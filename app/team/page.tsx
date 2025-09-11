import React from "react";
import OurTeam from "./ourTeam";
import StrategySquad from "./strategySquad";
import TeamSection from "./teamSection";

import LoadingProvider from "@/components/LoadingContext";
import { generateSeoMetadata } from "@/components/SEOComponent";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("cG9zdDoxMDEx"); // Team page ID
}
const page = () => {
  return (
    <LoadingProvider>
      <OurTeam />
      <TeamSection />
      <StrategySquad />
    </LoadingProvider>
  );
};

export default page;
