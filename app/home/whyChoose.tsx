"use client"; // Only if you plan animations/interactivity

import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_WHY_CHOOSE_US } from "@/lib/queries";
import { setWhyChooseData } from "@/store/slices/homeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { WhyChooseSkeleton } from "@/components/skeletons";

interface WhyChooseProps {
  initialData?: any;
}

const WhyChoose = ({ initialData }: WhyChooseProps) => {
  const dispatch = useDispatch();
  const cachedData = useSelector((state: RootState) => state.home.whyChoose);
  // Skip query if cached data or initial data exists to prevent unnecessary refetches
  const { data, loading } = useQuery(GET_WHY_CHOOSE_US, {
    skip: !!cachedData || !!initialData,
  });

  const freshData = initialData?.page?.flexibleContent?.flexibleContent?.find(
    (block: any) => block?.whyChooseUsTitle
  ) || data?.page?.flexibleContent?.flexibleContent?.find(
    (block: any) => block?.whyChooseUsTitle
  );

  const whyChooseData = cachedData || freshData;

  useEffect(() => {
    if (initialData && !cachedData) {
      const whyChooseBlock = initialData?.page?.flexibleContent?.flexibleContent?.find(
        (block: any) => block?.whyChooseUsTitle
      );
      if (whyChooseBlock) {
        dispatch(setWhyChooseData(whyChooseBlock));
      }
    } else if (data) {
      const whyChooseBlock = data?.page?.flexibleContent?.flexibleContent?.find(
        (block: any) => block?.whyChooseUsTitle
      );
      if (whyChooseBlock) {
        dispatch(setWhyChooseData(whyChooseBlock));
      }
    }
  }, [data, initialData, cachedData, dispatch]);

  // Show skeleton while loading and no cached data
  if (loading && !cachedData && !initialData) {
    return <WhyChooseSkeleton />;
  }

  if (!whyChooseData) return null;

  return (
    <section className="why-choose pt-[100px] relative overflow-hidden h-full">
      {/* Scrolling background */}
      <div className="absolute top-0 left-0 w-[200%] h-full bg-[url('/images/bg.png')] bg-repeat-x bg-top bg-cover animate-scroll-horizontal why-choose-animate-bg"></div>

      {/* Content wrapper */}
      <div className="container max-w-[1440px] px-[20px] mx-auto z-10 relative">
        <div className="flex flex-col items-center justify-center 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[25px] pt-[100px] pb-[200px]">
          <h2 className="h2 text-black">{whyChooseData.whyChooseUsTitle}</h2>

          {/* Grid Boxes */}
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 2xl:gap-[30px] xl:gap-[30px] lg:gap-[25px] md:gap-[25px] sm:gap-[20px] gap-[20px] w-full justify-center items-center min-h-[225px]">
            {whyChooseData.companyStatistic?.map(
              (stat: any, idx: number) =>
                stat.statisticLabel &&
                stat.statisticNumber && (
                  <div
                    key={idx}
                    className="h-full cursor-auto box px-[30px] py-[30px] rounded-[10px] bg-[#B9B9B9]/30 border border-white flex flex-col items-start justify-center gap-[10px] shadow-custom transition-transform duration-300 ease-in-out hover:scale-y-[1.1] hover:bg-[linear-gradient(115.51deg,_#E72125_32.11%,_#8E1D1D_116.15%)] group h-[178px]"
                  >
                    <h3 className="text-black h3 group-hover:text-white">
                      {stat.statisticNumber}
                    </h3>
                    <span className="font-denton text-[22px] font-medium leading-[100%] text-black group-hover:text-white">
                      {stat.statisticLabel}
                    </span>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
