import type { EditorialCategory } from "./types";

export interface EditorialCategoryDef {
  id: EditorialCategory;
  label: string;
  shortLabel: string;
  description: string;
}

export const EDITORIAL_CATEGORIES: EditorialCategoryDef[] = [
  { id: "editors-choice", label: "Editor's Choice", shortLabel: "Editor's Choice", description: "Top overall pick after balancing impact, logistics and return confidence for Las Palmas cruise passengers." },
  { id: "best-historic", label: "Best Historic Experience", shortLabel: "Historic", description: "Vegueta colonial quarter, Casa de Colón and Atlantic trading heritage." },
  { id: "best-independent", label: "Best Independent Experience", shortLabel: "Independent", description: "Self-guided plans that work well from Las Palmas cruise terminal." },
  { id: "best-coastal", label: "Best Coastal Experience", shortLabel: "Coastal", description: "Las Canteras urban beach, Maspalomas dunes and Atlantic coastline." },
  { id: "best-view", label: "Best Viewpoints", shortLabel: "Viewpoints", description: "Roque Nublo, Bandama caldera and highland panoramas." },
  { id: "best-families", label: "Best for Families", shortLabel: "Families", description: "Pacing and route design suitable for children and mixed-age groups." },
  { id: "best-photography", label: "Best for Photography", shortLabel: "Photography", description: "Volcanic landscapes, dunes, colonial architecture and Atlantic light." },
  { id: "best-food", label: "Best Food & Wine Experience", shortLabel: "Food & Wine", description: "Canarian cuisine, local wines, market dining and coffee culture." },
  { id: "best-luxury", label: "Best Luxury Experience", shortLabel: "Luxury", description: "Private Gran Canaria touring with custom pace and comfort." },
  { id: "hidden-gem", label: "Hidden Gem", shortLabel: "Hidden Gem", description: "Less-obvious but highly rewarding alternatives on a port day." },
  { id: "best-value", label: "Best Value", shortLabel: "Best Value", description: "Strong overall return in experience quality per euro and per hour." },
  { id: "best-short-port", label: "Best for Short Port Calls", shortLabel: "Short Port", description: "Reliable options for tighter arrival-departure windows." },
];

export function getEditorialLabel(id: EditorialCategory): string {
  return EDITORIAL_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
