import React from "react";
import OurServices from "@/app/services/ourServices";
import GrowthBanner from "@/app/services/growthBanner";
import ClientFeedback from "@/app/services/clientFeedback";
import WorkImpact from "@/components/WorkImpact";
import Trusted from "@/components/trusted";
import ServiceHighlights from "./serviceHighlights";

import LoadingProvider from "@/components/LoadingContext";
import { generateSeoMetadata } from "@/components/SEOComponent";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("cG9zdDoyNzg="); // Services page ID
}
const page = () => {
  return (
    <LoadingProvider>
      <OurServices />
      <GrowthBanner />
      <ServiceHighlights />
      <WorkImpact showViewMore={false} />
      <Trusted />
      <ClientFeedback />
    </LoadingProvider>
  );
};

export default page;
