# Miyathara

This is a React, Tailwind, and Vite page. It implements frame 237:10391 of the Figma file "Map Cam".

## Run with Docker

1. To start the dev server with hot reload, run `docker compose up dev`.
2. Open http://localhost:5173.
3. To build and serve the production bundle with nginx, run `docker compose --profile prod up --build web`.
4. Open http://localhost:8080.

## Structure

- `src/tokens.js` holds the colors and fonts. `tailwind.config.js` and the map code both read this file.
- `src/components/Button.tsx`, `Card.tsx`, and `Navbar.tsx` are the reusable components.
- `src/components/KazakhstanMap.tsx` draws the map with Leaflet. The country outlines come from the `world-atlas` package.

### Data

- `src/data/lakes.json` holds the lake outlines near Kazakhstan, taken from Natural Earth (public domain).
- `src/data/waterBodies.ts` holds the list of water bodies and their coordinates.
- `src/i18n/` holds the text in Kazakh (`kk.ts`), Russian (`ru.ts`), and English (`en.ts`).

## Map

The overview shows only the land, the borders, the Caspian Sea, and the pins. This matches the design. At zoom level 6 and higher, the map also shows the lakes and a pale OpenStreetMap layer.

The page does not scroll. It has two full-screen views: the hero and the map. "Go to map", a scroll down, or a swipe up on the hero opens the map. The back arrow or the browser Back button opens the hero again. The address of the map view is `#map`.

On the map, one finger or the mouse moves the map. The wheel, a trackpad pinch, or two fingers zoom the map.

The OpenStreetMap tile servers are for light use only. For a public launch, use a tile provider with an API key, or host your own tiles. Change the `url` of the `TileLayer` in `KazakhstanMap.tsx` to do this.

## Languages

The page starts in the language of the browser. If the browser language is not Kazakh or Russian, the page uses English. The language menu in the navbar changes the language, and the browser remembers the choice.

Search finds a place in any of the three languages, whatever language the page shows. It also finds Kazakh Latin spellings, former names, small typos, and text typed with the wrong keyboard layout. The search rules are in `src/lib/search.ts`. To add a spelling, add it to `aliases` in `src/data/waterBodies.ts`.

To add or change text, edit all three files in `src/i18n/`. If `kk.ts` or `ru.ts` does not have a key, TypeScript reports an error.

## Hero photo

Put the hero photo at `public/hero.jpg`. If the file is not there, the page shows a gradient.

## Deploy

The site runs on `92.47.152.2` (SSH port 2222, user `core`) at https://miyathara.duckdns.org. The host nginx receives HTTPS and sends the requests to the container on `127.0.0.1:8095`. The other sites on this server use the same setup.

1. To copy the code and restart the container, run `./deploy/deploy.sh` on your computer.
2. Only for the first deploy, run `sudo bash ~/miyathara/deploy/setup-https.sh` on the server. This script gets the Let's Encrypt certificate and installs the nginx site.

The `certbot.timer` on the server renews the certificate.
