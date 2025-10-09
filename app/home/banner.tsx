"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "@/css/home.css";
import { RootState } from "@/store";
import { useQuery } from "@apollo/client";
import { GET_BANNER_CONTENT } from "@/lib/queries";
import { setBanner } from "@/store/slices/homeSlice";
import { useDispatch, useSelector } from "react-redux";
import { BannerSkeleton } from "@/components/skeletons";
import LoadingProvider from "@/components/LoadingContext";

const Banner = () => {
  const cachedData = useSelector((state: RootState) => state.home.banner);
  // Skip query if cached data exists to prevent unnecessary refetches
  const { data } = useQuery(GET_BANNER_CONTENT, {
    skip: !!cachedData,
  });
  const [loading, setLoading] = React.useState(true);
  const dispatch = useDispatch();
  const column =
    cachedData?.page?.flexibleContent?.flexibleContent?.[0]?.column?.[0] ??
    data?.page?.flexibleContent?.flexibleContent?.[0]?.column?.[0];

  const title = column?.title;
  const content = column?.content;
  const link = column?.link;
  useEffect(() => {
    if (data) {
      dispatch(setBanner(data));
    }
    // Only trigger animation after content is loaded and not loading
    if (title && content) {
      setLoading(false);
      const banner = document.querySelector(".banner");
      // console.log('jaimin')
      if (banner) {
        // Small delay to ensure content is rendered
        setTimeout(() => {
          banner.classList.add("active");
        }, 100);
      }
    }
  }, [loading, title, content, data]);

  // if (!cachedData) {
  //   return <BannerSkeleton />;
  // }
  // if (!column || !title || !content || !link) return null;

  return (
    <LoadingProvider
      cachedData={cachedData ?? data}
    >
    <section className="banner relative min-h-screen max-lg:min-h-[auto] overflow-hidden">
      <Image
        src="/images/home_banner.webp"
        alt="Home Banner"
        width={1920}
        height={1080}
        priority
        className="absolute top-0 left-0 w-full h-full object-cover object-center z-0"
      />
      <video
        muted
        autoPlay
        loop
        playsInline
        // preload="none"
        // poster="/images/home_banner.webp"
        className="absolute top-[42px] left-0 w-full h-full object-cover object-center z-0"
      >
        <source src="/video/banner_background.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-[1432px] px-4 mx-auto pt-[200px] md:pt-[200px] lg:pt-[267px] pb-[100px] px-4 lg:pb-[227px]">
        <div className="text-left px-4 md:px-0">
          <h1 className="title h1 tracking-normal text-white max-w-full md:max-w-[970px] lg:max-w-[1200px] mx-auto md:mx-0">
            {title || "High-Performance Websites That Convert"}
          </h1>

          <div className="description max-w-full md:max-w-[677px] mb-[30px] md:mb-[60px] mx-auto md:mx-0">
            <p className="font-lato font-medium text-[16px] md:text-[18px] lg:text-[20px] text-white">
              {content || "Deliver seamless digital experiences with responsive, SEO-optimized websites. Whether it's corporate, eCommerce, or custom platforms, we design with performance and results in mind."}
            </p>
          </div>

          {link && (
            <Link href={link.url} className="inline-block group button">
              <div className="btn-primary-outline">
                <div className="btn-primary">{link.title}</div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
    </LoadingProvider>
  );
};

export default Banner;
