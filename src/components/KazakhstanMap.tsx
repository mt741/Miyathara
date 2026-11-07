import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { GeoJSON, MapContainer, Marker, Pane, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import "leaflet/dist/leaflet.css";
import lakes from "../data/lakes.json";
import type { WaterBody } from "../data/waterBodies";
import { useI18n } from "../i18n";
import { colors } from "../tokens";

export type MapHandle = { zoomIn: () => void; zoomOut: () => void };

type Props = {
  items: WaterBody[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Screen space that the search list covers now. Used to place a selected point. */
  cover: { right: number; bottom: number };
  /** Screen space that the open list covers. Used to fit the overview, so that opening
   *  or closing the list does not move the map. */
  fitCover: { right: number; bottom: number };
};

// The area framed in the design, and a tighter one for phones.
const DESKTOP_BOUNDS = L.latLngBounds([33, 42], [58, 100]);
const MOBILE_BOUNDS = L.latLngBounds([40.5, 46.5], [55.5, 87.5]);
/** From this zoom level, lakes and OpenStreetMap detail appear. */
const DETAIL_ZOOM = 6;

/**
 * Russia's far east crosses the 180° meridian. Leaflet does not split rings there, so a ring
 * that jumps from +180 to -180 draws a straight band across the whole map. Move those
 * points east by 360° so each ring is continuous.
 */
function unwrapAntimeridian(fc: FeatureCollection): FeatureCollection {
  type Ring = number[][];
  const fixRing = (ring: Ring): Ring => {
    const lons = ring.map((p) => p[0]);
    const crosses = Math.min(...lons) < -170 && Math.max(...lons) > 170;
    return crosses ? ring.map(([x, y]) => [x < 0 ? x + 360 : x, y]) : ring;
  };
  const fix = (g: Geometry): Geometry => {
    if (g.type === "Polygon") return { ...g, coordinates: (g.coordinates as Ring[]).map(fixRing) };
    if (g.type === "MultiPolygon") return { ...g, coordinates: (g.coordinates as Ring[][]).map((p) => p.map(fixRing)) };
    return g;
  };
  return { ...fc, features: fc.features.map((f) => (f.geometry ? { ...f, geometry: fix(f.geometry) } : f)) };
}

const LAND_STYLE: L.PathOptions = { fillColor: colors.sand, fillOpacity: 1, color: colors.water.line, weight: 0.8 };
const LAKE_STYLE: L.PathOptions = { fillColor: colors.water.DEFAULT, fillOpacity: 1, stroke: false };

const pinSvg = (fill: string, stroke: string) =>
  `<svg viewBox="-6 -15 12 16" width="100%" height="100%"><path d="M0-14a5 5 0 0 0-5 5c0 3.6 5 9 5 9s5-5.4 5-9a5 5 0 0 0-5-5z" fill="${fill}" stroke="${stroke}" stroke-width="1"/><circle cy="-9" r="1.8" fill="#fff"/></svg>`;
const pin = (active: boolean) =>
  L.divIcon({
    className: "map-pin",
    html: active ? pinSvg(colors.water.DEFAULT, "#fff") : pinSvg(colors.water.pin, "none"),
    iconSize: active ? [26, 34] : [16, 21],
    iconAnchor: active ? [13, 34] : [8, 21],
    tooltipAnchor: [0, active ? -34 : -21],
  });
const PIN = pin(false);
const PIN_ACTIVE = pin(true);

function fitView(map: L.Map, cover: Props["cover"]) {
  const mobile = map.getSize().x < 768;
  map.fitBounds(mobile ? MOBILE_BOUNDS : DESKTOP_BOUNDS, {
    paddingTopLeft: mobile ? [8, 72] : [0, 0],
    paddingBottomRight: mobile ? [8, cover.bottom + 8] : [cover.right - 40, 0],
    animate: false,
  });
}

/** Wires the map instance to React: fit on resize, fly to the selection, zoom buttons. */
type ControllerProps = Omit<Props, "onSelect"> & {
  onDetailChange: (detail: boolean) => void;
};

const Controller = forwardRef<MapHandle, ControllerProps>(
  function Controller({ items, selectedId, cover, fitCover, onDetailChange }, ref) {
    const map = useMap();
    const coverRef = useRef(cover);
    coverRef.current = cover;
    const fitRef = useRef(fitCover);
    fitRef.current = fitCover;
    const selectedRef = useRef(selectedId);
    selectedRef.current = selectedId;

    useImperativeHandle(ref, () => ({ zoomIn: () => map.zoomIn(), zoomOut: () => map.zoomOut() }), [map]);
    useMapEvents({ zoomend: () => onDetailChange(map.getZoom() >= DETAIL_ZOOM) });

    // The wheel, a trackpad pinch and Ctrl + wheel zoom the map around the cursor. The page
    // does not scroll, so the wheel has no other job. A trackpad pinch arrives as a wheel
    // event with ctrlKey set (Chrome, Edge, Firefox) or as a gesture event (Safari).
    // Without preventDefault the browser zooms the whole page.
    useEffect(() => {
      const el = map.getContainer();
      let pending = 0;
      let frame = 0;
      let anchor = L.point(0, 0);

      const apply = () => {
        frame = 0;
        const z = Math.min(map.getMaxZoom(), Math.max(map.getMinZoom(), map.getZoom() + pending));
        pending = 0;
        if (z !== map.getZoom()) map.setZoomAround(anchor, z, { animate: false });
      };
      const queue = (dz: number, e: MouseEvent) => {
        pending += dz;
        anchor = map.mouseEventToContainerPoint(e);
        if (!frame) frame = requestAnimationFrame(apply);
      };

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY; // lines to pixels
        // A browser page-zoom pinch scales by exp(-dy / 100). One map zoom level is a factor of 2.
        queue(Math.max(-1, Math.min(1, -dy / 70)), e);
      };

      type GestureEvent = MouseEvent & { scale: number };
      let lastScale = 1;
      const onGestureStart = (e: Event) => {
        e.preventDefault();
        lastScale = 1;
      };
      const onGestureChange = (e: Event) => {
        e.preventDefault();
        const g = e as GestureEvent;
        queue(Math.log2(g.scale / lastScale), g);
        lastScale = g.scale;
      };
      const stop = (e: Event) => e.preventDefault();

      el.addEventListener("wheel", onWheel, { passive: false });
      el.addEventListener("gesturestart", onGestureStart);
      el.addEventListener("gesturechange", onGestureChange);
      el.addEventListener("gestureend", stop);
      return () => {
        cancelAnimationFrame(frame);
        el.removeEventListener("wheel", onWheel);
        el.removeEventListener("gesturestart", onGestureStart);
        el.removeEventListener("gesturechange", onGestureChange);
        el.removeEventListener("gestureend", stop);
      };
    }, [map]);

    // Fit once, then again when the container changes size and nothing is selected.
    useEffect(() => {
      fitView(map, fitRef.current);
      const ro = new ResizeObserver(() => {
        map.invalidateSize();
        if (!selectedRef.current) fitView(map, fitRef.current);
      });
      ro.observe(map.getContainer());
      return () => ro.disconnect();
    }, [map]);

    // Fit again when the list is first measured or changes height, unless the user picked a place.
    useEffect(() => {
      if (!selectedRef.current) fitView(map, fitCover);
    }, [map, fitCover.right, fitCover.bottom]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      const item = items.find((w) => w.id === selectedId);
      if (!item) return;
      const zoom = Math.max(map.getZoom(), 7);
      // Put the point in the middle of the visible part of the map, not under the list.
      const offset = L.point(coverRef.current.right / 2, coverRef.current.bottom / 2);
      const target = map.unproject(map.project(item.coords, zoom).add(offset), zoom);
      map.flyTo(target, zoom, { duration: 0.8 });
    }, [selectedId, items, map]);

    return null;
  },
);

