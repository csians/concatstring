"use client";

import dynamic from "next/dynamic";

const Banner = dynamic(() => import("@/app/home/banner"), { ssr: false });
const Technologies = dynamic(() => import("@/app/home/technologies"), { ssr: false });
const Culture = dynamic(() => import("@/app/home/culture"), { ssr: false });
const WhyChoose = dynamic(() => import("@/app/home/whyChoose"), { ssr: false });
const WorkImpact = dynamic(() => import("@/components/WorkImpact"), { ssr: false });
const Faq = dynamic(() => import("@/components/faq"), { ssr: false });
const Trusted = dynamic(() => import("@/components/trusted"), { ssr: false });
const TechTalks = dynamic(() => import("@/app/home/techTalks"), { ssr: false });
const LifeAtCompany = dynamic(() => import("@/app/home/lifeAtCompany"), { ssr: false });

export default function HomeClient() {
  return (
    <>
      <Banner />
      <Trusted />
      <Technologies />
      <Culture />
      <WhyChoose />
      <WorkImpact />
      <TechTalks />
      <LifeAtCompany />
      <Faq />
    </>
  );
}
