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
import { fetchGraphQL } from "@/lib/server-graphql";
import {
  GET_BANNER_CONTENT,
  GET_TRUSTED_BRANDS,
  GET_OUR_TECHNOLOGIES,
  GET_CSIAN_CULTURE,
  GET_WHY_CHOOSE_US,
  GET_POWERFUL_IMPACTS,
  GET_BLOG_POSTS,
  GET_BLOG_ICONS,
  GET_LIFE_AT_COMPANY_WITH_EVENTS,
  GET_FAQ,
} from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("cG9zdDoyMA=="); // Home page ID
}

const page = async () => {
  // Fetch all data in parallel on the server
  const [
    bannerData,
    trustedData,
    technologiesData,
    cultureData,
    whyChooseData,
    workImpactData,
    blogPostsData,
    blogIconsData,
    lifeAtCompanyData,
    faqData,
  ] = await Promise.all([
    fetchGraphQL(GET_BANNER_CONTENT).catch(() => null),
    fetchGraphQL(GET_TRUSTED_BRANDS).catch(() => null),
    fetchGraphQL(GET_OUR_TECHNOLOGIES).catch(() => null),
    fetchGraphQL(GET_CSIAN_CULTURE).catch(() => null),
    fetchGraphQL(GET_WHY_CHOOSE_US).catch(() => null),
    fetchGraphQL(GET_POWERFUL_IMPACTS).catch(() => null),
    fetchGraphQL(GET_BLOG_POSTS, { perPage: 3, after: null }).catch(() => null),
    fetchGraphQL(GET_BLOG_ICONS).catch(() => null),
    fetchGraphQL(GET_LIFE_AT_COMPANY_WITH_EVENTS).catch(() => null),
    fetchGraphQL(GET_FAQ).catch(() => null),
  ]);

  return (
    <>
      {/* <LoadingProvider> */}
        <Banner initialData={bannerData} />
        <Trusted initialData={trustedData} />
        <Technologies initialData={technologiesData} />
        <Culture initialData={cultureData} />
        <WhyChoose initialData={whyChooseData} />
        <WorkImpact initialData={workImpactData} />
        <TechTalks initialPostsData={blogPostsData} initialIconsData={blogIconsData} />
        <LifeAtCompany initialData={lifeAtCompanyData} />
        <Faq initialData={faqData} />
      {/* </LoadingProvider> */}
    </>
  );
};

export default page;
