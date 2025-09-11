"use client";
import React, { useEffect, useState } from "react";
import { setBlogPostsData } from "@/store/slices/blogDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Breadcrumb from "@/components/Breadcrumb";

interface Props {
  post: any;
}

const FutureOfAi: React.FC<Props> = ({ post }) => {
  const dispatch = useDispatch();
  const cachedData = useSelector(
    (state: RootState) => state.blogDetail.blogPosts
  );

  // Store post data in Redux when it comes from props
  useEffect(() => {
    if (post) {
      dispatch(setBlogPostsData(post));
    }
  }, [post, dispatch]);

  // Use cached data from Redux if available, otherwise use post from props
  const postData = cachedData;

  const [headings, setHeadings] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = postData?.blogDetail?.blogDetailContent || "";

      const h2Tags = tempDiv.querySelectorAll("h2");
      const h2Texts = Array.from(h2Tags).map(
        (tag) => tag.textContent?.trim() || ""
      );

      setHeadings(h2Texts);
    }
  }, [postData]);

  // FAQ functionality
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
        
        // Close all other FAQ items
        faqItems.forEach((faq) => {
          const c = faq.querySelector(".faq-content") as HTMLElement | null;
          const i = faq.querySelector(".faq-icon svg") as HTMLElement | null;
          const w = faq.closest(".faq-wrapper");
          if (c) c.style.maxHeight = "";
          if (i) i.style.transform = "rotate(0deg)";
          faq.classList.remove("active", "bg-[#2B2B2B]");
          w?.classList.remove("is-active");
        });
        
        // Toggle current FAQ item
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
  }, [postData]);

  const scrollToHeading = (headingText: string) => {
    const blogContent = document.querySelector(".blog-content");
    if (!blogContent) return;
    const h2Elements = blogContent.querySelectorAll("h2");
    const targetHeading = Array.from(h2Elements).find(
      (element) => element.textContent?.trim() === headingText
    );
    if (targetHeading) {
      const headerOffset = 120;
      const elementPosition =
        targetHeading.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
  };
  return (
    <section className="pt-[90px] xl:pt-[90px] 2xl:pt-[90px]">
      <div className="w-full">
        <div className="flex flex-col 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[30px]">
          <div className="flex items-start 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[30px] flex-col">
            <div className="blog-img w-full rounded-[24px] overflow-hidden relative">
              
              <img
                src={postData?.featuredImage?.node?.sourceUrl}
                alt={postData?.featuredImage?.node?.altText}
                width="670"
                height="400"
                className="w-full"
              />
            </div>
            <div className="container max-w-[1400px] px-[20px] mx-auto">
            {/* Breadcrumb Navigation */}
            <div className="mb-8">
              <Breadcrumb 
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Blog', href: '/blog' },
                  { label: postData?.title || 'Blog Post', isActive: true }
                ]}
                variant="contrast"
              />
            </div>
            
            <div className="flex flex-col items-start w-full">
              <h1 className="font-denton font-bold 2xl:text-[80px] xl:text-[80px] lg:text-[70px] md:text-[60px] sm:text-[50px] text-[40px] 2xl:leading-[106px] xl:leading-[106px] lg:leading-[90px] md:leading-[70px] sm:leading-[60px] leading-[50px] text-white mb-[16px]">
                {postData?.title}
              </h1>
              <div className="flex flex-row flex-wrap justify-between gap-[10px] mb-[32px] w-full items-start">
              <div className="flex flex-row flex-wrap gap-x-[14px] gap-y-[5px]">
                  {/* Categories */}
                  
                  {postData?.terms?.nodes
                    ?.filter((term: any) => term?.taxonomyName === 'category')
                    ?.map((term: any) => (
                      <div
                        key={term?.slug}
                        className="blog-gr flex items-center justify-center bg-[#E72125]/30 rounded-[84px] py-[8px] px-[13px] relative"
                      >
                        <span className="text-center text-white font-denton font-normal text-[16px] leading-[17px]">
                          {term.name}
                        </span>
                      </div>
                    ))}
                  
                  {/* Tags */}
                  <div className="w-full"></div>
                  {postData?.terms?.nodes
                    ?.filter((term: any) => term?.taxonomyName === 'post_tag')
                    ?.map((term: any) => (
                      <div
                        key={term?.slug}
                        
                      >
                        <span className="text-white text-[20px] leading-[22px] opacity-70">
                          #{term.name}
                        </span>
                      </div>
                    ))}
                </div>
                <span className="flex items-center gap-[8px] text-[16px] font-lato font-normal leading-[100%] text-[#E9E9E9]">
                  <img
                    src={postData?.blogDetail?.dateSvg?.node?.sourceUrl}
                    alt={postData?.blogDetail?.dateSvg?.node?.altText}
                  />
                  {formatDate(postData?.date)}
                </span>
              </div>
              <p className="font-lato font-normal 2xl:text-[25px] xl:text-[25px] lg:text-[20px] md:text-[20px] sm:text-[20px] text-[18px] 2xl:leading-[40px] xl:leading-[40px] lg:leading-[30px] md:leading-[30px] sm:leading-[30px] leading-[30px] text-white">
                {postData?.blogDetail?.blogDetailShotDesc}
              </p>
            </div>
            </div>
          </div>
          <div className="container max-w-[1400px] px-[20px] mx-auto">
          <div className="flex 2xl:flex-row xl:flex-row lg:flex-col md:flex-col sm:flex-col flex-col 2xl:gap-[40px] xl:gap-[40px] lg:gap-[30px] md:gap-[30px] sm:gap-[20px] gap-[20px] justify-between items-start">
            <div className="flex flex-col items-start 2xl:gap-[30px] xl:gap-[30px] lg:gap-[20px] md:gap-[20px] sm:gap-[20px] gap-[20px] 2xl:max-w-[970px] xl:max-w-[800px] lg:max-w-full md:max-w-full sm:max-w-full max-w-full blog-content">
              <div
                dangerouslySetInnerHTML={{
                  __html: postData?.blogDetail?.blogDetailContent || "",
                }}
              />
            </div>
            <div className="bg-white/10 rounded-[0] 2xl:py-[20px] xl:py-[20px] lg:py-[20px] sm:py-[20px] py-[20px] px-[26px] 2xl:max-w-[330px] xl:max-w-[500px] lg:max-w-full md:max-w-full sm:max-w-full max-w-full 2xl:sticky xl:sticky lg:static md:static sm:static static 2xl:top-[120px] xl:top-[120px] lg:top-0 md:top-0 sm:top-0 top-0 max-h-[calc(100vh-130px)] overflow-y-auto custom-scrollbar max-xl:hidden">
              <div className="flex flex-col gap-[24px] items-start justify-start">
                <h4 className="font-denton font-bold text-[24px] leading-[100%] text-white text-left ">
                  {postData?.blogDetail?.tableOfContent}
                </h4>
                <ul className="flex flex-col gap-[14px]">
                  {headings.map((heading, index) => (
                    <li key={index} className="flex items-start gap-[10px]">
                      <img
                        src="/images/service-page/bullet.svg"
                        width="10"
                        height="10"
                      />
                      <button
                        onClick={() => scrollToHeading(heading)}
                        className="font-lato font-normal 2xl:text-[20px] xl:text-[20px] lg:text-[20px] md:text-[20px] sm:text-[18px] text-[18px] leading-[36px] text-white mt-[-13px] text-left hover:text-[#E72125] transition-colors duration-300 cursor-pointer"
                      >
                        {heading}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
            {/* faq section */}
            {postData?.flexibleContent?.flexibleContent?.find((item: any) => item?.faqTitle) && (
              <div className="faq-section faq 2xl:mt-[60px] xl:mt-[60px] lg:mt-[50px] md:mt-[40px] sm:mt-[30px] mt-[30px]">
                <div className="faq-wrap flex flex-col justify-center items-center 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[30px] rounded-[12px]">
                  <h2 className="font-denton font-bold 2xl:text-[60px] xl:text-[60px] lg:text-[50px] md:text-[40px] sm:text-[35px] text-[30px] 2xl:leading-[80px] xl:leading-[80px] lg:leading-[60px] md:leading-[50px] sm:leading-[45px] leading-[40px] text-white text-center">
                    {postData?.flexibleContent?.flexibleContent?.find((item: any) => item?.faqTitle)?.faqTitle || "FAQ"}
                  </h2>
                  <div className="faq-wrap flex flex-col gap-[20px] w-full max-w-[1217px]">
                    {postData?.flexibleContent?.flexibleContent?.find((item: any) => item?.faqTitle)?.faqData?.nodes?.map((faq: any, idx: number) => (
                      <div
                        key={idx}
                        className="faq-wrapper rounded-[12px] border border-[#2F2F2F] transition-all duration-300 group relative hover:border-transparent"
              >
                <span className="absolute top-[-1px] left-[-1px] right-[-1px] bottom-[-1px] inset-0 bg-gradient-to-b from-[#54A3DA] to-[#E72125] rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-[0]"></span>
  
                <div
                  className="group-hover:bg-[#2B2B2B] relative z-[1] faq-item py-[24px] 2xl:px-[30px] xl:px-[30px] lg:px-[25px] md:px-[25px] sm:px-[25px] px-[20px] overflow-hidden rounded-[12px] flex flex-col items-start transition-all duration-[400ms] bg-black cursor-pointer"
                          style={{ borderImageSlice: 1 }}
                        >
                          <div className="faq-head flex justify-between items-center w-full cursor-pointer gap-[5px]">
                            <h4 className="font-denton text-white font-bold 2xl:text-[22px] xl:text-[22px] lg:text-[20px] md:text-[20px] sm:text-[18px] text-[18px] 2xl:leading-[34px] xl:leading-[34px] lg:leading-[30px] md:leading-[30px] sm:leading-[25px] leading-[25px]">
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
                          <div className="faq-content transition-all duration-300 ease-in-out overflow-hidden max-h-0">
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
              
            )}
            </div>
        </div>
      </div>
    </section>
  );
};

export default FutureOfAi;
