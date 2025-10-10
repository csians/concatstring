"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { setBlogPostsData } from "@/store/slices/blogDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "react-toastify";
import Link from "next/link";

interface Props {
  post: any;
}

const AboutTheAuthor: React.FC<Props> = ({ post }) => {
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

  const router = useRouter();
  // Newsletter subscription state
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  // Validation functions
  const validateEmail = (email: string, showEmptyErrors: boolean = false) => {
    if (!email.trim()) {
      return showEmptyErrors ? "❗️Please enter your email address" : "";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,20}$/;
    if (!emailRegex.test(email)) {
      return "❗️Please enter a valid email address";
    }
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Clear error when user starts typing
    if (emailError) {
      setEmailError("");
    }
  };

  const handleEmailBlur = () => {
    // Only validate and mark as touched if user has actually entered some content
    if (email.trim() !== "") {
      setIsTouched(true);
      const error = validateEmail(email);
      setEmailError(error);
      
      // Auto-clear error after 5 seconds if there's an error
      if (error) {
        setTimeout(() => {
          setEmailError("");
        }, 5000);
      }
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark field as touched
    setIsTouched(true);

    // Validate email before submission
    const error = validateEmail(email, true);
    if (error) {
      setEmailError(error);
      
      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setEmailError("");
      }, 5000);
      
      return;
    }

    setIsSubmitting(true);
    setEmailError("");

    // Extract author slug from post data
    const authorName = postData?.author?.node?.name;
    const authorSlug = authorName ? authorName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : '';

    // Build the fields object as per WPForms API - now includes both email and blog slug
    const fields = {
      1: {
        name: "Email Address",
        value: email,
        id: 1,
        type: "email",
      },
      2: {
        name: "Blog Slug",
        value: authorSlug,
        id: 2,
        type: "text",
      },
    };

    const payload = {
      form_id: 2772,
      fields,
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT_URL}/wp-json/custom/v1/submit-form`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      // Success - reset form and show success toast
      setEmail("");
      setIsTouched(false);
      toast.success("Thanks for subscribing!");
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      setEmailError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
      
      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setEmailError("");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {
        postData?.author?.node?.name && postData?.author?.node?.description && (
          <section className="pt-[80px] pb-[40px]">
            <div className="container max-w-[1400px] px-[20px] mx-auto">
              <h3 className="font-lato font-bold 2xl:text-[38px] xl:text-[36px] lg:text-[30px] md:text-[30px] sm:text-[25px] text-[20px] leading-[100%] text-white mb-[40px]">
                {postData?.blogDetail?.aboutTheAuthorTitle}
              </h3>
              <div className="bg-white/10 rounded-[16px] 2xl:p-[34px] xl:p-[34px] lg:p-[30px] sm:p-[25px] p-[20px] 2xl:max-w-[1030px] xl:max-w-[1030px] lg:max-w-[1030px] md:max-w-full sm:max-w-full max-w-full max-h-max">
                <div className="flex items-top justify-top gap-[40px] 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col">
                  <div className="flex flex-top justify-top gap-[20px] 2xl:w-[516px] xl:w-[516px] lg:w-[516px] md:w-full sm:w-full w-full 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col">
                    <img
                      src={
                        postData?.author?.node?.userProfileImage?.userProfileImage
                          ?.node?.sourceUrl
                      }
                      alt={
                        postData?.author?.node?.userProfileImage?.userProfileImage
                          ?.node?.altText
                      }
                      width="90"
                      height="90"
                      className="h-[90px] w-[90px] rounded-full object-fit object-cover object-top"
                    />
                    <div className="flex flex-col gap-[40px] 2xl:max-w-[400px] xl:max-w-[400px] lg:max-w-[400px] md:max-w-full sm:max-w-full max-w-full pt-[16px]">
                      <div className="flex flex-col gap-[40px] items-start">
                        <div className="flex flex-col items-start">
                          <h5 className="font-denton font-bold text-center text-white mb-[2px] text-[24px] leading-[32px]">
                            {postData?.author?.node?.name}
                          </h5>
                          <p className="font-denton font-normal text-white text-[18px] leading-[24px] text-center mb-[6px]">
                            {postData?.author?.node?.userProfileImage?.userRole}
                          </p>
                          <p className="font-lato font-normal 2xl:text-[22px] xl:text-[22px] lg:text-[22px] md:text-[20px] sm:text-[18px] text-[18px] 2xl:leading-[36px] xl:leading-[36px] lg:leading-[36px] md:leading-[30px] sm:leading-[30px] leading-[30px] text-[#c3c3c3]">
                            {postData?.author?.node?.description}
                          </p>
                        </div>
                        <div className="flex flex-col gap-[30px] items-start">
                          <a
                            onClick={(e) => {
                              e.preventDefault();
                              // Pre-calculate the author slug for faster navigation
                              const authorName = postData?.author?.node?.name;
                              if (!authorName) return;
                              
                              const authorSlug = authorName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                              
                              // Use router.push with shallow routing for faster navigation
                              router.push(`/author/${authorSlug}`, { scroll: false });
                              
                              // Set localStorage after navigation starts (non-blocking)
                              setTimeout(() => {
                                localStorage.setItem("selectedAuthorSlug", authorSlug);
                              }, 0);
                            }}
                            className="flex items-center gap-[10px] text-white font-denton font-bold text-[18px] leading-[100%] hover:text-[#E72125] cursor-pointer transition-colors duration-200"
                          >
                            {
                              postData?.author?.node?.userProfileImage
                                ?.discoverMyJourneyTitle
                            }
                            <img
                              src={
                                postData?.author?.node?.userProfileImage?.discoverSvg
                                  ?.node?.sourceUrl
                              }
                              alt={
                                postData?.author?.node?.userProfileImage?.discoverSvg
                                  ?.node?.altText
                              }
                              className="w-[15px] h-[20px]"
                            />
                          </a>
                          <ul className="flex items-center 2xl:gap-[40px] xl:gap-[40px] lg:gap-[30px] md:gap-[20px] sm:gap-[20px] gap-[10px] mb-[44px]">
                            {postData?.author?.node?.userProfileImage?.socialMedia?.map(
                              (term: any, index: any) => (
                                <li key={index}>
                                  <Link
                                    href={term?.socialLink?.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-red-500 transition-colors duration-300"
                                  >
                                    <img
                                      src={term?.socialSvg?.node?.sourceUrl}
                                      alt={term?.socialSvg?.node?.altText}
                                      className="w-[20px] h-[20px] hover:scale-105 transition-all duration-300 ease-in-out"
                                    />
                                  </Link>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {
                    postData?.blogDetail?.subscribeMyArticleTitle && postData?.blogDetail?.subscribeDescription &&
                    <div className="flex flex-col gap-[7px] items-top justify-top 2xl:w-[406px] xl:w-[406px] lg:w-[406px] md:w-full sm:w-full w-full pt-[16px]">
                      <h3 className="font-denton font-bold 2xl:text-[24px] xl:text-[24px] lg:text-[20px] md:text-[20px] sm:text-[20px] text-[20px] leading-[100%] text-white">
                        {postData?.blogDetail?.subscribeMyArticleTitle}
                      </h3>
                      <p className="font-lato font-normal 2xl:text-[22px] xl:text-[22px] lg:text-[22px] md:text-[20px] sm:text-[18px] text-[18px] leading-[36px] text-[#c3c3c3]">
                        {postData?.blogDetail?.subscribeDescription}
                      </p>
                      <form onSubmit={handleNewsletterSubmit}>
                        <div className="w-full mt-[30px]">
                          <label className="font-lato font-normal text-[17px] leading-[100%] pt-[10px] text-white mb-[16px]">
                            Email Address*
                          </label>
                          <div className="relative 2xl:w-[406px] xl:w-[406px] lg:w-[406px] md:w-[406px] sm:w-[406px] w-full blog-search mt-[10px]">
                            <input
                              type="text"
                              value={email}
                              onChange={handleEmailChange}
                              onBlur={handleEmailBlur}
                              placeholder="Enter Your Email"
                              className="flex-grow bg-[#E721251A] text-[#E9E9E9] font-lato font-normal 2xl:text-[17px] xl:text-[17px] lg:text-[16px] md:text-[16px] sm:text-[16px] text-[16px] leading-[28px] rounded-full focus:outline-none px-[24px] py-[15px] w-full relative z-[99]"
                            />
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="absolute z-[99] right-[24px] top-0 bottom-0 flex items-center cursor-pointer disabled:opacity-50 hover:scale-110 transition-all duration-300 rounded-full p-2"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 30 30"
                                fill="none"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M21.4607 8.5393L11.5606 15.4129L1.20562 11.9607C0.482822 11.7193 -0.0041323 11.0412 2.64314e-05 10.2793C0.00423988 9.51742 0.496775 8.84344 1.22236 8.61044L27.6966 0.0847745C28.3259 -0.117526 29.0166 0.048495 29.4841 0.515969C29.9515 0.983442 30.1176 1.67412 29.9152 2.30346L21.3896 28.7776C21.1566 29.5032 20.4826 29.9958 19.7207 30C18.9588 30.0041 18.2807 29.5172 18.0393 28.7944L14.5704 18.3892L21.4607 8.5393Z"
                                  fill="white"
                                ></path>
                              </svg>
                            </button>
                          </div>
                          {isTouched && emailError && (
                            <span className="md:flex items-start justify-start w-full hidden mt-2">
                              <p className="font-denton text-[#E72125] text-sm font-medium ms-[20px]">
                                {emailError}
                              </p>
                            </span>
                          )}
                        </div>
                      </form>
                    </div>
                  }
                </div>
              </div>
            </div>
          </section>
        )
      }
    </>
  );
};

export default AboutTheAuthor;
