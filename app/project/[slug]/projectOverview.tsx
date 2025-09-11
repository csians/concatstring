"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectOverview } from "@/store/slices/projectDetailsSlice";
import { RootState } from "@/store";

interface Props {
  project: any;
}

const ProjectOverview: React.FC<Props> = ({ project }) => {
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
    projectOverviewTitle,
    projectOverviewDescription,
    projectOverviewImage,
  } = projectSettings;

  return (
    <section className="project-overview bg-black 2xl:pt-[100px] xl:pt-[100px] lg:pt-[100px] md:pt-[80px] sm:pt-[80px] pt-[80px]">
      {
        projectOverviewDescription &&
        <div className="relative">
          {/* <div className="absolute top-[35%] 2xl:block xl:block lg:hidden md:hidden sm:hidden hidden">
            <img src="/images/project-detail/shape1.png" alt="Shape 1" />
          </div> */}
          <div className="container max-w-[1432px] px-[20px] mx-auto">
            <div className="flex flex-col gap-[60px]">
              <h2 className="h2 text-white">{projectOverviewTitle}</h2>
              <div className="relative">
                <div className="absolute 2xl:right-[-10%] xl:right-[-1%] lg:right-[-1%] bottom-[5%] 2xl:block xl:block lg:hidden md:hidden sm:hidden hidden">
                  <img src="/images/project-detail/shape2.png" alt="Shape 2" />
                </div>
                <div className="bg-[#292929] 2xl:p-[60px] xl:p-[60px] lg:p-[50px] md:p-[40px] sm:p-[30px] p-[25px] rounded-[14px] z-[10] relative">
                  <div
                    className="font-lato font-normal 2xl:text-[30px] xl:text-[30px] lg:text-[22px] md:text-[20px] sm:text-[18px] text-[18px] 2xl:leading-[50px] xl:leading-[50px] lg:leading-[40px] md:leading-[30px] sm:leading-[30px] leading-[30px] text-white"
                    dangerouslySetInnerHTML={{
                      __html: projectOverviewDescription,
                    }}
                  />
                </div>
                <div className="absolute bottom-[-21%] left-[-3%] z-[99] 2xl:block xl:block lg:hidden md:hidden sm:hidden hidden">
                  <img src="/images/project-detail/shape3.png" alt="Shape 3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      <div className="container max-w-[1432px] px-[20px] mx-auto flex w-full 2xl:pt-[120px] xl:pt-[120px] lg:pt-[100px] md:pt-[80px] sm:pt-[60px] pt-[50px] 2xl:rounded-[30px] xl:rounded-[30px] lg:rounded-[25px] md:rounded-[25px] sm:rounded-[20px] rounded-[10px]">
        <img
          src={projectOverviewImage?.node?.sourceUrl}
          alt={projectOverviewImage?.node?.altText}
          className="2xl:rounded-[30px] xl:rounded-[30px] lg:rounded-[25px] md:rounded-[25px] sm:rounded-[20px] rounded-[10px]"
        />
      </div>
    </section>
  );
};

export default ProjectOverview;
