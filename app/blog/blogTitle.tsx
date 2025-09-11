"use client";

import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_BLOG_SETTINGS } from "@/lib/queries";
import { BlogTitleSkeleton } from "@/components/skeletons";
import { setBlogSettingsData } from "@/store/slices/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Breadcrumb from "@/components/Breadcrumb";

const BlogTitle = () => {
  const dispatch = useDispatch();
  const cachedData = useSelector((state: RootState) => state.blog.blogSettings);
  const { data, error, loading } = useQuery(GET_BLOG_SETTINGS);

  // Use cached data from Redux if available, otherwise use fresh data from query
  const blogData = cachedData || data;

  // Store data in Redux when it comes from query
  useEffect(() => {
    if (data) {
      dispatch(setBlogSettingsData(data));
    }
  }, [data, dispatch]);

  // Show loading skeleton if data is loading and no cached data is available
  if (loading && !cachedData) {
    return <BlogTitleSkeleton />;
  }

  // Show error message if there's an error
  if (error)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="font-denton text-[24px] font-bold text-white mb-[16px]">
            Error loading blog title
          </h3>
          <p className="text-[#C3C3C3]">Please try again later.</p>
        </div>
      </div>
    );

  const heroSection = blogData?.page?.blogSettings?.heroSection;
  const techTalks = blogData?.page?.blogSettings?.techTalks;
  const backgroundImage = heroSection?.image?.node?.sourceUrl;

  // Don't show section if no data
  if (!heroSection) return null;

  return (
    <section
      className="hero-section bg-cover 2xl:pt-[240px] xl:pt-[200px] lg:pt-[200px] md:pt-[200px] sm:pt-[180px] pt-[160px] 2xl:pb-[280px] xl:pb-[250px] lg:pb-[250px] md:pb-[200px] sm:pb-[180px] pb-[180px] bg-no-repeat bg-bottom-left"
      style={{
        backgroundImage: backgroundImage && `url(${backgroundImage})`,
      }}
    >
      <div className="container max-w-[1440px] px-[20px] mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', isActive: true }
            ]}
            variant="contrast"
          />
        </div>
        
        <div className="flex justify-between items-center">
          {/* <h1 className="h1 text-white max-w-[662px] leading-[100%]">
            {title}
          </h1> */}
          <div className="flex flex-col items-start justify-center gap-[0] 2xl:mb-[60px] xl:mb-[60px] lg:mb-[50px] md:mb-[40px] sm:mb-[30px] mb-[30px]">
          <h2 className="h2 text-white max-w-[662px] leading-[100%] mb-10">{techTalks?.title}</h2>
          <p className="font-lato font-medium text-[17px] leading-[26px] text-[#ffffff] text-left max-w-[1000px] max-w-[662px]">
            {techTalks?.description}
          </p>
        </div>
        </div>
      </div>
    </section>
  );
};

export default BlogTitle;