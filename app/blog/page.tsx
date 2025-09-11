import React from "react";
import BlogTitle from "./blogTitle";
import TechTalks from "./techTalks";
import FutureTech from "./futureTech";
import MeetWriters from "./meetWriters";
import StoryToShare from "./storyToShare";
import LoadingProvider from "@/components/LoadingContext";
import { generateSeoMetadata } from "@/components/SEOComponent";
import { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("cG9zdDoxMDcx"); // Blog page ID
}
const page = () => {
  return (
    <LoadingProvider>
      <BlogTitle />
      <TechTalks />
      <FutureTech />
      <MeetWriters />
      <StoryToShare />
    </LoadingProvider>
  );
};

export default page;
