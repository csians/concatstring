"use client";
import React, { useEffect, useState, useRef } from "react";
import "@/css/services.css";
import { GET_WHY_CONCATSTRING_PARTNER } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { setServiceWhyConcatString } from "@/store/slices/serviceDetailsSlice";
import { RootState } from "@/store";

interface Props {
  data: any;
}

const WhyConcatString: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch();
  const [showFade, setShowFade] = useState(true);
  const [showTopFade, setShowTopFade] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Get data from Redux store
  const cachedData = useSelector(
    (state: RootState) => state.serviceDetails.serviceWhyConcatString
  );
  
  // Dispatch data to Redux when it arrives
  useEffect(() => {
    if (data) {
      dispatch(setServiceWhyConcatString(data));
    }
  }, [data, dispatch]);

  // Handle scroll to show/hide fade overlays
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
        const isAtTop = scrollTop <= 10; // 10px threshold for top
        
        setShowFade(!isAtBottom);
        setShowTopFade(!isAtTop);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // Use Redux data if available, otherwise use prop data
  const displayData = cachedData || data;
  
  // Extract the relevant data
  const techSettings = displayData?.technology?.technologiesSettings;
  if (!techSettings) return null;

  const { concatstringPartnerTitle, partnerImage, partnerFeatures } =
    techSettings;

  return (
    <section className="why pt-[120px]">
      <div className="container max-w-[1440px] px-[20px] mx-auto w-full">
        <div className="flex flex-col items-center justify-center gap-[60px]">
          <h2 className="h2 text-white text-center 2xl:leading-[122px] xl:leading-[122px] lg:leading-[120px] md:leading-[70px] sm:leading-[50px] leading-[50px]">
            {concatstringPartnerTitle}
          </h2>
          <div className="flex items-top justify-between 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[30px]">
            <div className="2xl:w-[50%] xl:w-[50%] lg:w-[50%] md:w-full sm:w-full w-full flex items-center justify-center relative why-img">
              {partnerImage?.node?.sourceUrl && (
                <img
                  src={partnerImage.node.sourceUrl}
                  alt={partnerImage.node.altText || ""}
                  width="670"
                  height="776"
                />
              )}
            </div>
            <div className="relative 2xl:w-[50%] xl:w-[50%] lg:w-[50%] md:w-full sm:w-full w-full">
            {/* Top fade overlay - only show when not at top */}
            {showTopFade && (
              <div className="pointer-events-none absolute top-0 left-0 w-full h-[132px] bg-[linear-gradient(0deg,rgba(0,0,0,0)_0%,#000000_100%)] z-10 transition-opacity duration-300"></div>
            )}
              <div 
                ref={scrollContainerRef}
                className="flex flex-col gap-[22px] max-h-[740px] overflow-y-auto custom-scrollbar pe-[15px]"
              >
                {partnerFeatures?.map((feature: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-[1px] rounded-[14px] bg-[linear-gradient(180deg,_#54A3DA_0%,_#E72125_100%)] w-full"
                  >
                    <div className="flex flex-col gap-[16px] items-start justify-start bg-black rounded-[14px] h-full w-full 2xl:p-[30px] xl:p-[30px] lg:p-[30px] md:p-[25px] sm:p-[20px] p-[20px]">
                      <h3 className="font-denton font-bold 2xl:text-[27px] xl:text-[27px] lg:text-[25px] md:text-[25px] sm:text-[20px] text-[18px] leading-[100%] text-white">
                        {feature.featureTitle}
                      </h3>
                      <div
                        className="font-lato text-[17px] leading-[28px] font-normal text-[#E9E9E9]"
                        dangerouslySetInnerHTML={{
                          __html: feature.featureDescription,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* Dynamic fade overlay - only show when not at bottom */}
              {showFade && (
                <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[132px] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,#000000_100%)] z-10 transition-opacity duration-300"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyConcatString;
