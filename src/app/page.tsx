import { getAllDestinations } from "@/lib/destinations";
import HomeClient from "@/app/components/HomeClient";
import { preloadVitalDestinations } from "@/lib/preload";

export default function Home() {
  const destinations = getAllDestinations();
  preloadVitalDestinations();

  return <HomeClient destinations={destinations} />;
}
