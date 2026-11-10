// TVLive: TV en vivo gratis para Kino.
// Kino descarga por su cuenta las listas M3U y las guías XMLTV que declara liveCategories(),
// agrupa los canales por categoría y los reproduce; el plugin no resuelve nada.
//  - Pluto TV México y Pluto TV España (listas de BuddyChewChew en GitHub, con su guía de matthuisman).
//  - TDTChannels: canales de la TDT de España (RTVE, autonómicos...) con su guía.
//  - Webcams: señales fijas de la costa de Cataluña y de Almería.

const PLUTO_MX = "https://raw.githubusercontent.com/BuddyChewChew/app-m3u-generator/main/playlists/plutotv_mx.m3u";
const PLUTO_MX_GUIA = "https://github.com/matthuisman/i.mjh.nz/raw/master/PlutoTV/mx.xml.gz";
const PLUTO_ES = "https://raw.githubusercontent.com/BuddyChewChew/app-m3u-generator/main/playlists/plutotv_es.m3u";
const PLUTO_ES_GUIA = "https://github.com/matthuisman/i.mjh.nz/raw/master/PlutoTV/es.xml.gz";
const TDT = "https://www.tdtchannels.com/lists/tv.m3u";
const TDT_GUIA = "https://www.tdtchannels.com/epg/TV.xml.gz";

// Canales propios, con la señal puesta directamente (se reproducen sin llamar al plugin).
const WEBCAMS = [
  {
    id: "cam-cataluna",
    title: "Playas de Cataluña y Costa Brava",
    url: "https://directes-tv-int.3catdirectes.cat/live-content/beauties-hls/master.m3u8",
  },
  {
    id: "cam-almeria",
    title: "Costa de Almería y Mar Mediterráneo",
    url: "https://interalmeria.tv/directo/live.m3u8",
  },
];

function lista(url, guia) {
  return { playlist: { url, format: "m3u", epg: { url: guia, format: "xmltv" }, refreshHours: 12 } };
}

// Categorías: las tres listas (Kino las descarga y las agrupa) y la de webcams.
export async function liveCategories() {
  await null; // nunca lanzar antes del primer await
  return [
    lista(PLUTO_MX, PLUTO_MX_GUIA),
    lista(PLUTO_ES, PLUTO_ES_GUIA),
    lista(TDT, TDT_GUIA),
    { id: "webcams", title: "Webcams en vivo" },
  ];
}

// Solo la categoría propia tiene canales aquí; los de las listas los pone Kino.
export async function liveChannels({ categoryId } = {}) {
  await null;
  if (categoryId !== "webcams") return { items: [] };
  return {
    items: WEBCAMS.map((c, i) => ({
      id: c.id,
      title: c.title,
      categoryId: "webcams",
      number: 900 + i,
      stream: { url: c.url, mime: "application/vnd.apple.mpegurl" },
    })),
  };
}

// Kino exige home o search; un plugin solo de canales devuelve una lista vacía.
export async function home() {
  await null;
  return [];
}

// Ningún canal usa resolve (las listas se reproducen tal cual), pero Kino lo pide declarado.
export async function resolve() {
  await null;
  throw kino.error("not_found", "TVLive no resuelve nada: sus canales se reproducen directo");
}
