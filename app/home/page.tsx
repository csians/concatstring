import React from "react";
import LoadingProvider from "@/components/LoadingContext";
import { generateSeoMetadata } from "@/components/SEOComponent";
import { Metadata } from "next";
import WorkImpact from "@/components/WorkImpact";
import Banner from "./banner";
import Culture from "./culture";
import WhyChoose from "./whyChoose";
import Faq from "@/components/faq";
import TechTalks from "@/app/home/techTalks";
import LifeAtCompany from "./lifeAtCompany";
import Trusted from "@/components/trusted";
import Technologies from "./technologies";

export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("cG9zdDoyMA=="); // Home page ID
}
const page = () => {
  return (
    <>

      {/* <LoadingProvider> */}
        <Banner/>
        <Trusted />
        <Technologies />
        <Culture/>
        <WhyChoose/>
        <WorkImpact/>
        <TechTalks />
        <LifeAtCompany />
        <Faq />

      {/* </LoadingProvider> */}
    </>
  );
};

export default page;
