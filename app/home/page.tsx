import React from "react";
import { generateSeoMetadata } from "@/components/SEOComponent";
import { Metadata } from "next";
import HomeClient from "@/app/home/HomeClient";

export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("cG9zdDoyMA=="); // Home page ID
}
const page = () => {
  return (
    <>
      <HomeClient />
    </>
  );
};

export default page;
