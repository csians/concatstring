"use client";
import { GET_SERVICE_DETAIL_WHY_CHOOSE_US } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setServiceWhyChooseUs } from "@/store/slices/serviceDetailsSlice";
import { RootState } from "@/store";

interface Props {
  data: any;
}

const WhyChooseUs: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const cachedData = useSelector(
    (state: RootState) => state.serviceDetails.serviceWhyChooseUs
  );
  
  // Dispatch data to Redux when it arrives
  useEffect(() => {
    if (data) {
      dispatch(setServiceWhyChooseUs(data));
    }
  }, [data, dispatch]);

  // Use Redux data if available, otherwise use prop data
  const displayData = cachedData || data;
  
  const techNode = displayData?.technology;
  const title = techNode?.technologiesSettings?.whyChooseTitle;
  const stats = techNode?.technologiesSettings?.companyStatistic || [];

  return (
    <section className="wy-choose pt-[120px]">
      <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
        <div className="flex flex-col items-center justify-center 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[25px] pb-[120px]">
          <h2 className="h2 text-white">{title}</h2>
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 2xl:gap-[30px] xl:gap-[30px] lg:gap-[25px] md:gap-[25px] sm:gap-[20px] gap-[20px] w-full justify-center items-center min-h-[225px]">
            {stats.map((stat: any, idx: number) => (
              <div
                key={idx}
                className="box px-[30px] py-[30px] rounded-[10px] bg-[#D9D9D94D] border border-white flex flex-col items-start justify-center [15px] gap-[10px] shadow-custom transition-all duration-300 ease-in-out hover:py-[50px] hover:scale-[1.02] hover:bg-[linear-gradient(115.51deg,_#E72125_32.11%,_#8E1D1D_116.15%)] group h-[178px] hover:h-[218px] hover:border-transparent"
              >
                <h3 className="text-white h3 group-hover:text-white">
                  {stat.statisticNumber}
                </h3>
                <span className="font-denton text-[22px] font-medium leading-[100%] text-white group-hover:text-white">
                  {stat.statisticLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
