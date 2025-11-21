"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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


function useFirstUserGesture() {
  const [hasGesture, setHasGesture] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const arm = () => setHasGesture(true);
    // the safest events that only happen via explicit user input
    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "touchstart",
      "touchmove",
      "wheel",
    ];
    const options: AddEventListenerOptions = {
      once: true,
      passive: true,
      capture: true,
    };

    events.forEach((evt) => window.addEventListener(evt, arm, options));
    return () =>
      events.forEach((evt) =>
        window.removeEventListener(evt, arm, { capture: true } as any)
      );
  }, []);

  return hasGesture;
}

const usePrefersReducedData = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const conn: any = (navigator as any).connection;
    setReduced(Boolean(conn?.saveData));
  }, []);
  return reduced;
};

interface BannerProps {
  initialData?: any;
}

const Banner: React.FC<BannerProps> = ({ initialData }) => {
  const cachedData = useSelector((state: RootState) => state.home.banner);

  const { data, loading: gqlLoading } = useQuery(GET_BANNER_CONTENT, {
    skip: !!cachedData || !!initialData,
    fetchPolicy: "cache-first",
  });

  const dispatch = useDispatch();

  const column = useMemo(() => {
    return (
      cachedData?.page?.flexibleContent?.flexibleContent?.[0]?.column?.[0] ??
      initialData?.page?.flexibleContent?.flexibleContent?.[0]?.column?.[0] ??
      data?.page?.flexibleContent?.flexibleContent?.[0]?.column?.[0]
    );
  }, [cachedData, initialData, data]);

  const title: string | undefined = column?.title;
  const content: string | undefined = column?.content;
  const link: { url: string; title: string } | undefined = column?.link;

  // Activate animation once content is ready
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    if (initialData && !cachedData) {
      dispatch(setBanner(initialData));
    } else if (data) {
      dispatch(setBanner(data));
    }
  }, [data, initialData, cachedData, dispatch]);
  useEffect(() => {
    if (!title || !content) return;
    const id = window.setTimeout(() => setIsActive(true), 100);
    return () => window.clearTimeout(id);
  }, [title, content]);

  // Client-only flags
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  // Strict gating for video
  const hasGesture = useFirstUserGesture();
  const reducedData = usePrefersReducedData();
  const shouldRenderVideo = isMounted && hasGesture && !reducedData;

  const posterSrc = "/images/home_banner.webp";
  const videoSrc = "/video/banner_background.webm";

  const cmsStillLoading = !cachedData && !initialData && gqlLoading;
  if (cmsStillLoading) return <BannerSkeleton />;

  return (
    <LoadingProvider cachedData={cachedData ?? initialData ?? data}>
      <section
        className={`banner relative min-h-screen max-lg:min-h-[auto] overflow-hidden ${
          isActive ? "active" : ""
        }`}
      >
        {/* Always-rendered LCP image (placeholder + fallback) */}
        <Image
          src={posterSrc}
          alt="Home Banner"
          width={1920}
          height={1080}
          priority
          className="absolute top-0 left-0 w-full h-full object-cover object-center z-0 select-none"
        />

        {/* Render the video ONLY after explicit user gesture */}
        {shouldRenderVideo ? (
          <video
            muted
            autoPlay
            loop
            playsInline
            preload="none"
            poster={posterSrc}
            aria-hidden
            className="absolute top-[42px] left-0 w-full h-full object-cover object-center z-0"
          >
            <source src={videoSrc} type="video/webm" />
          </video>
        ) : null}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 z-0" />

        {/* Content */}
        <div className="relative z-10 max-w-[1432px] mx-auto pt-[200px] md:pt-[200px] lg:pt-[267px] pb-[100px] lg:pb-[227px] px-4">
          <div className="text-left px-4 md:px-0">
            <h1 className="title h1 tracking-normal text-white max-w-full md:max-w-[970px] lg:max-w-[1200px] mx-auto md:mx-0">
              {title || "High-Performance Websites That Convert"}
            </h1>

            <div className="description max-w-full md:max-w-[677px] mb-[30px] md:mb-[60px] mx-auto md:mx-0">
              <p className="font-lato font-medium text-[16px] md:text-[18px] lg:text-[20px] text-white">
                {content ||
                  "Deliver seamless digital experiences with responsive, SEO-optimized websites. Whether it's corporate, eCommerce, or custom platforms, we design with performance and results in mind."}
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
