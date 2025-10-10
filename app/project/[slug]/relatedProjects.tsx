"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectRelatedProjects } from "@/store/slices/projectDetailsSlice";
import { RootState } from "@/store";
import Link from "next/link";

interface Props {
  project: any;
}

const RelatedProjects: React.FC<Props> = ({ project }) => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const cachedData = useSelector(
    (state: RootState) => state.projectDetails.projectRelatedProjects
  );

  // Dispatch data to Redux when it arrives
  useEffect(() => {
    if (project) {
      dispatch(setProjectRelatedProjects(project));
    }
  }, [project, dispatch]);

  // Use Redux data if available, otherwise use prop data
  const displayData = cachedData || project;

  const projectsData = displayData?.projectSettings;

  if (!projectsData || !projectsData.projects?.nodes?.length) return null;

  const sectionTitle = projectsData.relatedProjectTitle;
  const relatedProjects = projectsData.projects.nodes;

  return (
    <>
      {
        relatedProjects.length > 0 &&
        <section className="related-project 2xl:pt-[76px] xl:pt-[76px] lg:pt-[70px] md:pt-[50px] sm:pt-[30px] pt-[30px] mt-10 2xl:pb-[120px] xl:pb-[120px] lg:pb-[100px] md:pb-[80px] sm:pb-[80px] pb-[80px]">
          <div className="container max-w-[1440px] px-[20px] mx-auto">
            <div className="flex flex-col 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[50px] sm:gap-[40px] gap-[30px]">
              <h2 className="h2 text-white text-center">{sectionTitle}</h2>
              <div className="flex flex-wrap gap-[30px]">
                {relatedProjects.map((project: any, idx: number) => {
                  const settings = project.projectSettings;
                  return (
                    <div
                      key={idx}
                      className="flex items-start justify-between 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col-reverse gap-[30px] w-full"
                    >
                      <div className="flex lg:flex-col md:gap-[40px] lg:justify-start gap-[20px] 2xl:order-1 xl:order-1 lg:order-1 md:order-2 sm:order-2 order-2 flex-row justify-between w-full lg:w-auto items-center lg:items-start">
                        <h4 className="font-lato font-bold 2xl:text-[46px] xl:text-[46px] lg:text-[40px] md:text-[35px] sm:text-[30px] text-[26px] leading-[100%] text-white">
                        {settings.arrowSvg?.node?.sourceUrl && settings.projectLink?.url && (
                          <Link
                            href={settings.projectLink.url}
                          >
                          {settings.relatedProjectName}
                          </Link>
                        )}
                        </h4>
                        {settings.arrowSvg?.node?.sourceUrl && settings.projectLink?.url && (
                          <Link
                            href={settings.projectLink.url}
                          >
                            <img
                              src={settings.arrowSvg.node.sourceUrl}
                              alt={settings.arrowSvg.node.altText}
                              width="76"
                              height="76"
                              className="w-[40px] h-[40px] md:w-[76px] md:h-[76px]"
                            />
                          </Link>
                        )}
                      </div>
                      <div className="p-[8px] rounded-[10px] bg-gradient-to-b from-[#E72125] via-[#A11E1E] to-[#8E1D1D] 2xl:w-[829px] xl:w-[829px] lg:w-[829px] md:w-full sm:w-full w-full 2xl:order-2 xl:order-2 lg:order-2 md:order-1 sm:order-1 order-1">
                      {settings.arrowSvg?.node?.sourceUrl && settings.projectLink?.url && (
                          <Link
                            href={settings.projectLink.url}
                            className="group rounded-[10px] overflow-hidden table"
                          >
                        <img
                          src={settings.relatedProjectImage?.node?.sourceUrl}
                          alt={settings.relatedProjectImage?.node?.altText}
                          width="829"
                          height="450"
                          className="2xl:w-[828px] xl:w-[828px] lg:w-[828px] md:w-full sm:w-full w-full rounded-[10px] group-hover:scale-105 transition-all duration-300"
                        />
                        </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      }
    </>
  );
};

export default RelatedProjects;
