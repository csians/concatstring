import React from "react";
import Banner from "@/app/home/banner";
import Technologies from "@/app/home/technologies";
import Culture from "@/app/home/culture";
import WhyChoose from "@/app/home/whyChoose";
import WorkImpact from "@/components/WorkImpact";
import Faq from "@/components/faq";
import Trusted from "@/components/trusted";
import TechTalks from "@/app/home/techTalks";
import LifeAtCompany from "./lifeAtCompany";

import LoadingProvider from "@/components/LoadingContext";

import { generateSeoMetadata } from "@/components/SEOComponent";
import { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("cG9zdDoyMA=="); // Home page ID
}
const page = () => {
  return (
    <>

      <LoadingProvider>
        <Banner />
        <Trusted />
        <Technologies />
        <Culture />
        <WhyChoose />
        <WorkImpact />
        <TechTalks />
        <LifeAtCompany />
        <Faq />

      </LoadingProvider>
    </>
  );
};

export default page;
