"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CSIAN_CULTURE } from "@/lib/queries";
import { setCsianData } from "@/store/slices/homeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { CultureSkeleton } from "@/components/skeletons";

const decodeHtmlEntities = (text: string) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

// Hook to detect touch devices
const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouch);
    };

    checkTouchDevice();
  }, []);

  return isTouchDevice;
};

const Culture = () => {
  const dispatch = useDispatch();
  const cachedData = useSelector((state: RootState) => state.home.csian);
  const { data, loading } = useQuery(GET_CSIAN_CULTURE);
  const isTouchDevice = useIsTouchDevice();
  const freshData = data?.page?.flexibleContent?.flexibleContent?.find(
    (block: any) => block?.csianTitle
  );

  const csianData = cachedData || freshData;

  useEffect(() => {
    if (data) {
      const csianBlock = data?.page?.flexibleContent?.flexibleContent?.find(
        (block: any) => block?.csianTitle
      );
      if (csianBlock) {
        dispatch(setCsianData(csianBlock));
      }
    }
  }, [data, dispatch]);

  // Show skeleton while loading and no cached data
  if (loading && !cachedData) {
    return <CultureSkeleton />;
  }

  // Card classNames for each card, matching the original layout
  const cardClassNames = [
    "2xl:w-[calc(33.333333%-16px)] xl:w-[calc(33.333333%-16px)] lg:w-[calc(50%-12px)] md:w-[calc(50%-12px)] sm:w-full w-full", // card 1
    "2xl:w-[calc(33.333333%-16px)] xl:w-[calc(33.333333%-16px)] lg:w-[calc(50%-12px)] md:w-[calc(50%-12px)] sm:w-full w-full", // card 2
    "2xl:w-[calc(33.333333%-16px)] xl:w-[calc(33.333333%-16px)] lg:w-[calc(50%-12px)] md:w-[calc(50%-12px)] sm:w-full w-full", // card 3
    "2xl:w-[calc(20%-7px)] xl:w-[calc(20%-7px)] lg:w-[calc(50%-12px)] md:w-[calc(50%-12px)] sm:w-full w-full", // card 4
    "2xl:w-[calc(20%-7px)] xl:w-[calc(20%-7px)] lg:w-[calc(50%-12px)] md:w-[calc(50%-12px)] sm:w-full w-full", // card 5
    "2xl:w-[calc(29%-20px)] xl:w-[calc(29%-20px)] lg:w-[calc(50%-12px)] md:w-[calc(50%-12px)] sm:w-full w-full", // card 6
    "2xl:w-[calc(29%-12px)] xl:w-[calc(29%-14px)] lg:w-[calc(50%-12px)] md:w-[calc(50%-12px)] sm:w-full w-full", // card 7
  ];

  if (
    !csianData ||
    !csianData.toBecomeTitle ||
    !csianData.csianTitle ||
    !csianData.perks ||
    csianData.perks.length === 0 ||
    !csianData.becomeCsian?.title
  )
    return null;

  return (
    <section className="become pt-[120px] pb-[100px]">
      <div className="max-w-[1432px] px-4 mx-auto">
        <div className="box-border max-w-[862.57px] bg-[#0F0F0F] shadow-[0px_24px_124px_rgba(231,33,37,0.22),_inset_0px_0px_20px_rgba(255,255,255,0.06)] rounded-[14px] py-[62px] px-[20px] pb-[42px] mx-auto">
          <p className="font-denton font-bold text-[26px] uppercase max-w-[400px] mx-auto text-left text-white leading-[100%]">
            {csianData.toBecomeTitle}
          </p>
          <h2 className="gradient-heading font-denton text-center font-normal 2xl:text-[151px] xl:text-[130px] lg:text-[120px] md:text-[100px] sm:text-[90px] text-[80px] max-w-[488px] mx-auto leading-[100%]">
            {decodeHtmlEntities(csianData.csianTitle)}
          </h2>
        </div>
        <div className="flex flex-wrap gap-[24px] pt-[60px] overflow-hidden">
          {csianData.perks &&
            csianData.perks?.map((perk: any, idx: number) => (
              <div
                key={idx}
                className={`border border-borderclr rounded-[14px] border-opacity-[50%] p-[30px] max-sm:p-[20px]
                ${cardClassNames[idx] || "w-full"} 
                relative 2xl:h-[276px] xl:h-[260px] lg:h-[250px] md:h-[230px] sm:h-[200px] h-[200px] group overflow-hidden transition-all duration-[500ms] ease-in-out hover:bg-white hover:bg-opacity-[16%] hover:border-white hover:border-opacity-[16%] ${isTouchDevice ? 'bg-white bg-opacity-[16%] border-white border-opacity-[16%]' : ''}`}
              >
                <h3 className="text-[20px] sm:text-[20px] md:text-[20px] lg:text-[25px] xl:text-[30px] 2xl:text-[36px] text-white font-bold 2xl:leading-[48px] xl:leading-[40px] lg:leading-[35px] md:leading-[30px] sm:leading-[30px] leading-[30px] pb-[2px] max-w-[328px] font-denton">
                  {perk.title}
                </h3>
                <p className={`font-lato text-[16px] font-medium text-white leading-[26px] transition-opacity duration-[800ms] ease-in-out ${isTouchDevice ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {perk.description}
                </p>
                <div className={`absolute transition-all duration-[1500ms] ease-in-out max-w-max ${isTouchDevice ? 'bottom-[15px] opacity-50 left-auto right-[15px] translate-x-0' : 'bottom-[50px] right-1/2 translate-x-1/2 group-hover:bottom-[20px] group-hover:opacity-50 group-hover:left-auto group-hover:right-[20px] group-hover:translate-x-0'}`}>
                  <img
                    src={perk.gif?.node?.sourceUrl}
                    alt={perk.gif?.node?.altText || perk.title}
                    height="86"
                    width="86"
                    className="2xl:w-[86px] xl:w-[86px] lg:w-[80px] md:w-[70px] sm:w-[50px] w-[50px] 2xl:h-[86px] xl:h-[86px] lg:h-[70px] md:h-[70px] sm:h-[50px] h-[50px] transition-all duration-[1200ms] ease-in-out"
                  />
                </div>
              </div>
            ))}
        </div>
        <div className="flex justify-center items-center pt-[60px]">
          <a href={csianData.becomeCsian?.url} target="_blank" className="inline-block group">
            <div className="btn-primary-outline">
              <div className="btn-primary">{csianData.becomeCsian?.title}</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
export default Culture;
