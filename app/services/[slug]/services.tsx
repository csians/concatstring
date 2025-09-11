"use client";
import { useState, useEffect, useRef } from "react";
import "@/css/services.css";
import { useQuery } from "@apollo/client";
import { GET_SERVICE_BANNER_FULL } from "@/lib/queries";
import { useDispatch, useSelector } from "react-redux";
import { setServiceBannerFull } from "@/store/slices/serviceDetailsSlice";
import { RootState } from "@/store";

interface Props {
  data: any;
}

const Service: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch();
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get data from Redux store
  const cachedData = useSelector(
    (state: RootState) => state.serviceDetails.serviceBannerFull
  );

  // Dispatch data to Redux when it arrives
  useEffect(() => {
    if (data) {
      dispatch(setServiceBannerFull(data));
    }
  }, [data, dispatch]);

  // Use Redux data if available, otherwise use prop data
  const displayData = cachedData || data;

  // Extract dynamic data
  const techNode = displayData?.technology?.technologiesSettings;
  const serviceTitle = techNode?.serviceTitle;
  const serviceDescription = techNode?.serviceDescription;
  const features = techNode?.serviceFeature || [];

  // Handle scroll to show/hide fade overlays
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
        const isAtTop = scrollTop <= 10; // 10px threshold for top
        
        console.log('Scroll detected:', { scrollTop, scrollHeight, clientHeight, isAtTop, isAtBottom });
        
        setShowBottomFade(!isAtBottom);
        setShowTopFade(!isAtTop);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Initial check - wait for next tick to ensure DOM is ready
      setTimeout(() => {
        console.log('Initial scroll check');
        handleScroll();
      }, 100);
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [features]); // Add features as dependency to re-run when data changes

  // Dynamic tab state: use index for active tab
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  // Reset active tab to first when features change
  useEffect(() => {
    setActiveTabIdx(0);
  }, [features?.length || 0]);

  // Don't render if no data
  if (!techNode || !features || features.length === 0) {
    return null;
  }

  return (
    <>
      {
        features.length > 0 &&

        <section className="service bg-[url('/images/tech-bg.png')] bg-left pb-[145px] pt-[80px] bg-cover relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1/2 before:bg-white before:z-[-1]">
          <div className="container max-w-[1440px] px-[20px] mx-auto">
            <div className="flex flex-col gap-[60px]">
              <div className="flex flex-col gap-[16px]">
                <h2 className="h2 2xl:text-[86px] text-black">{serviceTitle}</h2>
                <p className="font-lato font-medium text-[16px] leading-[26px] text-[#414141]">
                  {serviceDescription}
                </p>
              </div>

              {/* Desktop Layout - Side by side tabs and content */}
              <div className="hidden lg:flex items-start gap-[60px] 2xl:flex-row xl:flex-row lg:flex-row">
                <div className="relative">
                
              {/* Top fade overlay - only show when not at top */}
              {showTopFade && (
                <div className="pointer-events-none absolute top-0 left-0 w-full h-[132px] bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,#ffffff_100%)] z-10 transition-opacity duration-[300ms]"></div>
              )}
         
                <div 
                  ref={scrollContainerRef}
                  className="service-tab flex flex-col gap-[20px] 2xl:w-[470px] xl:w-[470px] lg:w-[470px] max-h-[440px] overflow-y-auto custom-scrollbar-light pe-[15px]"
                >
                  {features.map((feature: any, idx: number) => (
                    <button
                      key={feature?.featureTitle || idx}
                      type="button"
                      onClick={() => setActiveTabIdx(idx)}
                      className={`group p-[1px] border-[1px] rounded-[10px] transition-all duration-300 ${activeTabIdx === idx ? "" : "border-[#d1d1d1]"
                        }`}
                      style={
                        activeTabIdx === idx
                          ? {
                            background:
                              "linear-gradient(115.51deg, #E72125 32.11%, #8E1D1D 116.15%)",
                          }
                          : {}
                      }
                      onMouseEnter={(e) => {
                        if (activeTabIdx !== idx) {
                          e.currentTarget.style.background =
                            "linear-gradient(115.51deg, #E72125 32.11%, #8E1D1D 116.15%)";
                          // Make inner content background transparent on hover
                          const innerDiv = e.currentTarget.querySelector('div');
                          if (innerDiv) {
                            innerDiv.style.backgroundColor = 'transparent';
                          }
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeTabIdx !== idx) {
                          e.currentTarget.style.background = "transparent";
                          // Restore inner content background to white on mouse leave
                          const innerDiv = e.currentTarget.querySelector('div');
                          if (innerDiv) {
                            innerDiv.style.backgroundColor = 'white';
                          }
                        }
                      }}
                    >
                      <div
                        className={`rounded-[10px] w-full h-full py-[20px] px-[30px] flex items-start justify-start transition-all duration-300 ${activeTabIdx === idx ? "bg-transparent" : "bg-white"
                          }`}
                      >
                        <span
                          className={`font-denton font-bold text-[22px] leading-[34px] text-left transition-all duration-300 group-hover:text-white ${activeTabIdx === idx ? "text-white" : "text-[#252525]"
                            }`}
                        >
                          {feature?.featureTitle || "Service"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                {/* Bottom fade overlay - only show when not at bottom */}
                {showBottomFade && (
                  <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[132px] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#ffffff_100%)] z-10 transition-opacity duration-[300ms]"></div>
                )}
                </div>
                <div className="service-tab-contents 2xl:w-[calc(100%-530px)] xl:w-[calc(100%-530px)] lg:w-[calc(100%-530px)]">
                  {features.map((feature: any, idx: number) => (
                    <div
                      key={feature?.featureTitle || idx}
                      className={`service-tab-content rounded-[10px] border border-white shadow-custom 2xl:p-[50px] xl:p-[50px] lg:p-[40px] flex flex-col items-start bg-[#D9D9D94D] overflow-y-auto scrollbar-hide ${activeTabIdx === idx ? "" : "hidden"
                        }`}
                      data-content={feature?.featureTitle || idx}
                    >
                      <h4 className="font-denton 2xl:text-[34px] xl:text-[34px] lg:text-[30px] font-bold leading-[100%] text-black mb-[12px]">
                        {feature?.featureDescriptionTitle || ""}
                      </h4>
                      <p className="font-lato font-normal text-[17px] leading-[28px] text-[rgb(108,108,108)]">
                        {feature?.featureDescription || ""}
                      </p>
                      <ul className="flex flex-col gap-[12px] mt-[16px]">
                        {feature?.fratureDescription?.map(
                          (item: any, i: number) => (
                            <li
                              key={i}
                              className="flex items-start gap-[4px] flex-col"
                            >
                              <span className="flex items-center gap-[10px]">
                                <img
                                  src="./images/service-page/bullet.svg"
                                  width="10"
                                  height="10"
                                  alt="bullet"
                                />
                                <h4 className="font-denton font-bold text-[17px] leading-[28px] text-black w-[calc(100%-20px)]">
                                  {item.listTitle}
                                </h4>
                              </span>
                              <p className="font-lato font-normal text-[16px] leading-[24px] text-[#6C6C6C] ms-[22px]">
                                {item.listDescription}
                              </p>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Layout - Accordion style with stacked heading and content */}
              <div className="lg:hidden flex flex-col gap-[20px]">
                {features.map((feature: any, idx: number) => (
                                      <div
                      key={feature?.featureTitle || idx}
                      className="rounded-[10px] overflow-hidden flex flex-col"
                    >
                      {/* Accordion Header */}
                      <button
                        type="button"
                        onClick={() => setActiveTabIdx(activeTabIdx === idx ? -1 : idx)}
                        className={`w-full p-[1px] transition-all duration-300 rounded-[10px] border border-[#d1d1d1] ${
                          activeTabIdx === idx
                            ? "bg-gradient-to-br from-[#E72125] to-[#8E1D1D]"
                            : "bg-transparent"
                        }`}
                      >
                        <div
                          className={`w-full py-[15px] px-[20px] flex items-center justify-between transition-all duration-300 rounded-[10px] gap-[10px] ${
                            activeTabIdx === idx ? "bg-transparent" : "bg-white"
                          }`}
                        >
                          <span
                            className={`font-denton font-bold text-[20px] leading-[30px] text-left transition-all duration-300 ${
                              activeTabIdx === idx ? "text-white" : "text-[#252525]"
                            }`}
                          >
                            {feature?.featureTitle || "Service"}
                          </span>
                          {/* Accordion Arrow Icon */}
                          <svg
                            className={`min-w-6 min-h-6 w-6 h-6 transition-transform duration-300 ${
                              activeTabIdx === idx ? "rotate-180 text-white" : "text-[#252525]"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </button>

                      {/* Accordion Content */}
                      <div
                        className={`transition-all duration-300 overflow-hidden border border-[#d1d1d1] rounded-[10px] ${
                          activeTabIdx === idx ? "max-h-[1000px] opacity-100 mt-[20px]" : "max-h-0 opacity-0 mt-[0px]"
                        }`}
                      >
                        <div className="bg-[#D9D9D94D] border-t border-white p-[30px] sm:p-[20px] rounded-b-[10px]">
                          <h4 className="font-denton text-[25px] sm:text-[20px] font-bold leading-[100%] text-black mb-[12px]">
                            {feature?.featureDescriptionTitle || ""}
                          </h4>
                          <p className="font-lato font-normal text-[17px] leading-[28px] text-[rgb(108,108,108)]">
                            {feature?.featureDescription || ""}
                          </p>
                          <ul className="flex flex-col gap-[12px] mt-[16px]">
                            {feature?.fratureDescription?.map(
                              (item: any, i: number) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-[4px] flex-col"
                                >
                                  <span className="flex items-center gap-[10px]">
                                    <img
                                      src="./images/service-page/bullet.svg"
                                      width="10"
                                      height="10"
                                      alt="bullet"
                                    />
                                    <h4 className="font-denton font-bold text-[17px] leading-[28px] text-black w-[calc(100%-20px)]">
                                      {item.listTitle}
                                    </h4>
                                  </span>
                                  <p className="font-lato font-normal text-[16px] leading-[24px] text-[#6C6C6C] ms-[22px]">
                                    {item.listDescription}
                                  </p>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      }
    </>
  );
};

export default Service;
