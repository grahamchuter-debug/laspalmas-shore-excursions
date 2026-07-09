#!/usr/bin/env node
/**
 * Download Gran Canaria imagery from Wikimedia Commons (CC-licensed).
 * Run: npm run download:images
 * Force refresh hero assets: node scripts/download-laspalmas-images.mjs --force
 */
import { writeFileSync, mkdirSync, unlinkSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = join(import.meta.dirname, "..", "public/images");
const UA = "LasPalmasShoreExcursions/1.0 (https://laspalmasshoreexcursions.com; image setup)";
const DELAY_MS = 2000;
const FORCE = process.argv.includes("--force");
const FORCE_ONLY = new Set(
  process.argv
    .filter((a) => a.startsWith("--only="))
    .flatMap((a) => a.replace("--only=", "").split(",")),
);

/** Verified Commons titles — API-checked filenames. */
const IMAGE_FILES = {
  "hero-home.jpg": [
    "File:Gran Canaria, Las Cumbres Panorama con Roque Nublo.jpg",
    "File:Gran Canaria, Las Cumbres Panorama con Roque Nublo 2.jpg",
    "File:Roque Nublo - Gran Canaria.JPG",
  ],
  "og-default.jpg": [
    "File:Gran Canaria, Las Cumbres Panorama con Roque Nublo.jpg",
    "File:El Roque Nublo Y El Teide (58423090).jpeg",
    "File:Roque Nublo - Gran Canaria.JPG",
  ],
  "roque-nublo.jpg": [
    "File:Roque Nublo - Gran Canaria.JPG",
    "File:El Roque Nublo Y El Teide (58423090).jpeg",
    "File:Gran Canaria, Las Cumbres Panorama con Roque Nublo 2.jpg",
  ],
  "volcano.jpg": [
    "File:Bandama Caldera.jpg",
    "File:Gran Canaria, Las Cumbres Panorama con Roque Nublo 2.jpg",
  ],
  "dunes.jpg": [
    "File:Maspalomas Dunes.jpg",
    "File:Dunas de Maspalomas.jpg",
  ],
  "old-town.jpg": [
    "File:Catedral de Santa Ana de Las Palmas.jpg",
    "File:Casa de Colón, Las Palmas de Gran Canaria.jpg",
    "File:Vegueta (Las Palmas de Gran Canaria).jpg",
  ],
  "beach.jpg": [
    "File:Las Canteras (Las Palmas de Gran Canaria).jpg",
    "File:Playa de Las Canteras (Las Palmas de Gran Canaria).jpg",
    "File:Playa de Las Canteras, Gran Canaria.jpg",
  ],
  "food.jpg": [
    "File:Mojo verde y papas arrugás.jpg",
    "File:Mojo rojo - Papas arrugads.JPG",
    "File:Papas (Mojo picón) - Verde.JPG",
  ],
  "wine.jpg": [
    "File:Queso de Flor (Gran Canaria).jpg",
    "File:Bodega en Gran Canaria.jpg",
  ],
  "village.jpg": [
    "File:Teror - Gran Canaria.jpg",
    "File:Basílica de Nuestra Señora del Pino, Teror.jpg",
    "File:Arucas - Gran Canaria.jpg",
  ],
  "coast.jpg": [
    "File:Puerto de Las Palmas.jpg",
    "File:Gran Canaria coast.jpg",
  ],
  "island.jpg": [
    "File:Gran Canaria, Las Cumbres Panorama con Roque Nublo.jpg",
    "File:Gran Canaria, Las Cumbres Panorama con Roque Nublo 2.jpg",
  ],
  "cruise-port.jpg": [
    "File:Puerto de Las Palmas.jpg",
    "File:Puerto de la Luz, Las Palmas de Gran Canaria.jpg",
  ],
  "highlights.jpg": [
    "File:Gran Canaria, Las Cumbres Panorama con Roque Nublo 2.jpg",
    "File:Maspalomas Dunes.jpg",
    "File:Bandama Caldera.jpg",
  ],
  "photography.jpg": [
    "File:Roque Nublo - Gran Canaria.JPG",
    "File:Bandama Caldera.jpg",
    "File:Gran Canaria, Las Cumbres Panorama con Roque Nublo.jpg",
  ],
  "compare.jpg": [
    "File:Gran Canaria, Las Cumbres Panorama con Roque Nublo.jpg",
    "File:Maspalomas Dunes.jpg",
    "File:Bandama Caldera.jpg",
  ],
  "market.jpg": [
    "File:Mercado de Vegueta.jpg",
    "File:Mercado del Puerto, Las Palmas de Gran Canaria.jpg",
  ],
};

const SEARCH_FALLBACKS = {
  "old-town.jpg": "Vegueta Las Palmas cathedral",
  "beach.jpg": "Las Canteras beach Las Palmas",
  "cruise-port.jpg": "Puerto Las Palmas cruise",
  "village.jpg": "Teror Gran Canaria village",
  "market.jpg": "Mercado Vegueta Las Palmas",
  "wine.jpg": "Gran Canaria wine bodega",
};

const ALWAYS_REFRESH = new Set([
  "hero-home.jpg",
  "og-default.jpg",
  "roque-nublo.jpg",
  "volcano.jpg",
  "island.jpg",
]);

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

function shouldDownload(outFile) {
  if (FORCE_ONLY.size > 0) return FORCE_ONLY.has(outFile);
  if (FORCE || ALWAYS_REFRESH.has(outFile)) return true;
  const outPath = join(OUT, outFile);
  const stat = statSync(outPath, { throwIfNoEntry: false });
  return !stat || stat.size < 5000;
}

async function downloadImage(outFile, candidates) {
  if (!shouldDownload(outFile)) {
    console.log(`skip (exists): ${outFile}`);
    return true;
  }

  const outPath = join(OUT, outFile);
  try {
    unlinkSync(outPath);
  } catch {
    /* fresh download */
  }

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
      writeFileSync(outPath, buf);
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
      if (e.message === "rate limited") await sleep(10000);
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
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="50" r="48" fill="#153242"/>
  <path d="M30 65 L50 25 L70 65 Z" fill="#c4a05a" opacity="0.9"/>
  <circle cx="50" cy="55" r="8" fill="#4a7a3a"/>
</svg>`,
  );
  console.log("✓ logo-mark.svg");

  writeFileSync(join(OUT, "sources.json"), JSON.stringify(sources, null, 2));
  console.log(`\nDownloaded ${ok}/${Object.keys(IMAGE_FILES).length} images. Attribution → public/images/sources.json`);
}

main();
