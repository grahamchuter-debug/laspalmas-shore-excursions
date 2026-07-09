#!/usr/bin/env node
/**
 * Download Kotor-specific images from Wikimedia Commons (CC-licensed).
 * Each experience-card image is distinct — no duplicate files across the six homepage cards.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = join(import.meta.dirname, "..", "public/images");
const UA = "KotorShoreExcursions/1.0 (https://kotorshoreexcursion.com; image setup)";

const IMAGE_FILES = {
  // Experience cards — each unique
  "medieval.jpg": [
    "File:Kotor Cathedral.jpg",
    "File:Kotor old town 1.jpg",
  ],
  "bay.jpg": [
    "File:Our Lady of the Rocks.jpg",
    "File:Gospa od Skrpjela.jpg",
  ],
  "blue-cave.jpg": [
    "File:Blue Cave (Plava špilja), Bay of Kotor, Montenegro 07.jpg",
    "File:Blue Cave (Plava špilja), Bay of Kotor, Montenegro 03.jpg",
    "File:Plava spilja by Klackalica.JPG",
  ],
  "mountains.jpg": [
    "File:Lovcen.jpg",
    "File:Kotor city walls.jpg",
  ],
  "private.jpg": [
    "File:Kotor old town 2.jpg",
    "File:Tourist boat Barba in Blue Cave, Montenegro.webp",
  ],

  // Shared site images — also kept distinct from each other
  "hero-home.jpg": [
    "File:Kotor city walls.jpg",
    "File:Kotor, Montenegro.jpg",
  ],
  "og-default.jpg": [
    "File:Kotor Cathedral.jpg",
    "File:Kotor, Montenegro.jpg",
  ],
  "old-town.jpg": [
    "File:Kotor old town 1.jpg",
    "File:Kotor old town 2.jpg",
  ],
  "history.jpg": [
    "File:Kotor Cathedral.jpg",
    "File:Kotor old town 1.jpg",
  ],
  "fortress.jpg": [
    "File:Kotor city walls.jpg",
    "File:Kotor Fortress.jpg",
  ],
  "coast.jpg": [
    "File:Gospa od Skrpjela.jpg",
    "File:Kotor Bay Montenegro.jpg",
  ],
  "boat.jpg": [
    "File:Perast Montenegro.jpg",
    "File:Our Lady of the Rocks.jpg",
  ],
  "food.jpg": [
    "File:GreekSalad.jpg",
  ],
  "wine.jpg": [
    "File:Red Wine Glass.jpg",
  ],
  "family.jpg": [
    "File:Kotor old town 2.jpg",
    "File:Kotor old town 1.jpg",
  ],
  "luxury.jpg": [
    "File:Perast Montenegro.jpg",
    "File:Our Lady of the Rocks.jpg",
  ],
  "compare.jpg": [
    "File:Blue Cave (Plava špilja), Bay of Kotor, Montenegro 07.jpg",
    "File:Kotor, Montenegro.jpg",
  ],
  "cruise-port.jpg": [
    "File:Kotor, Montenegro.jpg",
  ],
  "highlights.jpg": [
    "File:Kotor city walls.jpg",
    "File:Kotor, Montenegro.jpg",
  ],
  "photography.jpg": [
    "File:Lovcen.jpg",
    "File:Kotor city walls.jpg",
  ],
};

mkdirSync(OUT, { recursive: true });

async function fetchCommonsUrl(fileName) {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&format=json`;
  const res = await fetch(apiUrl, { headers: { "User-Agent": UA } });
  const text = await res.text();
  if (text.startsWith("You are making")) throw new Error("rate limited");
  const data = JSON.parse(text);
  const pages = data?.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  return page?.imageinfo?.[0]?.url ?? null;
}

async function downloadImage(outFile, candidates) {
  for (const candidate of candidates) {
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const url = await fetchCommonsUrl(candidate);
      if (!url) continue;
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(join(OUT, outFile), buf);
      console.log(`✓ ${outFile} ← ${candidate}`);
      return true;
    } catch (e) {
      console.warn(`  failed ${candidate}:`, e.message);
    }
  }
  console.warn(`✗ ${outFile} — no candidate worked`);
  return false;
}

async function main() {
  for (const [outFile, candidates] of Object.entries(IMAGE_FILES)) {
    await downloadImage(outFile, candidates);
  }
  console.log("Kotor image download complete.");
}

main();
