"use client";

import React, { useEffect } from "react";
import "@/css/home.css";
import { useQuery } from "@apollo/client";
import { GET_SERVICE_DETAIL_FAQ } from "@/lib/queries";
import { useDispatch, useSelector } from "react-redux";
import { setServiceFaq } from "@/store/slices/serviceDetailsSlice";
import { RootState } from "@/store";

interface Props {
  data: any;
}

const Faq: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const cachedData = useSelector(
    (state: RootState) => state.serviceDetails.serviceFaq
  );

  // Dispatch data to Redux when it arrives
  useEffect(() => {
    if (data) {
      dispatch(setServiceFaq(data));
    }
  }, [data, dispatch]);

  // Use Redux data if available, otherwise use prop data
  const displayData = cachedData || data;

  // Find the first technology node with FAQ data
  const techNode = displayData?.technology;
  const faqTitle = techNode?.technologiesSettings?.faqTitle;
  const faqItems = techNode?.technologiesSettings?.faq?.nodes || [];

  useEffect(() => {
    const faqItems = document.querySelectorAll(".faq-item");
    const listeners: Array<() => void> = [];
    
    // Open first FAQ item by default
    if (faqItems.length > 0) {
      const firstItem = faqItems[0];
      const firstContent = firstItem.querySelector(".faq-content") as HTMLElement | null;
      const firstIcon = firstItem.querySelector(".faq-icon svg") as HTMLElement | null;
      const firstWrapper = firstItem.closest(".faq-wrapper");
      
      if (firstContent) firstContent.style.maxHeight = firstContent.scrollHeight + "px";
      if (firstIcon) firstIcon.style.transform = "rotate(180deg)";
      firstItem.classList.add("active", "bg-[#2B2B2B]");
      firstWrapper?.classList.add("is-active");
    }
    
    faqItems.forEach((item) => {
      const head = item.querySelector(".faq-head");
      const content = item.querySelector(".faq-content") as HTMLElement | null;
      const icon = item.querySelector(".faq-icon svg") as HTMLElement | null;
      const wrapper = item.closest(".faq-wrapper");
      const handleClick = () => {
        const isOpen = item.classList.contains("active");
        faqItems.forEach((faq) => {
          const c = faq.querySelector(".faq-content") as HTMLElement | null;
          const i = faq.querySelector(".faq-icon svg") as HTMLElement | null;
          const w = faq.closest(".faq-wrapper");
          if (c) c.style.maxHeight = "";
          if (i) i.style.transform = "rotate(0deg)";
          faq.classList.remove("active", "bg-[#2B2B2B]");
          w?.classList.remove("is-active");
        });
        if (!isOpen) {
          if (content) content.style.maxHeight = content.scrollHeight + "px";
          if (icon) icon.style.transform = "rotate(180deg)";
          item.classList.add("active", "bg-[#2B2B2B]");
          wrapper?.classList.add("is-active");
        }
      };
      if (head) {
        item.addEventListener("click", handleClick);
        listeners.push(() => item.removeEventListener("click", handleClick));
      }
    });
    return () => {
      listeners.forEach((removeListener) => removeListener());
    };
  }, [faqItems]);

  return (
    <>
      {
        faqItems.length > 0 && (
          <section className="faq pb-[120px] bg-black">
            <div className="container max-w-[1217px] w-full px-[20px] mx-auto">
              <div className="faq-wrap flex flex-col justify-center items-center 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[30px] rounded-[12px] ">
                <h2 className="h2 text-white">{faqTitle}</h2>
                <div className="faq-wrap flex flex-col gap-[20px]">
                  {faqItems.map((faq: any, idx: number) => (
                    <div
                      key={idx}
                      className="faq-wrapper rounded-[12px] border border-[#2F2F2F] transition-all duration-300 group relative hover:border-transparent"
                    >
                      <span className="absolute top-[-1px] left-[-1px] right-[-1px] bottom-[-1px] inset-0 bg-gradient-to-b from-[#54A3DA] to-[#E72125] rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-[0]"></span>
                      <div
                        className="group-hover:bg-[#2B2B2B] relative z-[1] faq-item py-[24px] 2xl:px-[30px] xl:px-[30px] lg:px-[25px] md:px-[25px] sm:px-[25px] px-[20px] overflow-hidden rounded-[12px] flex flex-col items-start transition-all duration-[400ms] bg-black cursor-pointer"
                        style={{ borderImageSlice: 1 }}
                      >
                        <div className="faq-head flex justify-between items-center w-full cursor-pointer">
                          <h4 className="font-denton text-white font-semibold 2xl:text-[22px] xl:text-[22px] lg:text-[20px] md:text-[20px] sm:text-[18px] text-[18px] 2xl:leading-[34px] xl:leading-[34px] lg:leading-[30px] md:leading-[30px] sm:leading-[25px] leading-[25px]">
                            {faq.title}
                          </h4>
                          <span className="faq-icon cursor-pointer">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="9"
                              viewBox="0 0 15 9"
                              fill="none"
                            >
                              <path
                                d="M8.0853 8.5731L14.7604 1.89791C14.9149 1.74352 15 1.53743 15 1.31767C15 1.09792 14.9149 0.891822 14.7604 0.737433L14.2689 0.245852C13.9487 -0.0740237 13.4282 -0.0740238 13.1084 0.245852L7.50311 5.85117L1.89157 0.239632C1.73706 0.0852427 1.53108 -5.88745e-07 1.31145 -5.98345e-07C1.09158 -6.07957e-07 0.885602 0.0852426 0.730968 0.239632L0.239632 0.731213C0.0851202 0.885724 0 1.0917 0 1.31145C0 1.53121 0.0851202 1.7373 0.239632 1.89169L6.9208 8.5731C7.0758 8.72786 7.28275 8.81286 7.50274 8.81237C7.7236 8.81286 7.93042 8.72786 8.0853 8.5731Z"
                                fill="white"
                              />
                            </svg>
                          </span>
                        </div>
                        <div className="faq-content transition-all duration-[400ms] ease-in-out overflow-hidden max-h-0">
                          <div
                            className="font-lato text-[16px] font-normal leading-[26px] text-[#C3C3C3]"
                            dangerouslySetInnerHTML={{ __html: faq.content }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )
      }
    </>
  );
};
export default Faq;
