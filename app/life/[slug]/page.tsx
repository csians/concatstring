"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_EVENT_BY_SLUG } from "@/lib/queries";
import { formatEventDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import Head from "next/head";
import Breadcrumb from "@/components/Breadcrumb";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const EventDetailPage = ({ params }: PageProps) => {
  const { slug } = React.use(params);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null
  );
  const thumbnailContainerRef = React.useRef<HTMLDivElement>(null);
  const modalVideoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isGalleryOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isGalleryOpen]);

  // Slick Slider Syncing: Auto-scroll thumbnail to current media
  useEffect(() => {
    if (thumbnailContainerRef.current && isGalleryOpen) {
      const container = thumbnailContainerRef.current;
      const thumbnailWidth = 48; // 12 * 4 (w-12 = 48px)
      const gap = 8; // gap-2 = 8px
      const totalThumbnailWidth = thumbnailWidth + gap;
      const scrollPosition = currentImageIndex * totalThumbnailWidth;

      container.scrollTo({
        left: scrollPosition - container.clientWidth / 2 + thumbnailWidth / 2,
        behavior: "smooth",
      });
    }
  }, [currentImageIndex, isGalleryOpen]);

  const { data, loading, error } = useQuery(GET_EVENT_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  });

  // Compute media arrays safely (before early returns to maintain hook order)
  const event = data?.event;
  const eventSettings = event?.eventSettings;
  const eventImages = eventSettings?.eventImages || [];
  const eventVideos = eventSettings?.eventVideos || [];

  // Filter out any null/undefined videos and ensure sourceUrl or mediaItemUrl exists
  const validVideos = eventVideos.filter((videoData: any) => {
    const video = videoData?.eventVideo?.node;
    return video && (video.sourceUrl || video.mediaItemUrl);
  });

  // Combine images and videos into a single array for the gallery
  const allMedia = [
    ...eventImages.map((img: any) => ({ type: "image" as const, data: img })),
    ...validVideos.map((vid: any) => ({ type: "video" as const, data: vid })),
  ];
  
  // Auto-play video when navigating to it (must be before early returns)
  useEffect(() => {
    if (isGalleryOpen && modalVideoRef.current && allMedia.length > 0) {
      const currentMedia = allMedia[currentImageIndex];
      if (currentMedia?.type === "video") {
        // Small delay to ensure video element is ready
        const playPromise = modalVideoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            // Auto-play was prevented, user can manually play
            console.log("Video autoplay prevented:", error);
          });
        }
      }
    }
  }, [currentImageIndex, isGalleryOpen, allMedia.length]);

  // Show loading state
  if (loading) {
    return (
      <section className="2xl:pt-[254px] xl:pt-[254px] lg:pt-[230px] md:pt-[200px] sm:pt-[200px] pt-[200px] 2xl:pb-[140px] xl:pb-[140px] lg:pb-[140px] md:pb-[120px] sm:pb-[120px] pb-[100px]">
        <div className="container max-w-[1440px] px-[20px] mx-auto">
          <div className="flex flex-col items-center justify-center 2xl:gap-[40px] xl:gap-[40px] lg:gap-[30px] md:gap-[25px] sm:gap-[20px] gap-[20px]">
            <div className="animate-pulse bg-gray-700 h-12 w-96 rounded mb-4"></div>
            <div className="animate-pulse bg-gray-700 h-4 w-[800px] rounded"></div>
          </div>
          <div className="relative w-full 2xl:mt-[100px] xl:mt-[100px] lg:mt-[80px] md:mt-[60px] sm:mt-[50px] mt-[40px]">
            <div className="grid grid-cols-12 2xl:gap-[30px] xl:gap-[25px] lg:gap-[20px] md:gap-[15px] sm:gap-[12px] gap-[8px] auto-rows-[150px]">
              {[...Array(6)].map((_, i) => {
                const getGridLayout = (index: number) => {
                  const layouts = [
                    // Image 1: col-span-12 md:col-span-6 lg:col-span-4 with row-span-3 and max-h-[500px]
                    {
                      gridClasses:
                        "w-full col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 2xl:col-span-4 row-span-3",
                      maxHeight: "max-h-[500px]",
                    },
                    // Image 2: col-span-12 md:col-span-6 lg:col-span-4 with row-span-3 and max-h-[500px]
                    {
                      gridClasses:
                        "w-full col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 2xl:col-span-4 row-span-3",
                      maxHeight: "max-h-[500px]",
                    },
                    // Image 3: col-span-12 md:col-span-6 lg:col-span-4 with row-span-2
                    {
                      gridClasses:
                        "w-full col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 2xl:col-span-4 row-span-2",
                      maxHeight: "",
                    },
                    // Image 4: col-span-12 md:col-span-6 lg:col-span-4 with row-span-2
                    {
                      gridClasses:
                        "w-full col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 2xl:col-span-4 row-span-2",
                      maxHeight: "",
                    },
                    // Image 5: col-span-12 lg:col-span-8 with row-span-3 (large main image)
                    {
                      gridClasses:
                        "col-span-12 lg:col-span-8 xl:col-span-8 2xl:col-span-8 row-span-3",
                      maxHeight: "",
                    },
                    // Image 6: col-span-12 md:col-span-6 lg:col-span-4 with row-span-2
                    {
                      gridClasses:
                        "w-full col-span-12 md:col-span-6 lg:col-span-4 2xl:col-span-4 row-span-2",
                      maxHeight: "",
                    },
                  ];
                  return layouts[index];
                };

                const layout = getGridLayout(i);

                return (
                  <div
                    key={i}
                    className={`${layout.gridClasses} rounded-[10px] overflow-hidden group ${layout.maxHeight}`}
                  >
                    <div className="animate-pulse bg-gray-700 h-full w-full"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Handle error or no data
  if (error || !data?.event) {
    notFound();
  }

  // Functions for gallery modal
  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    // Pause video when closing modal
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setIsGalleryOpen(false);
  };

  const nextMedia = () => {
    if (allMedia.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % allMedia.length);
    // Pause current video if playing
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
  };

  const prevMedia = () => {
    if (allMedia.length === 0) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + allMedia.length) % allMedia.length
    );
    // Pause current video if playing
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
  };

  // Touch handlers for swipe navigation (mobile/tablet)
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    setTouchStart({ x: t.clientX, y: t.clientY });
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    setTouchEnd({ x: t.clientX, y: t.clientY });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 80) {
      if (deltaX < 0) {
        nextMedia();
      } else {
        prevMedia();
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Pointer events (works with mouse, touch, pen) for half-window desktop cases
  const handlePointerDown = (e: React.PointerEvent) => {
    try {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {}
    setTouchStart({ x: e.clientX, y: e.clientY });
    setTouchEnd(null);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!touchStart) return;
    setTouchEnd({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => {
    handleTouchEnd();
  };

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isGalleryOpen) return;

    switch (e.key) {
      case "Escape":
        closeGallery();
        break;
      case "ArrowLeft":
        e.preventDefault();
        prevMedia();
        break;
      case "ArrowRight":
        e.preventDefault();
        nextMedia();
        break;
    }
  };

  // Get images to display
  const displayedItems = allMedia.length > 6 ? allMedia.slice(0, 6) : allMedia;
  const remainingCount = allMedia.length > 6 ? allMedia.length - 6 : 0;
  console.log("displayedImages", displayedItems);

  return (
    <>
      <Head>
        <title>
          {eventSettings?.eventTitle || event.title} - Concatstring Solutions
        </title>
        <meta
          name="description"
          content={
            event.seo?.metaDesc ||
            eventSettings?.eventDescription
              ?.replace(/<[^>]*>/g, "")
              .substring(0, 160) ||
            ""
          }
        />
        <meta
          property="og:title"
          content={eventSettings?.eventTitle || event.title}
        />
        <meta
          property="og:description"
          content={
            event.seo?.metaDesc ||
            eventSettings?.eventDescription
              ?.replace(/<[^>]*>/g, "")
              .substring(0, 160) ||
            ""
          }
        />
        <meta
          property="og:image"
          content={
            event.seo?.opengraphImage?.sourceUrl ||
            eventImages[0]?.eventImage?.node?.sourceUrl ||
            ""
          }
        />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={eventSettings?.eventTitle || event.title}
        />
        <meta
          name="twitter:description"
          content={
            event.seo?.metaDesc ||
            eventSettings?.eventDescription
              ?.replace(/<[^>]*>/g, "")
              .substring(0, 160) ||
            ""
          }
        />
        <meta
          name="twitter:image"
          content={
            event.seo?.opengraphImage?.sourceUrl ||
            eventImages[0]?.eventImage?.node?.sourceUrl ||
            ""
          }
        />
      </Head>
      <section className="2xl:pt-[254px] xl:pt-[254px] lg:pt-[230px] md:pt-[200px] sm:pt-[200px] pt-[200px] 2xl:pb-[140px] xl:pb-[140px] lg:pb-[140px] md:pb-[120px] sm:pb-[120px] pb-[100px]">
        <div className="container max-w-[1440px] px-[20px] mx-auto">
          <div className="flex flex-col items-center justify-center 2xl:gap-[40px] xl:gap-[40px] lg:gap-[30px] md:gap-[25px] sm:gap-[20px] gap-[20px]">
            <div className="flex flex-col items-center justify-center gap-[6px]">
              <h2 className="h2 text-center text-white">
                {eventSettings?.eventTitle || event.title}
              </h2>
              {/* Breadcrumb */}
              <div className="2xl:mt-[20px] xl:mt-[20px] lg:mt-[15px] md:mt-[15px] sm:mt-[10px] mt-[10px]">
                <Breadcrumb
                  items={[
                    { label: "Life", href: "/life" },
                    {
                      label: eventSettings?.eventTitle || event.title,
                      isActive: true,
                    },
                  ]}
                  variant="contrast"
                  className="text-white"
                />
              </div>
              <span className="flex items-center gap-[8px] text-[16px] font-lato font-normal leading-[100%] text-[#E9E9E9] 2xl:mt-[20px] xl:mt-[20px] lg:mt-[15px] md:mt-[15px] sm:mt-[10px] mt-[10px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                >
                  <path
                    d="M6.50441 10.4306C6.50441 10.2051 6.31737 10.0225 6.08658 10.0225H4.62854C4.39802 10.0225 4.21094 10.2051 4.21094 10.4306V11.8562C4.21094 12.0819 4.39802 12.2647 4.62854 12.2647H6.08658C6.31737 12.2647 6.50441 12.0819 6.50441 11.8562V10.4306ZM10.1483 10.4306C10.1483 10.2051 9.96119 10.0225 9.73085 10.0225H8.27262C8.0421 10.0225 7.85502 10.2051 7.85502 10.4306V11.8562C7.85502 12.0819 8.0421 12.2647 8.27262 12.2647H9.73085C9.96119 12.2647 10.1483 12.0819 10.1483 11.8562V10.4306ZM13.7923 10.4306C13.7923 10.2051 13.6052 10.0225 13.3747 10.0225H11.9167C11.6859 10.0225 11.4988 10.2051 11.4988 10.4306V11.8562C11.4988 12.0819 11.6859 12.2647 11.9167 12.2647H13.3747C13.6052 12.2647 13.7923 12.0819 13.7923 11.8562V10.4306ZM6.50441 13.9941C6.50441 13.7682 6.31737 13.5857 6.08658 13.5857H4.62854C4.39802 13.5857 4.21094 13.7682 4.21094 13.9941V15.4193C4.21094 15.645 4.39802 15.8277 4.62854 15.8277H6.08658C6.31737 15.8277 6.50441 15.6449 6.50441 15.4193V13.9941ZM10.1483 13.9941C10.1483 13.7682 9.96119 13.5857 9.73085 13.5857H8.27262C8.0421 13.5857 7.85502 13.7682 7.85502 13.9941V15.4193C7.85502 15.645 8.0421 15.8277 8.27262 12.2647H9.73085C9.96119 15.8277 10.1483 15.6449 10.1483 15.4193V13.9941ZM13.7923 13.9941C13.7923 13.7682 13.6052 13.5857 13.3749 13.5857H11.9167C11.6859 13.5857 11.4988 13.7682 11.4988 13.9941V15.4193C11.4988 15.645 11.6859 15.8277 11.9167 15.8277H13.3749C13.6052 15.8277 13.7923 15.6449 13.7923 15.4193V13.9941Z"
                    fill="white"
                  ></path>
                  <path
                    d="M16.3978 2.50428V4.68167C16.3978 5.66583 15.5813 6.45891 14.575 6.45891H13.4251C12.4187 6.45891 11.5914 5.66583 11.5914 4.68167V2.49646H6.40859V4.68167C6.40859 5.66583 5.58131 6.45891 4.57506 6.45891H3.42495C2.41867 6.45891 1.60221 5.66583 1.60221 4.68167V2.50428C0.722708 2.5302 0 3.24182 0 4.11651V16.8771C0 17.7682 0.738659 18.5 1.64999 18.5H16.35C17.26 18.5 18 17.7667 18 16.8771V4.11651C18 3.24182 17.2773 2.5302 16.3978 2.50428ZM15.8637 16.0824C15.8637 16.4675 15.5444 16.78 15.1504 16.78H2.81816C2.42417 16.78 2.10485 16.4675 2.10485 16.0824V9.49114C2.10485 9.10588 2.42413 8.79345 2.81816 8.79345H15.1504C15.5444 8.79345 15.8637 9.10588 15.8637 9.49114L15.8637 16.0824Z"
                    fill="white"
                  ></path>
                  <path
                    d="M3.42203 5.29155H4.55943C4.90466 5.29155 5.18458 5.01824 5.18458 4.68066V1.11111C5.18458 0.773492 4.90466 0.5 4.55943 0.5H3.42203C3.07676 0.5 2.79688 0.773492 2.79688 1.11111V4.68066C2.79688 5.01824 3.07676 5.29155 3.42203 5.29155ZM13.4116 5.29155H14.549C14.894 5.29155 15.1739 5.01824 15.1739 4.68066V1.11111C15.174 0.773492 14.8941 0.5 14.549 0.5H13.4116C13.0664 0.5 12.7865 0.773492 12.7865 1.11111V4.68066C12.7865 5.01824 13.0664 5.29155 13.4116 5.29155Z"
                    fill="white"
                  ></path>
                </svg>
                {formatEventDate(eventSettings?.eventDate)}
              </span>
            </div>
            <div
              className="text-center max-w-[1000px] font-lato font-normal 2xl:text-[30px] xl:text-[30px] lg:text-[25px] md:text-[25px] sm:text-[20px] text-[18px] 2xl:leading-[50px] xl:leading-[50px] lg:leading-[40px] md:leading-[40px] sm:leading-[30px] leading-[30px] text-white"
              dangerouslySetInnerHTML={{
                __html: eventSettings?.eventDescription || "",
              }}
            />
          </div>

          {/* Event Images Gallery */}
          {allMedia.length > 0 && (
            <div className="relative w-full 2xl:mt-[100px] xl:mt-[100px] lg:mt-[80px] md:mt-[60px] sm:mt-[50px] mt-[40px]">
              <div className="grid grid-cols-12 2xl:gap-[30px] xl:gap-[25px] lg:gap-[20px] md:gap-[15px] sm:gap-[12px] gap-[8px] auto-rows-[150px]">
                {displayedItems.map((mediaItem: any, index: number) => {
                  // Handle both images and videos
                  const isImage = mediaItem.type === "image";
                  const mediaData = isImage
                    ? mediaItem.data?.eventImage?.node
                    : mediaItem.data?.eventVideo?.node;

                  const mediaUrl = isImage
                    ? mediaData?.sourceUrl
                    : mediaData?.sourceUrl || mediaData?.mediaItemUrl;

                  if (!mediaUrl) return null;

                  // Get grid layout classes based on index to match HTML exactly
                  const getGridLayout = (index: number) => {
                    const layouts = [
                      // Image 1: col-span-12 md:col-span-6 lg:col-span-4 with row-span-3 and max-h-[500px]
                      {
                        gridClasses:
                          "w-full col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 2xl:col-span-4 row-span-3",
                        maxHeight: "max-h-[500px]",
                      },
                      // Image 2: col-span-12 md:col-span-6 lg:col-span-4 with row-span-3 and max-h-[500px]
                      {
                        gridClasses:
                          "w-full col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 2xl:col-span-4 row-span-3",
                        maxHeight: "max-h-[500px]",
                      },
                      // Image 3: col-span-12 md:col-span-6 lg:col-span-4 with row-span-2
                      {
                        gridClasses:
                          "w-full col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 2xl:col-span-4 row-span-2",
                        maxHeight: "",
                      },
                      // Image 4: col-span-12 md:col-span-6 lg:col-span-4 with row-span-2
                      {
                        gridClasses:
                          "w-full col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 2xl:col-span-4 row-span-2",
                        maxHeight: "",
                      },
                      // Image 5: col-span-12 lg:col-span-8 with row-span-3 (large main image)
                      {
                        gridClasses:
                          "col-span-12 lg:col-span-8 xl:col-span-8 2xl:col-span-8 row-span-3",
                        maxHeight: "",
                      },
                      // Image 6: col-span-12 md:col-span-6 lg:col-span-4 with row-span-2 + "+X more" overlay
                      {
                        gridClasses:
                          "w-full col-span-12 md:col-span-6 lg:col-span-4 2xl:col-span-4 row-span-2",
                        maxHeight: "",
                      },
                    ];

                    return layouts[index];
                  };

                  const layout = getGridLayout(index);
                  const isLastImage = index === 5 && remainingCount > 0;

                  return (
                    <div
                      key={index}
                      className={`${layout.gridClasses} rounded-[10px] overflow-hidden group ${layout.maxHeight} cursor-pointer relative`}
                      onClick={() => openGallery(index)}
                    >
                      {isImage ? (
                        <img
                          src={mediaUrl}
                          alt={mediaData?.altText || `Event image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <video
                            src={mediaUrl}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            muted
                            playsInline
                            preload="metadata"
                            controlsList="nodownload"
                            onContextMenu={(e) => e.preventDefault()}
                          />
                          {/* Play indicator for videos */}
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/40">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                      {isLastImage && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-[10px]">
                          <div className="text-center text-white">
                            <div className="text-4xl font-bold mb-2">
                              +{remainingCount}
                            </div>
                            <div className="text-lg font-medium">
                              more photos
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999999] gallery-popup"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeGallery();
            }
          }}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-popup-title"
          aria-describedby="gallery-popup-description"
        >
          <div className="min-h-screen px-4 sm:px-6 md:px-10 flex justify-center items-center">
            <div className="w-full max-w-[1400px] 2xl:pb-[80px] xl:pb-[80px] lg:pb-[60px] md:pb-[50px] sm:pb-[40px] pb-[20px] 2xl:pt-[80px] xl:pt-[80px] lg:pt-[60px] md:pt-[50px] sm:pt-[60px] pt-[60px] 2xl:px-[130px] xl:px-[130px] lg:px-[60px] md:px-[50px] sm:px-[40px] px-[30px] bg-[#292929] rounded-[20px] mx-auto max-h-[90vh] overflow-y-auto relative custom-scrollbar max-sm:w-[calc(100vw-40px)]">
              <button
                onClick={closeGallery}
                className="absolute xl:top-[40px] xl:right-[40px] top-[20px] right-[20px] z-20 w-[43.83px] h-[43.83px] rounded-full flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity duration-300 group"
                aria-label="Close gallery popup"
                type="button"
              >
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g
                    opacity="1"
                    className="group-hover:opacity-100 transition-opacity duration-300"
                  >
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

              {/* Navigation Arrows - centered over the image (inside image container) */}

              {/* Gallery Title */}
              <h2
                id="gallery-popup-title"
                className="font-denton font-bold 2xl:text-[66px] xl:text-[66px] lg:text-[60px] md:text-[50px] sm:text-[30px] text-[30px] font-bold leading-[100%] text-center text-white 2xl:mb-[30px] xl:mb-[30px] lg:mb-[20px] md:mb-[20px] sm:mb-[20px] mb-[20px]"
              >
                <span className="text-[#E72125]">
                  {eventSettings?.eventTitle || event.title}
                </span>
              </h2>

              {/* Main Media Container */}
              <div className="flex flex-col items-center justify-center">
                <div
                  className="relative w-full max-w-[800px] mb-6"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                >
                  {allMedia[currentImageIndex]?.type === "video" ? (
                    <video
                      ref={modalVideoRef}
                      src={
                        allMedia[currentImageIndex]?.data?.eventVideo?.node
                          ?.sourceUrl ||
                        allMedia[currentImageIndex]?.data?.eventVideo?.node
                          ?.mediaItemUrl
                      }
                      className="w-full h-auto max-h-[60vh] object-contain aspect-[16/9] object-center rounded-[10px]"
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      controlsList="nodownload"
                      onContextMenu={(e) => e.preventDefault()}
                      id="gallery-popup-description"
                    />
                  ) : (
                    <img
                      src={
                        allMedia[currentImageIndex]?.data?.eventImage?.node
                          ?.sourceUrl
                      }
                      alt={
                        allMedia[currentImageIndex]?.data?.eventImage?.node
                          ?.altText || `Event image ${currentImageIndex + 1}`
                      }
                      className="w-full h-auto max-h-[60vh] object-contain aspect-[16/9] object-center rounded-[10px] select-none pointer-events-none"
                      id="gallery-popup-description"
                      draggable={false}
                    />
                  )}

                  {/* Media Counter */}
                  <div className="absolute top-4 left-4 bg-black/50 rounded-full px-3 py-1 hidden">
                    <div className="text-sm font-medium text-white">
                      {currentImageIndex + 1} of {allMedia.length}
                    </div>
                  </div>

                  {allMedia.length > 1 && (
                    <>
                      <button
                        onClick={prevMedia}
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-50 w-[50px] h-[50px] rounded-full border border-white/50 items-center justify-center text-white transition-all duration-300 group -rotate-90 hover:border-white"
                        id="previousArrow"
                        aria-label="Previous media"
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
                      <button
                        onClick={nextMedia}
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-50 w-[50px] h-[50px] rounded-full border border-white/50 items-center justify-center text-white transition-all duration-300 group -rotate-90 hover:border-white"
                        id="nextArrow"
                        aria-label="Next media"
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
                </div>

                {/* Thumbnail Strip */}
                {allMedia.length > 1 && (
                  <div className="w-full max-w-[600px] mx-auto flex justify-center">
                    <div className="flex gap-2 items-center pb-2">
                      {/* Previous Arrow - Mobile Only */}
                      <button
                        onClick={prevMedia}
                        className="flex lg:hidden w-8 h-8 rounded-full border border-white/50 items-center justify-center text-white transition-all duration-300 group -rotate-90 hover:border-white"
                        aria-label="Previous media"
                        type="button"
                        id="previousArrow"
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
                              id="prevArrowThumbGradient"
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
                            fill="url(#prevArrowThumbGradient)"
                          />
                        </svg>
                      </button>

                      {/* Thumbnails Container - Scrollable */}
                      <div
                        ref={thumbnailContainerRef}
                        className="flex gap-2 overflow-x-auto items-center px-2 lg:px-4 max-w-[calc(100vw-200px)] lg:max-w-[600px]"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        <style jsx>{`
                          .thumbnail-container::-webkit-scrollbar {
                            display: none;
                          }
                        `}</style>
                        {allMedia.map((mediaItem: any, index: number) => {
                          if (mediaItem.type === "image") {
                            const image = mediaItem.data?.eventImage?.node;
                            if (!image?.sourceUrl) return null;
                            return (
                              <button
                                key={`img-${index}`}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 relative ${
                                  index === currentImageIndex
                                    ? "border-[#E72125] ring-2 ring-[#E72125]/30 shadow-lg"
                                    : "border-white/30 hover:border-white/50"
                                }`}
                              >
                                <img
                                  src={image.sourceUrl}
                                  alt={`Thumbnail ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            );
                          } else {
                            const video = mediaItem.data?.eventVideo?.node;
                            const videoUrl =
                              video?.sourceUrl || video?.mediaItemUrl;
                            if (!videoUrl) return null;
                            return (
                              <button
                                key={`vid-${index}`}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 relative ${
                                  index === currentImageIndex
                                    ? "border-[#E72125] ring-2 ring-[#E72125]/30 shadow-lg"
                                    : "border-white/30 hover:border-white/50"
                                }`}
                              >
                                <video
                                  src={videoUrl}
                                  className="w-full h-full object-cover"
                                  muted
                                  playsInline
                                  preload="metadata"
                                />
                                {/* Video indicator */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                  <svg
                                    className="w-4 h-4 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </button>
                            );
                          }
                        })}
                      </div>

                      {/* Next Arrow - Mobile Only */}
                      <button
                        onClick={nextMedia}
                        className="flex lg:hidden w-8 h-8 rounded-full border border-white/50 items-center justify-center text-white transition-all duration-300 group -rotate-90 hover:border-white "
                        aria-label="Next media"
                        type="button"
                        id="nextArrow"
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
                              id="nextArrowThumbGradient"
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
                            fill="url(#nextArrowThumbGradient)"
                          />
                        </svg>
                      </button>
                    </div>
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
export default EventDetailPage;
