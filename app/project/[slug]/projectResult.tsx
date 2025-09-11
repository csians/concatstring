"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectResults } from "@/store/slices/projectDetailsSlice";
import { RootState } from "@/store";

interface Props {
  project: any;
  onLanguagesChange?: (langs: string[]) => void;
}
const projectResult: React.FC<Props> = ({ project }) => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const cachedData = useSelector(
    (state: RootState) => state.projectDetails.projectResults
  );

  // Dispatch data to Redux when it arrives
  useEffect(() => {
    if (project) {
      dispatch(setProjectResults(project));
    }
  }, [project, dispatch]);

  // Use Redux data if available, otherwise use prop data
  const displayData = cachedData || project;

  const projectSettings = displayData?.projectSettings;
  if (!projectSettings) return null;

  const { resultTitle, resultImage, resultKeyPoints } = projectSettings;
  return (
    <>
      {
        resultKeyPoints.length > 0 &&
        <section className="2xl:py-[120px] xl:py-[120px] lg:py-[120px] md:py-[80px] sm:py-[80px] py-[80px]">
          <div className="container max-w-[1440px] px-[20px] mx-auto">
            <div className="flex flex-col 2xl:gap-[80px] xl:gap-[80px] lg:gap-[60px] md:gap-[50px] sm:gap-[40px] gap-[30px] items-start">
              <h2 className="h2 text-left text-white">{resultTitle}</h2>
              <div className="flex items-top justify-between 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[30px] 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col">

                {resultImage?.node?.sourceUrl &&
                  <div className="rounded-[30px] 2xl:w-[50%] xl:w-[50%] lg:w-[50%] md:w-full sm:w-full w-full">
                    <img
                      src={resultImage?.node?.sourceUrl}
                      className="w-full sticky top-[130px]"
                      alt={resultImage?.node?.altText}
                    />
                  </div>
                }
                <ul className="flex flex-col gap-[20px] 2xl:w-[50%] xl:w-[50%] lg:w-[50%] md:w-full sm:w-full w-full">
                  {Array.isArray(resultKeyPoints) &&
                    resultKeyPoints.length > 0 &&
                    resultKeyPoints.map((item: any, idx: number) => (
                      <li
                        key={idx}
                        className="2xl:px-[30px] xl:px-[30px] lg:px-[30px] md:px-[20px] sm:px-[20px] px-[20px] py-[20px] rounded-[14px] bg-[#FFFFFF29] flex items-top gap-[10px] w-full"
                      >
                        <span className="bg-gradient-to-b from-[#E72125] to-[#8E1D1D] h-[10px] w-[10px] rounded 2xl:mt-[11px] xl:mt-[11px] lg:mt-[11px] md:mt-[11px] sm:mt-[8px] mt-[8px]"></span>
                        <p className="font-lato font-semibold 2xl:text-[18px] xl:text-[18px] lg:text-[18px] md:text-[18px] sm:text-[18px] text-[18px] 2xl:leading-[30px] xl:leading-[30px] lg:leading-[30px] md:leading-[30px] sm:leading-[25px] leading-[25px] text-white w-[calc(100%-40px)]">
                          {item?.resultList}
                        </p>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      }
    </>
  );
};

export default projectResult;