export const KazakhstanMap = forwardRef<MapHandle, Props>(function KazakhstanMap(
  { items, selectedId, onSelect, cover, fitCover },
  ref,
) {
  // Draw land well past the screen edges. With the default small margin, fast pans and
  // zooms on phones show straight clip edges before Leaflet redraws.
  const renderer = useMemo(() => L.svg({ padding: 1 }), []);
  const { t } = useI18n();
  const [countries, setCountries] = useState<FeatureCollection | null>(null);
  const [detail, setDetail] = useState(false);

  // Country outlines load on demand to keep the first paint fast.
  useEffect(() => {
    import("world-atlas/countries-50m.json").then((m) => {
      const topo = m.default as unknown as Topology;
      setCountries(
        unwrapAntimeridian(feature(topo, topo.objects.countries as GeometryCollection) as unknown as FeatureCollection),
      );
    });
  }, []);

  return (
    <div className="absolute inset-0">
      <MapContainer
        className="h-full w-full !bg-water"
        center={[47, 68]}
        zoom={4}
        minZoom={3}
        maxZoom={11}
        zoomSnap={0}
        zoomDelta={1}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging
        touchZoom
        attributionControl
        renderer={renderer}
      >
        <Controller
          ref={ref}
          items={items}
          selectedId={selectedId}
          cover={cover}
          fitCover={fitCover}
          onDetailChange={setDetail}
        />

        {/* Land: cream on a teal background, so the Caspian shows as water. */}
        {countries && (
          <GeoJSON
            data={countries}
            interactive={false}
            style={LAND_STYLE}
          />
        )}

        {/* Lakes and OpenStreetMap detail appear only when zoomed in, so the overview stays minimal. */}
        {detail && (
          <>
            <Pane name="osm" style={{ zIndex: 410, mixBlendMode: "multiply", pointerEvents: "none" }}>
              <TileLayer
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxNativeZoom={19}
                className="osm-tint"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
            </Pane>
            <GeoJSON
              data={lakes as FeatureCollection}
              interactive={false}
              style={LAKE_STYLE}
            />
          </>
        )}

        {items.map((w) => {
          const [name] = t.places[w.id];
          const active = w.id === selectedId;
          return (
            <Marker
              key={w.id}
              position={w.coords}
              icon={active ? PIN_ACTIVE : PIN}
              zIndexOffset={active ? 1000 : 0}
              title={name}
              alt={name}
              eventHandlers={{ click: () => onSelect(w.id) }}
            >
              <Tooltip key={String(active)} direction="top" className="map-tooltip" permanent={active}>
                {name}
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
});
