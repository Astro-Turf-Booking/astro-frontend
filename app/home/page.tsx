import type { Metadata } from "next";
import { HomeView } from "./home-view";

export const metadata: Metadata = {
  title: "Home — TurfZone | Good grounds. Great games.",
  description:
    "Explore local football pitches across the country.",
};

export default function HomePage() {
  return <HomeView />;
}
