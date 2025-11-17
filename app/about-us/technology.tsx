"use client";
import React, { useEffect, useState } from "react";
import "@/css/about.css";
import { useQuery } from "@apollo/client";
import { GET_ABOUT_TECHNOLOGIES } from "@/lib/queries";
// import { TechnologySkeleton } from "@/components/skeletons";
import { setAboutTechnologiesData } from "@/store/slices/aboutSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

const Technology = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("tab-0"); // Set first tab as default
  const cachedData = useSelector(
    (state: RootState) => state.about.aboutTechnologies
  );
  // Skip query if cached data exists to prevent unnecessary refetches
  const { data, error } = useQuery(GET_ABOUT_TECHNOLOGIES, {
    skip: !!cachedData,
  });

  // Get fresh data from query
  const freshData = data?.page?.flexibleContent?.flexibleContent?.find(
    (item: any) => item?.aboutTechnologiesTitle
  );

  // Use cached data from Redux if available, otherwise use fresh data from query
  const techData = cachedData || freshData;

  // Store data in Redux when it comes from query
  useEffect(() => {
    if (data) {
      const technologyBlock =
        data?.page?.flexibleContent?.flexibleContent?.find(
          (item: any) => item?.aboutTechnologiesTitle
        );
      if (technologyBlock) {
        dispatch(setAboutTechnologiesData(technologyBlock));
      }
    }
  }, [data, dispatch]);

  // Function to activate a specific tab
  const activateTab = (target: string) => {
    const tabButtons =
      document.querySelectorAll<HTMLButtonElement>(".tab-button");
    const tabContents = document.querySelectorAll<HTMLElement>(".tab-content");
    const targetContent = document.querySelector<HTMLElement>(
      `[data-content="${target}"]`
    );

    // Reset all buttons
    tabButtons.forEach((b) => {
      b.classList.remove("border-transparent");
      b.classList.remove("pointer-events-none");
      b.classList.add("border-black/20");
      
      b.querySelector(".tab-bg")?.classList.add("opacity-0");
      b.querySelector(".tab-title")?.classList.replace(
        "text-white",
        "text-black"
      );
    });

    // Reset all content
    tabContents.forEach((c) => c.classList.add("hidden"));

    // Find and activate the target button
    const targetButton = document.querySelector<HTMLButtonElement>(
      `[data-tab="${target}"]`
    );
    if (targetButton) {
      targetButton.classList.remove("border-black/20");
      targetButton.classList.add("border-transparent");
      targetButton.classList.add("pointer-events-none");
      targetButton.querySelector(".tab-bg")?.classList.remove("opacity-0");
      targetButton
        .querySelector(".tab-title")
        ?.classList.replace("text-black", "text-white");
    }

    // Show target content
    if (targetContent) {
      targetContent.classList.remove("hidden");

      // For mobile view, insert content after the button
      if (window.innerWidth < 1024) {
        targetButton?.insertAdjacentElement("afterend", targetContent);
      }
    }
  };

  // Auto-activate first tab when data is available
  useEffect(() => {
    if (techData?.technologies && techData.technologies.length > 0) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        activateTab("tab-0");
      }, 100);
    }
  }, [techData]);

  useEffect(() => {
    const tabButtons =
      document.querySelectorAll<HTMLButtonElement>(".tab-button");
    const tabContents = document.querySelectorAll<HTMLElement>(".tab-content");

    function isMobileView() {
      return window.innerWidth < 1024;
    }

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target: any = btn.getAttribute("data-tab");
        const targetContent = document.querySelector<HTMLElement>(
          `[data-content="${target}"]`
        );

        if (isMobileView()) {
          if (activeTab === target) {
            targetContent?.classList.add("hidden");
            setActiveTab(""); // Clear active tab
            return;
          }

          setActiveTab(target);
          activateTab(target);
        } else {
          setActiveTab(target);
          activateTab(target);
        }
      });
    });
  }, [data, activeTab]); // Added activeTab to dependencies

  // if (error)
  //   return (
  //     <div className="flex items-center justify-center min-h-[400px]">
  //       <div className="text-center">
  //         <h3 className="font-denton text-[24px] font-bold text-white mb-[16px]">
  //           Error loading technologies
  //         </h3>
  //         <p className="text-[#C3C3C3]">Please try again later.</p>
  //       </div>
  //     </div>
  //   );

  const technologies = techData?.technologies;
  if (!techData || !technologies || technologies.length === 0) {
    return null;
  }

  // useEffect(() => {
  //   let first = true;
  //   if (technologies.length > 0) {
  //     setTimeout(() => {
  //       const tabButtons =
  //         document.querySelectorAll<HTMLButtonElement>(".tab-button");
  //       if (first) {
  //         first = false
  //         // tabButtons[0]?.click();
  //       }
  //     }, 1000);
  //   }
  // }, [technologies])
  return (
    <section className="technology bg-[url(/images/tech-bg.png)] bg-cover bg-center 2xl:pt-[135px] xl:pt-[135px] lg:pt-[120px] md:pt-[100px] sm:pt-[100px] pt-[100px] 2xl:pb-[135px] xl:pb-[135px] lg:pb-[135px] md:pb-[200px] sm:pb-[200px] pb-[200px] technology-bg">
      <div className="container max-w-[1420px] mx-auto px-[10px]">
        <div className="flex flex-col items-start gap-[60px]">
          <h2 className="h2 text-black">{techData?.aboutTechnologiesTitle}</h2>
          <div className="tec-wrap flex items-center justify-between 2xl:gap-[60px] xl:gap-[60px] lg:gap-[60px] md:gap-[40px] sm:gap-[30px] gap-[25px] 2xl:flex-row xl:flex-row lg:flex-col md:flex-col sm:flex-col flex-col w-full">
            {/* Tab Buttons */}
            <div className="tab-buttons grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-1 sm:grid-cols-1 grid-cols-1 gap-[20px] 2xl:w-[calc(100%-557px)] xl:w-[calc(100%-557px)] lg:w-full md:w-full sm:w-full w-full">
              {technologies?.map((tech: any, index: number) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveTab(`tab-${index}`)}
                  data-tab={`tab-${index}`}
                  className="tab-button relative group w-full overflow-hidden bg-white rounded-[10px] border border-black/20 flex items-center justify-center py-[85px] px-[20px] hover:border-transparent h-full"
                >
                  <div
                    className="tab-bg absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[10px] h-full w-full"
                    style={{
                      backgroundImage: `url(${tech.aboutTechnologyBackPic.node.sourceUrl})`,
                    }}
                  ></div>
                  <div className="relative z-10 text-center">
                    <h2 className="tab-title text-[22px] font-denton font-bold text-center text-black group-hover:text-white max-w-[168px] block">
                      {tech.aboutTechnologyTitle}
                    </h2>
                  </div>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="tab-contents 2xl:w-[446px] xl:w-[446px] lg:w-full md:w-full sm:w-full w-full h-full">
              {technologies?.map((tech: any, index: number) => (
                <div
                  key={index}
                  data-content={`tab-${index}`}
                  className="tab-content bg-cover bg-center rounded-[10px] w-full py-[30px] px-[26px] h-full min-h-[497px] hidden"
                  style={{
                    backgroundImage: `url(${tech.aboutTechnologiesImage.node.sourceUrl})`,
                  }}
                >
                  <div className="flex flex-col gap-[20px] items-start">
                    <h3 className="text-[26px] font-denton font-bold text-black leading-[34px] text-white">
                      {tech.aboutTechnologiesDescriptionTitle}
                    </h3>
                    <div className="flex flex-col items-start gap-[15px]">
                      {tech.description.map((desc: any, i: number) => (
                        <div key={i} className="flex flex-col gap-[15px]">
                          <h4 className="font-lato font-bold 2xl:text-[20px] xl:text-[20px] lg:text-[20px] md:text-[20px] sm:text-[18px] text-[18px] leading-[100%] text-white">
                            {desc.listTitle}
                          </h4>
                          {desc.technologyList &&
                            desc.technologyList.some(
                              (item: any) => item.technologyName
                            ) && (
                              <ul className="flex items-center 2xl:gap-x-[30px] xl:gap-x-[30px] lg:gap-x-[40px] md:gap-x-[40px] sm:gap-x-[30px] gap-x-[30px] gap-y-[10px] list-disc ps-[18px] flex-wrap">
                                {desc.technologyList.map(
                                  (item: any, j: number) =>
                                    item.technologyName && (
                                      <li
                                        key={j}
                                        className="font-lato font-normal text-[17px] leading-[100%] text-white"
                                      >
                                        {item.technologyName}
                                      </li>
                                    )
                                )}
                              </ul>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technology;
