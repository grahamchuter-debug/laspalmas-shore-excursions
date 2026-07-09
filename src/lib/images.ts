export interface SiteImage {
  src: string;
  alt: string;
  base: string;
}

const B = "/images";

function img(base: string, alt: string): SiteImage {
  return { base, src: `${B}/${base}.jpg`, alt };
}

export const siteImages = {
  hero: img(
    "hero-home",
    "Roque Nublo and volcanic landscapes of Gran Canaria — panoramic Atlantic island view",
  ),
  ogDefault: img(
    "og-default",
    "Gran Canaria — Roque Nublo and Las Palmas cruise port",
  ),
  logo: {
    base: "logo-mark",
    src: `${B}/logo-mark.svg`,
    alt: "Las Palmas — Gran Canaria Shore Excursions",
  },
  port: img("cruise-port", "Las Palmas cruise port and Atlantic harbour, Gran Canaria"),
} as const;

export const subjectImages: Record<string, SiteImage> = {
  "old-town": img("old-town", "Vegueta historic quarter — colonial streets in Las Palmas"),
  vegueta: img("old-town", "Vegueta cathedral and old town, Las Palmas"),
  volcano: img("volcano", "Bandama Caldera volcanic crater, Gran Canaria"),
  "roque-nublo": img("roque-nublo", "Roque Nublo monolith above pine forests, Gran Canaria"),
  dunes: img("dunes", "Maspalomas Dunes golden sandscape, Gran Canaria"),
  village: img("village", "Traditional Canarian mountain village, Gran Canaria"),
  island: img("island", "Gran Canaria island scenery — mountains and Atlantic coast"),
  coastal: img("coast", "Atlantic coastline and mountain roads, Gran Canaria"),
  coast: img("coast", "Gran Canaria Atlantic coast"),
  food: img("food", "Traditional Canarian papas arrugadas and mojo sauces"),
  wine: img("wine", "Canarian wine and local produce tasting"),
  beach: img("beach", "Las Canteras urban beach, Las Palmas"),
  market: img("market", "Santa Catalina market area, Las Palmas"),
  private: img("island", "Private island tour through Gran Canaria landscapes"),
  family: img("beach", "Family at Las Canteras beach, Las Palmas"),
  compare: img("compare", "Roque Nublo and Maspalomas Dunes — Gran Canaria highlights"),
  port: img("cruise-port", "Las Palmas harbour and cruise terminal"),
  highlights: img("highlights", "Gran Canaria scenic viewpoints and island touring"),
  photography: img("photography", "Dramatic Gran Canaria landscape photography"),
  city: img("old-town", "Las Palmas city centre from cruise port"),
  independent: img("old-town", "Self-guided walking through Vegueta, Las Palmas"),
  itinerary: img("highlights", "One day exploring Gran Canaria from cruise ship"),
  "first-time": img("island", "First visit to Gran Canaria from Las Palmas cruise port"),
  planner: img("photography", "Gran Canaria cruise planning"),
  "canary-islands": img("coast", "Canary Islands cruise ports"),
  tenerife: img("coast", "Canary Islands cruise planning"),
  lanzarote: img("volcano", "Canary Islands volcanic landscapes"),
  spain: img("island", "Spain cruise travel guide"),
  // Legacy keys used in generated data
  "galicia-landscape": img("island", "Gran Canaria island landscape"),
  hercules: img("volcano", "Volcanic landscape, Gran Canaria"),
  castle: img("old-town", "Historic architecture in Vegueta, Las Palmas"),
  santiago: img("roque-nublo", "Roque Nublo — Gran Canaria landmark"),
  pilgrimage: img("village", "Traditional Canarian village"),
  fishing: img("coast", "Atlantic fishing harbour, Gran Canaria"),
  walking: img("old-town", "Walking through historic Las Palmas"),
  history: img("old-town", "Historic Vegueta quarter, Las Palmas"),
  luxury: img("island", "Premium Gran Canaria island touring"),
};

function pick(key: string): SiteImage {
  return subjectImages[key] ?? siteImages.ogDefault;
}

const excursionImageKeys: Record<string, string> = {
  "a-taste-of-gran-canaria": "island",
  "gran-canaria-and-roque-nublo": "roque-nublo",
  "maspalomas-dunes-tour": "dunes",
  "bandama-caldera-tour": "volcano",
  "private-gran-canaria-tour": "private",
  "vegueta-historic-las-palmas-tour": "vegueta",
  "canarian-food-wine-tour": "food",
  "family-gran-canaria-tour": "family",
  "half-day-las-palmas-tour": "old-town",
  "scenic-island-highlights-tour": "highlights",
  "las-canteras-beach-day": "beach",
  "short-port-call-tour": "port",
};

export function getExcursionImage(slug: string): SiteImage {
  return pick(excursionImageKeys[slug] ?? "highlights");
}

export const excursionsHubImage = pick("photography");

const highlightImageKeys: Record<string, string> = {
  "roque-nublo-from-cruise-ship": "roque-nublo",
  "bandama-caldera-guide": "volcano",
  "vegueta-walking-guide": "vegueta",
  "las-canteras-beach-from-cruise-port": "beach",
  "maspalomas-dunes-from-las-palmas-cruise-port": "dunes",
  "canarian-food-guide": "food",
  "what-to-wear-in-gran-canaria": "island",
  "best-las-palmas-shore-excursions": "highlights",
  "best-things-to-do-las-palmas-cruise": "highlights",
};

const experienceImageKeys: Record<string, string> = {
  "independent-las-palmas-guide": "independent",
  "one-day-in-gran-canaria": "itinerary",
  "las-palmas-for-first-time-visitors": "first-time",
  "las-palmas-cruise-port-guide": "port",
  "las-palmas-for-families": "family",
  "gran-canaria-cruise-excursions": "highlights",
};

const comparisonImageKeys: Record<string, string> = {
  "las-palmas-or-island-tour": "compare",
  "is-roque-nublo-worth-it-from-cruise-ship": "roque-nublo",
  "best-gran-canaria-shore-excursion-first-time-visitors": "first-time",
  "can-you-explore-las-palmas-independently": "independent",
  "bandama-caldera-or-maspalomas-dunes": "compare",
  "best-beaches-near-las-palmas-cruise-port": "beach",
  "one-day-in-gran-canaria-from-cruise-ship": "itinerary",
};

export function getHighlightImage(slug: string): SiteImage {
  return pick(highlightImageKeys[slug] ?? "highlights");
}

export function getExperienceImage(slug: string): SiteImage {
  return pick(experienceImageKeys[slug] ?? "highlights");
}

export function getComparisonImage(slug: string): SiteImage {
  return pick(comparisonImageKeys[slug] ?? "compare");
}

export function getGuideImage(imageKey: string): SiteImage {
  return pick(imageKey);
}

export function getHotelImage(_slug: string): SiteImage {
  return pick("highlights");
}

export function getTransferImage(_slug: string): SiteImage {
  return pick("port");
}
