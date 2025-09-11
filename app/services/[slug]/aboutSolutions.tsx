"use client";
import { GET_SERVICE_SOLUTIONS } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setServiceSolutions } from "@/store/slices/serviceDetailsSlice";
import { RootState } from "@/store";

interface Props {
  data: any;
}

const AboutSolutions: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const cachedData = useSelector(
    (state: RootState) => state.serviceDetails.serviceSolutions
  );

  // Dispatch data to Redux when it arrives
  useEffect(() => {
    if (data) {
      dispatch(setServiceSolutions(data));
    }
  }, [data, dispatch]);

  // Use Redux data if available, otherwise use prop data
  const displayData = cachedData || data;

  const techNode = displayData?.technology?.technologiesSettings;

  if (!techNode) return <div>No solution data found.</div>;

  return (
    <section className="py-[100px]">
      <div className="container max-w-[1440px] px-[20px] mx-auto">
        <div className="flex flex-col gap-[20px]">
          <h2 className="h2 text-white normal-case 2xl:leading-[122px] xl:leading-[122px] lg:leading-[120px] md:leading-[70px] sm:leading-[50px] leading-[50px]">
            {techNode.solutionTitle}
          </h2>
          {
            techNode.solutionDescription &&
            <div className="flex items-end justify-end">
              <div className="2xl:max-w-[1177px] xl:max-w-[1177px] lg:max-w-[1177px] md:max-w-full sm:max-w-full max-w-full rounded-[14px] 2xl:p-[50px] xl:p-[50px] lg:p-[40px] md:p-[30px] sm:p-[20px] p-[20px] bg-[#E72125]/20">
                <div
                  className="font-lato 2xl:text-[30px] xl:text-[30px] lg:text-[20px] md:text-[20px] sm:text-[20px] text-[18px] 2xl:leading-[50px] xl:leading-[50px] lg:leading-[40px] md:leading-[40px] sm:leading-[40px] leading-[30px] font-normal text-white 2xl:max-w-[1010px] xl:max-w-[1010px] lg:max-w-[1010px] md:max-w-full sm:max-w-full max-w-full"
                  dangerouslySetInnerHTML={{
                    __html: techNode.solutionDescription,
                  }}
                />
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  );
};

export default AboutSolutions;
