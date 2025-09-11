import React from "react";
import Banner from "./banner";
import LifeAtCompany from "./lifeAtCompany";
import Pagination from "./pagination";
import LoadingProvider from "@/components/LoadingContext";
import { Metadata } from "next";
import { generateSeoMetadata } from "@/components/SEOComponent";

export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("cG9zdDo5NzM="); // Event page ID
}
const page = () => {
  return (
    <LoadingProvider>
      <Banner />
      <LifeAtCompany />
      <Pagination />
    </LoadingProvider>
  );
};

export default page;
