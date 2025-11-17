"use client";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { GET_ROAD_TRAVELED } from "@/lib/queries";
import { TimelineSkeleton } from "@/components/skeletons";
import { setRoadTraveledData } from "@/store/slices/aboutSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";

const Timeline = () => {
  const dispatch = useDispatch();
  const cachedData = useSelector(
    (state: RootState) => state.about.roadTraveled
  );
  // Skip query if cached data exists to prevent unnecessary refetches
  const { data, error, loading } = useQuery(GET_ROAD_TRAVELED, {
    skip: !!cachedData,
  });
  const [selectedTimeline, setSelectedTimeline] = useState<any>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0);

  // Refs for scroll functionality
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollUpBtnRef = useRef<HTMLButtonElement>(null);
  const scrollDownBtnRef = useRef<HTMLButtonElement>(null);

  // Get fresh data from query
  const freshData = data?.page?.flexibleContent?.flexibleContent?.find(
    (block: any) => block?.roadTraveledTitle
  );

  // Use cached data from Redux if available, otherwise use fresh data from query
  const roadTraveledBlock = cachedData || freshData;

  // Memoize companyGrowth before any early returns
  const companyGrowth = useMemo(() => roadTraveledBlock?.companyGrowth || [], [roadTraveledBlock]);

  // Memoized functions for better performance - must be before early returns
  const openPopup = useCallback((timelineData: any, index: number) => {
    setSelectedTimeline(timelineData);
    setCurrentTimelineIndex(index);
    setIsPopupOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
    setSelectedTimeline(null);
    setCurrentTimelineIndex(0);
  }, []);

  const goToPreviousTimeline = useCallback(() => {
    if (currentTimelineIndex > 0) {
      const newIndex = currentTimelineIndex - 1;
      setCurrentTimelineIndex(newIndex);
      setSelectedTimeline(companyGrowth[newIndex]);
    }
  }, [currentTimelineIndex, companyGrowth]);

  const goToNextTimeline = useCallback(() => {
    if (currentTimelineIndex < companyGrowth.length - 1) {
      const newIndex = currentTimelineIndex + 1;
      setCurrentTimelineIndex(newIndex);
      setSelectedTimeline(companyGrowth[newIndex]);
    }
  }, [currentTimelineIndex, companyGrowth]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isPopupOpen) return;
    
    switch (e.key) {
      case 'Escape':
        closePopup();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        goToPreviousTimeline();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNextTimeline();
        break;
    }
  }, [isPopupOpen, closePopup, goToPreviousTimeline, goToNextTimeline]);

    // Lock body scroll when popup is open and manage focus
  useEffect(() => {
    if (isPopupOpen) {
      document.body.classList.add("overflow-hidden");
      // Focus the popup for accessibility
      const popup = document.querySelector('[role="dialog"]') as HTMLElement;
      if (popup) {
        popup.focus();
      }
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup on unmount (safety)
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isPopupOpen]);
  // Store data in Redux when it comes from query
  useEffect(() => {
    if (data) {
      const timelineBlock = data?.page?.flexibleContent?.flexibleContent?.find(
        (block: any) => block?.roadTraveledTitle
      );
      if (timelineBlock) {
        dispatch(setRoadTraveledData(timelineBlock));
      }
    }
  }, [data, dispatch]);

  // Scroll functionality useEffect - only run when data is available
  useEffect(() => {
    if (!roadTraveledBlock || !scrollerRef.current) return;
  
    const scroller = scrollerRef.current;
    const slides = scroller.querySelectorAll(
      ".timeline-slide"
    ) as NodeListOf<HTMLElement>;
    let currentIndex = 0;
  
    // Calculate the height needed to show exactly 2 slides
    const calculateVisibleHeight = () => {
      if (slides.length === 0) return 0;
      
      // Force a reflow to get accurate heights
      slides.forEach(slide => {
        if (slide.offsetHeight === 0) {
          slide.style.display = 'block';
          slide.offsetHeight; // Force reflow
        }
      });
      
      // Get the height of the current slide and the next slide
      const currentSlideHeight = slides[currentIndex]?.offsetHeight || 0;
      const nextSlideHeight = slides[currentIndex + 1]?.offsetHeight || 0;
      
      // If we're at the last slide, only show one slide height
      if (currentIndex === slides.length - 1) {
        const timelineWrapper = document.getElementById('timelineWrapper');
        if (timelineWrapper) {
          timelineWrapper.style.transition = 'height 0.3s ease-in-out';
          timelineWrapper.style.height = `${currentSlideHeight}px`;
        }
        return currentSlideHeight;
      }
      
      // Calculate the total height needed for the two visible slides
      // Use the actual heights of the two slides to ensure precise positioning
      const visibleHeight = currentSlideHeight + nextSlideHeight;
      
      // Set the container height to show exactly 2 slides with proper spacing
      const timelineWrapper = document.getElementById('timelineWrapper');
      if (timelineWrapper) {
        // Add smooth transition for height changes
        timelineWrapper.style.transition = 'height 0.3s ease-in-out';
        timelineWrapper.style.height = `${visibleHeight}px`;
      }
      
      return Math.max(currentSlideHeight, nextSlideHeight);
    };
  
    function updateScroll() {
      if (slides.length === 0) return;
      
      const slideHeight = calculateVisibleHeight();
      if (slideHeight === 0) return;
      
      // Calculate the exact position to show the current slide at the top
      // and the next slide below it, ensuring both are fully visible
      let scrollPosition = 0;
      
      // If we're at the last slide, position it at the top
      if (currentIndex === slides.length - 1) {
        scrollPosition = 0;
      } else {
        // For other slides, calculate position to show current + next slide
        // Start from the beginning and move down by the sum of previous slide heights
        for (let i = 0; i < currentIndex; i++) {
          scrollPosition += slides[i]?.offsetHeight || 0;
        }
      }
      
      scroller.style.transform = `translateY(-${scrollPosition}px)`;
      
      // Validate scroll position after a short delay to ensure accuracy
      setTimeout(() => {
        const currentTransform = scroller.style.transform;
        const expectedTransform = `translateY(-${scrollPosition}px)`;
        if (currentTransform !== expectedTransform) {
          scroller.style.transform = expectedTransform;
        }
      }, 50);
  
      // 🔹 Update button disabled state
      if (scrollUpBtnRef.current) {
        if (slides.length <= 2 || currentIndex === 0) {
          scrollUpBtnRef.current.disabled = true;
          scrollUpBtnRef.current.classList.add("opacity-50", "cursor-not-allowed");
        } else {
          scrollUpBtnRef.current.disabled = false;
          scrollUpBtnRef.current.classList.remove("opacity-50", "cursor-not-allowed");
        }
      }
  
      if (scrollDownBtnRef.current) {
        // Allow scrolling down until we can't show 2 slides anymore
        if (slides.length <= 2 || currentIndex >= slides.length - 2) {
          scrollDownBtnRef.current.disabled = true;
          scrollDownBtnRef.current.classList.add("opacity-50", "cursor-not-allowed");
        } else {
          scrollDownBtnRef.current.disabled = false;
          scrollDownBtnRef.current.classList.remove("opacity-50", "cursor-not-allowed");
        }
      }
    }
  
    // Scroll up function
    const handleScrollUp = () => {
      currentIndex = Math.max(currentIndex - 1, 0);
      // Recalculate height after scroll to accommodate new visible slides
      setTimeout(() => updateScroll(), 100);
    };
  
    // Scroll down function
    const handleScrollDown = () => {
      // Ensure we don't scroll past the point where we can show 2 slides
      currentIndex = Math.min(currentIndex + 1, slides.length - 2);
      // Recalculate height after scroll to accommodate new visible slides
      setTimeout(() => updateScroll(), 100);
    };
  
    // Add event listeners
    if (scrollUpBtnRef.current) {
      scrollUpBtnRef.current.addEventListener("click", handleScrollUp);
    }
    if (scrollDownBtnRef.current) {
      scrollDownBtnRef.current.addEventListener("click", handleScrollDown);
    }
  
    // Initial setup
    updateScroll();
    
    // Also recalculate height after a short delay to ensure all slides are properly rendered
    setTimeout(() => {
      updateScroll();
    }, 100);
  
    // Handle window resize to recalculate heights
    const handleResize = () => {
      updateScroll();
    };
    
    window.addEventListener('resize', handleResize);
  
    // Cleanup event listeners
    return () => {
      if (scrollUpBtnRef.current) {
        scrollUpBtnRef.current.removeEventListener("click", handleScrollUp);
      }
      if (scrollDownBtnRef.current) {
        scrollDownBtnRef.current.removeEventListener("click", handleScrollDown);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [roadTraveledBlock]);
  

  // Show loading state
  // if (loading) {
  //   return <TimelineSkeleton />;
  // }

  // Show error message if there's an error
  // if (error)
  //   return (
  //     <div className="flex items-center justify-center min-h-[400px]">
  //       <div className="text-center">
  //         <h3 className="font-denton text-[24px] font-bold text-white mb-[16px]">
  //           Error loading timeline
  //         </h3>
  //         <p className="text-[#C3C3C3]">Please try again later.</p>
  //       </div>
  //     </div>
  //   );



  // Function to truncate text to 30 words
  const truncateToWords = (text: string, wordLimit: number = 30) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  // Function to strip HTML tags for word counting
  const stripHtml = (html: string) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (!roadTraveledBlock &&  companyGrowth.length === 0) return <TimelineSkeleton />;;

  // if (!companyGrowth || ) return null;

  return (
    <>
      <section className="timeline bg-black pt-[120px]">
        <div className="container max-w-[1355px] px-[20px] mx-auto">
          <div className="timeline-warp flex flex-col items-center gap-[60px]">
            <h2 className="h2 text-white">
              {roadTraveledBlock?.roadTraveledTitle}
            </h2>

            <div className="relative w-full bg-black flex justify-between items-center">
              {/* <!-- Timeline Scroll Area --> */}
              <div
                id="timelineWrapper"
                className="relative w-full overflow-hidden"
                style={{ height: 'auto' }}
              >
                <div
                  ref={scrollerRef}
                  id="timelineScroller"
                  className="flex flex-col transition-transform duration-500 ease-in-out"
                >
                  {/* <!-- Dynamic Slides --> */}
                  {companyGrowth.map((growth: any, idx: number) => {
                    // Parse the readMoreLink.url JSON string
                    let readMore = {
                      title: "Read More",
                      url: "#",
                      target: "",
                    };

                    if (growth.readMoreLink?.url) {
                      try {
                        const parsed = JSON.parse(growth.readMoreLink.url);
                        if (parsed && typeof parsed === "object") {
                          readMore = { ...readMore, ...parsed };
                        }
                      } catch (e) {
                        // If parsing fails, use the URL directly
                        if (typeof growth.readMoreLink.url === "string") {
                          readMore.url = growth.readMoreLink.url;
                        }
                      }
                    }

                    // Alternate row direction as in original layout
                    const isEven = idx % 2 === 0;
                    const rowClass = isEven
                      ? "2xl:flex-row xl:flex-row lg:flex-row md:flex-row flex-column"
                      : "flex-row-reverse";

                    // Use color from API or fallback to default
                    const color = growth.color || "#E72125";

                    // Truncate description to 30 words
                    const fullDescription = stripHtml(growth.growthDescription);
                    const truncatedDescription = truncateToWords(
                      fullDescription,
                      50
                    );

                    return (
                      <div
                        key={growth.growthYear}
                        className={`timeline-slide items-stretch flex ${rowClass} items-start 2xl:gap-[60px] xl:gap-[60px] lg:gap-[60px] md:gap-[30px] sm:gap-[30px] gap-[20px] min-h-[350px] max-md:flex-col max-md:pl-[20px] max-md:relative`}
                        data-color={color}
                      >
                        <div className="2xl:w-1/2 xl:w-1/2 lg:w-1/2 md:w-1/2 sm:w-auto w-auto pt-[40px] md:pb-[60px] pb-[20px]">
                          <h3
                            className="year 2xl:text-[20px] xl:text-[20px] lg:text-[18px] md:text-[18px] sm:text-[18px] text-[18px] font-denton font-bold leading-[100%] mb-[10px]"
                            style={{ color }}
                          >
                            {growth.growthYear}
                          </h3>
                          <h2 className="2xl:text-[44px] xl:text-[44px] lg:text-[40px] md:text-[30px] sm:text-[25px] text-[20px] font-denton font-bold text-white 2xl:leading-[58px] xl:leading-[58px] lg:leading-[58px] md:leading-[40px] sm:leading-[35px] leading-[30px] max-w-[500px]">
                            {growth.companyGrowthTitle}
                          </h2>
                          <div className="text-white font-lato 2xl:text-[24px] xl:text-[24px] lg:text-[20px] md:text-[20px] sm:text-[18px] text-[18px] font-medium 2xl:leading-[39px] xl:leading-[39px] lg:leading-[30px] md:leading-[30px] sm:leading-[25px] leading-[25px] mt-[12px] mb-[30px] max-w-[500px] line-clamp-4">
                            {truncatedDescription}
                          </div>
                          <button
                            onClick={() => openPopup(growth, idx)}
                            className="font-denton underline hover:no-underline cursor-pointer"
                            style={{ color }}
                            aria-label={`Read more about ${growth.companyGrowthTitle}`}
                          >
                            {readMore.title}
                          </button>
                        </div>
                        {/* <!-- Center Line --> */}
                        <div className="w-[2px] h-[auto] bg-[#D9D9D9] relative max-md:absolute max-md:top-0 max-md:left-[10px] max-md:h-full">
                          <div
                            className="dot absolute top-[12%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full"
                            style={{ backgroundColor: color }}
                          ></div>
                        </div>
                        <div className="2xl:w-1/2 xl:w-1/2 lg:w-1/2 md:w-1/2 sm:w-auto w-auto flex items-center justify-center max-sm:pb-[20px]">
                          {growth.growthImage?.node?.sourceUrl ? (
                            <img 
                              src={growth.growthImage.node.sourceUrl} 
                              alt={growth.growthImage.node.altText || `${growth.growthYear} - ${growth.companyGrowthTitle}`} 
                              className="w-full h-auto md:max-w-[350px] max-w-[150px]" 
                            />
                          ) : null
                            
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* <!-- Arrows --> */}
              {companyGrowth.length > 1 && (
                <div className="absolute right-4 2xl:bottom-0 xl:bottom-0 lg:bottom-0 md:bottom-[-50px] sm:bottom-[-50px] bottom-[-50px] flex 2xl:flex-col xl:flex-col lg:flex-row md:flex-row sm:flex-row flex-row gap-4 xl:-translate-y-1/2 z-20 w-max mx-auto bg-[#000000] xl:bg-transparent">
                <button
                  ref={scrollUpBtnRef}
                  id="scrollUp"
                  aria-label="Scroll timeline up"
                  className="md:w-[64px] md:h-[64px] w-[50px] h-[50px] rounded-full border border-white/50 flex items-center justify-center text-white relative group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="22"
                    viewBox="0 0 11 22"
                    fill="none"
                    
                  >
                    <defs>
                      <linearGradient
                        id="arrowGradient"
                        x1="100%"
                        y1="0%"
                        x2="0%"
                        y2="0%"
                      >
                        <stop offset="-10.69%" stopColor="#2C3894" />
                        <stop offset="94.92%" stopColor="#54A3DA" />
                      </linearGradient>
                    </defs>

                    {/* Default white arrow */}
                    <path
                      className="group-hover:opacity-0 transition-opacity duration-300"
                      d="M4.67916 0.913869L4.67839 0.914595L0.484838 5.12847C0.170685 5.44415 0.171854 5.95476 0.48758 6.26899C0.803265 6.58319 1.31387 6.58198 1.62806 6.26629L4.44355 3.4371L4.44355 20.5161C4.44355 20.9615 4.8046 21.3225 5.25 21.3225C5.6954 21.3225 6.05645 20.9615 6.05645 20.5161L6.05645 3.43714L8.87194 6.26625C9.18613 6.58194 9.69674 6.58315 10.0124 6.26895C10.3282 5.95472 10.3293 5.44407 10.0152 5.12843L5.82162 0.914553L5.82085 0.913829C5.50561 0.597981 4.99335 0.59899 4.67916 0.913869Z"
                      fill="white"
                    />

                    {/* Gradient arrow on hover */}
                    <path
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      d="M4.67916 0.913869L4.67839 0.914595L0.484838 5.12847C0.170685 5.44415 0.171854 5.95476 0.48758 6.26899C0.803265 6.58319 1.31387 6.58198 1.62806 6.26629L4.44355 3.4371L4.44355 20.5161C4.44355 20.9615 4.8046 21.3225 5.25 21.3225C5.6954 21.3225 6.05645 20.9615 6.05645 20.5161L6.05645 3.43714L8.87194 6.26625C9.18613 6.58194 9.69674 6.58315 10.0124 6.26895C10.3282 5.95472 10.3293 5.44407 10.0152 5.12843L5.82162 0.914553L5.82085 0.913829C5.50561 0.597981 4.99335 0.59899 4.67916 0.913869Z"
                      fill="url(#arrowGradient)"
                    />
                  </svg>
                </button>
                <button
                  ref={scrollDownBtnRef}
                  id="scrollDown"
                  aria-label="Scroll timeline down"
                  className="md:w-[64px] md:h-[64px] w-[50px] h-[50px] rounded-full border border-white/50 flex items-center justify-center text-white relative group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="22"
                    viewBox="0 0 11 22"
                    fill="none"
                  >
                    <defs>
                      <linearGradient
                        id="downArrowGradient"
                        x1="100%"
                        y1="0%"
                        x2="0%"
                        y2="0%"
                      >
                        <stop offset="-10.69%" stopColor="#2C3894" />
                        <stop offset="94.92%" stopColor="#54A3DA" />
                      </linearGradient>
                    </defs>

                    {/* Default white arrow */}
                    <path
                      className="group-hover:opacity-0 transition-opacity duration-300"
                      d="M4.67916 21.0861L4.67839 21.0854L0.484838 16.8715C0.170685 16.5558 0.171854 16.0452 0.48758 15.731C0.803265 15.4168 1.31387 15.418 1.62806 15.7337L4.44355 18.5629L4.44355 1.48394C4.44355 1.03854 4.8046 0.67749 5.25 0.67749C5.6954 0.67749 6.05645 1.03854 6.05645 1.48394L6.05645 18.5629L8.87194 15.7337C9.18613 15.4181 9.69674 15.4169 10.0124 15.731C10.3282 16.0453 10.3293 16.5559 10.0152 16.8716L5.82162 21.0854L5.82085 21.0862C5.50561 21.402 4.99335 21.401 4.67916 21.0861Z"
                      fill="white"
                    />

                    {/* Gradient arrow on hover */}
                    <path
                      className="group-hover:opacity-100 transition-opacity duration-300 opacity-0"
                      d="M4.67916 21.0861L4.67839 21.0854L0.484838 16.8715C0.170685 16.5558 0.171854 16.0452 0.48758 15.731C0.803265 15.4168 1.31387 15.418 1.62806 15.7337L4.44355 18.5629L4.44355 1.48394C4.44355 1.03854 4.8046 0.67749 5.25 0.67749C5.6954 0.67749 6.05645 1.03854 6.05645 1.48394L6.05645 18.5629L8.87194 15.7337C9.18613 15.4181 9.69674 15.4169 10.0124 15.731C10.3282 16.0453 10.3293 16.5559 10.0152 16.8716L5.82162 21.0854L5.82085 21.0862C5.50561 21.402 4.99335 21.401 4.67916 21.0861Z"
                      fill="url(#downArrowGradient)"
                    />
                  </svg>
                </button>
                </div>
              )}
              <div className="pointer-events-none absolute bottom-0 left-0 w-full md:h-[60px] h-[20px] bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Popup Modal */}
      {isPopupOpen && selectedTimeline && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999999] timeline-popup"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closePopup();
            }
          }}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="timeline-popup-title"
          aria-describedby="timeline-popup-description"
        >
          <div className="min-h-screen px-4 sm:px-6 md:px-10 flex justify-center items-center">
            <div className="w-full max-w-[1400px] 2xl:pb-[80px] xl:pb-[80px] lg:pb-[60px] md:pb-[50px] sm:pb-[40px] pb-[20px] 2xl:pt-[80px] xl:pt-[80px] lg:pt-[60px] md:pt-[50px] sm:pt-[60px] pt-[60px] 2xl:px-[130px] xl:px-[130px] lg:px-[60px] md:px-[50px] sm:px-[40px] px-[30px] bg-[#292929] rounded-[20px] mx-auto max-h-[90vh] overflow-y-auto relative custom-scrollbar">

              <button
                onClick={closePopup}
                className="absolute xl:top-[40px] xl:right-[40px] top-[20px] right-[20px] z-20 w-[43.84px] h-[43.84px] rounded-full flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity duration-300 group"
                aria-label="Close timeline popup"
                type="button"
              >
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="1" className="group-hover:opacity-100 transition-opacity duration-300">
                    <path
                      d="M10.9603 10.9601C11.7413 10.1791 12.905 10.0764 13.5594 10.7308L33.1099 30.2813C33.7643 30.9357 33.6617 32.0994 32.8806 32.8804C32.0996 33.6615 30.9359 33.7641 30.2815 33.1098L10.731 13.5592C10.0766 12.9048 10.1792 11.7412 10.9603 10.9601Z"
                      fill="#E72125"
                    ></path>
                    <path
                      d="M32.8802 10.9598C33.6613 11.7409 33.7639 12.9045 33.1096 13.5589L13.559 33.1094C12.9046 33.7638 11.741 33.6612 10.9599 32.8801C10.1789 32.0991 10.0762 30.9354 10.7306 30.281L30.2811 10.7305C30.9355 10.0761 32.0992 10.1788 32.8802 10.9598Z"
                      fill="#E72125"
                    ></path>
                  </g>
                </svg>
              </button>
              <div className="flex flex-col items-center justify-center ">
                <h2 
                  id="timeline-popup-title"
                  className="font-denton font-bold 2xl:text-[66px] xl:text-[66px] lg:text-[60px] md:text-[50px] sm:text-[40px] text-[30px] font-bold leading-[100%] text-center text-white 2xl:mb-[30px] xl:mb-[30px] lg:mb-[20px] md:mb-[20px] sm:mb-[20px] mb-[20px]"
                >
                  <span className="text-[#E72125]">
                    {selectedTimeline?.growthYear}
                  </span>{" "}
                  - {selectedTimeline?.companyGrowthTitle}
                </h2>
                <div
                  id="timeline-popup-description"
                  className="font-lato font-normal text-white 2xl:text-[24px] xl:text-[24px] lg:text-[20px] md:text-[20px] sm:text-[18px] text-[18px] 2xl:leading-[39px] xl:leading-[39px] lg:leading-[30px] md:leading-[30px] sm:leading-[25px] leading-[25px] text-center 2xl:mb-[60px] xl:mb-[60px] lg:mb-[50px] md:mb-[40px] sm:mb-[30px] mb-[25px]"
                  dangerouslySetInnerHTML={{
                    __html: selectedTimeline?.growthDescription || 'No description available.',
                  }}
                />
                {/* Navigation Arrows - Desktop: Left/Right sides, Mobile: Bottom */}
                {companyGrowth && companyGrowth.length > 1 && (
                  <>
                    {/* Desktop: Left Arrow */}
                    <button
                      onClick={goToPreviousTimeline}
                      disabled={currentTimelineIndex === 0}
                      className={`hidden md:block absolute xl:left-[40px] md:left-[20px] left-[10px] xl:top-1/2 xl:bottom-auto lg:bottom-[40px] md:bottom-[25px] -translate-y-1/2 z-20 w-[50px] h-[50px] rounded-full border border-white/50 flex items-center justify-center text-white transition-all duration-300 group -rotate-90 ${
                        currentTimelineIndex === 0 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:border-white hover:bg-white/10'
                      }`}
                      id="previousArrow"
                      aria-label="Previous timeline entry"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="22"
                        viewBox="0 0 11 22"
                        fill="none"
                      >
                        <defs>
                          <linearGradient
                            id="prevArrowGradient"
                            x1="100%"
                            y1="0%"
                            x2="0%"
                            y2="0%"
                          >
                            <stop offset="-10.69%" stopColor="#2C3894" />
                            <stop offset="94.92%" stopColor="#54A3DA" />
                          </linearGradient>
                        </defs>
                        <path
                          className="group-hover:opacity-0 transition-opacity duration-300"
                          d="M4.67916 0.913869L4.67839 0.914595L0.484838 5.12847C0.170685 5.44415 0.171854 5.95476 0.48758 6.26899C0.803265 6.58319 1.31387 6.58198 1.62806 6.26629L4.44355 3.4371L4.44355 20.5161C4.44355 20.9615 4.8046 21.3225 5.25 21.3225C5.6954 21.3225 6.05645 20.9615 6.05645 20.5161L6.05645 3.43714L8.87194 6.26625C9.18613 6.58194 9.69674 6.58315 10.0124 6.26895C10.3282 5.95472 10.3293 5.44407 10.0152 5.12843L5.82162 0.914553L5.82085 0.913829C5.50561 0.597981 4.99335 0.59899 4.67916 0.913869Z"
                          fill="white"
                        />
                        <path
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          d="M4.67916 0.913869L4.67839 0.914595L0.484838 5.12847C0.170685 5.44415 0.171854 5.95476 0.48758 6.26899C0.803265 6.58319 1.31387 6.58198 1.62806 6.26629L4.44355 3.4371L4.44355 20.5161C4.44355 20.9615 4.8046 21.3225 5.25 21.3225C5.6954 21.3225 6.05645 20.9615 6.05645 20.5161L6.05645 3.43714L8.87194 6.26625C9.18613 6.58194 9.69674 6.58315 10.0124 6.26895C10.3282 5.95472 10.3293 5.44407 10.0152 5.12843L5.82162 0.914553L5.82085 0.913829C5.50561 0.597981 4.99335 0.59899 4.67916 0.913869Z"
                          fill="url(#prevArrowGradient)"
                        />
                      </svg>
                    </button>

                    {/* Desktop: Right Arrow */}
                    <button
                      onClick={goToNextTimeline}
                      disabled={currentTimelineIndex === companyGrowth.length - 1}
                      className={`hidden md:block absolute xl:right-[40px] md:right-[20px] right-[10px] xl:top-1/2 xl:bottom-auto lg:bottom-[40px] md:bottom-[25px] -translate-y-1/2 z-20 w-[50px] h-[50px] rounded-full border border-white/50 flex items-center justify-center text-white transition-all duration-300 group -rotate-90 ${
                        currentTimelineIndex === companyGrowth.length - 1 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:border-white hover:bg-white/10'
                      }`}
                      id="nextArrow"
                      aria-label="Next timeline entry"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="22"
                        viewBox="0 0 11 22"
                        fill="none"
                      >
                        <defs>
                          <linearGradient
                            id="nextArrowGradient"
                            x1="100%"
                            y1="0%"
                            x2="0%"
                            y2="0%"
                          >
                            <stop offset="-10.69%" stopColor="#2C3894" />
                            <stop offset="94.92%" stopColor="#54A3DA" />
                          </linearGradient>
                        </defs>
                        <path
                          className="group-hover:opacity-0 transition-opacity duration-300"
                          d="M4.67916 21.0861L4.67839 21.0854L0.484838 16.8715C0.170685 16.5558 0.171854 16.0452 0.48758 15.731C0.803265 15.4168 1.31387 15.418 1.62806 15.7337L4.44355 18.5629L4.44355 1.48394C4.44355 1.03854 4.8046 0.67749 5.25 0.67749C5.6954 0.67749 6.05645 1.03854 6.05645 1.48394L6.05645 18.5629L8.87194 15.7337C9.18613 15.4181 9.69674 15.4169 10.0124 15.731C10.3282 16.0453 10.3293 16.5559 10.0152 16.8716L5.82162 21.0854L5.82085 21.0862C5.50561 21.402 4.99335 21.401 4.67916 21.0861Z"
                          fill="white"
                        />
                        <path
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          d="M4.67916 21.0861L4.67839 21.0854L0.484838 16.8715C0.170685 16.5558 0.171854 16.0452 0.48758 15.731C0.803265 15.4168 1.31387 15.418 1.62806 15.7337L4.44355 18.5629L4.44355 1.48394C4.44355 1.03854 4.8046 0.67749 5.25 0.67749C5.6954 0.67749 6.05645 1.03854 6.05645 1.48394L6.05645 18.5629L8.87194 15.7337C9.18613 15.4181 9.69674 15.4169 10.0124 15.731C10.3282 16.0453 10.3293 16.5559 10.0152 16.8716L5.82162 21.0854L5.82085 21.0862C5.50561 21.402 4.99335 21.401 4.67916 21.0861Z"
                          fill="url(#nextArrowGradient)"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {/* Contact Us Button - Centered */}
                <div className="flex justify-center">
                  <Link
                    href={selectedTimeline?.readMoreLink?.url || '#'}
                    className="btn-primary bg-[#E72125] no-underline hover:bg-gradient-to-r from-[#E72125] to-[#8E1D1D] transition-all duration-300 ease-in-out [background-size:100%_153.5%] hover:no-underline hover:text-white"
                    aria-label="Contact us for more information"
                    target={selectedTimeline?.readMoreLink?.target || '_self'}
                    rel={selectedTimeline?.readMoreLink?.target === '_blank' ? 'noopener noreferrer' : undefined}
                  >
                    Contact Us
                  </Link>
                </div>

                {/* Mobile: Navigation Arrows at Bottom */}
                {companyGrowth && companyGrowth.length > 1 && (
                  <div className="flex md:hidden gap-4 justify-center mt-6">
                    {/* Previous Arrow (Left) */}
                    <button
                      onClick={goToPreviousTimeline}
                      disabled={currentTimelineIndex === 0}
                      className={`w-[50px] h-[50px] rounded-full border border-white/50 flex items-center justify-center text-white transition-all duration-300 group -rotate-90 ${
                        currentTimelineIndex === 0 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:border-white hover:bg-white/10'
                      }`}
                      id="previousArrowMobile"
                      aria-label="Previous timeline entry"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="22"
                        viewBox="0 0 11 22"
                        fill="none"
                      >
                        <defs>
                          <linearGradient
                            id="prevArrowMobileGradient"
                            x1="100%"
                            y1="0%"
                            x2="0%"
                            y2="0%"
                          >
                            <stop offset="-10.69%" stopColor="#2C3894" />
                            <stop offset="94.92%" stopColor="#54A3DA" />
                          </linearGradient>
                        </defs>
                        <path
                          className="group-hover:opacity-0 transition-opacity duration-300"
                          d="M4.67916 0.913869L4.67839 0.914595L0.484838 5.12847C0.170685 5.44415 0.171854 5.95476 0.48758 6.26899C0.803265 6.58319 1.31387 6.58198 1.62806 6.26629L4.44355 3.4371L4.44355 20.5161C4.44355 20.9615 4.8046 21.3225 5.25 21.3225C5.6954 21.3225 6.05645 20.9615 6.05645 20.5161L6.05645 3.43714L8.87194 6.26625C9.18613 6.58194 9.69674 6.58315 10.0124 6.26895C10.3282 5.95472 10.3293 5.44407 10.0152 5.12843L5.82162 0.914553L5.82085 0.913829C5.50561 0.597981 4.99335 0.59899 4.67916 0.913869Z"
                          fill="white"
                        />
                        <path
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          d="M4.67916 0.913869L4.67839 0.914595L0.484838 5.12847C0.170685 5.44415 0.171854 5.95476 0.48758 6.26899C0.803265 6.58319 1.31387 6.58198 1.62806 6.26629L4.44355 3.4371L4.44355 20.5161C4.44355 20.9615 4.8046 21.3225 5.25 21.3225C5.6954 21.3225 6.05645 20.9615 6.05645 20.5161L6.05645 3.43714L8.87194 6.26625C9.18613 6.58194 9.69674 6.58315 10.0124 6.26895C10.3282 5.95472 10.3293 5.44407 10.0152 5.12843L5.82162 0.914553L5.82085 0.913829C5.50561 0.597981 4.99335 0.59899 4.67916 0.913869Z"
                          fill="url(#prevArrowMobileGradient)"
                        />
                      </svg>
                    </button>

                    {/* Next Arrow (Right) */}
                    <button
                      onClick={goToNextTimeline}
                      disabled={currentTimelineIndex === companyGrowth.length - 1}
                      className={`w-[50px] h-[50px] rounded-full border border-white/50 flex items-center justify-center text-white transition-all duration-300 group -rotate-90 ${
                        currentTimelineIndex === companyGrowth.length - 1 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:border-white hover:bg-white/10'
                      }`}
                      id="nextArrowMobile"
                      aria-label="Next timeline entry"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="22"
                        viewBox="0 0 11 22"
                        fill="none"
                      >
                        <defs>
                          <linearGradient
                            id="nextArrowMobileGradient"
                            x1="100%"
                            y1="0%"
                            x2="0%"
                            y2="0%"
                          >
                            <stop offset="-10.69%" stopColor="#2C3894" />
                            <stop offset="94.92%" stopColor="#54A3DA" />
                          </linearGradient>
                        </defs>
                        <path
                          className="group-hover:opacity-0 transition-opacity duration-300"
                          d="M4.67916 21.0861L4.67839 21.0854L0.484838 16.8715C0.170685 16.5558 0.171854 16.0452 0.48758 15.731C0.803265 15.4168 1.31387 15.418 1.62806 15.7337L4.44355 18.5629L4.44355 1.48394C4.44355 1.03854 4.8046 0.67749 5.25 0.67749C5.6954 0.67749 6.05645 1.03854 6.05645 1.48394L6.05645 18.5629L8.87194 15.7337C9.18613 15.4181 9.69674 15.4169 10.0124 15.731C10.3282 16.0453 10.3293 16.5559 10.0152 16.8716L5.82162 21.0854L5.82085 21.0862C5.50561 21.402 4.99335 21.401 4.67916 21.0861Z"
                          fill="white"
                        />
                        <path
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          d="M4.67916 21.0861L4.67839 21.0854L0.484838 16.8715C0.170685 16.5558 0.171854 16.0452 0.48758 15.731C0.803265 15.4168 1.31387 15.418 1.62806 15.7337L4.44355 18.5629L4.44355 1.48394C4.44355 1.03854 4.8046 0.67749 5.25 0.67749C5.6954 0.67749 6.05645 1.03854 6.05645 1.48394L6.05645 18.5629L8.87194 15.7337C9.18613 15.4181 9.69674 15.4169 10.0124 15.731C10.3282 16.0453 10.3293 16.5559 10.0152 16.8716L5.82162 21.0854L5.82085 21.0862C5.50561 21.402 4.99335 21.401 4.67916 21.0861Z"
                          fill="url(#nextArrowMobileGradient)"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Timeline;
