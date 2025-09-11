"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectService } from "@/store/slices/projectDetailsSlice";
import { RootState } from "@/store";

interface Props {
  project: any;
}

const Service: React.FC<Props> = ({ project }) => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const cachedData = useSelector(
    (state: RootState) => state.projectDetails.projectService
  );

  // Dispatch data to Redux when it arrives
  useEffect(() => {
    if (project) {
      dispatch(setProjectService(project));
    }
  }, [project, dispatch]);

  // Use Redux data if available, otherwise use prop data
  const displayData = cachedData || project;

  const projectSettings = displayData?.projectSettings;

  if (!projectSettings) return <div>No service data found.</div>;

  const {
    serviceTitle,
    services,
    serviceImage,
    servicePhoto,
    serviceHighlight,
    ourApproachDescription,
  } = projectSettings;

  return (
    <>
      {
        services.length > 0 &&
        <section className="service 2xl:pt-[120px] xl:pt-[120px] lg:pt-[100px] md:pt-[80px] sm:pt-[80px] pt-[80px]">
          <div className="container max-w-[1432px] px-[20px] mx-auto">
            <div className="flex flex-col gap-[60px]">
              <div className="flex flex-col items-start justify-start gap-[3px]">
                <h2 className="h2 text-white">{serviceTitle}</h2>
                <p className="font-lato font-normal 2xl:text-[30px] xl:text-[30px] lg:text-[25px] md:text-[25px] sm:text-[20px] text-[18px] 2xl:leading-[50px] xl:leading-[50px] lg:leading-[40px] md:leading-[40px] sm:leading-[30px] leading-[30px] text-white text-left mb-[30px] max-w-[1280px]">
                  {ourApproachDescription}
                </p>
              </div>
              <div className="grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-[30px]">
                {services?.map(
                  (
                    item: { service: string; servicesDescription: string },
                    idx: number
                  ) => (
                    <div
                      key={idx}
                      className="bg-black border border-[#5B5B5B80] rounded-[10px] shadow-custom h-[190px] p-[30px] flex items-center justify-center group hover:bg-[#2E0707] hover:shadow-none hover:border-none transition-all duration-300 ease-in-out relative overflow-hidden"
                    >
                      <span className="font-lato font-bold text-[26px] leading-[38px] text-white text-center absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out group-hover:opacity-0 group-hover:pointer-events-none px-[10px]">
                        {item.service}
                      </span>
                      <p className="font-lato font-bold text-[18px] leading-[30px] text-white text-center absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto px-[10px]">
                        {item.servicesDescription}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="project-heighlight 2xl:pt-[120px] xl:pt-[120px] lg:pt-[100px] md:pt-[80px] sm:pt-[80px] pt-[80px]">
            <div className="container max-w-[1432px] px-[20px] mx-auto">
              <div className="flex flex-col 2xl:gap-[80px] xl:gap-[80px] lg:gap-[60px] md:gap-[50px] sm:gap-[40px] gap-[30px]">
                {/* <div className="flex w-full">
                  <img
                    src={serviceImage?.node?.sourceUrl}
                    alt={serviceImage?.node?.altText}
                    width="895"
                    height="436"
                    className="2xl:w-max xl:w-max lg:w-max md:w-full sm:w-full w-full shadow-custom rounded-[20px]"
                  />
                </div> */}
                <div className="flex flex-col 2xl:gap-[80px] xl:gap-[80px] lg:gap-[60px] md:gap-[50px] sm:gap-[40px] gap-[30px] items-start">
                  <h2 className="h2 text-left text-white">Key Objectives</h2>
                  <div className="flex items-top justify-between 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[30px] 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col">
                    <ul className="flex flex-col gap-[20px] 2xl:w-[50%] xl:w-[50%] lg:w-[50%] md:w-full sm:w-full w-full">
                      {serviceHighlight?.map(
                        (
                          highlight: { serviceHighlightTitle: string },
                          idx: number
                        ) => (
                          <li
                            key={idx}
                            className="2xl:px-[30px] xl:px-[30px] lg:px-[30px] md:px-[20px] sm:px-[20px] px-[20px] py-[20px] rounded-[14px] bg-[#FFFFFF29] flex 2xl:items-top xl:items-top lg:items-top md:items-top sm:items-top items-top gap-[10px] w-full"
                          >
                            <span className="bg-gradient-to-b from-[#E72125] to-[#8E1D1D] h-[10px] w-[10px] rounded 2xl:mt-[11px] xl:mt-[11px] lg:mt-[11px] md:mt-[11px] sm:mt-[8px] mt-[8px]"></span>
                            <p className="font-lato font-semibold 2xl:text-[18px] xl:text-[18px] lg:text-[18px] md:text-[18px] sm:text-[18px] text-[18px] 2xl:leading-[30px] xl:leading-[30px] lg:leading-[30px] md:leading-[30px] sm:leading-[25px] leading-[25px] text-white w-[calc(100%-40px)]">
                              {highlight.serviceHighlightTitle}
                            </p>
                          </li>
                        )
                      )}
                    </ul>
                    <div className="rounded-[30px] 2xl:w-[50%] xl:w-[50%] lg:w-[50%] md:w-full sm:w-full w-full">
                      <img
                        src={servicePhoto?.node?.sourceUrl}
                        alt={servicePhoto?.node?.altText}
                        width="670"
                        height="684"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      }
    </>

  );
};

export default Service;
