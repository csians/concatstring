"use client";
import { GET_SERVICE_PROCESS_FLOW } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setServiceProcess } from "@/store/slices/serviceDetailsSlice";
import { RootState } from "@/store";

interface Props {
  data: any;
}
const SERVICE_PAGE_ID = "cG9zdDoyNzg="; // Replace with prop if needed
const OurProcess: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const cachedData = useSelector(
    (state: RootState) => state.serviceDetails.serviceProcess
  );

  // Dispatch data to Redux when it arrives
  useEffect(() => {
    if (data) {
      dispatch(setServiceProcess(data));
    }
  }, [data, dispatch]);

  // Use Redux data if available, otherwise use prop data
  const displayData = cachedData || data;

  const processData = displayData?.technology?.technologiesSettings;
  const processTitle = processData?.ourProcessTitle;
  const processFlow = processData?.processFlow || [];

  return (
    <>
      {
        processFlow?.length > 0 &&
        <section className="our-process pt-[120px]">
          <div className="container max-w-[1100px] px-[20px] mx-auto">
            <h2 className="h2 text-white text-center gap-[60px] pb-[60px]">
              {processTitle}
            </h2>
            <div className="flex flex-col">
              {processFlow.map((step: any, idx: number) => {
                const isEven = idx % 2 === 1;
                // Alternate left/right layout
                return (
                  <div
                    key={step.processCount}
                    className={`process-wrap flex flex-col ${isEven ? "items-end justify-end" : "items-start justify-start"
                      }`}
                  >
                    <div
                      className={`process flex gap-[15px] 2xl:items-center xl:items-center lg:items-center md:items-center  ${isEven
                        ? "items-end sm:items-end justify-end bg-[linear-gradient(90deg,_#000000_0%,_rgba(217,217,217,0.3)_100%)] rounded-r-[20px] rounded-l-none"
                        : "items-start sm:items-start bg-[linear-gradient(27deg,_rgba(217,217,217,0.3)_0%,_#000000_100%)] rounded-l-[20px] rounded-r-none text-right"
                        } h-full 2xl:px-[40px] xl:px-[40px] lg:px-[30px] md:px-[25px] sm:px-[20px] px-[20px] 2xl:py-[30px] xl:py-[30px] lg:py-[30px] md:py-[25px] sm:py-[20px] py-[20px] 2xl:w-[930px] xl:w-[930px] lg:w-[930px] md:w-full sm:w-full w-full 2xl:flex-row xl:flex-row lg:flex-row md:flex-row sm:flex-col flex-col`}
                    >
                      {/* For even steps, number on right; for odd, number on left */}
                      {!isEven && (
                        <span
                          className={
                            `rounded-full w-[74px] h-[75px] flex items-center justify-center font-denton text-[36px] leading-[100%] font-semibold text-white ` +
                            (step.processCount === "01" || step.processCount === "1"
                              ? "bg-[#0084FF]"
                              : step.processCount === "03" ||
                                step.processCount === "3"
                                ? "bg-[#00C49A]"
                                : step.processCount === "05" ||
                                  step.processCount === "5"
                                  ? "bg-[#FF3B3B]"
                                  : "")
                          }
                        >
                          {step.processCount}
                        </span>
                      )}
                      <div
                        className={`flex flex-col ${isEven
                          ? "items-end justify-end md:items-end md:justify-end"
                          : ""
                          } ${isEven
                            ? "2xl:order-1 xl:order-1 lg:order-1 md:order-1 sm:order-2 order-2"
                            : ""
                          }`}
                      >
                        <h3
                          className={`font-denton font-bold 2xl:text-[26px] xl:text-[26px] lg:text-[25px] md:text-[25px] sm:text-[20px] text-[18px] leading-[38px] text-white text-${isEven ? "right" : "left"
                            }`}
                        >
                          {step.processTitle}
                        </h3>
                        <p
                          className={`font-lato text-[16px] leading-[26px] font-medium text-[#C3C3C3] text-${isEven ? "right" : "left"
                            }`}
                        >
                          {step.processDescription}
                        </p>
                      </div>
                      {isEven && (
                        <span
                          className={
                            `rounded-full w-[74px] h-[75px] flex items-center justify-center font-denton text-[36px] leading-[100%] font-semibold text-white 2xl:order-2 xl:order-2 lg:order-2 md:order-2 sm:order-1 order-1 ` +
                            (step.processCount === "02" || step.processCount === "2"
                              ? "bg-[#FF9900]"
                              : step.processCount === "04" ||
                                step.processCount === "4"
                                ? "bg-[#9C27B0]"
                                : "")
                          }
                        >
                          {step.processCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      }
    </>
  );
};

export default OurProcess;
