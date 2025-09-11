import type { Metadata } from "next";
import { generateSeoMetadata } from "@/components/SEOComponent";
import React from "react";
import WhoWeAre from "@/app/about-us/whoWeAre";
import WorkingMethod from "@/app/about-us/workingMethod";
import MeetTheMind from "@/app/about-us/meetTheMind";
import Empowering from "@/app/about-us/empowering";
import Technology from "@/app/about-us/technology";
import Timeline from "@/app/about-us/timeline";
import VisionSlider from "@/components/visionSlider";

import LoadingProvider from "@/components/LoadingContext";


export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("cG9zdDoyMg=="); // About Us page ID
}

const page = () => {
  return (
    <>
      <LoadingProvider>
        <Empowering />
        <WhoWeAre />
        <Technology />
        <Timeline />
        <WorkingMethod />
        <MeetTheMind />
        <VisionSlider padding="pb-[173px]" />
      </LoadingProvider>
    </>
  );
};

export default page;
