#!/usr/bin/env node
/**
 * Download Dubrovnik-specific images from Wikimedia Commons (CC-licensed).
 */
import { writeFileSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const OUT = join(import.meta.dirname, "..", "public/images");
const UA = "DubrovnikShoreExcursions/1.0 (https://dubrovnikshoreexcursion.com; image setup)";

const IMAGE_FILES = {
  "hero-home.jpg": [
    "File:Casco viejo de Dubrovnik, Croacia, 2014-04-14, DD 07.JPG",
    "File:Dubrovnik Old Town 1.jpg",
    "File:Dubrovnik Old Town From Minčeta Tower.jpg",
  ],
  "og-default.jpg": [
    "File:Dubrovnik Old Town From Minčeta Tower.jpg",
    "File:Casco viejo de Dubrovnik, Croacia, 2014-04-14, DD 07.JPG",
    "File:Dubrovnik city walls.jpg",
  ],
  "old-town.jpg": [
    "File:Dubrovnik Old Town 1.jpg",
    "File:Casco viejo de Dubrovnik, Croacia, 2014-04-14, DD 04.JPG",
    "File:Stari grad Dubrovnik, Ilijaš.jpg",
  ],
  "city-walls.jpg": [
    "File:Dubrovnik city walls.jpg",
    "File:Walls of Dubrovnik 02.jpg",
    "File:Casco viejo de Dubrovnik, Croacia, 2014-04-14, DD 07.JPG",
  ],
  "cable-car.jpg": [
    "File:Cable car to Mount Srd in Dubrovnik, Croatia (48738636363).jpg",
    "File:Dubrovnik Cable Car.JPG",
    "File:Cable car Srđ.jpg",
  ],
  "lokrum.jpg": [
    "File:Dubrovnik and Otok Lokrum as seen from Mount Srđ.jpg",
    "File:Lokrum island and Adriatic Sea from Dubrovnik at dusk 2023.jpg",
    "File:Dubrovnik and Lokrum (15472037395).jpg",
  ],
  "coast.jpg": [
    "File:Dubrovnik coast.jpg",
    "File:Lokrum island and Adriatic Sea from Dubrovnik at dusk 2023.jpg",
  ],
  "beach.jpg": [
    "File:Dubrovnik coast.jpg",
    "File:Banje Beach Dubrovnik.jpg",
  ],
  "boat.jpg": [
    "File:Old Port Dubrovnik.jpg",
    "File:Boats - Lokrum island.jpg",
    "File:Dubrovnik harbour boats.jpg",
  ],
  "food.jpg": [
    "File:GreekSalad.jpg",
    "File:Greek Salad Choriatiki.jpg",
  ],
  "wine.jpg": [
    "File:Red Wine Glass.jpg",
    "File:Assyrtiko wine bottles.jpg",
  ],
  "fortress.jpg": [
    "File:Fort Lovrijenac,Dubrovnik,Croatia.jpg",
    "File:Fort Lovrijenac - Dubrovnik.jpg",
    "File:Fort Lovrijenac, Dubrovnik, Croatia.jpg",
  ],
  "got.jpg": [
    "File:Fort Lovrijenac,Dubrovnik,Croatia.jpg",
    "File:Dubrovnik city walls.jpg",
    "File:Fort Lovrijenac - Dubrovnik.jpg",
  ],
  "history.jpg": [
    "File:Rector's Palace Dubrovnik.jpg",
    "File:Sponza Palace Dubrovnik.jpg",
    "File:Dubrovnik Old Town 1.jpg",
  ],
  "family.jpg": [
    "File:Dubrovnik Old Town 1.jpg",
    "File:Casco viejo de Dubrovnik, Croacia, 2014-04-14, DD 04.JPG",
  ],
  "luxury.jpg": [
    "File:Dubrovnik and Otok Lokrum as seen from Mount Srđ.jpg",
    "File:Dubrovnik Old Town From Minčeta Tower.jpg",
  ],
  "compare.jpg": [
    "File:Dubrovnik city walls.jpg",
    "File:Cable car to Mount Srd in Dubrovnik, Croatia (48738636363).jpg",
  ],
  "cruise-port.jpg": [
    "File:Dubrovnik Port Gruž (50247624561).jpg",
    "File:Dubrovnik- Port Gruž.jpg",
    "File:Old Port Dubrovnik.jpg",
  ],
  "highlights.jpg": [
    "File:Casco viejo de Dubrovnik, Croacia, 2014-04-14, DD 07.JPG",
    "File:Dubrovnik Old Town From Minčeta Tower.jpg",
  ],
  "photography.jpg": [
    "File:Dubrovnik and Otok Lokrum as seen from Mount Srđ.jpg",
    "File:Dubrovnik Old Town From Minčeta Tower.jpg",
    "File:Casco viejo de Dubrovnik, Croacia, 2014-04-14, DD 07.JPG",
  ],
};

const KEEP = new Set(["logo-mark.svg", "sources.json", ...Object.keys(IMAGE_FILES)]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function commonsThumb(fileTitle, width = 1920) {
  const params = new URLSearchParams({
    action: "query",
    titles: fileTitle,
    prop: "imageinfo",
    iiprop: "url|mime|size",
    iiurlwidth: String(width),
    format: "json",
  });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data.query?.pages ?? {};
  const page = Object.values(pages)[0];
  if (!page || page.missing !== undefined) return null;
  const info = page.imageinfo?.[0];
  if (!info?.mime?.startsWith("image/")) return null;
  const url = info.thumburl ?? info.url;
  if (!url) return null;
  return { url, title: page.title, source: info.descriptionurl ?? `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}` };
}

async function downloadBuffer(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  return buf.length > 8000 ? buf : null;
}

function purgeLegacyImages() {
  mkdirSync(OUT, { recursive: true });
  for (const name of readdirSync(OUT)) {
    if (!KEEP.has(name)) {
      unlinkSync(join(OUT, name));
      console.log("removed legacy:", name);
    }
  }
}

async function resolveImage(titles) {
  for (const title of titles) {
    const meta = await commonsThumb(title);
    if (meta) return meta;
    await sleep(200);
  }
  return null;
}

async function main() {
  purgeLegacyImages();

  const attribution = [];
  let ok = 0;
  let fail = 0;

  for (const [filename, titles] of Object.entries(IMAGE_FILES)) {
    const dest = join(OUT, filename);
    try {
      const meta = await resolveImage(titles);
      if (!meta) {
        console.warn("FAIL (no Commons file):", filename, "←", titles[0]);
        fail++;
        continue;
      }
      const buf = await downloadBuffer(meta.url);
      if (!buf) {
        console.warn("FAIL (download):", filename);
        fail++;
        continue;
      }
      writeFileSync(dest, buf);
      attribution.push({ file: filename, commons: meta.title, url: meta.source });
      console.log("ok:", filename, "←", meta.title.replace("File:", ""));
      ok++;
    } catch (e) {
      console.warn("FAIL:", filename, e.message);
      fail++;
    }
    await sleep(350);
  }

  writeFileSync(
    join(OUT, "sources.json"),
    JSON.stringify({ platform: "Wikimedia Commons", license: "Various CC licenses — see source URLs", images: attribution }, null, 2),
  );

  console.log(`\nDone: ${ok} downloaded, ${fail} failed. Attribution: public/images/sources.json`);
  if (fail > 0) process.exit(1);
}

main();
