"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_BLOG_POSTS, GET_BLOG_ICONS } from "@/lib/queries";
import { TechTalksSkeleton } from "@/components/skeletons";
import { setBlogPostsData, setBlogIconsData } from "@/store/slices/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

const TechTalks = () => {
  const dispatch = useDispatch();
  const [featuredPost, setFeaturedPost] = useState<any>(null); // Separate state for featured post
  const cachedIconsData = useSelector(
    (state: RootState) => state.blog.blogIcons
  );

  const { data: postsData, error: postsError, loading: postsLoading } = useQuery(GET_BLOG_POSTS, {
    variables: {
      perPage: 1,
      after: null,
    },
  });
  const { data: iconsData, error: iconsError, loading: iconsLoading } = useQuery(GET_BLOG_ICONS);

  const finalPostsData = postsData;
  const finalIconsData = cachedIconsData || iconsData;

  useEffect(() => {
    if (postsData) {
      dispatch(setBlogPostsData(postsData));
    }
  }, [postsData, dispatch]);

  useEffect(() => {
    if (iconsData) {
      dispatch(setBlogIconsData(iconsData));
    }
  }, [iconsData, dispatch]);

  useEffect(() => {
    if (finalPostsData?.posts?.nodes?.[0] && !featuredPost) {
      setFeaturedPost(finalPostsData.posts.nodes[0]);
    }
  }, [finalPostsData, featuredPost]);

  // Show loading skeleton if data is loading and no cached data is available
  if ((postsLoading || iconsLoading) && !cachedIconsData && !featuredPost) {
    return <TechTalksSkeleton />;
  }

  if (postsError || iconsError)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="font-denton text-[24px] font-bold text-white mb-[16px]">
            Error loading tech talks
          </h3>
          <p className="text-[#C3C3C3]">Please try again later.</p>
        </div>
      </div>
    );

  const blogIcons = finalIconsData?.page?.blogSettings?.techTalks;

  // Don't show section if no data
  if (!featuredPost || !blogIcons || !blogIcons.title || !blogIcons.description)
    return null;

  // Format date for display
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

  // Get categories array
  const getCategories = (post: any) => {
    const categories = post?.categories?.nodes || [];
    return categories;
  };

  // Get featured image URL with fallback
  const getFeaturedImageUrl = (post: any) => {
    return post?.featuredImage?.node?.sourceUrl;
  };

  return (
    <section className="lg:pt-[120px] md:pt-[100px] pt-[60px]">
      <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
        {/* <div className="flex flex-col items-center justify-center gap-[16px] 2xl:mb-[60px] xl:mb-[60px] lg:mb-[50px] md:mb-[40px] sm:mb-[30px] mb-[30px]">
          <h2 className="h2 text-white text-center">{blogIcons?.title}</h2>
          <p className="font-lato font-normal text-[17px] leading-[26px] text-[#C3C3C3] text-center max-w-[1000px]">
            {blogIcons?.description}
          </p>
        </div> */}
        <div className="blog-img bg-[#2E0707] border border-[10px] md:border-[20px] rounded-[30px] border-[#2E0707]">
          <div
            className="relative bg-cover h-[400px] md:h-[746px] px-[20px] pt-[20px] pb-[30px] sm:px-[30px] sm:pt-[30px] sm:pb-[60px] flex items-end rounded-[20px] overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
            style={{
              backgroundImage: `url(${getFeaturedImageUrl(featuredPost)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() =>
              (window.location.href = `/blog/${featuredPost.slug}`)
            }
          >
            <div className="shadow"></div>

            <div className="absolute top-[15px] right-[15px] md:top-[30px] md:right-[30px]">
              <img
                src={blogIcons?.newIcon?.node?.sourceUrl}
                alt={blogIcons?.newIcon?.node?.altText}
                width="108"
                height="108"
                className="2xl:w-[108px] xl:w-[108px] lg:w-[100px] md:w-[100px] sm:w-[80px] w-[60px]"
              />
            </div>
            <div className="w-full">
              <div className="flex flex-col gap-[23px] relative z-10">
                <div className="flex flex-col gap-[10px]">
                  <div className="flex justify-between items-center w-full flex-row flex-wrap gap-[10px]">
                    <div className="flex flex-row flex-wrap gap-[10px]">
                      {getCategories(featuredPost).map(
                        (category: any, index: number) => (
                          <div
                            key={category.slug || index}
                            className="blog-gr flex items-center justify-center bg-[#E7212599] rounded-[84px] py-[10px] sm:px-[24px] px-[16px] relative"
                          >
                            <span className="text-center text-white font-denton font-normal md:text-[16px] text-[14px] md:leading-[21px] leading-[100%]">
                              {category.name}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                    <div className="blog-gr flex items-center justify-center bg-[#E7212599] rounded-[84px] py-[10px] px-[24px] flex items-center justify-center gap-[10px] relative">
                      {blogIcons?.dateIcon?.node?.sourceUrl && (
                        <img
                          src={blogIcons.dateIcon.node.sourceUrl}
                          alt={blogIcons.dateIcon.node.altText}
                          width="18"
                          height="18"
                          className="md:w-[18px] md:h-[18px] w-[14px] h-[14px]"
                        />
                      )}
                      <span className="text-center text-white font-denton font-normal md:text-[16px] text-[14px] md:leading-[21px] leading-[100%]">
                        {formatDate(featuredPost?.date)}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`/blog/${featuredPost.slug}`}
                    className="block hover:text-[#E72125] transition-colors"
                  >
                    <h2 className="font-denton font-bold 2xl:text-[34px] xl:text-[34px] lg:text-[30px] md:text-[24px] text:text-[20px] text-[20px] 2xl:leading-[45px] xl:leading-[45px] lg:leading-[40px] md:leading-[30px] sm:leading-[25px] leading-[25px] text-white text-left">
                      {featuredPost?.title}
                    </h2>
                  </a>
                  <div className="flex items-center 2xl:gap-[60px] xl:gap-[60px] lg:gap-[40px] md:gap-[30px] sm:gap-[20px] gap-[10px] flex-row flex-wrap">
                    {/* <div className="flex gap-[8px] items-center">
                      {blogIcons?.viewIcon?.node?.sourceUrl && (
                        <img
                          src={blogIcons.viewIcon.node.sourceUrl}
                          alt={blogIcons.viewIcon.node.altText}
                          width="18"
                          height="18"
                        />
                      )}
                      <span className="font-lato text-[16px] text-[#E9E9E9] font-normal leading-[100%]">
                        1,020 View
                      </span>
                    </div>
                    <div className="flex gap-[8px] items-center">
                      {blogIcons?.commentIcon?.node?.sourceUrl && (
                        <img
                          src={blogIcons.commentIcon.node.sourceUrl}
                          alt={blogIcons.commentIcon.node.altText}
                          width="18"
                          height="18"
                        />
                      )}
                      <span className="font-lato text-[16px] text-[#E9E9E9] font-normal leading-[100%]">
                        {featuredPost?.commentCount || 0} Comments
                      </span>
                    </div> */}
                  </div>
                  <a
                    href={`/blog/${featuredPost.slug}`}
                    className="flex items-center gap-[10px] text-white font-denton font-bold md:text-[18px] text-[14px] leading-[100%] hover:text-[#E72125] transition-opacity w-max"
                  >
                    {blogIcons?.readMore}
                    {blogIcons?.readMoreIcon?.node?.sourceUrl && (
                      <img
                        src={blogIcons.readMoreIcon.node.sourceUrl}
                        alt={blogIcons.readMoreIcon.node.altText}
                        width="15"
                        height="20"
                        className="md:w-[15px] md:h-[20px] w-[10px] h-[15px]"
                      />
                    )}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechTalks;
