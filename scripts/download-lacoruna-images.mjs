#!/usr/bin/env node
/**
 * Download Atlantic/Galician imagery from Wikimedia Commons (CC-licensed).
 * Run: npm run download:images
 */
import { writeFileSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = join(import.meta.dirname, "..", "public/images");
const UA = "LaCorunaShoreExcursions/1.0 (https://lacorunashoreexcursions.com; image setup)";
const DELAY_MS = 1800;

/** Verified Commons titles — each output file gets distinct Galician subject matter where possible. */
const IMAGE_FILES = {
  "hero-home.jpg": [
    "File:Torre de Hércules, La Coruña, España, 2015-09-24, DD 12-15 PAN.JPG",
    "File:Torre de Hércules, La Coruña, España, 2015-09-25, DD 35-37 HDR.jpg",
    "File:Puerto de La Coruña, España, 2015-09-25, DD 46-49 PAN.JPG",
  ],
  "og-default.jpg": [
    "File:Torre de Hércules, La Coruña, España, 2015-09-25, DD 35-37 HDR.jpg",
    "File:Plaza de María Pita, La Coruña, España, 2015-09-25, DD 91.jpg",
  ],
  "hercules.jpg": [
    "File:Torre de Hércules - DivesGallaecia2012-62.jpg",
    "File:Torre de Hércules, La Coruña, España, 2015-09-25, DD 35-37 HDR.jpg",
  ],
  "santiago.jpg": [
    "File:2010-Catedral de Santiago de Compostela-Galicia (Spain) 3.jpg",
    "File:Santiago cathedral 2021.jpg",
    "File:2010-Catedral de Santiago de Compostela-Galicia (Spain) 4.jpg",
  ],
  "pilgrimage.jpg": [
    "File:Camino Francés, Santiago de Compostela 02.jpg",
    "File:Camino Francés, Santiago de Compostela 01.jpg",
    "File:Pereira, O Ameneiral o Camiño de Santiago no Ameneiral.jpg",
  ],
  "old-town.jpg": [
    "File:Plaza de María Pita, La Coruña, España, 2015-09-25, DD 91.jpg",
    "File:Plaza de María Pita, La Coruña, España, 2015-09-25, DD 92.jpg",
    "File:María Pita.003 - A Coruña.jpg",
  ],
  "coast.jpg": [
    "File:Coruña. Orzán.jpg",
    "File:Praia orzan.jpg",
    "File:Costa de Baroña.jpg",
  ],
  "beach.jpg": [
    "File:Playa de Riazor, La Coruña, España, 2015-09-24, DD 06.JPG",
    "File:Praia de Riazor.A Coruña Galicia.jpg",
  ],
  "food.jpg": [
    "File:El Pulpo a la gallega, típica tapa española.jpg",
    "File:Pulpo a la gallega con patata.jpg",
  ],
  "wine.jpg": [
    "File:Moluscos y marisco de Galicia piden Albariño Rias Baixas (24868696804).jpg",
    "File:Vieiras cociñadas ó albariño, Galiza.jpg",
    "File:Albarino in glass image 2.JPG",
  ],
  "castle.jpg": [
    "File:Castillo de San Antón, La Coruña, España, 2015-09-25, DD 66.jpg",
    "File:Faro.001 - Castelo de San Antón.jpg",
  ],
  "market.jpg": [
    "File:Mercado Municipal de San Agustín - A Coruña 03.jpg",
    "File:A Coruña - Mercado de San Agustín.JPG",
    "File:Mercado Municipal de San Agustín - A Coruña 05.jpg",
  ],
  "fishing.jpg": [
    "File:Fishing Boats Galicia Spain.jpg",
    "File:2017. Dorna en Palmeira. Ribeira. Galiza Galicia.jpg",
  ],
  "galicia-landscape.jpg": [
    "File:Costa de Baroña.jpg",
    "File:Coruña. Orzán.jpg",
  ],
  "cruise-port.jpg": [
    "File:Puerto de La Coruña, España, 2015-09-25, DD 46-49 PAN.JPG",
    "File:La Coruña - Puerto -BT- 04.jpg",
    "File:Puerto de La Coruña, España, 2015-09-25, DD 71.JPG",
  ],
  "highlights.jpg": [
    "File:Plaza de María Pita, La Coruña, España, 2015-09-25, DD 92.jpg",
    "File:Torre de Hércules, La Coruña, España, 2015-09-25, DD 35-37 HDR.jpg",
  ],
  "photography.jpg": [
    "File:Torre de Hércules, La Coruña, España, 2015-09-24, DD 12-15 PAN.JPG",
    "File:Puerto de La Coruña, España, 2015-09-25, DD 46-49 PAN.JPG",
  ],
  "compare.jpg": [
    "File:2010-Catedral de Santiago de Compostela-Galicia (Spain) 4.jpg",
    "File:Torre de Hércules - DivesGallaecia2012-62.jpg",
  ],
  "private.jpg": [
    "File:Costa de Baroña.jpg",
    "File:Coruña. Orzán.jpg",
  ],
  "family.jpg": [
    "File:Playa de Riazor, La Coruña, España, 2015-09-24, DD 06.JPG",
    "File:Praia de Riazor.A Coruña Galicia.jpg",
  ],
};

const SEARCH_FALLBACKS = {
  "coast.jpg": "Orzan Coruna Atlantic",
  "cruise-port.jpg": "Puerto La Coruna",
  "wine.jpg": "Albarino Galicia",
};

mkdirSync(OUT, { recursive: true });

const sources = { platform: "Wikimedia Commons", license: "Various CC licenses — see source URLs", images: [] };

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchCommonsUrl(fileName) {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url|extmetadata&format=json`;
  const res = await fetch(apiUrl, { headers: { "User-Agent": UA } });
  const text = await res.text();
  if (text.startsWith("You are making")) throw new Error("rate limited");
  const data = JSON.parse(text);
  const pages = data?.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  if (page?.missing !== undefined) return null;
  const info = page?.imageinfo?.[0];
  if (!info?.url) return null;
  return {
    url: info.url,
    commons: fileName,
    license: info.extmetadata?.LicenseShortName?.value ?? "See Commons",
  };
}

async function searchCommons(query) {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=5&format=json`;
  const res = await fetch(apiUrl, { headers: { "User-Agent": UA } });
  const text = await res.text();
  if (text.startsWith("You are making")) return [];
  const data = JSON.parse(text);
  return (data.query?.search ?? []).map((s) => s.title);
}

async function downloadImage(outFile, candidates) {
  const tries = [...candidates];
  if (SEARCH_FALLBACKS[outFile]) {
    await sleep(DELAY_MS);
    const found = await searchCommons(SEARCH_FALLBACKS[outFile]);
    tries.push(...found.filter((t) => !t.endsWith(".pdf") && !t.endsWith(".svg")));
  }

  for (const candidate of tries) {
    try {
      await sleep(DELAY_MS);
      const meta = await fetchCommonsUrl(candidate);
      if (!meta) continue;
      const res = await fetch(meta.url, { headers: { "User-Agent": UA } });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 5000) continue;
      writeFileSync(join(OUT, outFile), buf);
      const wikiTitle = candidate.replace(/^File:/, "");
      sources.images.push({
        file: outFile,
        commons: candidate,
        url: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(wikiTitle).replace(/%20/g, "_")}`,
        license: meta.license,
      });
      console.log(`✓ ${outFile} ← ${candidate} (${Math.round(buf.length / 1024)} KB)`);
      return true;
    } catch (e) {
      console.warn(`  failed ${candidate}:`, e.message);
      if (e.message === "rate limited") await sleep(8000);
    }
  }
  console.warn(`✗ ${outFile} — no candidate worked`);
  return false;
}

async function main() {
  let ok = 0;
  for (const [outFile, candidates] of Object.entries(IMAGE_FILES)) {
    if (await downloadImage(outFile, candidates)) ok++;
  }

  writeFileSync(
    join(OUT, "logo-mark.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#1a2f42"/>
  <path d="M12 44c8-14 16-22 20-28 4 6 12 14 20 28" stroke="#a88b5a" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M32 16v28M28 40h8" stroke="#d4e0ea" stroke-width="2" stroke-linecap="round"/>
  <circle cx="32" cy="14" r="3" fill="#a88b5a"/>
</svg>`,
  );
  console.log("✓ logo-mark.svg (Galicia lighthouse mark)");

  writeFileSync(join(OUT, "sources.json"), JSON.stringify(sources, null, 2));
  console.log(`\nDownloaded ${ok}/${Object.keys(IMAGE_FILES).length} images. Attribution saved to public/images/sources.json`);
}

main();
