"use client";
import { GET_BLOG_ICONS, GET_BLOG_POSTS } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { setBlogPostsData, setBlogIconsData } from "@/store/slices/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

interface Props {
  post: any;
}

const MoreFromMe: React.FC<Props> = ({ post }) => {
  const dispatch = useDispatch();
  const cachedPostsData = useSelector(
    (state: RootState) => state.blog.blogPosts
  );
  const cachedIconsData = useSelector(
    (state: RootState) => state.blog.blogIcons
  );

  const { data } = useQuery(GET_BLOG_POSTS);
  const { data: iconsData } = useQuery(GET_BLOG_ICONS);

  // Store posts data in Redux when it comes from query
  useEffect(() => {
    if (data) {
      dispatch(setBlogPostsData(data));
    }
  }, [data, dispatch]);

  // Store icons data in Redux when it comes from query
  useEffect(() => {
    if (iconsData) {
      dispatch(setBlogIconsData(iconsData));
    }
  }, [iconsData, dispatch]);

  // Use cached data from Redux if available, otherwise use fresh data from query
  const finalPostsData = cachedPostsData || data;
  const finalIconsData = cachedIconsData || iconsData;

  const authorId = post?.author?.node?.id;
  const currentPostSlug = post?.slug;

  // Get all posts from the data
  const allPosts = finalPostsData?.posts?.nodes || [];

  // Filter posts by the same author
  const allAuthorPosts =
    authorId && allPosts.length > 0
      ? allPosts.filter((post: any) => post?.author?.node?.id === authorId)
      : [];

  // Filter out the current post being viewed
  const filteredPosts = allAuthorPosts.filter(
    (post: any) => post?.slug !== currentPostSlug
  );

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const blogIcons = finalIconsData?.page?.blogSettings?.techTalks;
  const router = useRouter();

  // If no filtered posts, don't render the section at all
  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <>
      {
        filteredPosts.length > 0 && (

          <section className="pt-[20px] md:pb-[80px] md:pt-[60px] pb-[60px]">
            <div className="container max-w-[1400px] px-[20px] mx-auto">
              <div className="flex flex-col items-center justify-center 2xl:gap-[60px] xl:gap-[60px] lg:gap-[50px] md:gap-[40px] sm:gap-[30px] gap-[20px]">
                <h2 className="font-denton font-bold 2xl:text-[60px] xl:text-[60px] lg:text-[50px] md:text-[40px] sm:text-[40px] text-[30px] 2xl:leading-[87px] lg:leading-[87px] md:leading-[50px] sm:leading-[50px] leading-[40px] text-white text-center">
                  {post?.blogDetail?.moreFromMeTitle || "More From This Author"}
                </h2>
                <div className="flex flex-wrap justify-center items-start w-full gap-[30px]">
                  {filteredPosts.slice(0, 2).map((post: any, index: any) => (
                    <div
                      key={post.id}
                      className="bg-[#FFFF]/10 px-[24px] py-[24px] backdrop-blur-sm 2xl:rounded-[16px] xl:rounded-[16px] lg:rounded-[16px] md:rounded-[15px] sm:rounded-[10px] rounded-[16px] 2xl:w-[calc(50%-15px)] xl:w-[calc(50%-15px)] lg:w-[calc(50%-15px)] md:w-[calc(50%-15px)] sm:w-full w-full"
                    >
                      <div className="flex gap-[20px] 2xl:flex-row xl:flex-row lg:flex-row lg:flex-col sm:flex-col flex-col">
                        <div className="2xl:max-w-[272px] xl:max-w-[272px] lg:max-w-full md:max-w-full sm:max-w-full max-w-full">
                          <a
                            href={`/blog/${post.slug}`}
                            className="block hover:opacity-80 transition-opacity"
                          >
                            <img
                              src={post.featuredImage?.node?.sourceUrl}
                              alt={post.featuredImage?.node?.altText || post.title}
                              className="rounded-[10px] h-full w-full object-cover object-center"
                              width="272"
                              height="186"
                            />
                          </a>
                        </div>
                        <div className="2xl:max-w-[345px] xl:max-w-[345px] lg:max-w-full md:max-w-full sm:max-w-full max-w-full">
                          <div className="flex flex-col justify-between gap-[26px] items-start">
                            <div className="flex flex-col h-full flex-1 items-start">
                              <div className="flex flex-wrap gap-[10px]">
                              {post.categories?.nodes?.map((cat: any, index: any) => (
                                <div
                                  key={index}
                                  className="blog-gr flex items-center justify-center bg-[#E7212533] rounded-[84px] py-[5px] px-[13px] relative mb-[6px] text-[14px] leading-[19px]"
                                >
                                  <span className="text-center text-white font-denton font-normal text-[14px] leading-[100%]">
                                    {cat.name}
                                  </span>
                                </div>
                              ))}
                              </div>
                              <a
                                href={`/blog/${post.slug}`}
                                className="block hover:text-[#E72125] transition-colors"
                              >
                                <h3 className="font-denton text-[24px] font-bold leading-[32px] text-white mb-[6px] line-clamp-2">
                                  {post.title}
                                </h3>
                              </a>
                              <p className="font-lato text-[17px] font-normal leading-[26px] text-[#C3C3C3] line-clamp-2">
                                {stripHtml(post.excerpt)}
                              </p>
                            </div>
                            <a
                              href={`/blog/${post.slug}`}
                              className="flex items-center gap-[10px] text-white font-denton font-bold text-[18px] leading-[100%] hover:opacity-80 transition-opacity w-max"
                            >
                              {blogIcons?.readMore}
                              {blogIcons?.readMoreIcon?.node?.sourceUrl && (
                                <img
                                  key={blogIcons?.node?.id || index}
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
                    </div>
                    
                  ))}
                  
                </div>
                <a
                  href={post?.blogDetail?.viewAllBlog?.url}
                  className="inline-block group"
                >
                  <div className="btn-primary-outline">
                    <div className="btn-primary 2xl:px-[40px] xl:px-[40px] lg:px-[30px] md:px-[30px] sm:px-[20px] px-[20px]">
                      {post?.blogDetail?.viewAllBlog?.title}
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </section>
        )
      }
    </>
  );
};

export default MoreFromMe;
