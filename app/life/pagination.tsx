"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_LIFE_AT_COMPANY } from "@/lib/queries";
import { formatEventDate } from "@/lib/utils";
import { setLifeAtCompanyData } from "@/store/slices/eventsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import EventGalleryModal from "@/components/EventGalleryModal";

const Pagination = () => {
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Number of images to show per page

  // Skip GraphQL if cache is available (wait for cache to load first)
  const shouldSkipGraphQL = cacheLoading ? true : !!cacheData;

  // Fallback to GraphQL only if cache is not available
  const { data: queryData } = useQuery(GET_LIFE_AT_COMPANY, {
    skip: shouldSkipGraphQL,
  });

  // Use cache data if available, otherwise use GraphQL data
  const data = cacheData?.lifeAtCompany || queryData;

  // Store data in Redux when it comes from query
  useEffect(() => {
    if (data) {
      dispatch(setLifeAtCompanyData(data));
    }
  }, [data, dispatch]);

  // Use cached data from Redux if available, otherwise use fresh data from query
  const lifeAtCompanyData = cachedData || data;

  const allEvents =
    lifeAtCompanyData?.page?.flexibleContent?.flexibleContent?.find(
      (item: any) => item.lifeAtCompanyTitle
    )?.events?.nodes || [];

  // Sort by most recent first to ensure newest events appear first
  const sortedEvents = [...allEvents].sort((a: any, b: any) => {
    const dateA = new Date(a?.eventSettings?.eventDate || 0).getTime();
    const dateB = new Date(b?.eventSettings?.eventDate || 0).getTime();
    return dateB - dateA;
  });
  // Show events from 4th onwards (skip first 3)
  const remainingEvents = sortedEvents.slice(3);

  // Return null if no remaining events (4th onwards)
  if (!remainingEvents || remainingEvents.length === 0) {
    return null;
  }

  // Calculate pagination
  const totalPages = Math.ceil(remainingEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = remainingEvents.slice(startIndex, endIndex);

  // Handle page navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to the category section after page change
      setTimeout(() => {
        const categoryElement = document.getElementById("most-recent-events");
        if (categoryElement) {
          // Get the element's position and scroll to show it with some offset
          const elementRect = categoryElement.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          const offset = 100; // Add some offset to show the categories clearly
          window.scrollTo({
            top: absoluteElementTop - offset,
            behavior: "smooth",
          });
        }
      }, 100); // Small delay to ensure DOM is updated
    }
  };

  return (
    <>
      <section
        id="collage"
        className="2xl:py-[120px] xl:py-[100px] lg:py-[80px] md:py-[60px] sm:py-[50px] py-[40px]"
      >
        <div className="container max-w-[1440px] 2xl:px-[20px] xl:px-[20px] lg:px-[20px] md:px-[15px] sm:px-[12px] px-[10px] mx-auto">
          {/* <!-- Photo Gallery Grid --> */}
          <div className="relative w-full max-w-[1401px] mx-auto">
            {/* <!-- Main Grid Container --> */}
            <div className="grid grid-cols-12 2xl:gap-[30px] xl:gap-[25px] lg:gap-[20px] md:gap-[15px] sm:gap-[12px] gap-[8px]">
              {currentEvents.map((event: any, index: number) => {
                // Define grid classes based on index for responsive layout
                const getGridClasses = () => {
                  if (index === 0) {
                    return "col-span-12 lg:col-span-8 xl:col-span-8 2xl:col-span-8 row-span-3";
                  } else if (index === 1 || index === 2) {
                    return "col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-4 2xl:col-span-4 row-span-2";
                  } else if (index === 3 || index === 4) {
                    return "col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-4 2xl:col-span-4 row-span-3";
                  } else if (index === 5) {
                    return "col-span-6 md:col-span-6 lg:col-span-4 2xl:col-span-4 md:row-span-2";
                  } else if (index === 6) {
                    return "col-span-6 md:col-span-6 lg:col-span-4 2xl:col-span-4";
                  } else if (index === 7) {
                    return "col-span-6 md:col-span-6 lg:col-span-4 2xl:col-span-4 row-span-2";
                  } else if (index === 8) {
                    return "col-span-6 md:col-span-6 lg:col-span-4 2xl:col-span-4";
                  } else {
                    return "col-span-6 md:col-span-6 lg:col-span-4 2xl:col-span-4";
                  }
                };

                return (
                  <div
                    key={event.id}
                    className={`relative w-full ${getGridClasses()} rounded-[10px] overflow-hidden group ${
                      index === 3 || index === 4 ? "max-h-[500px]" : ""
                    }`}
                  >
                    {/* Top-right gallery trigger */}
                    <button
                      type="button"
                      aria-label="Open gallery"
                      onClick={() => {
                        setSelectedImages(
                          event.eventSettings?.eventImages || []
                        );
                        setSelectedVideos(
                          event.eventSettings?.eventVideos || []
                        );
                        setSelectedTitle(event.eventSettings?.eventTitle);
                        setInitialIndex(0);
                        setIsGalleryOpen(true);
                      }}
                      className="absolute z-10 top-3 right-3 bg-white/90 hover:bg-white text-black rounded-md p-2 shadow transition opacity-0 group-hover:opacity-100"
                    >
                      <svg
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                      >
                        <path
                          d="M22 42H6V26"
                          stroke="#000000"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M26 6H42V22"
                          stroke="#000000"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </button>
                    <img
                      src={
                        event.eventSettings?.eventImages?.[0]?.eventImage?.node
                          ?.sourceUrl
                      }
                      alt={
                        event.eventSettings?.eventImages?.[0]?.eventImage?.node
                          ?.altText
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* <!-- Hover Overlay --> */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 2xl:p-[30px] xl:p-[25px] lg:p-[20px] md:p-[15px] sm:p-[12px] p-[10px] flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-row flex-wrap">
                      <div className="2xl:mb-[20px] xl:mb-[18px] lg:mb-[15px] md:mb-[12px] sm:mb-[10px] mb-[8px]">
                        <h3 className="text-white font-denton font-bold 2xl:text-[24px] xl:text-[22px] lg:text-[20px] md:text-[18px] sm:text-[16px] text-[14px] 2xl:leading-[32px] xl:leading-[28px] lg:leading-[26px] md:leading-[24px] sm:leading-[22px] leading-[20px] 2xl:mb-[5px] xl:mb-[5px] lg:mb-[4px] md:mb-[3px] sm:mb-[3px] mb-[2px]">
                          {event.eventSettings?.eventTitle}
                        </h3>
                        <p className="text-white font-denton font-normal 2xl:text-[18px] xl:text-[16px] lg:text-[15px] md:text-[14px] sm:text-[13px] text-[12px] 2xl:leading-[24px] xl:leading-[22px] lg:leading-[20px] md:leading-[18px] sm:leading-[17px] leading-[16px]">
                          {formatEventDate(event.eventSettings?.eventDate)}
                        </p>
                      </div>
                      {/* <!-- View More Button --> */}
                      {/* Only show View More button if both URL and title exist */}
                      {event.eventSettings?.eventViewMoreLink?.title && (
                        <Link
                          href={`/life/${event.slug}`}
                          className="flex items-center 2xl:gap-[10px] xl:gap-[10px] lg:gap-[8px] md:gap-[7px] sm:gap-[6px] gap-[5px] cursor-pointer hover:opacity-80 transition-opacity opacity-0 group-hover:opacity-100 duration-300"
                        >
                          <span className="text-white font-denton font-bold 2xl:text-[18px] xl:text-[16px] lg:text-[15px] md:text-[14px] sm:text-[13px] text-[12px] 2xl:leading-[24px] xl:leading-[22px] lg:leading-[20px] md:leading-[18px] sm:leading-[17px] leading-[16px]">
                            {event.eventSettings?.eventViewMoreLink?.title}
                          </span>
                          <svg
                            width="15"
                            height="20"
                            viewBox="0 0 15 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="2xl:w-[15px] 2xl:h-[20px] xl:w-[13px] xl:h-[18px] lg:w-[12px] lg:h-[16px] md:w-[11px] md:h-[15px] sm:w-[10px] sm:h-[14px] w-[8px] h-[12px]"
                          >
                            <path
                              d="M14.8489 10.4392L7.9075 19.617C7.72435 19.8563 7.40933 19.9991 7.06134 19.9991H0.999061C0.289536 20.0284 -0.293615 19.3092 0.160232 18.7314L6.96244 10.0106L0.365361 1.26134C-0.0800613 0.674958 0.507851 -0.025701 1.21152 0.000725499H7.06134C7.40933 0.000725499 7.72435 0.143571 7.9075 0.382838L14.8489 9.56068C15.0504 9.82852 15.0504 10.1713 14.8489 10.4392Z"
                              fill="url(#paint0_linear_gallery)"
                            />
                            <defs>
                              <linearGradient
                                id="paint0_linear_gallery"
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
                  </div>
                );
              })}
            </div>

            {/* <!-- Pagination Controls --> */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center 2xl:mt-[60px] xl:mt-[50px] lg:mt-[40px] md:mt-[30px] sm:mt-[25px] mt-[20px]">
                <div className="flex items-center 2xl:gap-[20px] xl:gap-[18px] lg:gap-[15px] md:gap-[12px] sm:gap-[10px] gap-[8px]">
                  {/* <!-- Page Text --> */}
                  <div className="flex items-center 2xl:gap-[8px] xl:gap-[8px] lg:gap-[6px] md:gap-[5px] sm:gap-[4px] gap-[3px]">
                    <span className="font-lato font-normal text-[#E9E9E9] 2xl:text-[17px] xl:text-[16px] lg:text-[15px] md:text-[14px] sm:text-[14px] text-[14px] 2xl:leading-[20px] xl:leading-[19px] lg:leading-[18px] md:leading-[17px] sm:leading-[16px] leading-[14px]">
                      Page
                    </span>
                  </div>

                  {/* <!-- Page Number Input --> */}
                  <div className="relative">
                    <div className="custom-pagination flex items-center justify-center 2xl:w-[60px] 2xl:h-[62px] xl:w-[55px] xl:h-[57px] lg:w-[50px] lg:h-[52px] md:w-[45px] md:h-[47px] sm:w-[40px] sm:h-[42px] w-[35px] h-[37px] border border-white 2xl:rounded-[10px] xl:rounded-[10px] lg:rounded-[8px] md:rounded-[6px] sm:rounded-[5px] rounded-[4px] bg-transparent">
                      <div className="flex items-center gap-[4px]">
                        <span className="font-lato font-normal text-[#E9E9E9] text-center 2xl:text-[17px] xl:text-[16px] lg:text-[15px] md:text-[14px] sm:text-[14px] text-[14px] 2xl:leading-[20px] xl:leading-[19px] lg:leading-[18px] md:leading-[17px] sm:leading-[16px] leading-[14px]">
                          {currentPage}
                        </span>
                        {/* <!-- Up/Down Arrows --> */}
                        <div className="flex flex-col gap-[2px]">
                          <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`cursor-pointer hover:opacity-70 transition-opacity ${
                              currentPage === 1
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <svg
                              width="15"
                              height="9"
                              viewBox="0 0 15 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-[15px] h-[9px]"
                            >
                              <path d="M7.5 0L15 8.61H0L7.5 0Z" fill="white" />
                            </svg>
                          </button>
                          <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`cursor-pointer hover:opacity-70 transition-opacity rotate-180 ${
                              currentPage === totalPages
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <svg
                              width="15"
                              height="9"
                              viewBox="0 0 15 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="2xl:w-[15px] 2xl:h-[9px] w-[15px] h-[9px]"
                            >
                              <path d="M7.5 0L15 8.61H0L7.5 0Z" fill="white" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <!-- Of Total Pages Text --> */}
                  <div className="flex items-center 2xl:gap-[8px] xl:gap-[8px] lg:gap-[6px] md:gap-[5px] sm:gap-[4px] gap-[3px]">
                    <span className="font-lato font-normal text-[#E9E9E9] 2xl:text-[17px] xl:text-[16px] lg:text-[15px] md:text-[14px] sm:text-[14px] text-[14px] 2xl:leading-[20px] xl:leading-[19px] lg:leading-[18px] md:leading-[17px] sm:leading-[16px] leading-[14px]">
                      of {totalPages}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
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
};

export default Pagination;
