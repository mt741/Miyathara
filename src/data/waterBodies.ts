export type WaterBody = {
  /** Key into the `places` messages of each locale. */
  id: string;
  /** [latitude, longitude] */
  coords: [number, number];
  /** Other spellings that search should find: Kazakh Latin, former names, short forms. */
  aliases: string[];
  /** Region names in Kazakh Latin, for search. */
  regionAliases: string[];
};

export const waterBodies: WaterBody[] = [
  { id: "alakol", coords: [46.15, 81.7], aliases: ["Alakól", "Alakul"], regionAliases: ["Jetisý oblysy"] },
  { id: "aral", coords: [46.1, 61.0], aliases: ["Aral", "Арал", "Aral teńizi"], regionAliases: ["Qyzylorda oblysy"] },
  { id: "balkhash", coords: [46.5, 74.9], aliases: ["Balqash", "Balkash"], regionAliases: [] },
  { id: "burabay", coords: [53.08, 70.3], aliases: ["Býrabaı", "Borovoye", "Боровое"], regionAliases: ["Aqmola oblysy"] },
  { id: "caspian", coords: [42.0, 50.8], aliases: ["Kaspıı teńizi", "Kaspiy", "Каспий"], regionAliases: ["Mańǵystaý oblysy"] },
  { id: "maly-taldykol", coords: [51.12, 71.38], aliases: ["Kishi Taldykól", "Taldykol", "Талдыколь", "Талдыкөл"], regionAliases: [] },
  { id: "tengiz", coords: [50.4, 68.9], aliases: ["Teńiz"], regionAliases: ["Aqmola oblysy"] },
];
