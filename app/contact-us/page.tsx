import React from "react";
import StartProject from "@/app/contact-us/startProject";
import Faq from "@/app/contact-us/faq";
import LoadingProvider from "@/components/LoadingContext";
import { generateSeoMetadata } from "@/components/SEOComponent";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("cG9zdDoyNjU="); // Contact Us page ID
}
const page = () => {
  return (
    <LoadingProvider>
      <StartProject />
      <Faq />
    </LoadingProvider>
  );
};

export default page;
