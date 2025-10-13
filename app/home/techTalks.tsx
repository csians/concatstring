"use client";

import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_BLOG_POSTS, GET_BLOG_ICONS } from "@/lib/queries";
import { setTechTalksData } from "@/store/slices/homeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";

const TechTalks = () => {
  const dispatch = useDispatch();
  const cachedData = useSelector((state: RootState) => state.home.techTalks);

  const { data: postsData } = useQuery(GET_BLOG_POSTS, {
    variables: {
      perPage: 3, // Get the latest 3 posts
      after: null,
    },
  });

  const { data: iconsData } = useQuery(GET_BLOG_ICONS);

  useEffect(() => {
    if (postsData && iconsData) {
      const techTalksData = {
        posts: postsData?.posts?.nodes || [],
        icons: iconsData?.page?.blogSettings?.techTalks,
      };
      dispatch(setTechTalksData(techTalksData));
    }
  }, [postsData, iconsData, dispatch]);

  // Use cached data from Redux if available, otherwise use fresh data from query
  const finalPostsData = cachedData?.posts || postsData?.posts?.nodes || [];
  const finalIconsData =
    cachedData?.icons || iconsData?.page?.blogSettings?.techTalks;

  const posts = finalPostsData;
  const blogIcons = finalIconsData;
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
    console.log(post?.featuredImage?.node)
    return post?.featuredImage?.node?.sourceUrl;
  };

  // Strip HTML tags from content
  const stripHtml = (html: string) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (!posts || posts.length === 0 || !blogIcons || !blogIcons?.title)
    return null;
  return (
    <section className="tech-talk">
      <div className="container max-[1400px] mx-auto px-[20px]">
        <div className="flex flex-col items-center justify-center 2xl:gap-[60px] xl:gap-[50px] lg:gap-[40px] md:gap-[30px] sm:gap-[20px] gap-[20px]">
          <h2 className="h2 text-white text-center">{blogIcons?.title}</h2>

          <div className="grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-[30px] mb-[0px]">
            {posts &&
              posts.length > 0 &&
              posts.map((post: any, index: number) => (
                <div
                  key={post.id || index}
                  className="bg-[#FFFF]/10 2xl:pt-[24px] xl:pt-[24px] lg:pt-[24px] md:pt-[20px] sm:pt-[20px] pt-[15px] 2xl:px-[24px] xl:px-[24px] lg:px-[24px] md:px-[20px] sm:px-[20px] px-[15px] 2xl:pb-[30px] xl:pb-[30px] lg:pb-[24px] md:pb-[20px] sm:pb-[20px] pb-[15px] backdrop-blur-sm 2xl:rounded-[16px] xl:rounded-[16px] lg:rounded-[16px] md:rounded-[15px] sm:rounded-[10px] rounded-[10px]"
                >
                  <div className="flex flex-col justify-between gap-[32px] h-full">
                    <div className="flex flex-col flex-grow height-full">
                      <Link href={`/blog/${post.slug}`} className="block hover:opacity-80 transition-opacity">
                        <img
                          src={getFeaturedImageUrl(post)}
                          width={399}
                          height={270}
                          className="2xl:rounded-[16px] xl:rounded-[16px] lg:rounded-[16px] md:rounded-[15px] sm:rounded-[10px] rounded-[10px] mb-[16px] w-full h-[270px] object-fit object-cover"
                          alt={post?.title}
                          loading="lazy"
                          decoding="async"
                        />
                      </Link>
                      <div className="flex flex-row flex-wrap justify-between gap-[10px] mb-[20px] items-start">
                        <div className="flex flex-row flex-wrap gap-[14px] max-w-[calc(100%-130px)]">
                          {getCategories &&
                            getCategories(post).slice(0, 2).map(
                              (category: any, catIndex: number) => (
                                <div
                                  key={category.slug || catIndex}
                                  className="blog-gr flex items-center justify-center bg-[#E7212599] rounded-[84px] py-[5px] leading-[100%] md:leading-[21px] px-[13px] relative"
                                >
                                  <span className="text-center text-white font-denton font-normal text-[16px] leading-[100%]">
                                    {category.name.split(' ')[0]}
                                  </span>
                                </div>
                              )
                            )}
                        </div>
                        <span className="flex items-center gap-[8px] text-[16px] font-lato font-normal leading-[100%] text-[#E9E9E9] mt-[6px]">
                          {blogIcons?.dateIcon?.node?.sourceUrl && (
                            <img
                              src={blogIcons.dateIcon.node.sourceUrl}
                              alt={blogIcons.dateIcon.node.altText}
                              width={18}
                              height={18}
                              loading="lazy"
                              decoding="async"
                            />
                          )}
                          {formatDate && formatDate(post?.date)}
                        </span>
                      </div>
                      {post?.title && (
                        <Link href={`/blog/${post.slug}`} className="block hover:text-[#E72125] transition-colors">
                          <h3 className="font-denton text-[24px] font-bold leading-[32px] text-white mb-[6px]">
                            {post?.title}
                          </h3>
                        </Link>
                      )}
                      {(post?.blogDetail?.blogDetailShotDesc) && (
                        <p className="font-lato text-[17px] font-normal leading-[26px] text-[#C3C3C3] line-clamp-3">
                          {stripHtml(post?.blogDetail?.blogDetailShotDesc || '')}
                        </p>
                      )}
                    </div>
                    {blogIcons?.readMore && (
                      <Link
                        href={`/blog/${post?.slug}`}
                        className="flex items-center gap-[10px] text-white font-denton font-bold text-[18px] leading-[100%] hover:text-[#E72125] w-max"
                      >
                        {blogIcons?.readMore}
                        {blogIcons?.readMoreIcon?.node?.sourceUrl && (
                          <img
                            src={blogIcons.readMoreIcon.node.sourceUrl}
                            alt={blogIcons.readMoreIcon.node.altText}
                            width={15}
                            height={20}
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
          </div>
          {/*
           */}
          {posts[0]?.blogDetail?.viewAllBlog?.title && (
            <Link href={posts[0]?.blogDetail?.viewAllBlog?.url} className="group">
              <div className="btn-primary-outline">
                <div className="btn-primary">
                  {posts[0]?.blogDetail?.viewAllBlog?.title}
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default TechTalks;
