"use client";
import React, { useEffect } from "react";
import "@/css/blog.css";
import { setBlogPostsData } from "@/store/slices/blogDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

interface Props {
  post: any;
}

const ShareItOn: React.FC<Props> = ({ post }) => {
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
  const postData = cachedData || post;

  return (
    <></>
    // <section className="pt-[44px]">
    // <div className="container max-w-[1400px] px-[20px] mx-auto">
    // <div className="flex flex-col gap-[22px]">
    //       <h5 className="font-lato font-bold 2xl:text-[28px] xl:text-[28px] lg:text-[25px] md:text-[20px] sm:text-[20px] text-[20px] 2xl:leading-[36px] xl:leading-[30px] lg:leading-[35px] md:leading-[35px] sm:leading-[35px] leading-[35px] text-white">
    //         {postData?.shareItOnTitle}
    //       </h5>

    //       <ul className="flex items-center 2xl:gap-[40px] xl:gap-[40px] lg:gap-[30px] md:gap-[20px] sm:gap-[20px] gap-[10px]">
    //         {postData?.socialLinks?.map((term: any, index: any) => (
    //           <li key={index}>
    //             <a
    //               href={term?.socialLinks?.url || "#"}
    //               target="_blank"
    //               rel="noopener noreferrer"
    //             >
    //               <img
    //                 src={term?.socialSvg?.node?.sourceUrl}
    //                 alt={term?.socialSvg?.node?.altText}
    //               />
    //             </a>
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    // </div>
    // </section>
  );
};

export default ShareItOn;
