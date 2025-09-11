"use client";
import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "@apollo/client";
import { GET_CONTACT_FAQ } from "@/lib/queries";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import "@/css/home.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

const Faq = () => {
  const dispatch = useDispatch();
  const cachedData = useSelector(
    (state: RootState) => state.contact.contactFaq
  );
  const { data } = useQuery(GET_CONTACT_FAQ);

  // Use cached data from Redux if available, otherwise use fresh data from query
  const faqData = cachedData || data;

  const faqNodes =
    faqData?.page?.flexibleContent?.flexibleContent?.[0]?.contactFaq?.nodes ||
    [];
  const faqTitle =
    faqData?.page?.flexibleContent?.flexibleContent?.[0]?.faqTitle || "FAQ";
  // Contact form state
  const [form, setForm] = useState({
    fullName: "",
    emailAddress: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Validation states
  const [errors, setErrors] = useState({
    fullName: "",
    emailAddress: "",
    message: "",
  });
  const [touched, setTouched] = useState({
    fullName: false,
    emailAddress: false,
    message: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Helper function to show toast with progress bar restart
  const showToast = (message: string, type: 'success' | 'error' = 'error') => {
    // Dismiss ALL existing toasts first (this ensures clean state)
    toast.dismiss();
    
    // Small delay to ensure previous toasts are fully dismissed before showing new one
    setTimeout(() => {
      // Show new toast
      if (type === 'success') {
        toast.success(message);
      } else {
        toast.error(message);
      }
    }, 100);
  };

  // Validation functions
  const validateField = (name: string, value: string, showEmptyErrors: boolean = false) => {
    let message = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          message = showEmptyErrors ? "❗️Please enter your name" : "";
        } else if (value.trim().length < 2) {
          message = "❗️Full name must be at least 2 characters long";
        } else if (value.trim().length >= 20) {
          message = "❗️Full name cannot be longer than 20 characters.";
        }
        break;
      case "emailAddress":
        if (!value.trim()) {
          message = showEmptyErrors ? "❗️Please enter your email address" : "";
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,20}$/;
          if (!emailRegex.test(value)) {
            message = "❗️Please enter a valid email address";
          }
        }
        break;
      case "message":
        if (!value.trim()) {
          message = showEmptyErrors ? "❗️Please enter your message" : "";
        } else if (value.trim().length < 10) {
          message = "❗️Message must be at least 10 characters long";
        } else if (value.trim().length >= 500) {
          message = "❗️Message cannot be longer than 500 characters.";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const validateForm = () => {
    const fullNameValid = validateField("fullName", form.fullName, true);
    const emailValid = validateField("emailAddress", form.emailAddress, true);
    const messageValid = validateField("message", form.message, true);

    return fullNameValid && emailValid && messageValid;
  };

  // Check if form is valid for button state
  const isFormValid = () => {
    // Check if all required fields have some content (not necessarily valid yet)
    const hasFullName = form.fullName.trim().length > 0;
    const hasEmail = form.emailAddress.trim().length > 0;
    const hasMessage = form.message.trim().length > 0;
    // const recaptchaValid = recaptchaToken !== null;

    // Button is enabled if all fields have some content (removed reCAPTCHA)
    return hasFullName && hasEmail && hasMessage; // && recaptchaValid;
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Don't validate while typing - only clear errors
    // Validation will happen on blur or form submission
  };

  const handleFieldBlur = (name: string) => {
    const value = form[name as keyof typeof form];
    
    // Only validate and mark as touched if user has actually entered some content
    if (typeof value === "string" && value.trim() !== "") {
      setTouched((prev) => ({ ...prev, [name]: true }));
      validateField(name, value);
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent rapid form submissions
    if (isSubmitting) {
      return;
    }

    // Mark all fields as touched
    setTouched({
      fullName: true,
      emailAddress: true,
      message: true,
    });

    // Validate form fields first
    if (!validateForm()) {
      return;
    }

    // Check if reCAPTCHA is completed only after form validation passes
    if (!recaptchaToken) {
      showToast("Please complete the reCAPTCHA verification");
      return;
    }

    setIsSubmitting(true);

    // Build the fields object as per WPForms API
    const fields = {
      10: {
        name: "Full Name",
        value: form.fullName,
        id: 10,
        type: "text",
      },
      12: {
        name: "Email Address",
        value: form.emailAddress,
        id: 12,
        type: "email",
      },
      13: {
        name: "Message",
        value: form.message,
        id: 13,
        type: "textarea",
      },
    };

    const payload = {
      form_id: 1147,
      fields,
      recaptcha_token: recaptchaToken,
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
      setForm({ fullName: "", emailAddress: "", message: "" });
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
      setIsSubmitted(true);
      setTouched({ fullName: false, emailAddress: false, message: false });
      showToast("Form submitted successfully!", "success");

      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error: any) {
      console.error("Form submission error:", error);
      showToast("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const faqItems = document.querySelectorAll(".faq-item");
    
    // Open first FAQ item by default
    if (faqItems.length > 0) {
      const firstItem = faqItems[0];
      const firstContent = firstItem.querySelector(".faq-content");
      const firstIcon = firstItem.querySelector(".faq-icon svg");
      
      if (firstContent) {
        firstContent.classList.remove("max-h-0");
        firstContent.classList.add("max-h-[500px]");
      }
      if (firstIcon instanceof SVGElement) {
        firstIcon.style.transform = "rotate(180deg)";
      }
      firstItem.classList.add(
        "active",
        "bg-[#2B2B2B]",
        "border-[1px]",
        "gradient-border"
      );
    }
    
    faqItems.forEach((item) => {
      const head = item.querySelector(".faq-head");
      const content = item.querySelector(".faq-content");
      const icon = item.querySelector(".faq-icon svg");

      item?.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");
        faqItems.forEach((faq) => {
          const c = faq.querySelector(".faq-content");
          const i = faq.querySelector(".faq-icon svg");
          c?.classList.remove("max-h-[500px]");
          c?.classList.add("max-h-0");
          if (i instanceof SVGElement) {
            i.style.transform = "rotate(0deg)";
          }
          faq.classList.remove("active");
          faq.classList.remove("bg-[#2B2B2B]");
          faq.classList.remove("border-[1px]");
          faq.classList.remove("gradient-border");
        });

        if (!isOpen) {
          content?.classList.remove("max-h-0");
          content?.classList.add("max-h-[500px]");
          if (icon instanceof SVGElement) {
            icon.style.transform = "rotate(180deg)";
          }
          item.classList.add(
            "active",
            "bg-[#2B2B2B]",
            "border-[1px]",
            "gradient-border"
          );
        }
      });
    });
  }, [faqNodes]);

  return (
    <section className="faq pb-[120px]">
      <div className="container max-w-[1432px] px-[20px] mx-auto w-full">
        <h2 className="font-denton font-bold 2xl:text-[66px] xl:text-[66px] lg:text-[50px] md:text-[40px] sm:text-[30px] text-[30px] leading-[100%] text-white 2xl:mb-[62px] xl:mb-[62px] lg:mb-[50px] md:mb-[40px] sm:mb-[30px] mb-[25px]">
          {faqTitle}
        </h2>
        <div className="contact-faq flex xl:gap-[60px] lg:gap-[20px] gap-[60px] 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col">
          <div className="faq-wrap flex flex-col gap-[20px] 2xl:w-[50%] xl:w-[50%] lg:w-[50%] md:w-full sm:w-full w-full">
            {faqNodes.map((faq: any, idx: number) => (
              <div
                key={faq.title + idx}
                className="faq-item py-[24px] 2xl:px-[30px] xl:px-[30px] lg:px-[25px] md:px-[25px] sm:px-[25px] px-[20px] overflow-hidden border border-[#2F2F2F] rounded-[12px] flex flex-col items-start transition-all duration-[600ms] cursor-pointer"
                style={{ borderImageSlice: 1 }}
              >
                <div className="faq-head flex justify-between items-center w-full cursor-pointer gap-[5px]">
                  <h4 className="font-denton text-white font-semibold 2xl:text-[22px] xl:text-[22px] lg:text-[20px] md:text-[20px] sm:text-[18px] text-[18px] 2xl:leading-[34px] xl:leading-[34px] lg:leading-[30px] md:leading-[30px] sm:leading-[25px] leading-[25px]">
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
                <div className="faq-content transition-all duration-[600ms] ease-in-out overflow-hidden max-h-0">
                  <div
                    className="font-lato text-[16px] font-normal leading-[26px] text-[#C3C3C3]"
                    dangerouslySetInnerHTML={{ __html: faq.content }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-start gap-[36px] 2xl:w-[50%] xl:w-[50%] lg:w-[50%] md:w-full sm:w-full w-full">
            <h3 className="font-denton font-bold 2xl:text-[40px] xl:text-[40px] lg:text-[30px] md:text-[30px] sm:text-[25px] text-[25px] text-white leading-[100%]">
              Ask a different question
            </h3>
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-col gap-[20px] w-full"
            >
              <div className="w-full">
                <label className="font-lato font-normal text-[17px] leading-[100%] text-white mb-[16px]">
                  Full Name*
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter Full Name"
                  value={form.fullName}
                  onChange={handleFormChange}
                  onBlur={() => handleFieldBlur("fullName")}
                  className="rounded-[12px] mt-3 2xl:p-[20px] xl:p-[20px] lg:p-[20px] md:p-[15px] sm:p-[15px] p-[15px] text-left font-lato font-medium text-white leading-[24px] border border-[#FFFFFF70] bg-transparent w-full focus:bg-[#D9D9D94D] focus:border-transparent focus:outline-none focus:ring-0 autofill:bg-transparent placeholder:text-white-600"
                />
                {touched.fullName && errors.fullName && (
                  <p className="text-red-400 text-sm mt-2 font-medium ms-[17px]">
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="font-lato font-normal text-[17px] leading-[100%] text-white mb-[16px]">
                  Email Address*
                </label>
                <input
                  type="text"
                  name="emailAddress"
                  placeholder="Enter Email Address"
                  value={form.emailAddress}
                  onChange={handleFormChange}
                  onBlur={() => handleFieldBlur("emailAddress")}
                  className="rounded-[12px] mt-3 2xl:p-[20px] xl:p-[20px] lg:p-[20px] md:p-[15px] sm:p-[15px] p-[15px] text-left font-lato font-medium text-white leading-[24px] border border-[#FFFFFF70] bg-transparent w-full focus:bg-[#D9D9D94D] focus:border-transparent focus:outline-none focus:ring-0 autofill:bg-transparent placeholder:text-white-600"
                />
                {touched.emailAddress && errors.emailAddress && (
                  <p className="text-red-400 text-sm mt-2 font-medium ms-[17px]">
                    {errors.emailAddress}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="font-lato font-normal text-[17px] leading-[100%] text-white mb-[16px]">
                  Message*
                </label>
                <textarea
                  name="message"
                  className="rounded-[12px] mt-3 2xl:p-[20px] xl:p-[20px] lg:p-[20px] md:p-[15px] sm:p-[15px] p-[15px] text-left font-lato font-medium text-white leading-[24px] border border-[#FFFFFF70] bg-transparent w-full focus:bg-[#D9D9D94D] focus:border-transparent focus:outline-none focus:ring-0 autofill:bg-transparent placeholder:text-white-600"
                  placeholder="Write Your Message"
                  value={form.message}
                  onChange={handleFormChange}
                  onBlur={() => handleFieldBlur("message")}
                  rows={4}
                />
                {touched.message && errors.message && (
                  <p className="text-red-400 text-sm mt-2 font-medium ms-[17px]">
                    {errors.message}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-start md:items-center gap-[20px] 2xl:flex-row xl:flex-row lg:flex-row md:flex-row sm:flex-col flex-col">
                <div className="flex items-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                    onChange={handleRecaptchaChange}
                    theme="dark"
                    size="normal"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary bg-[#E72125] hover:bg-gradient-to-r from-[#E72125] to-[#8E1D1D] transition-all duration-300 ease-in-out [background-size:100%_153.5%] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
            {/* {isSubmitted && (
              <div className="mt-4 text-green-500 text-center">
                Form submitted successfully!
              </div>
            )} */}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Faq;
