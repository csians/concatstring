"use client";
import React, { useEffect, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/css/about.css";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_TURNING_VISION_AND_WORKING_METHOD } from "@/lib/queries";
import { setTurningVisionData } from "@/store/slices/aboutSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

interface VisionSliderProps {
  padding?: string;
}

const VisionSlider: React.FC<VisionSliderProps> = ({ padding }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cachedData = useSelector(
    (state: RootState) => state.about.turningVision
  );

  const { data } = useQuery(GET_TURNING_VISION_AND_WORKING_METHOD);

  // Get fresh data from query
  const freshData = data?.page?.flexibleContent?.flexibleContent?.find(
    (section: any) => section?.turningVisionTitle
  );

  // Use cached data from Redux if available, otherwise use fresh data from query
  const visionSection = cachedData || freshData;

  // Store data in Redux when it comes from query
  useEffect(() => {
    if (data) {
      const turningVisionBlock =
        data?.page?.flexibleContent?.flexibleContent?.find(
          (section: any) => section?.turningVisionTitle
        );
      if (turningVisionBlock) {
        dispatch(setTurningVisionData(turningVisionBlock));
      }
    }
  }, [data, dispatch]);

  // Pre-compute routes for better performance
  const processedSlides = useMemo(() => {
    if (!visionSection?.projectSilder?.nodes) return [];

    return visionSection.projectSilder.nodes
      .filter((slide: any) => slide.projectSettings?.projectLink?.url) // Ensure projectLink is available
      .map((slide: any) => {
        return {
          ...slide,
          computedRoute: slide.projectSettings.projectLink.url // Use projectLink.url directly for route
        };
      });
  }, [visionSection?.projectSilder?.nodes]);

  // Prefetch routes for faster navigation
  useEffect(() => {
    processedSlides.forEach((slide: any) => {
      if (slide.computedRoute) {
        router.prefetch(slide.computedRoute);
      }
    });
  }, [processedSlides, router]);

  const turningVisionTitle = visionSection?.turningVisionTitle;

  const settings = {
    centerMode: true,
    centerPadding: "20px",
    slidesToShow: 1,
    infinite: true,
    arrows: false,
    dots: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "40px",
        },
      },
    ],
  };

  return (
    <>
      {visionSection && (
        <section className={`overflow-hidden vision bg-black ${padding}`}>
          <div className="container max-w-[1440px] px-[20px] mx-auto">
            <h2 className="h2 text-white text-center mb-[60px]">
              {turningVisionTitle}
            </h2>
          </div>
          <div className="vision-slider max-w-[980px] mx-auto">
            <div className="slider-container">
              <Slider className="vision-slider" {...settings}>
                {processedSlides.map((slide: any, idx: number) => (
                  <div className="slide-wrap" key={idx}>
                    <div
                      className="slide cursor-pointer group overflow-hidden"
                      onClick={() => router.push(slide.computedRoute)} // Use precomputed route
                    >
                      <img
                        src={
                          slide.projectSettings.relatedProjectImage?.node
                            ?.sourceUrl
                        }
                        alt={
                          slide.projectSettings.relatedProjectImage?.node
                            ?.altText || `Slide ${idx + 1}`
                        }
                        width="854"
                        height="463"
                        className="w-full aspect-[980/532] object-cover object-center group-hover:scale-105 transition-all duration-[800ms] ease-in-out"
                      />
                      <div className="slide-content flex justify-between items-center 2xl:pb-[20px] xl:pb-[20px] lg:pb-[20px] md:pb-0 sm:pb-0 pb-0 2xl:px-[20px] xl:px-[20px] lg:px-[20px] md:px-0 sm:px-0 px-0">
                        <h3 className="font-denton font-semibold 2xl:text-[46px] xl:text-[46px] lg:text-[30px] md:text-[20px] sm:text-[20px] text-[20px] leading-[100%] text-white hover:text-[#E72125] cursor-pointer">
                          {slide.projectSettings.relatedProjectName}
                        </h3>
                        <span className="arrow">
                          <img
                            className="cursor-pointer"
                            src={
                              slide.projectSettings.arrowSvg?.node?.sourceUrl
                            }
                            width="44"
                            height="44"
                            alt={
                              slide.projectSettings.arrowSvg?.node?.altText ||
                              "progress"
                            }
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default VisionSlider;
