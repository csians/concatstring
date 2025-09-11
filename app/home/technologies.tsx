"use client";

import React, { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { GET_OUR_TECHNOLOGIES } from "@/lib/queries";
import "@/css/home.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setTechnologies } from "@/store/slices/homeSlice";
import { TechnologiesSkeleton } from "@/components/skeletons";

const Technologies = () => {
  const dispatch = useDispatch();
  const cachedData = useSelector((state: RootState) => state.home.technologies);

  const { data, loading } = useQuery(GET_OUR_TECHNOLOGIES);

  const content = cachedData || data;
  
  const techSection =
    content?.page?.flexibleContent?.flexibleContent?.find(
      (item: any) => item?.weProvideTitle
    ) || {};

  const technologies = techSection.technologies?.nodes || [];

  // Show skeleton while loading and no cached data
  // if (loading && !cachedData) {
  //   return <TechnologiesSkeleton />;
  // }

  if (!technologies || !techSection || !techSection.weProvideTitle) return null;
  return (
    <section className="explore-technologies md:pt-[100px] pt-[60px]">
      <div className="max-w-[1432px] px-4 mx-auto">
        <div className="flex justify-between items-start gap-[20px] flex-col lg:flex-row">
          <h2 className="title text-white h2 tracking-normal">
            {techSection.weProvideTitle}
          </h2>
          {techSection.exploreTechnologies && (
            <a
              href={techSection.exploreTechnologies?.url}
              className="btn-primary btn-primary 2xl:h-[82px] xl:h-[82px] lg:h-[80px] md:h-[70px] sm:h-[60px] h-[60px] gap-[10px] 2xl:text-[24px] xl:text-[24px] lg:text-[18px] md:text-[18px] lg:text-[18px] sm:text-[18px] text-[16px] transition-all duration-300 ease-in-out cursor-pointer hover:shadow-[inset_0_0_16px_rgba(255,255,255,0.26),0_24px_124px_rgba(231,33,37,0.22)] inline-block group p-0 max-sm:h-[auto]"
            >
              <div className="btn-primary-outline 2xl:w-[410x] xl:w-[410px] lg:w-[360px]  md:w-max sm:w-max w-max"><div className="btn-primary 2xl:text-[24px]  2xl:h-[82px] xl:h-[82px] lg:h-[80px] md:h-[70px] sm:h-[60px] h-[60px] xl:text-[24px] lg:text-[18px] md:text-[18px] lg:text-[18px] sm:text-[18px] text-[16px] xl:py-[18px] justify-center   gap-[10px]"> 
              {techSection.exploreTechnologies?.title}
              {/* <img
                src="/images/gif/progress.gif"
                alt="Progress"
                width={44}
                height={45}
                className="2xl:w-[44px] xl:w-[44px] lg:w-[40px] md:w-[40px] sm:w-[30px] w-[25px]"
              /> */}
              </div></div>
             
            </a>
          )}
        </div>
        {techSection.provideDescription && (
          <p className="text-[#C3C3C3] font-lato text-[16px] font-medium max-w-[1019px] mt-[16px] mb-[50px]">
            <span
              dangerouslySetInnerHTML={{
                __html: techSection.provideDescription || "",
              }}
            />
          </p>
        )}

        <div className="border-gradient rounded-[40px] p-[1px]">
          <div className="bg-black 2xl:py-[70px] xl:py-[70px] lg:py-[60px] md:py-[50px] sm:py-[40px] py-[30px] rounded-[40px] 2xl:px-[105px] xl:px-[100px] lg:px-[80px] md:px-[60px] sm:px-[50px] px-[30px] flex">
          <div 
            className="min-h-[375px] h-[375px] max-lg:h-[450px] max-lg:min-h-[450px]  overflow-y-auto custom-scrollbar"
          >
              {technologies.map((tech: any, i: number) => {
                const settings = tech.technologiesSettings;
                return (
                  <div
                    key={i}
                    className="flex gap-[66px] max-lg:gap-[30px] justify-between items-center mb-12 2xl:flex-row xl:flex-row lg:flex-row md:flex-col-reverse sm:flex-col-reverse flex-col-reverse me-[5px] last:mb-[4px] md:first:mt-[35px] max-lg:h-[450px] max-lg:min-h-[450px] max-lg:justify-center"
                  >
                    <div className="2xl:w-[832px] xl:w-[832px] lg:w-[832px] md:w-full sm:w-full w-full">
                      {settings.technologyName && (
                        <h3 className="h3 tracking-normal mb-4 text-white leading-[105%]">
                          {settings.technologyName}
                        </h3>
                      )}
                      {settings.technologyDescription && (
                        <p className="font-lato font-medium 2xl:text-[24px] xl:text-[24px] lg:text-[24px] md:text-[20px] sm:text-[20px] text-[16px] 2xl:leading-[39px] xl:leading-[39px] lg:leading-[39px] md:leading-[30px] sm:leading-[30px] leading-[20px] text-white mb-10">
                          {settings.technologyDescription}
                        </p>
                      )}
                      {settings.readMoreLink?.title && (
                        <div className="button-box text-left">
                          <a
                            href={`/services/${tech?.slug}`}
                            className="inline-block group"
                          >
                            <div className="btn-primary-outline">
                              <div className="btn-primary">
                                {settings.readMoreLink?.title}
                              </div>
                            </div>
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="image-box max-md:w-[80px] max-md:h-[80px] max-lg:w-[120px] max-lg:h-[120px]">
                      {settings.technologyImage?.node && (
                        <img
                          src={settings.technologyImage?.node?.sourceUrl}
                          alt={
                            settings.technologyImage?.node?.altText ||
                            settings.technologyName
                          }
                          width={298}
                          height={298}
                          className="float-left"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technologies;
