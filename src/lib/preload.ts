import { preload } from "react-dom";
import { destinations } from "@/data/destinations";

/**
 * Preloads the highest priority images (the first 3 visible destinations' hero photos)
 * This signals the browser to fetch these assets early on, improving Largest Contentful Paint (LCP)
 */
export function preloadVitalDestinations() {
  const topDestinations = destinations.slice(0, 3);
  
  topDestinations.forEach((dest) => {
    preload(dest.foto_url[0], { as: "image", fetchPriority: "high" });
  });
}
