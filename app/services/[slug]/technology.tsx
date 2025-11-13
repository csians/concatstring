"use client";
import "@/css/services.css";
import { GET_SERVICE_TECHNOLOGIES } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setServiceTechnologies } from "@/store/slices/serviceDetailsSlice";
import { RootState } from "@/store";

interface Props {
  data: any;
}

const Technology: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const cachedData = useSelector(
    (state: RootState) => state.serviceDetails.serviceTechnologies
  );

  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Dispatch data to Redux when it arrives
  useEffect(() => {
    if (data) {
      dispatch(setServiceTechnologies(data));
    }
  }, [data, dispatch]);

  // Use Redux data if available, otherwise use prop data
  const displayData = cachedData || data;

  // Extract techStack from the fetched data
  const techStack = displayData?.technology?.technologiesSettings?.techStack || [];
  const technologyUseTitle =
    displayData?.technology?.technologiesSettings?.technologyUseTitle;
  const technologyUsedDescription =
    displayData?.technology?.technologiesSettings?.technologyUsedDescription;

  useEffect(() => {
    if (techStack.length > 0) {
      setActiveTab(techStack[0].techStackName);
    }
  }, [techStack]);

  // Dynamic function to determine grid columns based on item count
  const getGridColumns = (itemCount: number) => {
    if (!itemCount || itemCount <= 0) {
      return "2xl:grid-cols-1 xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1 grid-cols-1";
    }
    if (itemCount <= 2) {
      return "2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1";
    } else if (itemCount <= 3) {
      return "2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1";
    } else if (itemCount <= 4) {
      return "2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1";
    } else if (itemCount <= 5) {
      return "2xl:grid-cols-5 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1";
    } else {
      return "2xl:grid-cols-6 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1";
    }
  };

  return (
    <>
      {
        techStack.length > 0 && (

          <section className="technology pt-[120px]">
            <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
              <div className="flex flex-col items-center justify-center gap-[16px] 2xl:mb-[60px] xl:mb-[60px] lg:mb-[50px] md:mb-[40px] sm:mb-[30px] mb-[30px]">
                <h2 className="h2 text-white text-center">{technologyUseTitle}</h2>
                <p className="font-lato font-medium text-[16px] leading-[26px] text-[#C3C3C3] text-center max-w-[1019px]">
                  {technologyUsedDescription}
                </p>
              </div>
              <div className="flex flex-col 2xl:gap-[80px] xl:gap-[80px] lg:gap-[60px] md:gap-[50px] sm:gap-[30px] gap-[30px] items-center justify-center">
                {/* Tab Buttons - Only show if there are multiple tech stacks */}
                {techStack.length > 1 && (
                  <div className="tech-tab-btn flex items-center justify-center gap-[18px] 2xl:flex-nowrap xl:flex-nowrap lg:flex-nowrap md:flex-wrap sm:flex-wrap flex-wrap">
                    {techStack.map((stack: any) => (
                      <button
                        key={stack.techStackName}
                        className={`tech-btn py-[8px] px-[26px] rounded-[6px] border border-[#99999959] hover:bg-[#FFFFFF29] ${activeTab === stack.techStackName ? "active" : ""
                          }`}
                        onClick={() => setActiveTab(stack.techStackName)}
                      >
                        <span className="font-denton md:text-[26px] text-[20px] leading-[100%] font-bold text-[#FFFFFF99]">
                          {stack.techStackName}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {/* Tab Contents */}
                <div className="tech-tab-contents w-full flex justify-center items-center flex-col">
                  {techStack.map((stack: any) => {
                    const itemCount = stack.techSubStack?.length || 0;
                    const gridClasses = getGridColumns(itemCount);

                    return (
                      <div
                        key={stack.techStackName}
                        className={`tech-tab-content grid gap-[20px] ${activeTab === stack.techStackName ? "active" : "hidden"
                          } ${gridClasses} 2xl:w-max xl:w-max lg:w-max md:w-full sm:w-full w-full`}
                        data-content={stack.techStackName}
                      >
                        {stack.techSubStack?.map((sub: any) => (
                          <div
                            key={sub.techSubStackName}
                            className="p-[1px] hover:shadow-[inset_0_0_16px_rgba(255,255,255,0.26),0_24px_124px_rgba(231,33,37,0.22)] group rounded-[10px] bg-[linear-gradient(180deg,_#54A3DA_0%,_#E72125_100%)] h-[140px] 2xl:w-[216px] xl:w-[216px] lg:w-[216px] md:w-full sm:w-full w-full"
                          >
                            <div className="flex flex-col px-[10px] gap-[10px] items-center justify-center bg-[#2B2B2B] rounded-[10px] h-full w-full 2xl:py-[26px] xl:py-[26px] lg:py-[26px] md:py-[20px] sm:py-[20px] py-[20px]">
                              <img
                                src={sub.techSubStackLogo?.node?.sourceUrl}
                                alt={
                                  sub.techSubStackLogo?.node?.altText ||
                                  sub.techSubStackName
                                }
                                width="100"
                                height="54"
                                className="group-hover:scale-[1.1] transition-all duration-300 ease-in-out object-contain w-[auto] max-h-[54px] h-[54px]"
                              />
                              <h3 className="font-denton font-medium text-[18px] leading-[100%] text-white">
                                {sub.techSubStackName}
                              </h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )
      }
    </>
  );
};
export default Technology;
