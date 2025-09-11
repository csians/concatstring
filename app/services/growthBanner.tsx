"use client";
import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { GET_DIGITAL_GROWTH_BANNER } from "@/lib/queries";
import { setDigitalGrowthBanner } from "@/store/slices/servicesSlice";
import { RootState } from "@/store";

const GrowthBanner = () => {
  const dispatch = useDispatch();

  const cachedData = useSelector(
    (state: RootState) => state.services.digitalGrowthBanner
  );

  const { data } = useQuery(GET_DIGITAL_GROWTH_BANNER);

  useEffect(() => {
    if (data) {
      dispatch(setDigitalGrowthBanner(data));
    }
  }, [data, dispatch]);

  const displayData = cachedData || data;

  // Find the DigitalGrowthLayout from the flexible content array
  const digitalGrowthData =
    displayData?.page?.flexibleContent?.flexibleContent?.find(
      (item: any) => item.digitalGrowthTitle
    );

  const title =
    digitalGrowthData?.digitalGrowthTitle ||
    "Solutions That Power Your Digital Growth";
  const description = digitalGrowthData?.growthDescription || "";

  return (
    <section className="pt-[120px] relative service-listing">
      <div className="max-w-[1440px] px-[20px] mx-auto w-full">
        <div className="flex flex-col gap-[16px] items-center justify-center">
          <h2 className="h2 text-white text-center">{title}</h2>
          <div
            className="font-lato font-medium text-[24px] leading-[34px] text-center text-[#C3C3C3] max-w-[1090px]"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </section>
  );
};

export default GrowthBanner;
