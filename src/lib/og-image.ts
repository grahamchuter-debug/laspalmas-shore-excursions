import type { SiteImage } from "./images";
import { getResponsiveSources } from "./responsive-images";

export function ogImageUrl(image: SiteImage): string {
  const sources = getResponsiveSources(image.base, "og");
  return sources.src;
}
