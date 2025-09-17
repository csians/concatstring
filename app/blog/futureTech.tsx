"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_BLOG_POSTS,
  GET_BLOG_ICONS,
  GET_CATEGORIES,
} from "../../lib/queries";
import {
  CategorySkeleton,
  BlogPostsSkeletonGrid,
} from "../../components/skeletons";
import {
  setBlogPostsData,
  setBlogIconsData,
  setCategoriesData,
} from "@/store/slices/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

const FutureTech = () => {
  const dispatch = useDispatch();
  const cachedPostsData = useSelector(
    (state: RootState) => state.blog.blogPosts
  );

  const cachedIconsData = useSelector(
    (state: RootState) => state.blog.blogIcons
  );
  const cachedCategoriesData = useSelector(
    (state: RootState) => state.blog.categories
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const postsPerPage = 6;

  const { data: allPostsData, loading: allPostsLoading } = useQuery(
    GET_BLOG_POSTS,
    {
      variables: {
        categorySlug: null, // Get all posts
        perPage: 100,
        after: null,
      },
      onCompleted: (data) => {
        if (data?.posts?.nodes) {
          setAllPosts(data.posts.nodes);
          setCurrentPage(1);
        }
      },
    }
  );

  const { data, loading } = useQuery(GET_BLOG_POSTS, {
    variables: {
      categorySlug: selectedCategory,
      perPage: 100, // Fetch more posts for better pagination
      after: null,
    },
    skip: !selectedCategory, // Skip when no category is selected
    onCompleted: (data) => {
      if (data?.posts?.nodes) {
        setAllPosts(data.posts.nodes);
        setCurrentPage(1);
      }
    },
  });

  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    GET_CATEGORIES,
    {
      fetchPolicy: "cache-first", // Use cached data if available
    }
  );

  // Fetch blog icons
  const { data: iconsData, loading: iconsLoading } = useQuery(GET_BLOG_ICONS);

  // Use cached data from Redux if available, otherwise use fresh data from query
  // Priority: cached data > category data > all posts data
  const finalPostsData =
    cachedPostsData && !loading && !allPostsLoading
      ? cachedPostsData
      : selectedCategory && data?.posts?.nodes
      ? data
      : allPostsData;

  const finalIconsData =
    cachedIconsData && !iconsLoading ? cachedIconsData : iconsData;
  const finalCategoriesData =
    cachedCategoriesData && !categoriesLoading
      ? cachedCategoriesData
      : categoriesData;

  useEffect(() => {
    if (data) {
      dispatch(setBlogPostsData(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (iconsData) {
      dispatch(setBlogIconsData(iconsData));
    }
  }, [iconsData, dispatch]);

  useEffect(() => {
    if (categoriesData) {
      dispatch(setCategoriesData(categoriesData));
    }
  }, [categoriesData, dispatch]);

  React.useEffect(() => {
    if (finalPostsData?.posts?.nodes && !loading) {
      setAllPosts(finalPostsData.posts.nodes);
      setCurrentPage(1);
    }
  }, [finalPostsData, loading, cachedPostsData, data, allPostsData]);

  // Ensure "All" posts are always available when no category is selected
  useEffect(() => {
    if (
      selectedCategory === null &&
      !allPostsLoading &&
      allPostsData?.posts?.nodes
    ) {
      const currentPostsCount = allPosts.length;
      const availablePostsCount = allPostsData.posts.nodes.length;

      if (
        currentPostsCount === 0 ||
        currentPostsCount !== availablePostsCount
      ) {
        setAllPosts(allPostsData.posts.nodes);
        setCurrentPage(1);
      }
    }
  }, [selectedCategory, allPostsLoading, allPostsData, allPosts.length]);

  // Additional useEffect to handle "All" category selection
  useEffect(() => {
    if (selectedCategory === null && allPostsData?.posts?.nodes) {
      setAllPosts(allPostsData.posts.nodes);
      setCurrentPage(1);
    }
  }, [selectedCategory, allPostsData]);

  const allCategories = finalCategoriesData?.categories?.nodes || [];
  const blogIcons = finalIconsData?.page?.blogSettings?.techTalks;

  // Filter posts based on search term
  const filteredPosts = allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.blogDetail?.blogDetailContent && post.blogDetail.blogDetailContent.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Create categories array with "All" option and dynamic categories from API
  const categories = [
    { name: "All", slug: null, count: totalPosts },
    ...allCategories.map((cat: any) => ({
      name: cat.name,
      slug: cat.slug,
      count: cat.count,
    })),
  ];

  // Dynamic skeleton counts based on data or configuration
  const skeletonCounts = {
    categories:
      allCategories.length > 0 ? Math.min(allCategories.length, 8) : 5,
    posts: postsPerPage,
    maxCategories: 8,
    fallbackCategories: 5,
  };

  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);

    // If "All" is selected, immediately use the initial posts data
    if (categorySlug === null) {
      if (allPostsData?.posts?.nodes) {
        setAllPosts(allPostsData.posts.nodes);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
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

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <section className="md:pt-[87px] pt-[50px]">
      <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
        <div className="flex flex-col">
          <div className="flex items-start 2xl:gap-[88px] xl:gap-[88px] lg:gap-[70px] md:gap-[60px] sm:gap-[30px] gap-[20px] 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col 2xl:mb-[60px] xl:mb-[60px] lg:mb-[40px] md:mb-[30px] sm:mb-[30px] mb-[30px]">
            {categoriesLoading || iconsLoading ? (
              <div className="2xl:w-[964px] xl:w-[964px] lg:w-[964px] md:w-full sm:w-full w-full">
                {/* <CategorySkeleton count={skeletonCounts.categories} /> */}
              </div>
            ) : (
              <>
                <div className="flex flex-row flex-wrap gap-[12px] 2xl:w-[964px] xl:w-[964px] lg:w-[964px] md:w-full sm:w-full w-full">
                  {!categoriesLoading &&
                    categories &&
                    categories.map((category) => (
                      <button
                        key={category.slug || "all"}
                        onClick={() => handleCategoryChange(category.slug)}
                        className={`flex items-center justify-center rounded-[84px] leading-[100%] md:leading-[21px] md:py-[22px] py-[15px] md:px-[24px] px-[16px] relative blog-ct hover:bg-[#E721254D] ${selectedCategory === category.slug ? "active" : ""
                          }`}
                      >
                        <span className="text-center text-white font-denton font-normal md:text-[16px] text-[14px] leading-[100%]">
                          {category.name}
                        </span>
                      </button>
                    ))}
                </div>
                <div
                  className="relative 2xl:w-[348px] xl:w-[348px] lg:w-[348px] md:w-full sm:w-full w-full 
                  rounded-[84px] p-[1px]
                  before:content-[''] before:absolute before:inset-0 before:rounded-[84px] before:p-[1px]
                  before:box-border before:pointer-events-none before:z-0
                  before:transition-all before:duration-300
                  before:z-[-1]
                  hover:before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
                  hover:before:[-webkit-mask-composite:xor]
                  hover:before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
                  hover:before:[mask-composite:exclude]
                  hover:before:bg-[linear-gradient(180deg,rgba(255,255,255,0.5),rgba(84,163,218,0.5))]
                  hover:before:z-[-1]
                  focus-within:before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
                  focus-within:before:[-webkit-mask-composite:xor]
                  focus-within:before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
                  focus-within:before:[mask-composite:exclude]
                  focus-within:before:bg-[linear-gradient(180deg,rgba(255,255,255,0.5),rgba(84,163,218,0.5))]
                  focus-within:before:z-[-1]"
                >
                  <input
                    type="search"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="flex-grow bg-[#292929] text-[#E9E9E9] font-lato font-normal 2xl:text-[17px] xl:text-[17px] lg:text-[16px] md:text-[16px] sm:text-[16px] text-[16px] leading-[28px] rounded-full focus:outline-none px-[23px] py-[14px] w-full"
                  />
                  {searchTerm ? (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-[19px] top-1/2 bottom-0 group bg-[#292929] h-[80%] translate-y-[-50%] transition-colors duration-200 rounded-full p-0 text-white hover:text-[#E721254D]"
                    >
                      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.9608 10.9611C11.7418 10.18 12.9055 10.0774 13.5599 10.7318L33.1104 30.2823C33.7648 30.9367 33.6621 32.1003 32.8811 32.8814C32.1 33.6624 30.9364 33.7651 30.282 33.1107L10.7315 13.5602C10.0771 12.9058 10.1797 11.7421 10.9608 10.9611Z" fill="currentColor"/>
                      <path d="M32.8827 10.9608C33.6637 11.7418 33.7664 12.9055 33.112 13.5599L13.5614 33.1104C12.9071 33.7648 11.7434 33.6621 10.9623 32.8811C10.1813 32.1 10.0786 30.9364 10.733 30.282L30.2836 10.7315C30.938 10.0771 32.1016 10.1797 32.8827 10.9608Z" fill="currentColor"/>
                      </svg>

                    </button>
                  ) : (
                    <button
                      type="button"
                      className="absolute right-[24px] top-1/2 bottom-0 group bg-[#292929] h-[80%] translate-y-[-50%]"
                    >
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M29.0429 27.3252L21.9028 19.8992C23.7393 17.7203 24.7459 14.9621 24.7445 12.1125C24.7445 5.43377 19.3107 0 12.632 0C5.9533 0 0.519531 5.43377 0.519531 12.1125C0.519531 18.7912 5.9533 24.225 12.632 24.225C15.1393 24.225 17.5286 23.4687 19.5714 22.0331L26.7657 29.5155C27.0664 29.8278 27.4709 30 27.9043 30C28.3145 30 28.7037 29.8436 28.9992 29.5592C29.3007 29.2685 29.4746 28.87 29.4828 28.4513C29.491 28.0325 29.3328 27.6275 29.0429 27.3252ZM12.632 3.15978C17.5686 3.15978 21.5847 7.17586 21.5847 12.1125C21.5847 17.0491 17.5686 21.0652 12.632 21.0652C7.69539 21.0652 3.67931 17.0491 3.67931 12.1125C3.67931 7.17586 7.69539 3.15978 12.632 3.15978Z" fill="white"/>
                      </svg>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Posts with skeleton loading */}
          {loading || allPostsLoading ? (
            <BlogPostsSkeletonGrid count={skeletonCounts.posts} columns={3} />
          ) : currentPosts.length > 0 ? (
            <div className="grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-[30px] mb-[30px]">
              {currentPosts.map((post: any) => (
                <div
                  key={post.id}
                  className="bg-[#FFFF]/10 2xl:pt-[24px] xl:pt-[24px] lg:pt-[24px] md:pt-[20px] sm:pt-[20px] pt-[15px] 2xl:px-[24px] xl:px-[24px] lg:px-[24px] md:px-[20px] sm:px-[20px] px-[15px] 2xl:pb-[30px] xl:pb-[30px] lg:pb-[24px] md:pb-[20px] sm:pb-[20px] pb-[15px] backdrop-blur-sm 2xl:rounded-[16px] xl:rounded-[16px] lg:rounded-[16px] md:rounded-[15px] sm:rounded-[10px] rounded-[10px]"
                >
                  <div className="flex flex-col justify-between gap-[32px] h-full">
                    <div className="flex flex-col flex-grow height-full">
                      <a
                        href={`/blog/${post.slug}`}
                        className="block hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={post.featuredImage?.node?.sourceUrl}
                          alt={post.featuredImage?.node?.altText || post.title}
                          width="399"
                          height="270"
                          className="2xl:rounded-[16px] xl:rounded-[16px] lg:rounded-[16px] md:rounded-[15px] sm:rounded-[10px] rounded-[10px] mb-[16px] w-full object-cover"
                        />
                      </a>
                      <div className="flex flex-row flex-wrap justify-between gap-[10px] mb-[20px] items-start">
                        <div className="flex flex-row flex-wrap gap-[14px] max-w-[calc(100%-130px)]">
                          {post.categories?.nodes?.map(
                            (category: any, index: number) => (
                              <div
                                key={index}
                                className="blog-gr flex items-center justify-center bg-[#E7212599] rounded-[84px] py-[5px] leading-[100%] md:leading-[21px] px-[13px] relative "
                              >
                                <span className="text-center text-white font-denton font-normal text-[16px] leading-[100%] md:leading-[21px]">
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
                              width="18"
                              height="19"
                              className="w-[18px] h-[19px]"
                            />
                          )}
                          {formatDate(post.date)}
                        </span>
                      </div>
                      <a
                        href={`/blog/${post.slug}`}
                        className="block hover:text-[#E72125] transition-colors"
                      >
                        <h3 className="font-denton text-[24px] font-bold leading-[32px] text-white mb-[6px]">
                          {post.title}
                        </h3>
                      </a>
                      {/* <div className="flex items-center justify-between gap-[10px] w-full mb-[16px]">
                        <div className="flex gap-[8px] items-center">
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
                              className="w-[18px] h-[18px]"
                            />
                          )}
                          <span className="text-center text-white font-denton font-normal text-[16px] leading-[100%]">
                            {post.commentCount || 0} Comments
                          </span>
                        </div>
                      </div> */}
                      <p className="font-lato text-[17px] font-normal leading-[26px] text-[#C3C3C3] line-clamp-3">
                        {stripHtml(post.blogDetail?.blogDetailShotDesc || '')}
                      </p>
                    </div>
                    <a
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-[10px] text-white font-denton font-bold text-[18px] leading-[100%] hover:text-[#E72125] transition-opacity w-max"
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
              ))}
            </div>
          ) : (
            <div className="text-center md:py-[100px] py-[60px] px-[20px] bg-[#2e0707] md:rounded-[20px] rounded-[15px]">
              <h3 className="font-denton md:text-[66px] text-[24px] md:leading-[87px] leading-[36px] font-bold text-white mb-[0]">
                No Blog Found
              </h3>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center ">
              <div className="flex items-center 2xl:gap-[20px] xl:gap-[18px] lg:gap-[15px] md:gap-[12px] sm:gap-[10px] gap-[8px]">
                {/* <!-- Page Text --> */}
                <div className="flex items-center 2xl:gap-[8px] xl:gap-[8px] lg:gap-[6px] md:gap-[5px] sm:gap-[4px] gap-[3px]">
                  <span className="font-lato font-normal text-[#E9E9E9] 2xl:text-[17px] xl:text-[16px] lg:text-[15px] md:text-[14px] sm:text-[14px] text-[14px] 2xl:leading-[20px] xl:leading-[19px] lg:leading-[18px] md:leading-[17px] sm:leading-[16px] leading-[14px]">
                    Page
                  </span>
                </div>

                {/* <!-- Page Number Input --> */}
                <div className="relative">
                  <div className="flex items-center justify-center 2xl:w-[60px] 2xl:h-[62px] xl:w-[55px] xl:h-[57px] lg:w-[50px] lg:h-[52px] md:w-[45px] md:h-[47px] sm:w-[40px] sm:h-[42px] w-[35px] h-[37px] border border-white 2xl:rounded-[10px] xl:rounded-[10px] lg:rounded-[8px] md:rounded-[6px] sm:rounded-[5px] rounded-[4px] bg-transparent">
                    <div className="flex items-center gap-[12px]">
                      <span className="font-lato font-normal text-[#E9E9E9] text-center 2xl:text-[17px] xl:text-[16px] lg:text-[15px] md:text-[14px] sm:text-[14px] text-[14px] 2xl:leading-[20px] xl:leading-[19px] lg:leading-[18px] md:leading-[17px] sm:leading-[16px] leading-[14px]">
                        {currentPage}
                      </span>
                      {/* <!-- Up/Down Arrows --> */}
                      <div className="flex flex-col gap-[2px]">
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`cursor-pointer hover:opacity-70 transition-opacity ${
                            currentPage === 1
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <svg
                            className="w-[15px] h-[9px]"
                            width="15"
                            height="9"
                            viewBox="0 0 15 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.46577 -5.21571e-05C7.60734 -0.000870397 7.74768 0.0262636 7.87874 0.0797952C8.0098 0.133327 8.129 0.212201 8.22951 0.311898L14.6836 6.76603C14.8862 6.96859 15 7.24331 15 7.52977C15 7.81623 14.8862 8.09096 14.6836 8.29351C14.4811 8.49607 14.2064 8.60986 13.9199 8.60986C13.6335 8.60986 13.3587 8.49607 13.1562 8.29351L7.46577 2.59236L1.77538 8.28275C1.5696 8.45898 1.3049 8.55107 1.03417 8.54061C0.763446 8.53015 0.506637 8.41792 0.315062 8.22635C0.123488 8.03477 0.0112601 7.77796 0.00080309 7.50724C-0.00965393 7.23651 0.08243 6.97181 0.258657 6.76603L6.71279 0.311898C6.91315 0.11317 7.18358 0.0011361 7.46577 -5.21571e-05Z"
                              fill="white"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`cursor-pointer hover:opacity-70 transition-opacity rotate-180 ${
                            currentPage === totalPages
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <svg
                            className="w-[15px] h-[9px]"
                            width="15"
                            height="9"
                            viewBox="0 0 15 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.46577 -5.21571e-05C7.60734 -0.000870397 7.74768 0.0262636 7.87874 0.0797952C8.0098 0.133327 8.129 0.212201 8.22951 0.311898L14.6836 6.76603C14.8862 6.96859 15 7.24331 15 7.52977C15 7.81623 14.8862 8.09096 14.6836 8.29351C14.4811 8.49607 14.2064 8.60986 13.9199 8.60986C13.6335 8.60986 13.3587 8.49607 13.1562 8.29351L7.46577 2.59236L1.77538 8.28275C1.5696 8.45898 1.3049 8.55107 1.03417 8.54061C0.763446 8.53015 0.506637 8.41792 0.315062 8.22635C0.123488 8.03477 0.0112601 7.77796 0.00080309 7.50724C-0.00965393 7.23651 0.08243 6.97181 0.258657 6.76603L6.71279 0.311898C6.91315 0.11317 7.18358 0.0011361 7.46577 -5.21571e-05Z"
                              fill="white"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- Of Total Pages Text --> */}
                <div className="flex items-center 2xl:gap-[8px] xl:gap-[8px] lg:gap-[6px] md:gap-[5px] sm:gap-[4px] gap-[3px]">
                  <span className="font-lato font-normal text-[#E9E9E9] 2xl:text-[17px] xl:text-[16px] lg:text-[15px] md:text-[14px] sm:text-[14px] text-[14px] 2xl:leading-[20px] xl:leading-[19px] lg:leading-[18px] md:leading-[17px] sm:leading-[16px] leading-[14px]">
                    of {totalPages}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FutureTech;