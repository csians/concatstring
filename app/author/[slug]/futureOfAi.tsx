"use client";
import React, { useRef, useMemo, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/css/author-details.css";
import { useQuery } from "@apollo/client";
import { GET_BLOG_ICONS, GET_AUTHORS } from "@/lib/queries";
import { AuthorBlogPostsSkeleton } from "@/components/skeletons";
import { setAuthorsData, setBlogIconsData } from "@/store/slices/authorSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

interface Props {
  userId: any;
}

const FutureOfAi: React.FC<Props> = ({ userId }) => {
  const dispatch = useDispatch();
  const cachedAuthorsData = useSelector(
    (state: RootState) => state.author.authors
  );
  const cachedBlogIconsData = useSelector(
    (state: RootState) => state.author.blogIcons
  );

  const { data: iconsData, loading: iconsLoading } = useQuery(GET_BLOG_ICONS);
  const { data: authorsData, error: authorsError, loading: authorsLoading } = useQuery(GET_AUTHORS);

  // Use cached data from Redux if available, otherwise use fresh data from query
  const finalIconsData = cachedBlogIconsData || iconsData;
  const finalAuthorsData = cachedAuthorsData || authorsData;

  // Store data in Redux when it comes from query
  useEffect(() => {
    if (iconsData) {
      dispatch(setBlogIconsData(iconsData));
    }
  }, [iconsData, dispatch]);

  useEffect(() => {
    if (authorsData) {
      dispatch(setAuthorsData(authorsData));
    }
  }, [authorsData, dispatch]);

  const sliderRef = useRef<Slider>(null);
  const blogIcons = finalIconsData?.page?.blogSettings?.techTalks;
  const filteredPosts = useMemo(() => {
    if (!finalAuthorsData?.users?.nodes || !userId) return [];

    const author = finalAuthorsData.users.nodes.find(
      (user: any) => user.id === userId
    );
    if (!author || !author.posts?.nodes) return [];

    const posts = author.posts.nodes;
    const uniquePosts = posts.filter(
      (post: any, index: number, self: any[]) =>
        index === self.findIndex((p: any) => p.id === post.id)
    );
    return uniquePosts;
  }, [finalAuthorsData, userId]);

  // Get the author data for dynamic title
  const author = useMemo(() => {
    if (!finalAuthorsData?.users?.nodes || !userId) return null;
    return finalAuthorsData.users.nodes.find((user: any) => user.id === userId);
  }, [finalAuthorsData, userId]);

  const blogTitle = author?.userProfileImage?.blogTitle;

  const settings = {
    slidesToShow: 1,
    infinite: finalAuthorsData?.users?.nodes?.length > 3,
    autoplay: true,
    dots: true,
    arrows: false,
  };

  const goToPrev = () => {
    sliderRef.current?.slickPrev();
  };

  const goToNext = () => {
    sliderRef.current?.slickNext();
  };

  // Show error message if there's an error
  if (authorsError) {
    return (
      <section className="mb-[100px]">
        <div className="container max-w-[1600px] px-[20px] mx-auto w-full">
          <div className="bg-white/10 2xl:p-[100px] xl:p-[100px] lg:p-[80px] md:p-[60px] sm:p-[40px] p-[30px] rounded-[16px]">
            <div className="text-center">
              <h3 className="font-denton text-[24px] font-bold text-white mb-[16px]">
                Error loading blog posts
              </h3>
              <p className="text-[#C3C3C3]">Please try again later.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show loading state if data is loading and no cached data is available
  if ((authorsLoading || iconsLoading) && !cachedAuthorsData && !cachedBlogIconsData) {
    return (
      <section className="mb-[100px]">
        <div className="container max-w-[1600px] px-[20px] mx-auto w-full">
          <div className="bg-white/10 2xl:p-[100px] xl:p-[100px] lg:p-[80px] md:p-[60px] sm:p-[40px] p-[30px] rounded-[16px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E72125] mx-auto mb-4"></div>
              <p className="text-[#C3C3C3]">Loading blog posts...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (!finalAuthorsData || !author) return null;
  return (
    <section className="mb-[100px]">
      <div className="container max-w-[1600px] px-[20px] mx-auto w-full">
        <div className="bg-white/10 2xl:p-[100px] xl:p-[100px] lg:p-[80px] md:p-[60px] sm:p-[40px] p-[30px] rounded-[16px]">
          <h3 className="font-denton font-bold 2xl:text-[66px] xl:text-[66px] lg:text-[50px] md:text-[40px] sm:text-[40px] text-[30px] 2xl:leading-[87px] lg:leading-[87px] md:leading-[50px] sm:leading-[50px] leading-[40px] text-white text-center 2xl:mb-[60px] xl:mb-[60px] lg:mb-[40px] md:mb-[30px] sm:mb-[20px] mb-[20px]">
            {blogTitle}
          </h3>

          {filteredPosts && filteredPosts.length > 0 ? (
            <>
              {filteredPosts.length <= 6 ? (
                <div className="flex flex-wrap justify-center items-stretch gap-[30px] mb-[30px]">
                  {filteredPosts.map((post: any, index: number) => (
                    <div
                      key={`${post.id}-${index}`}
                      className="bg-[#FFFF]/10 2xl:w-[calc(33.333333%-20px)] xl:w-[calc(33.333333%-20px)] lg:w-[calc(33.333333%-20px)] md:w-[calc(50%-15px)] sm:w-full w-full px-[20px] pt-[20px] pb-[26px] backdrop-blur-sm 2xl:rounded-[16px] xl:rounded-[16px] lg:rounded-[16px] md:rounded-[15px] sm:rounded-[10px] rounded-[10px]"
                    >
                      <div className="flex flex-col justify-between gap-[32px] h-full">
                        <div className="flex flex-col flex-grow height-full">
                          <a href={`/blog/${post.slug}`} className="block hover:opacity-80 transition-opacity">
                            <img
                              src={post.featuredImage?.node?.sourceUrl}
                              alt={post.featuredImage?.node?.altText}
                              width="399"
                              height="270"
                              className="2xl:rounded-[16px] xl:rounded-[16px] lg:rounded-[16px] md:rounded-[15px] sm:rounded-[10px] rounded-[10px] mb-[18px] w-full object-cover"
                            />
                          </a>
                          <a href={`/blog/${post.slug}`} className="block hover:text-[#E72125] transition-colors">
                            <h3 className="font-denton text-[24px] font-bold leading-[32px] text-white mb-[6px]">
                              {post.title}
                            </h3>
                          </a>

                          <div className="flex items-center justify-between gap-[10px] w-full mb-[30px]">
                            {/* <div className="flex gap-[8px] items-center">
                              {blogIcons?.viewIcon?.node?.sourceUrl && (
                                <img
                                  src={blogIcons.viewIcon.node.sourceUrl}
                                  alt={blogIcons.viewIcon.node.altText}
                                  width="18"
                                  height="18"
                                  className="w-[18px] h-[18px]"
                                />
                              )}
                              <span className="font-lato text-[16px] text-[#E9E9E9] font-normal leading-[100%]">
                                {post.viewsCount || 0} Views
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
                                {post.commentCount || 0} Comments
                              </span>
                            </div> */}
                          </div>

                          <a
                            href={`/blog/${post.slug}`}
                            className="flex items-center gap-[10px] text-white font-denton font-bold text-[18px] leading-[100%] mt-auto hover:text-[#E72125] transition-opacity w-max"
                          >
                            {blogIcons?.readMore}
                            {blogIcons?.readMoreIcon?.node?.sourceUrl && (
                              <img
                                src={blogIcons.readMoreIcon.node.sourceUrl}
                                alt={blogIcons.readMoreIcon.node.altText}
                                width="15"
                                height="20"
                                className="w-[15px] h-[20px]"
                              />
                            )}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="blog-slider !mb-0">
                  <Slider ref={sliderRef} {...settings}>
                    {Array.from(
                      { length: Math.ceil(filteredPosts.length / 6) },
                      (_, slideIndex) => (
                        <div key={slideIndex} className="blog-slide-wrap">
                          <div className="grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-[30px] mb-[30px]">
                            {filteredPosts
                              .slice(slideIndex * 6, slideIndex * 6 + 6)
                              .map((post: any, index: number) => (
                                <div
                                  key={`${post.id}-${slideIndex}-${index}`}
                                  className="bg-[#FFFF]/10 px-[20px] pt-[20px] pb-[26px] backdrop-blur-sm 2xl:rounded-[16px] xl:rounded-[16px] lg:rounded-[16px] md:rounded-[15px] sm:rounded-[10px] rounded-[10px] hover:bg-[#2E0707]"
                                >
                                  <div className="flex flex-col justify-between gap-[32px] h-full">
                                    <div className="flex flex-col flex-grow height-full">
                                      <a href={`/blog/${post.slug}`} className="block hover:opacity-80 transition-opacity">
                                        <img
                                          src={
                                            post.featuredImage?.node?.sourceUrl
                                          }
                                          alt={post.featuredImage?.node?.altText}
                                          width="399"
                                          height="270"
                                          className="2xl:rounded-[16px] xl:rounded-[16px] lg:rounded-[16px] md:rounded-[15px] sm:rounded-[10px] rounded-[10px] mb-[18px] w-full object-cover"
                                        />
                                      </a>
                                      <a href={`/blog/${post.slug}`} className="block hover:text-[#E72125] transition-colors">
                                        <h3 className="font-denton text-[24px] font-bold leading-[32px] text-white mb-[6px]">
                                          {post.title}
                                        </h3>
                                      </a>

                                      <div className="flex items-center justify-between gap-[10px] w-full mb-[30px]">
                                        {/* <div className="flex gap-[8px] items-center">
                                          {blogIcons?.viewIcon?.node
                                            ?.sourceUrl && (
                                              <img
                                                src={
                                                  blogIcons.viewIcon.node
                                                    .sourceUrl
                                                }
                                                alt={
                                                  blogIcons.viewIcon.node.altText
                                                }
                                                width="18"
                                                height="18"
                                                className="w-[18px] h-[18px]"
                                              />
                                            )}
                                          <span className="font-lato text-[16px] text-[#E9E9E9] font-normal leading-[100%]">
                                            {post.viewsCount || 0} Views
                                          </span>
                                        </div>
                                        <div className="flex gap-[8px] items-center">
                                          {blogIcons?.commentIcon?.node
                                            ?.sourceUrl && (
                                              <img
                                                src={
                                                  blogIcons.commentIcon.node
                                                    .sourceUrl
                                                }
                                                alt={
                                                  blogIcons.commentIcon.node
                                                    .altText
                                                }
                                                width="18"
                                                height="18"
                                              />
                                            )}
                                          <span className="font-lato text-[16px] text-[#E9E9E9] font-normal leading-[100%]">
                                            {post.commentCount || 0} Comments
                                          </span>
                                        </div> */}
                                      </div>

                                      <a
                                        href={`/blog/${post.slug}`}
                                        className="flex items-center gap-[10px] text-white font-denton font-bold text-[18px] leading-[100%] mt-auto"
                                      >
                                        {blogIcons?.readMore}
                                        {blogIcons?.readMoreIcon?.node
                                          ?.sourceUrl && (
                                            <img
                                              src={
                                                blogIcons.readMoreIcon.node
                                                  .sourceUrl
                                              }
                                              alt={
                                                blogIcons.readMoreIcon.node
                                                  .altText
                                              }
                                              width="15"
                                              height="20"
                                              className="w-[15px] h-[20px]"
                                            />
                                          )}
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )
                    )}
                  </Slider>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-[60px]">
              <p className="text-white text-[18px] font-lato">
                {filteredPosts === undefined
                  ? "Loading..."
                  : "No blog posts found for this author."}
              </p>
            </div>
          )}
          {filteredPosts && filteredPosts.length > 6 && (
            <div className="flex justify-end items-end gap-[12px]">
              <button className="custom-prev" onClick={goToPrev}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="107"
                  height="52"
                  viewBox="0 0 107 52"
                  fill="none"
                >
                  <path
                    d="M0 26C0 11.6406 11.6406 0 26 0H81C95.3594 0 107 11.6406 107 26C107 40.3594 95.3594 52 81 52H26C11.6406 52 0 40.3594 0 26Z"
                    fill="#232323"
                  />
                  <path
                    d="M26 0.5H81C95.0833 0.5 106.5 11.9167 106.5 26C106.5 40.0833 95.0833 51.5 81 51.5H26C11.9167 51.5 0.5 40.0833 0.5 26C0.5 11.9167 11.9167 0.5 26 0.5Z"
                    stroke="white"
                    strokeOpacity="0.5"
                  />
                  <path
                    d="M40.3593 25.1009L48.9503 16.3509C49.1818 16.1232 49.4918 15.9972 49.8136 16C50.1354 16.0029 50.4432 16.1344 50.6708 16.3661C50.8983 16.5979 51.0274 16.9114 51.0302 17.2391C51.033 17.5669 50.9093 17.8826 50.6857 18.1184L44.1897 24.7346H65.7727C66.0982 24.7346 66.4104 24.8663 66.6405 25.1008C66.8707 25.3352 67 25.6531 67 25.9846C67 26.3162 66.8707 26.6341 66.6405 26.8685C66.4104 27.1029 66.0982 27.2346 65.7727 27.2346H44.1897L50.6857 33.8509C50.8029 33.9662 50.8964 34.1041 50.9607 34.2566C51.0251 34.4091 51.0589 34.5732 51.0603 34.7391C51.0618 34.9051 51.0307 35.0697 50.969 35.2233C50.9073 35.377 50.8162 35.5165 50.7009 35.6339C50.5857 35.7512 50.4487 35.8441 50.2978 35.9069C50.147 35.9698 49.9854 36.0014 49.8224 36C49.6595 35.9985 49.4984 35.964 49.3487 35.8985C49.199 35.833 49.0635 35.7378 48.9503 35.6184L40.3593 26.8684C40.1292 26.634 40 26.3161 40 25.9846C40 25.6532 40.1292 25.3353 40.3593 25.1009Z"
                    fill="white"
                  />
                </svg>
              </button>
              <button className="custom-next" onClick={goToNext}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="107"
                  height="52"
                  viewBox="0 0 107 52"
                  fill="none"
                >
                  <path
                    d="M107 26C107 11.6406 95.3594 0 81 0H26C11.6406 0 0 11.6406 0 26C0 40.3594 11.6406 52 26 52H81C95.3594 52 107 40.3594 107 26Z"
                    fill="#232323"
                  />
                  <path
                    d="M81 0.5H26C11.9167 0.5 0.5 11.9167 0.5 26C0.5 40.0833 11.9167 51.5 26 51.5H81C95.0833 51.5 106.5 40.0833 106.5 26C106.5 11.9167 95.0833 0.5 81 0.5Z"
                    stroke="white"
                    strokeOpacity="0.5"
                  />
                  <path
                    d="M66.6407 25.1009L58.0497 16.3509C57.8182 16.1232 57.5082 15.9972 57.1864 16C56.8646 16.0029 56.5568 16.1344 56.3292 16.3661C56.1017 16.5979 55.9726 16.9114 55.9698 17.2391C55.967 17.5669 56.0907 17.8826 56.3143 18.1184L62.8103 24.7346H41.2273C40.9018 24.7346 40.5896 24.8663 40.3595 25.1008C40.1293 25.3352 40 25.6531 40 25.9846C40 26.3162 40.1293 26.6341 40.3595 26.8685C40.5896 27.1029 40.9018 27.2346 41.2273 27.2346H62.8103L56.3143 33.8509C56.1971 33.9662 56.1036 34.1041 56.0393 34.2566C55.9749 34.4091 55.9411 34.5732 55.9397 34.7391C55.9382 34.9051 55.9693 35.0697 56.031 35.2233C56.0927 35.377 56.1838 35.5165 56.2991 35.6339C56.4143 35.7512 56.5513 35.8441 56.7022 35.9069C56.853 35.9698 57.0146 36.0014 57.1776 36C57.3405 35.9985 57.5016 35.964 57.6513 35.8985C57.801 35.833 57.9365 35.7378 58.0497 35.6184L66.6407 26.8684C66.8708 26.634 67 26.3161 67 25.9846C67 25.6532 66.8708 25.3353 66.6407 25.1009Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FutureOfAi;
