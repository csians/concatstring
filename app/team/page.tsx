import React from "react";
import OurTeam from "./ourTeam";
import StrategySquad from "./strategySquad";
import TeamSection from "./teamSection";

import LoadingProvider from "@/components/LoadingContext";
import { generateSeoMetadata } from "@/components/SEOComponent";
import { Metadata } from "next";
import { fetchGraphQL } from "@/lib/server-graphql";
import { GET_TEAM_LISTING } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("cG9zdDoxMDEx"); // Team page ID
}

const page = async () => {
  // Fetch team data on the server
  const teamData = await fetchGraphQL(GET_TEAM_LISTING).catch(() => null);

  return (
    <LoadingProvider>
      <OurTeam initialData={teamData} />
      <TeamSection initialData={teamData} />
      <StrategySquad initialData={teamData} />
    </LoadingProvider>
  );
};

export default page;
