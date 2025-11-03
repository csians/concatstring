"use client";
import React, { useEffect, useState } from "react";

type EventImageNode = {
  sourceUrl?: string;
  altText?: string;
};

type EventImage = {
  eventImage?: {
    node?: EventImageNode;
  };
};

interface EventGalleryModalProps {
  isOpen: boolean;
  title?: string;
  images: EventImage[];
  videos?: any[];
  initialIndex?: number;
  onClose: () => void;
}

const EventGalleryModal: React.FC<EventGalleryModalProps> = ({
  isOpen,
  title,
  images,
  videos = [],
  initialIndex = 0,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null
  );
  const thumbnailContainerRef = React.useRef<HTMLDivElement>(null);
  const modalVideoRef = React.useRef<HTMLVideoElement>(null);

  // Filter out any null/undefined videos and ensure sourceUrl or mediaItemUrl exists
  const validVideos = (videos || []).filter((videoData: any) => {
    const video = videoData?.eventVideo?.node;
    const hasUrl = video && (video.sourceUrl || video.mediaItemUrl);
    return hasUrl;
  });

  // Combine images and videos into a single array for the gallery
  const allMedia = [
    ...images.map((img: EventImage) => ({ type: "image" as const, data: img })),
    ...validVideos.map((vid: any) => ({ type: "video" as const, data: vid })),
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentImageIndex(initialIndex);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialIndex]);

  // Auto-scroll thumbnail to current media
  useEffect(() => {
    if (thumbnailContainerRef.current && isOpen) {
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
  }, [currentImageIndex, isOpen]);

  // Auto-play video when navigating to it (must be before early returns)
  useEffect(() => {
    if (isOpen && modalVideoRef.current && allMedia.length > 0) {
      const currentMedia = allMedia[currentImageIndex];
      if (currentMedia?.type === "video") {
        // Reset video to start and play
        modalVideoRef.current.currentTime = 0;
        const playPromise = modalVideoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Video autoplay prevented:", error);
          });
        }
      } else {
        // Pause video when navigating away from it
        if (modalVideoRef.current && !modalVideoRef.current.paused) {
          modalVideoRef.current.pause();
        }
      }
    }
  }, [currentImageIndex, isOpen, allMedia.length]);

  // Pause video when closing modal (must be before early returns)
  useEffect(() => {
    if (!isOpen && modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
  }, [isOpen]);

  if (!isOpen) return null;

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Escape":
        onClose();
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
    finishSwipe();
  };

  const finishSwipe = () => {
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
    finishSwipe();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999999] gallery-popup"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
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
            onClick={onClose}
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

          {allMedia.length > 1 && <></>}

          <h2
            id="gallery-popup-title"
            className="font-denton font-bold 2xl:text-[66px] xl:text-[66px] lg:text-[60px] md:text-[50px] sm:text-[30px] text-[30px] font-bold leading-[100%] text-center text-white 2xl:mb-[30px] xl:mb-[30px] lg:mb-[20px] md:mb-[20px] sm:mb-[20px] mb-[20px]"
          >
            <span className="text-[#E72125]">{title}</span>
          </h2>

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
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <style jsx>{`
                      .thumbnail-container::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    {allMedia.map((mediaItem: any, index: number) => {
                      if (mediaItem.type === "image") {
                        const node = mediaItem.data?.eventImage?.node;
                        if (!node?.sourceUrl) return null;
                        return (
                          <button
                            key={`img-${index}`}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 relative ${
                              index === currentImageIndex
                                ? "border-[#E72125] ring-2 ring-[#E72125]/30 shadow-lg"
                                : "border-white/30 hover:border-white/50"
                            }`}
                            aria-label={`Thumbnail ${index + 1}`}
                            type="button"
                          >
                            <img
                              src={node.sourceUrl}
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
                            aria-label={`Video thumbnail ${index + 1}`}
                            type="button"
                          >
                            <video
                              src={videoUrl}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                              preload="metadata"
                              controlsList="nodownload"
                              onContextMenu={(e) => e.preventDefault()}
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
                    className="flex lg:hidden w-8 h-8 rounded-full border border-white/50 items-center justify-center text-white transition-all duration-300 group -rotate-90 hover:border-white"
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
  );
};

export default EventGalleryModal;
