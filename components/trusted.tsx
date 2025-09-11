"use client";

import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_TRUSTED_BRANDS } from "@/lib/queries";
import "@/css/home.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setTrusted } from "@/store/slices/homeSlice";
import { useIsMobile } from "@/hooks/use-mobile";
import { TrustedSkeleton } from "@/components/skeletons";

interface TrustSliderProps {
  mainClass?: string;
}

const Trusted: React.FC<TrustSliderProps> = ({ mainClass }) => {
  const dispatch = useDispatch();
  const cachedData = useSelector((state: RootState) => state.home.trusted);
  const { data, loading } = useQuery(GET_TRUSTED_BRANDS);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (data) {
      const trustedBlock = data?.page?.flexibleContent?.flexibleContent?.find(
        (block: any) => block?.trustedTitle
      );
      if (trustedBlock) {
        dispatch(setTrusted(trustedBlock));
      }
    }
  }, [data, dispatch]);

  // Animation effect
  useEffect(() => {
    const trustedSection = document.querySelector(
      ".trusted-section"
    ) as HTMLElement | null;
  
    if (!trustedSection) return;

    // Add active class by default on mobile
    if (isMobile) {
      trustedSection.classList.add("active");
      return;
    }
  
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trustedSection.classList.add("active");
          observer.unobserve(trustedSection);
        }
      },
      {
        root: null,       // viewport
        threshold: 0.5,   // fire when 50% of element is visible
      }
    );
  
    observer.observe(trustedSection);
  
    return () => observer.disconnect();
  }, [isMobile]);
  

  // Show skeleton while loading and no cached data
  if (loading && !cachedData) {
    return <TrustedSkeleton />;
  }

  const brandGroup = data?.page?.flexibleContent?.flexibleContent?.find(
    (block: any) => block?.trustedTitle
  );

  const finalBrandData = cachedData || brandGroup;

  let images = [];

  if (
    Array.isArray(finalBrandData) &&
    finalBrandData.length > 0 &&
    finalBrandData[0]?.sourceUrl
  ) {
    images = finalBrandData;
  } else if (brandGroup?.brandsImages) {
    images =
      brandGroup.brandsImages.map((img: any) => img?.brandImage?.node) || [];
  } else if (finalBrandData?.brandsImages) {
    images =
      finalBrandData.brandsImages.map((img: any) => img?.brandImage?.node) ||
      [];
  }

  const classNames = [
    "absolute top-[14.53vw] right-[36.3vw] w-[3.8vw] animate-1 object-contain object-center",
    "absolute top-[7.97vw] left-[23.13vw] w-[14.43vw] animate-1 object-contain object-center",
    "absolute bottom-[14.22vw] right-[45.26vw] w-[12.55vw] animate-1 object-contain object-center",
    "absolute bottom-[7.97vw] right-[29.22vw] w-[12.55vw] animate-3 object-contain object-center",
    "absolute top-[27.19vw] right-[7.81vw] w-[12.55vw] animate-3 object-contain object-center",
    "absolute top-[13.85vw] right-[10.94vw] w-[12.55vw] animate-1 object-contain object-center",
    "absolute bottom-[15.05vw] right-[21.51vw] w-[12.55vw] animate-1 object-contain object-center",
    "absolute bottom-[8.65vw] left-[23.18vw] w-[12.55vw] animate-3 object-contain object-center",
    "absolute bottom-[17.76vw] left-[19.53vw] w-[8.33vw] animate-1 object-contain object-center",
    "absolute top-[17.91vw] left-[7.81vw] w-[12.55vw] animate-3 object-contain object-center",
    "absolute top-[11.67vw] left-[42.08vw] w-[12.55vw] animate-3 object-contain object-center",
  ];

  return (
    <section className="trusted-section relative py-[7.97vw]">
      <div className="max-w-[1632px] mx-auto px-4">
        <h2 className="text-[4.17vw] mx-auto pt-[14.43vw] pb-[15.57vw] h2 tracking-normal text-center text-white max-w-[60.94vw]">
          {finalBrandData?.trustedTitle || brandGroup?.trustedTitle}
        </h2>
        <div className="icon-box absolute top-0 left-0 w-full h-full">
          {images.map((img: any, idx: number) =>
            img ? (
              <img
                key={idx}
                src={img.sourceUrl}
                alt={img.altText || "brand"}
                className={classNames[idx]}
              />
            ) : null
          )}
        </div>
      </div>
    </section>
  );
};

export default Trusted;
