"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectOverview } from "@/store/slices/projectDetailsSlice";
import { RootState } from "@/store";

interface Props {
  project: any;
  onLanguagesChange?: (langs: string[]) => void;
}

const AboutConcatstring: React.FC<Props> = ({ project }) => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const cachedData = useSelector(
    (state: RootState) => state.projectDetails.projectOverview
  );

  // Dispatch data to Redux when it arrives
  useEffect(() => {
    if (project) {
      dispatch(setProjectOverview(project));
    }
  }, [project, dispatch]);

  // Use Redux data if available, otherwise use prop data
  const displayData = cachedData || project;

  const projectSettings = displayData?.projectSettings;
  if (!projectSettings) return null;

  const {
    aboutCsTitle,
    aboutCsDescription,
    caseStudyClientFeedbackTitle,
    caseStudyClientFeedbackDescription,
  } = projectSettings;

  return (
    <>
      <section className="pt-[100px]">
        <div className="container max-w-[1440px] px-[20px] mx-auto">
          <div className="flex flex-col items-center justify-center 2xl:gap-[120px] xl:gap-[100px] lg:gap-[80px] md:gap-[60px] sm:gap-[50px] gap-[30px]">
            <div className="flex flex-col gap-[16px] items-center justify-center">
              <h2 className="h2 text-white text-center">{aboutCsTitle}</h2>
              <div
                className="font-lato font-normal 2xl:text-[30px] xl:text-[30px] lg:text-[25px] md:text-[25px] sm:text-[20px] text-[18px] 2xl:leading-[50px] xl:leading-[50px] lg:leading-[40px] md:leading-[40px] sm:leading-[30px] leading-[30px] text-white text-center mb-[30px]"
                dangerouslySetInnerHTML={{ __html: aboutCsDescription }}
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-[16px]">
              <h2 className="h2 text-white text-lrft">
                {caseStudyClientFeedbackTitle}
              </h2>
              <p className="font-lato font-normal 2xl:text-[30px] xl:text-[30px] lg:text-[25px] md:text-[25px] sm:text-[20px] text-[18px] 2xl:leading-[50px] xl:leading-[50px] lg:leading-[40px] md:leading-[40px] sm:leading-[30px] leading-[30px] text-white text-left mb-[30px]">
                {caseStudyClientFeedbackDescription}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutConcatstring;
