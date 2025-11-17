"use client";
import "@/css/footer.css";
import { useQuery } from "@apollo/client";
import { GET_FOOTER_MENU } from "@/lib/queries";
import { useState, useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { setFooterData } from "@/store/slices/homeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "react-toastify";
import { FooterSkeleton } from "./skeletons";

const Footer = () => {
  const dispatch = useDispatch();
  const cachedData = useSelector((state: RootState) => state.home.footer);
  // Skip query if cached data exists to prevent unnecessary refetches
  const { data, loading } = useQuery(GET_FOOTER_MENU, {
    skip: !!cachedData,
  });
  const freshFooter = data?.footerSettings?.footerOptions;
  const footer = cachedData || freshFooter;

  useEffect(() => {
    if (data) {
      const footerBlock = data?.footerSettings?.footerOptions;
      if (footerBlock) {
        dispatch(setFooterData(footerBlock));
      }
    }
  }, [data, dispatch]);

  const pathname = usePathname();

  // Newsletter subscription state
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,20}$/;
    if (!emailRegex.test(email)) {
      return "❗️Please enter a valid email address";
    }
    return "";
  };



  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Only show validation error if user has already attempted to submit
    if (hasAttemptedSubmit && emailError) {
      const error = validateEmail(newEmail);
      setEmailError(error);
    }
  };

  const handleEmailBlur = () => {
    // Only validate on blur if user has already attempted to submit
    if (hasAttemptedSubmit) {
      const error = validateEmail(email);
      setEmailError(error);
    }
  };

  // Show skeleton while loading and no cached data
  if (loading && !cachedData) {
    return <FooterSkeleton />;
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting newsletter with email:", email);
    
    // Set flag that user has attempted to submit
    setHasAttemptedSubmit(true);
    
    // Check if email is empty
    if (!email.trim()) {
      setEmailError("❗️Please enter your email address");
      // Auto-hide error after 5 seconds
      setTimeout(() => {
        setEmailError("");
      }, 5000);
      return;
    }
    
    // Validate email format before submission
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      // Auto-hide error after 5 seconds
      setTimeout(() => {
        setEmailError("");
      }, 5000);
      return;
    }

    setIsSubmitting(true);
    setEmailError("");

    // Build the fields object as per WPForms API
    const fields = {
      1: {
        name: "Email Address",
        value: email,
        id: 1,
        type: "email",
      },
    };

    const payload = {
      form_id: 1217,
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

      // Success - reset form and show success message
      setEmail("");
      setIsSubmitted(true);
      setHasAttemptedSubmit(false);

      toast.success("Thank you for subscribing to our newsletter");

      // Hide success message after 5 seconds
      // setTimeout(() => {
      //   setIsSubmitted(false);
      // }, 5000);
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <footer className="footer 2xl:px-[110px] xl:px-[100px] lg:px-[80px] md:px-[60px] sm:px-[40px] px-[20px]">
        <div className="mx-auto overflow-hidden px-[20px] w-full rounded-[20px] 2xl:pt-[100px] xl:pt-[100px] lg:pt-[100px] md:pt-[100px] sm:pt-[80px] pt-[60px] bg-[radial-gradient(62.87%_106.71%_at_50%_15.94%,_#E72125_0%,_rgba(231,_33,_37,_0)_100%)]">
          <div className="container max-w-[1432px] mx-auto w-full 2xl:pb-[50px] xl:pb-[50px] lg:pb-[40px] md:pb-[40px] sm:pb-[30px] pb-[30px]">
            <div className="flex flex-col items-center justify-center 2xl:gap-[30px] xl:gap-[30px] lg:gap-[30px] md:gap-[25px] sm:gap-[25px] gap-[20px]">
              {/* {isSubmitted ? (
                <div className="thankyou 2xl:w-[823px] xl:w-[823px] lg:w-[700px] md:w-full sm:w-full w-full">
                  <div className="font-lato font-semibold text-[#4DFF00] 2xl:text-[22px] xl:text-[22px] lg:text-[20px] md:text-[20px] sm:text-[18px] text-[18px] leading-[100%] text-center flex items-center rounded-full py-[25px] h-full 2xl:w-[823px] xl:w-[823px] lg:w-[700px] leading-[34px] 2xl:px-[25px] xl:px-[25px] lg:px-[20px] md:px-[20px] sm:px-[15px] px-[15px] md:w-full sm:w-full w-full justify-center text-center input">
                    Thank you for subscribing to our newsletter
                  </div>
                </div>
              ) : (
                <> */}
              <h3 className="font-denton font-semibold text-white 2xl:text-[46px] xl:text-[46px] lg:text-[40px] md:text-[40px] sm:text-[30px] text-[25px] leading-[100%] text-center">
                {footer?.newsletterTitle}
              </h3>
              <form
                onSubmit={handleNewsletterSubmit}
                className="w-full flex flex-col justify-center items-center gap-[10px] max-w-[823px]"
              >
                <div className="subscribe 2xl:w-[823px] xl:w-[823px] lg:w-[700px] md:w-full sm:w-full w-full">
                  <div className="input flex items-center rounded-full py-[10px] px-[10px] h-full 2xl:w-[823px] xl:w-[823px] lg:w-[700px] leading-[34px] 2xl:px-[10px] xl:px-[10px] lg:px-[10px] md:px-[10px] sm:px-0 px-0 md:w-full sm:w-full w-full">
                    {" "}
                    <input
                      type="text"
                      placeholder="Enter Your Email Address*"
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={handleEmailBlur}

                      className="flex-grow bg-transparent text-white font-lato font-regular text-[16px] lg:text-[18px] leading-[36px] px-4 rounded-full focus:outline-none placeholder:text-white-600"
                    />
                    <button
                      className={`group 2xl:flex xl:flex lg:flex md:flex sm:hidden hidden disabled:opacity-50
                            }`}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <div className="btn-primary-outline">
                        <span className="btn-primary">
                          {isSubmitting ? "Submitting..." : "Submit"}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
                {emailError && hasAttemptedSubmit && (
                  <span className="2xl:w-[823px] xl:w-[823px] lg:w-[700px] md:w-full sm:w-full w-full">
                    <p className="font-denton text-[#e5e7eb] text-sm font-medium ms-[23px]">
                      {emailError}
                    </p>
                  </span>
                )}
                <button
                  className={`group 2xl:w-[823px] xl:w-[823px] lg:w-[700px] md:w-full sm:w-full w-full 2xl:hidden xl:hidden lg:hidden md:hidden sm:flex flex disabled:opacity-50
                        }`}
                  type="submit"
                  disabled={isSubmitting}
                >
                  <div className="btn-primary-outline 2xl:w-[823px] xl:w-[823px] lg:w-[700px] md:w-full sm:w-full w-full bg-gradient-to-b from-white to-[#54A3DA]">
                    <span className="btn-primary">
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </span>
                  </div>
                </button>
              </form>
              {/* </>
              )} */}
            </div>
            <ul className="flex flex-wrap justify-center items-center 2xl:gap-[46px] xl:gap-[46px] lg:gap-[40px] md:gap-[40px] sm:gap-[30px] gap-[20px] 2xl:pt-[80px] xl:pt-[60px] lg:pt-[50px] md:pt-[40px] sm:pt-[30px] pt-[30px] 2xl:pb-[60px] xl:pb-[60px] lg:pb-[50px] md:pb-[40px] sm:pb-[30px] pb-[30px] border-b border-[#D9D9D9]">
              {footer?.footerPaths?.map(
                (
                  item: { pathLink: { url: string; title: string; target: string } },
                  idx: number
                ) => {
                  const isActive = pathname === item.pathLink.url;
                  return (
                    <li key={idx}>
                      <Link
                        href={item.pathLink.url}
                        target={item.pathLink.target || "_self"}
                        className={`font-denton font-bold 2xl:text-[22px] xl:text-[22px] lg:text-[20px] md:text-[20px] sm:text-[18px] text:[18px] leading-[32px] text-white hover:opacity-80 transition-opacity ${isActive
                          ? "text-[#E72125] underline decoration-2 underline-offset-4"
                          : ""
                          }`}
                      >
                        {item.pathLink.title}
                      </Link>
                    </li>
                  );
                }
              )}
            </ul>
            <div className="py-[50px] flex flex-wrap flex-col gap-[20px]">
              <h4 className="font-denton font-bold text-[30px] leading-[100%] text-white">
                {footer?.servicesTitle}
              </h4>
              
              {/* Services List - All devices */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-none 2xl:flex 2xl:flex-wrap gap-[20px]">
                {footer?.serviceName?.nodes?.map(
                  (
                    service: {
                      title: string;
                      slug: string;
                    },
                    idx: number
                  ) => {
                    const isActive = pathname === `/services/${service?.slug}`;
                    const isLastItem = idx === footer?.serviceName?.nodes?.length - 1;
                    return (
                      <div key={idx} className="flex items-start gap-[20px] footer-service-link">
                        <p className="font-denton font-medium 2xl:text-[18px] xl:text-[18px] lg:text-[18px] md:text-[18px] sm:text-[18px] text:[18px] leading-[32px] text-white hover:opacity-80 transition-opacity">
                          <Link
                            href={`/services/${service?.slug}`}
                            className={isActive ? "active" : ""}
                          >
                            {service.title}
                          </Link>
                        </p>
                        {/* Add separator only when all in one line (2xl screens) */}
                        <span className="hidden 2xl:block text-white text-[18px] font-lato">
                          {!isLastItem && "|"}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            <div className="grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 2xl:gap-[30px] xl:gap-[30px] lg:gap-[25px] md:gap-[20px] sm:gap-[20px] gap-[20px]">
              <Link
                href={`https://maps.app.goo.gl/2ENUbrW1qMk1FeBj8`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-[1px] rounded-[12px] bg-[linear-gradient(180deg,_#54A3DA_0%,_#E72125_100%)] h-full group hover:shadow-[inset_0_0_16px_rgba(255,255,255,0.26),0_24px_124px_rgba(231,33,37,0.22)]"
              >
                <div className="flex items-center bg-[#2B2B2B] group-hover:bg-[#000] rounded-[12px] h-full gap-[15px] w-full 2xl:py-[24px] xl:py-[24px] lg:py-[24px] md:py-[20px] sm:py-[20px] py-[20px] 2xl:px-[30px] xl:px-[30px] lg:px-[24px] md:px-[20px] sm:px-[20px] px-[20px]">
                  <span className="icon w-[50px] h-[50px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="50"
                      height="51"
                      viewBox="0 0 50 51"
                      fill="none"
                    >
                      <circle cx="25" cy="25.8359" r="25" fill="white" />
                      <path
                        d="M25 14.8359C20.59 14.8359 17 18.3893 17 22.7593C17 26.7293 21.1467 31.2659 23.62 33.6159C24.0067 33.9826 24.5033 34.1693 25 34.1693C25.4967 34.1693 25.9933 33.9859 26.38 33.6159C28.8533 31.2659 33 26.7293 33 22.7593C33 18.3893 29.41 14.8359 25 14.8359ZM25 27.1693C22.61 27.1693 20.6667 25.2259 20.6667 22.8359C20.6667 20.4459 22.61 18.5026 25 18.5026C27.39 18.5026 29.3333 20.4459 29.3333 22.8359C29.3333 25.2259 27.39 27.1693 25 27.1693Z"
                        fill="url(#paint0_linear_985_6626)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_985_6626"
                          x1="23.9957"
                          y1="19.5732"
                          x2="23.9957"
                          y2="34.1693"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.037" stopColor="#DA2124" />
                          <stop offset="1" stopColor="#8E1D1D" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  <span className="font-lato text-white font-normal text-[16px] leading-[24px] max-w-[calc(100%-65px)] cursor-pointer">
                    {footer?.companyAddress}
                  </span>
                </div>
              </Link>
              <Link
                href={`tel:${footer?.companyNumber}`}
                className="p-[1px] rounded-[12px] bg-[linear-gradient(180deg,_#54A3DA_0%,_#E72125_100%)] h-full group hover:shadow-[inset_0_0_16px_rgba(255,255,255,0.26),0_24px_124px_rgba(231,33,37,0.22)]"
              >
                <div className="flex items-center bg-[#2B2B2B] group-hover:bg-[#000] rounded-[12px] h-full gap-[15px] w-full 2xl:py-[24px] xl:py-[24px] lg:py-[24px] md:py-[20px] sm:py-[20px] py-[20px] 2xl:px-[30px] xl:px-[30px] lg:px-[24px] md:px-[20px] sm:px-[20px] px-[20px]">
                  <span className="icon w-[50px] h-[50px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="51"
                      height="51"
                      viewBox="0 0 51 51"
                      fill="none"
                    >
                      <circle cx="25.667" cy="25.8359" r="25" fill="white" />
                      <path
                        d="M34.6537 30.6448C34.617 30.3387 34.5104 30.0452 34.3422 29.7868C34.174 29.5285 33.9487 29.3122 33.6837 29.1548L31.2771 27.7114C30.8896 27.4785 30.4353 27.3818 29.9865 27.4368C29.5377 27.4917 29.1202 27.6952 28.8004 28.0148C28.2104 28.6048 27.3137 28.7181 26.6204 28.2948C25.9737 27.9014 25.3171 27.3781 24.7237 26.7814C24.1304 26.1848 23.6037 25.5281 23.2104 24.8848C22.7871 24.1914 22.9004 23.2948 23.4904 22.7048C23.8106 22.3853 24.0146 21.9678 24.0695 21.5188C24.1245 21.0698 24.0274 20.6154 23.7937 20.2281L22.3504 17.8214C22.0271 17.2814 21.4837 16.9281 20.8604 16.8514C20.2371 16.7748 19.6237 16.9848 19.1804 17.4314L17.3637 19.2481C16.8504 19.7614 16.5971 20.4881 16.6837 21.1914C17.0671 24.2748 18.7771 27.5314 21.3737 30.1281C23.9704 32.7248 27.2304 34.4348 30.3137 34.8181C30.4037 34.8281 30.4971 34.8348 30.5904 34.8348C31.2162 34.832 31.8155 34.5816 32.2571 34.1381L34.0737 32.3214C34.2923 32.1043 34.4582 31.84 34.5588 31.5488C34.6593 31.2576 34.6918 30.9472 34.6537 30.6414V30.6448Z"
                        fill="url(#paint0_linear_985_6634)"
                      />
                      <path
                        d="M26.8467 20.5278C26.6776 20.4856 26.4987 20.5113 26.3483 20.5992C26.1978 20.6872 26.0878 20.8305 26.0416 20.9986C25.9955 21.1667 26.0169 21.3461 26.1013 21.4986C26.1857 21.651 26.3265 21.7644 26.4934 21.8145C27.8801 22.1978 28.9801 23.2978 29.3601 24.6812C29.4401 24.9778 29.7101 25.1712 30.0034 25.1712C30.0634 25.1712 30.1234 25.1645 30.1801 25.1478C30.3503 25.1003 30.4948 24.9875 30.5822 24.8339C30.6696 24.6803 30.6928 24.4984 30.6467 24.3278C30.1401 22.4912 28.6834 21.0378 26.8467 20.5278ZM26.5634 18.4978C28.0971 18.7414 29.5145 19.4639 30.6126 20.562C31.7107 21.6601 32.4332 23.0775 32.6767 24.6112C32.7301 24.9378 33.0134 25.1712 33.3334 25.1712C33.3667 25.1712 33.4034 25.1712 33.4401 25.1612C33.8034 25.1045 34.0501 24.7612 33.9934 24.3978C33.7061 22.5864 32.8528 20.9123 31.5559 19.6153C30.259 18.3184 28.5849 17.4652 26.7734 17.1778C26.4067 17.1178 26.0667 17.3678 26.0101 17.7312C25.9534 18.0945 26.2001 18.4378 26.5634 18.4945V18.4978Z"
                        fill="url(#paint1_linear_985_6634)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_985_6634"
                          x1="24.5381"
                          y1="21.2462"
                          x2="24.5381"
                          y2="34.8348"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.037" stopColor="#DA2124" />
                          <stop offset="1" stopColor="#8E1D1D" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_985_6634"
                          x1="29.4996"
                          y1="19.1298"
                          x2="29.4996"
                          y2="25.1712"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.037" stopColor="#DA2124" />
                          <stop offset="1" stopColor="#8E1D1D" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  <span className="font-lato text-white font-normal text-[16px] leading-[24px] max-w-[calc(100%-65px)]">
                    {footer?.companyNumber}
                  </span>
                </div>
              </Link>
              <Link
                href={`mailto:${footer?.companyEmail}`}
                className="p-[1px] rounded-[12px] bg-[linear-gradient(180deg,_#54A3DA_0%,_#E72125_100%)] h-full group hover:shadow-[inset_0_0_16px_rgba(255,255,255,0.26),0_24px_124px_rgba(231,33,37,0.22)]"
              >
                <div className="flex items-center bg-[#2B2B2B] group-hover:bg-[#000] rounded-[12px] h-full gap-[15px] w-full 2xl:py-[24px] xl:py-[24px] lg:py-[24px] md:py-[20px] sm:py-[20px] py-[20px] 2xl:px-[30px] xl:px-[30px] lg:px-[24px] md:px-[20px] sm:px-[20px] px-[20px]">
                  <span className="icon w-[50px] h-[50px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="51"
                      height="51"
                      viewBox="0 0 51 51"
                      fill="none"
                    >
                      <circle cx="25.3335" cy="25.8359" r="25" fill="white" />
                      <path
                        d="M32.0002 17.8359H18.6668C16.8302 17.8359 15.3335 19.3326 15.3335 21.1693V31.1693C15.3335 33.0059 16.8302 34.5026 18.6668 34.5026H32.0002C33.8368 34.5026 35.3335 33.0059 35.3335 31.1693V21.1693C35.3335 19.3326 33.8368 17.8359 32.0002 17.8359ZM32.0568 22.7093L27.1468 26.2393C26.5968 26.6359 25.9635 26.8326 25.3335 26.8326C24.7035 26.8326 24.0702 26.6359 23.5202 26.2393L18.6102 22.7093C18.5368 22.6592 18.4741 22.5949 18.4259 22.5203C18.3777 22.4457 18.3449 22.3622 18.3295 22.2747C18.314 22.1872 18.3162 22.0975 18.3358 22.0108C18.3555 21.9242 18.3924 21.8424 18.4441 21.7702C18.4959 21.698 18.5616 21.6368 18.6373 21.5904C18.713 21.5439 18.7973 21.513 18.8851 21.4996C18.9729 21.4862 19.0626 21.4904 19.1487 21.5121C19.2349 21.5338 19.3158 21.5725 19.3868 21.6259L24.2968 25.1559C24.9335 25.6159 25.7268 25.6159 26.3668 25.1559L31.2768 21.6259C31.5768 21.4093 31.9935 21.4793 32.2068 21.7793C32.4202 22.0793 32.3535 22.4959 32.0535 22.7093H32.0568Z"
                        fill="url(#paint0_linear_985_6643)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_985_6643"
                          x1="24.0781"
                          y1="21.9198"
                          x2="24.0781"
                          y2="34.5026"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.037" stopColor="#DA2124" />
                          <stop offset="1" stopColor="#8E1D1D" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  <span className="font-lato text-white font-normal text-[16px] leading-[24px] max-w-[calc(100%-65px)] break-all">
                    {footer?.companyEmail}
                  </span>
                </div>
              </Link>
            </div>
          </div>
          <div className="border-t border-transparent ">
          <div className="container max-w-[1432px] px-[20] relative py-[0] xl:pb-[0px] mb-[12px] mx-auto w-full flex items-center justify-between">
            
          <ul className="relative flex items-center gap-[14px] 2xl:flex-row xl:flex-row lg:flex-row md:flex-row sm:flex-row flex-row ralative before:content-[''] before:absolute before:left-full before:top-1/2 before:h-[2px] before:w-[100vw] before:bg-[#d9d9d9] before:-translate-y-1/2 before:z-[1] after:content-[''] after:absolute after:right-full after:top-1/2 after:h-[2px] after:w-[100vw] after:bg-[#d9d9d9] after:-translate-y-1/2 after:z-[1] ">
          <li>
            <Link href="https://www.instagram.com/concatstringsolutions/" target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram page" className="p-0 btn-primary bg-gradient-to-b from-[#DA2124] to-[#8E1D1D  ] hover:from-[#DA2124] hover:to-[#DA2124] transition-all duration-300 ease-in-out [background-size:100%_153.5%] disabled:opacity-50 disabled:cursor-not-allowed lg:w-[60px] lg:h-[60px] w-[50px] h-[50px]">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M25.929 7.6441C25.8681 6.26258 25.6447 5.31288 25.3246 4.48986C24.9945 3.61629 24.4866 2.83421 23.8212 2.18403C23.171 1.52374 22.3837 1.01065 21.5203 0.685683C20.6926 0.365698 19.7477 0.142216 18.3663 0.0813678C16.9744 0.0152374 16.5326 0 13.0026 0C9.47259 0 9.03076 0.0152374 7.6441 0.0761871C6.26263 0.137137 5.31288 0.36072 4.49011 0.680503C3.61629 1.01065 2.83421 1.51856 2.18403 2.18403C1.52374 2.83416 1.0109 3.62142 0.685683 4.48488C0.365698 5.31288 0.142267 6.2575 0.0813678 7.63892C0.0152882 9.03076 0 9.47259 0 13.0026C0 16.5326 0.0152882 16.9745 0.0761871 18.3611C0.137137 19.7426 0.36072 20.6923 0.680757 21.5153C1.0109 22.3889 1.52374 23.171 2.18403 23.8212C2.83421 24.4814 3.62148 24.9945 4.48493 25.3195C5.31283 25.6395 6.25745 25.863 7.63917 25.9238C9.02558 25.985 9.46766 26 12.9977 26C16.5277 26 16.9695 25.985 18.3562 25.9238C19.7376 25.8629 20.6874 25.6395 21.5101 25.3195C22.3743 24.9854 23.1591 24.4744 23.8142 23.8193C24.4694 23.1642 24.9804 22.3794 25.3146 21.5153C25.6344 20.6874 25.858 19.7426 25.9189 18.3611C25.9798 16.9745 25.9951 16.5326 25.9951 13.0026C25.9951 9.47259 25.9899 9.03071 25.929 7.6441ZM23.5877 18.2595C23.5317 19.5293 23.3184 20.215 23.1406 20.6721C22.7037 21.8047 21.8048 22.7037 20.6721 23.1406C20.215 23.3184 19.5244 23.5317 18.2595 23.5874C16.8881 23.6486 16.4769 23.6636 13.0078 23.6636C9.53867 23.6636 9.12223 23.6486 7.75579 23.5874C6.48601 23.5317 5.80032 23.3184 5.3432 23.1406C4.77957 22.9323 4.26653 22.6022 3.85004 22.1704C3.41831 21.7489 3.08817 21.2409 2.87982 20.6773C2.70205 20.2201 2.48878 19.5293 2.43306 18.2647C2.37191 16.8933 2.35687 16.4818 2.35687 13.0127C2.35687 9.5436 2.37191 9.12716 2.43306 7.76097C2.48878 6.49119 2.70205 5.8055 2.87982 5.34838C3.08817 4.7845 3.41831 4.27155 3.85522 3.85496C4.27658 3.42324 4.7845 3.09309 5.34838 2.885C5.8055 2.70723 6.49637 2.49391 7.76097 2.43799C9.13234 2.37704 9.54385 2.3618 13.0127 2.3618C16.487 2.3618 16.8982 2.37704 18.2647 2.43799C19.5345 2.49396 20.2201 2.70718 20.6773 2.88495C21.2409 3.09309 21.754 3.42324 22.1704 3.85496C22.6022 4.27658 22.9323 4.7845 23.1406 5.34838C23.3184 5.8055 23.5317 6.49611 23.5876 7.76097C23.6486 9.13234 23.6638 9.5436 23.6638 13.0127C23.6638 16.4818 23.6486 16.8881 23.5877 18.2595Z" fill="white"/>
            <path d="M13.0026 6.32331C9.3152 6.32331 6.32349 9.31482 6.32349 13.0024C6.32349 16.6899 9.3152 19.6814 13.0026 19.6814C16.69 19.6814 19.6816 16.6899 19.6816 13.0024C19.6816 9.31482 16.69 6.32331 13.0026 6.32331ZM13.0026 17.3349C10.6104 17.3349 8.66995 15.3947 8.66995 13.0024C8.66995 10.61 10.6104 8.66987 13.0025 8.66987C15.3949 8.66987 17.3351 10.61 17.3351 13.0024C17.3351 15.3947 15.3948 17.3349 13.0026 17.3349ZM21.5051 6.05919C21.5051 6.92031 20.8069 7.61849 19.9456 7.61849C19.0846 7.61849 18.3864 6.92031 18.3864 6.05919C18.3864 5.19798 19.0846 4.5 19.9457 4.5C20.8069 4.5 21.5051 5.19792 21.5051 6.05919Z" fill="white"/>
            </svg>

            </Link>
          </li>
          <li>
            <Link
              href="https://www.linkedin.com/company/concatstring-solutions-pvt-ltd/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our LinkedIn page"
              className="p-0 btn-primary bg-gradient-to-b from-[#DA2124] to-[#8E1D1D  ] hover:from-[#DA2124] hover:to-[#DA2124] transition-all duration-300 ease-in-out [background-size:100%_153.5%] disabled:opacity-50 disabled:cursor-not-allowed lg:w-[60px] lg:h-[60px] w-[50px] h-[50px]"
            >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 24V15.21C24 10.89 23.07 7.59 18.03 7.59C15.6 7.59 13.98 8.91 13.32 10.17H13.26V7.98H8.49V24H13.47V16.05C13.47 13.95 13.86 11.94 16.44 11.94C18.99 11.94 19.02 14.31 19.02 16.17V23.97H24V24ZM0.39 7.98H5.37V24H0.39V7.98ZM2.88 0C1.29 0 0 1.29 0 2.88C0 4.47 1.29 5.79 2.88 5.79C4.47 5.79 5.76 4.47 5.76 2.88C5.76 1.29 4.47 0 2.88 0Z" fill="white"/>
            </svg>


            </Link>
          </li>
          {/* <li>
            <Link href="https://x.com/search?q=%23ConcatString&src=hashtag_click" target="_blank" rel="noopener noreferrer" aria-label="Visit our Twitter page" className="p-0 btn-primary bg-gradient-to-b from-[#DA2124] to-[#8E1D1D  ] hover:from-[#DA2124] hover:to-[#DA2124] transition-all duration-300 ease-in-out [background-size:100%_153.5%] disabled:opacity-50 disabled:cursor-not-allowed  lg:w-[60px] lg:h-[60px] w-[50px] h-[50px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M13.9761 10.1624L22.7186 0H20.6469L13.0558 8.82384L6.99289 0H0L9.16837 13.3432L0 24H2.07179L10.0881 14.6817L16.491 24H23.4839L13.9756 10.1624H13.9761ZM11.1385 13.4608L10.2096 12.1321L2.81829 1.55961H6.00044L11.9653 10.0919L12.8942 11.4206L20.6479 22.5113H17.4657L11.1385 13.4613V13.4608Z" fill="white"/>
            </svg>


            </Link>
          </li> */}
          </ul>
          
           
          </div>
            <div className="container max-w-[1420px] px-[20] py-[30px] pt-[0px] mx-auto w-full">
              <div className="flex justify-start items-center gap-[10px] 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col">
                <span
                  className="font-lato font-normal text-white text-[18px] leading-[32px] 2xl:text-left xl:text-left lg:text-left md:text-center sm:text-center text-center"
                  dangerouslySetInnerHTML={{
                    __html: footer?.rightsTitle ?
                      footer.rightsTitle.replace(/©\d{4}/, `©${new Date().getFullYear()}`) :
                      "",
                  }}
                />
                <ul className="flex items-center gap-[5px] 2xl:flex-row xl:flex-row lg:flex-row md:flex-row sm:flex-col flex-col">
                <li>
                    <span className="font-lato font-normal text-[18px] leading-[32px] text-white 2xl:block xl:block lg:block md:block sm:hidden hidden">
                      |
                    </span>
                  </li>
                  <li>
                    <Link
                      href={footer?.termsLink?.url}
                      className={`font-lato font-normal text-[18px] leading-[32px] text-white hover:opacity-80 transition-opacity ${
                        pathname === footer?.termsLink?.url
                          ? "text-[#E72125] underline decoration-2 underline-offset-4"
                          : ""
                      }`}
                    >
                      {footer?.termsLink?.title}
                    </Link>
                  </li>
                  <li>
                    <span className="font-lato font-normal text-[18px] leading-[32px] text-white 2xl:block xl:block lg:block md:block sm:hidden hidden">
                      |
                    </span>
                  </li>
                  <li>
                    <Link
                      href={footer?.privacyLink?.url}
                      className={`font-lato font-normal text-[18px] leading-[32px] text-white hover:opacity-80 transition-opacity ${
                        pathname === footer?.privacyLink?.url
                          ? "text-[#E72125] underline decoration-2 underline-offset-4"
                          : ""
                      }`}
                    >
                      {footer?.privacyLink?.title}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="w-full h-[16px] bg-[linear-gradient(180deg,_#E72125_0%,_#811215_100%)]"></div>
    </>
  );
};

export default Footer;
