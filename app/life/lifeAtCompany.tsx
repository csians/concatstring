"use client";
import { useRef, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import Slider from "react-slick";
import type { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/css/events.css";
import { GET_LIFE_AT_COMPANY } from "@/lib/queries";
import { formatEventDate } from "@/lib/utils";
import { setLifeAtCompanyData } from "@/store/slices/eventsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";
import EventGalleryModal from "@/components/EventGalleryModal";

export default function LifeAtCompany() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<any[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string | undefined>(
    undefined
  );
  const [initialIndex, setInitialIndex] = useState(0);
  const dispatch = useDispatch();
  const cachedData = useSelector(
    (state: RootState) => state.events.lifeAtCompany
  );

  const [cacheData, setCacheData] = useState<any>(null);
  const [cacheLoading, setCacheLoading] = useState(true);
  const [cacheError, setCacheError] = useState(false);

  // Try to fetch from cache API first
  useEffect(() => {
    const fetchCache = async () => {
      try {
        const response = await fetch("/api/life-cache");
        const result = await response.json();
        if (result.success && result.data) {
          setCacheData(result.data);
          setCacheError(false);
        } else {
          setCacheError(true);
        }
      } catch (error) {
        console.error("Failed to fetch from cache:", error);
        setCacheError(true);
      } finally {
        setCacheLoading(false);
      }
    };
    fetchCache();
  }, []);

  const sliderRef = useRef<Slider>(null);
  
  // Skip GraphQL if cache is available (wait for cache to load first)
  const shouldSkipGraphQL = cacheLoading ? true : !!cacheData;
  
  // Fallback to GraphQL only if cache is not available
  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(GET_LIFE_AT_COMPANY, {
    skip: shouldSkipGraphQL,
  });

  // Use cache data if available, otherwise use GraphQL data
  const data = cacheData?.lifeAtCompany || queryData;
  const loading = cacheLoading || (queryLoading && !cacheData);
  const error = queryError;

  // Store data in Redux when it comes from query
  useEffect(() => {
    if (data) {
      dispatch(setLifeAtCompanyData(data));
    }
  }, [data, dispatch]);

  // Use cached data from Redux if available, otherwise use fresh data from query
  const lifeAtCompanyData = cachedData || data;

  const sliderSettings: Settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    fade: false,
    cssEase: "ease-in-out",
    autoplay: true,
    autoplaySpeed: 8000,
    pauseOnHover: true,
    pauseOnFocus: true,
    adaptiveHeight: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: "slick-dots custom-slick-dots",
    customPaging: (i: number) => (
      <button 
        type="button" 
        aria-label={`Go to slide ${i + 1}`}
      ></button>
    ),
  };

  const title = lifeAtCompanyData?.page?.flexibleContent?.flexibleContent?.find(
    (item: any) => item.lifeAtCompanyTitle
  )?.lifeAtCompanyTitle;
  const content =
    lifeAtCompanyData?.page?.flexibleContent?.flexibleContent?.find(
      (item: any) => item.lifeAtCompanyTitle
    )?.lifeAtCompanyContent;
  const mostRecentEventsTitle =
    lifeAtCompanyData?.page?.flexibleContent?.flexibleContent?.find(
      (item: any) => item.lifeAtCompanyTitle
    )?.mostRecentEventsTitle;
  const allEvents =
    lifeAtCompanyData?.page?.flexibleContent?.flexibleContent?.find(
      (item: any) => item.lifeAtCompanyTitle
    )?.events?.nodes || [];

  // Ensure events are sorted by most recent date first
  const sortedEvents = [...allEvents].sort((a: any, b: any) => {
    const dateA = new Date(a?.eventSettings?.eventDate || 0).getTime();
    const dateB = new Date(b?.eventSettings?.eventDate || 0).getTime();
    return dateB - dateA;
  });
  // Show loading state while data is being fetched and no cached data exists
  if (loading && !cachedData) {
    return (
      <section className="2xl:pt-[120px] xl:pt-[100px] lg:pt-[80px] md:pt-[60px] sm:pt-[50px] pt-[40px] 2xl:pb-[60px] xl:pb-[50px] lg:pb-[40px] md:pb-[30px] sm:pb-[25px] pb-[20px]">
        <div className="container max-w-[1440px] 2xl:px-[20px] xl:px-[20px] lg:px-[20px] md:px-[15px] sm:px-[12px] px-[10px] mx-auto">
          <div className="flex flex-col items-center justify-center 2xl:gap-[16px] xl:gap-[14px] lg:gap-[12px] md:gap-[10px] sm:gap-[8px] gap-[6px] 2xl:mb-[60px] xl:mb-[50px] lg:mb-[40px] md:mb-[35px] sm:mb-[30px] mb-[25px]">
            <div className="animate-pulse bg-gray-700 h-12 w-96 rounded mb-4"></div>
            <div className="animate-pulse bg-gray-700 h-4 w-[800px] rounded"></div>
          </div>
          <div className="text-center py-[60px]">
            <div className="animate-pulse bg-gray-700 h-8 w-64 rounded mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  // Return null if there's an error and no cached data
  if (error && !cachedData) {
    return null;
  }

  // Show only first 3 most recent events
  const events = sortedEvents.slice(0, 3);

  // Return null if no events to display (only after loading is complete)
  if (!allEvents || allEvents.length === 0) {
    return null;
  }

  return (
    <>
    <section className="2xl:pt-[120px] xl:pt-[100px] lg:pt-[80px] md:pt-[60px] sm:pt-[50px] pt-[40px] 2xl:pb-[60px] xl:pb-[50px] lg:pb-[40px] md:pb-[30px] sm:pb-[25px] pb-[20px]">
      <div className="container max-w-[1440px] 2xl:px-[20px] xl:px-[20px] lg:px-[20px] md:px-[15px] sm:px-[12px] px-[10px] mx-auto">
        {/* <div className="flex flex-col items-center justify-center 2xl:gap-[16px] xl:gap-[14px] lg:gap-[12px] md:gap-[10px] sm:gap-[8px] gap-[6px] 2xl:mb-[60px] xl:mb-[50px] lg:mb-[40px] md:mb-[35px] sm:mb-[30px] mb-[25px]">
          <h2 className="h2 text-white text-center normal-case">{title}</h2>
          <p className="font-lato font-medium text-[17px] leading-[26px] text-[#C3C3C3] text-center max-w-[1000px]">
            {content}
          </p>
        </div> */}
        {events.length > 0 && (
          <div
            id="most-recent-events"
            className="bg-[#2E0707] 2xl:rounded-[20px] xl:rounded-[18px] lg:rounded-[15px] md:rounded-[12px] sm:rounded-[10px] rounded-[8px] 2xl:p-[80px] xl:p-[60px] lg:p-[50px] md:p-[40px] sm:p-[30px] p-[20px] relative overflow-hidden"
          >
            {/* Title */}
            <div className="text-center 2xl:mb-[50px] xl:mb-[45px] lg:mb-[40px] md:mb-[35px] sm:mb-[30px] mb-[25px]">
              <h2 className="text-white 2xl:text-[66px] xl:text-[58px] lg:text-[48px] md:text-[36px] sm:text-[28px] text-[22px] font-bold 2xl:leading-[87px] xl:leading-[75px] lg:leading-[60px] md:leading-[45px] sm:leading-[35px] leading-[28px] font-denton">
                {mostRecentEventsTitle}
              </h2>
            </div>
            {/* Event Slider Container */}
            <div className="events-slider-container relative">
              {/* Slick Slider */}
              <Slider
                ref={sliderRef}
                {...sliderSettings}
                className="events-slider"
              >
                {events.map((event: any, index: number) => {
                  return (
                  <div key={event.id} className="slide cursor-grab">
                    <div className="flex 2xl:gap-[60px] xl:gap-[60px] lg:gap-[40px] md:gap-[30px] sm:gap-[20px] gap-[20px] lg:items-start items-center lg:flex-row flex-col">
                      {/* Left Content */}
                      <div className="flex-1 2xl:max-w-[590px] xl:max-w-[590px] lg:max-w-[50%] max-w-full">
                        <h3 className="text-white 2xl:text-[34px] xl:text-[34px] lg:text-[28px] md:text-[24px] sm:text-[20px] text-[18px] font-bold 2xl:leading-[45px] xl:leading-[45px] lg:leading-[35px] md:leading-[30px] sm:leading-[25px] leading-[23px] font-denton mb-[5px]">
                          {event.eventSettings?.eventTitle}
                        </h3>
                        <p className="text-white 2xl:text-[24px] xl:text-[24px] lg:text-[20px] md:text-[18px] sm:text-[16px] text-[14px] font-normal 2xl:leading-[32px] xl:leading-[32px] lg:leading-[26px] md:leading-[24px] sm:leading-[22px] leading-[20px] font-denton mb-[16px]">
                          {formatEventDate(event.eventSettings?.eventDate)}
                        </p>
                        <p
                          className="text-[#C3C3C3] 2xl:text-[17px] xl:text-[17px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px] font-normal 2xl:leading-[26px] xl:leading-[26px] lg:leading-[24px] md:leading-[22px] sm:leading-[20px] leading-[19px] font-lato 2xl:mb-[47px] xl:mb-[47px] lg:mb-[30px] md:mb-[25px] sm:mb-[20px] mb-[15px]"
                          dangerouslySetInnerHTML={{
                            __html: event.eventSettings?.eventDescription,
                          }}
                        />
                        {/* Only show View More button if both URL and title exist */}
                        {event.eventSettings?.eventViewMoreLink?.title && (
                          <Link
                            href={`/life/${event.slug}`}
                            className="flex items-center gap-[10px] cursor-pointer hover:opacity-80 transition-opacity"
                          >
                            <span className="text-white 2xl:text-[18px] xl:text-[18px] lg:text-[16px] md:text-[15px] sm:text-[14px] text-[13px] font-bold 2xl:leading-[24px] xl:leading-[24px] lg:leading-[20px] md:leading-[19px] sm:leading-[18px] leading-[17px] font-denton hover:opacity-80 transition-opacity">
                              {event.eventSettings?.eventViewMoreLink?.title}
                            </span>
                            <svg
                              width="15"
                              height="20"
                              viewBox="0 0 15 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M14.8489 10.4392L7.9075 19.617C7.72435 19.8563 7.40933 19.9991 7.06134 19.9991H0.999061C0.289536 20.0284 -0.293615 19.3092 0.160232 18.7314L6.96244 10.0106L0.365361 1.26134C-0.0800613 0.674958 0.507851 -0.025701 1.21152 0.000725499H7.06134C7.40933 0.000725499 7.72435 0.143571 7.9075 0.382838L14.8489 9.56068C15.0504 9.82852 15.0504 10.1713 14.8489 10.4392Z"
                                fill="url(#paint0_linear_1_2080)"
                              />
                              <defs>
                                <linearGradient
                                  id="paint0_linear_1_2080"
                                  x1="0.000158411"
                                  y1="9.99993"
                                  x2="14.9998"
                                  y2="9.99993"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#EA070B" />
                                  <stop offset="0.158" stopColor="#DF1418" />
                                  <stop offset="1" stopColor="#FF686B" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </Link>
                        )}
                      </div>
                      {/* Right Image */}
                      <div className="flex-1 2xl:max-w-[590px] xl:max-w-[590px] lg:max-w-[50%] max-w-full relative group">
                        {/* Top-right gallery trigger (visible on hover) */}
                        <button
                          type="button"
                          aria-label="Open gallery"
                          onClick={() => {
                            setSelectedImages(event.eventSettings?.eventImages || []);
                            setSelectedVideos(event.eventSettings?.eventVideos || []);
                            setSelectedTitle(event.eventSettings?.eventTitle);
                            setInitialIndex(0);
                            setIsGalleryOpen(true);
                          }}
                          className="absolute z-10 top-3 right-3 bg-white/90 hover:bg-white text-black rounded-md p-2 shadow transition opacity-0 group-hover:opacity-100"
                        >
                          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                            <path d="M22 42H6V26" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M26 6H42V22" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </button>
                        <div className="w-full 2xl:h-[380px] xl:h-[380px] lg:h-[300px] md:h-[350px] sm:h-[300px] h-[300px] rounded-[14px] overflow-hidden bg-[#D9D9D9] relative">
                          <img
                            src={
                              event.eventSettings?.eventImages?.[0]?.eventImage
                                ?.node?.sourceUrl
                            }
                            alt={
                              event.eventSettings?.eventImages?.[0]?.eventImage
                                ?.node?.altText
                            }
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Hover overlay to match pagination behavior */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );})}
              </Slider>
            </div>
          </div>
        )}
      </div>
    </section>
    <EventGalleryModal
      isOpen={isGalleryOpen}
      title={selectedTitle}
      images={selectedImages}
      videos={selectedVideos}
      initialIndex={initialIndex}
      onClose={() => setIsGalleryOpen(false)}
    />
    </>
  );
}