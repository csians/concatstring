"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectAchievements } from "@/store/slices/projectDetailsSlice";
import { RootState } from "@/store";

interface Props {
  project: any;
}

const WhatWeAchive: React.FC<Props> = ({ project }) => {
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const cachedData = useSelector(
    (state: RootState) => state.projectDetails.projectAchievements
  );
  
  // Dispatch data to Redux when it arrives
  useEffect(() => {
    if (project) {
      dispatch(setProjectAchievements(project));
    }
  }, [project, dispatch]);

  // Use Redux data if available, otherwise use prop data
  const displayData = cachedData || project;
  
  const projectSettings = displayData?.projectSettings;

  const achievedBlocks = projectSettings?.achievedBlocks || [];
  const weAchievedTitle = projectSettings?.weAchievedTitle;

  return (
    <section className="why-choose py-[200px] relative overflow-hidden h-full">
      <div className="absolute top-0 left-0 w-[200%] h-full bg-[url('/images/bg.png')] bg-repeat-x bg-top bg-cover animate-scroll-horizontal why-choose-animate-bg"></div>
      <div className="container max-w-[1432px] px-[20px] mx-auto z-10 relative">
        <div className="flex flex-col items-center justify-center 2xl:gap-[43px] xl:gap-[43px] lg:gap-[40px] md:gap-[30px] sm:gap-[30px] gap-[25px]">
          <h2 className="h2 text-black">{weAchievedTitle}</h2>
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 2xl:gap-[30px] xl:gap-[30px] lg:gap-[25px] md:gap-[25px] sm:gap-[20px] gap-[20px] w-full justify-center items-center">
            {achievedBlocks.map((block: any, idx: number) => (
              <div
                key={idx}
                className="h-full box px-[30px] py-[34px] rounded-[10px] bg-[#D9D9D94D] border border-white flex flex-col items-start justify-center [15px] gap-[10px] shadow-custom"
              >
                <h3 className="bg-clip-text font-bold text-transparent bg-gradient-to-b from-[#E72125] via-[#A11E1E] to-[#8E1D1D] h3 text-[66px]">
                  {block.archivedNumber}
                </h3>
                <span className="font-denton text-[22px] font-medium leading-[100%] text-black">
                  {block.achievedTitle}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeAchive;
