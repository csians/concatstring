"use client";
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { GET_BLOG_SETTINGS } from "@/lib/queries";
import { uploadToCloudinary } from "@/lib/cloudinary-client";
import { toast } from "react-toastify";
import { StoryToShareSkeleton } from "@/components/skeletons";
import { setBlogSettingsData } from "@/store/slices/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import ReCAPTCHA from "react-google-recaptcha";

const StoryToShare = () => {
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

  // All hooks must be called first, before any conditional returns
  // Form state - all useState hooks must be called
  const [form, setForm] = useState({
    name: "",
    email: "",
    blogTitle: "",
    // blogContent: "",
    uploadDocument: null as File | null,
    // tags: "",
    authorBio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

   // Lock body scroll when popup is open
   useEffect(() => {
    if (isPopupOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup on unmount (safety)
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isPopupOpen]);

  // Request a Blog modal state
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isRequestSubmitting, setIsRequestSubmitting] = useState(false);
  const [requestForm, setRequestForm] = useState({
    name: "",
    email: "",
    topic: "",
    purpose: "",
  });
  const [requestErrors, setRequestErrors] = useState({
    name: "",
    email: "",
    topic: "",
    purpose: "",
  });
  const [requestTouched, setRequestTouched] = useState({
    name: false,
    email: false,
    topic: false,
    purpose: false,
  });

  // Lock body scroll when request modal is open
  useEffect(() => {
    if (isRequestOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup on unmount (safety)
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isRequestOpen]);

  // Validation states - all useState hooks must be called
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    blogTitle: "",
    // blogContent: "",
    // tags: "",
    authorBio: "",
    uploadDocument: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    blogTitle: false,
    // blogContent: false,
    // tags: false,
    authorBio: false,
    uploadDocument: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // reCAPTCHA states
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [requestRecaptchaToken, setRequestRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const requestRecaptchaRef = useRef<ReCAPTCHA>(null);

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

  // Get data after all hooks are called
  const techStory = blogData?.page?.blogSettings?.techStory;

  // Show loading skeleton if data is loading and no cached data is available
  if (loading && !cachedData) {
    return <StoryToShareSkeleton />;
  }

  // Show error message if there's an error
  if (error)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="font-denton text-[24px] font-bold text-white mb-[16px]">
            Error loading story form
          </h3>
          <p className="text-[#C3C3C3]">Please try again later.</p>
        </div>
      </div>
    );

  // Don't show section if no data
  if (
    !techStory ||
    !techStory.title ||
    !techStory.description ||
    !techStory.cards ||
    techStory.cards.length === 0
  ) {
    return null;
  }

  // Validation functions
  const validateField = (name: string, value: string, showEmptyErrors: boolean = false) => {
    let message = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          message = showEmptyErrors ? "❗️Please enter your name" : "";
        } else if (value.trim().length < 2) {
          message = "❗️Name must be minimum 2 characters long";
        } else if (value.trim().length >= 50) {
          message = "❗️Name cannot be longer than 50 characters.";
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          message = "❗️Name can only contain letters and spaces";
        }
        break;
      case "email":
        if (!value.trim()) {
          message = showEmptyErrors ? "❗️Please enter your email address" : "";
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,20}$/;
          if (!emailRegex.test(value)) {
            message = "❗️Please enter a valid email address";
          }
        }
        break;
      case "blogTitle":
        if (!value.trim()) {
          message = showEmptyErrors ? "❗️Please enter blog title" : "";
        } else if (value.trim().length < 5) {
          message = "❗️Blog title must be minimum 5 characters long";
        } else if (value.trim().length >= 50) {
          message = "❗️Blog cannot be longer than 50 characters.";
        }
        break;
      // case "blogContent":
      //   if (!value.trim()) {
      //     message = showEmptyErrors ? "❗️Please enter blog content" : "";
      //   } else if (value.trim().length < 20) {
      //     message = "❗️Blog content must be atleast 20 characters long";
      //   }
      //   break;
      // case "tags":
      //   if (!value.trim()) {
      //     message = showEmptyErrors ? "❗️Please enter tags" : "";
      //   } else if (value.trim().length < 3) {
      //     message = "❗️Tags must be atleast 3 characters long";
      //   }
      //   break;
      case "authorBio":
        if (!value.trim()) {
          message = showEmptyErrors ? "❗️Please enter author bio" : "";
        } else if (value.replace(/\s/g, '').length < 150) {
          message = `❗️Author bio must contain minimum 150 characters`;
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  // Check if all required fields are filled and valid
  const isFormValid = () => {
    return (
      form.name.trim() !== "" &&
      form.email.trim() !== "" &&
      form.blogTitle.trim() !== "" &&
      form.authorBio.trim() !== "" &&
      form.uploadDocument !== null &&
      !errors.name &&
      !errors.email &&
      !errors.blogTitle &&
      !errors.authorBio &&
      !errors.uploadDocument
    );
  };

  const validateForm = () => {
    const nameValid = validateField("name", form.name, true);
    const emailValid = validateField("email", form.email, true);
    const blogTitleValid = validateField("blogTitle", form.blogTitle, true);
    // const blogContentValid = validateField("blogContent", form.blogContent, true);
    // const tagsValid = validateField("tags", form.tags, true);
    const authorBioValid = validateField("authorBio", form.authorBio, true);
    
    // Validate file upload
    let uploadDocumentValid = true;
    if (!form.uploadDocument) {
      setErrors((prev) => ({ ...prev, uploadDocument: "❗️Please upload a document" }));
      uploadDocumentValid = false;
    } else {
      setErrors((prev) => ({ ...prev, uploadDocument: "" }));
    }

    return (
      nameValid &&
      emailValid &&
      blogTitleValid &&
      // blogContentValid &&
      // tagsValid &&
      authorBioValid &&
      uploadDocumentValid
    );
  };

  const openPopup = () => {
    setIsPopupOpen(true);
    // Reset form data
    setForm({
      name: "",
      email: "",
      blogTitle: "",
      // blogContent: "",
      uploadDocument: null,
      // tags: "",
      authorBio: "",
    });
    // Reset validation states
    setErrors({
      name: "",
      email: "",
      blogTitle: "",
      // blogContent: "",
      // tags: "",
      authorBio: "",
      uploadDocument: "",
    });
    setTouched({
      name: false,
      email: false,
      blogTitle: false,
      // blogContent: false,
      // tags: false,
      authorBio: false,
      uploadDocument: false,
    });
    setIsSubmitted(false);
    setRecaptchaToken(null);
    recaptchaRef.current?.reset();
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // Request a Blog modal open/close
  const openRequestModal = () => {
    setIsRequestOpen(true);
    // Reset request form data
    setRequestForm({
      name: "",
      email: "",
      topic: "",
      purpose: "",
    });
    // Reset request validation states
    setRequestErrors({
      name: "",
      email: "",
      topic: "",
      purpose: "",
    });
    setRequestTouched({
      name: false,
      email: false,
      topic: false,
      purpose: false,
    });
    setRequestRecaptchaToken(null);
    requestRecaptchaRef.current?.reset();
  };
  const closeRequestModal = () => setIsRequestOpen(false);

  // Request a Blog validation
  const validateRequestField = (name: string, value: string, showEmptyErrors: boolean = false) => {
    let message = "";
    switch (name) {
      case "name":
        if (!value.trim()) message = showEmptyErrors ? "❗️Please enter your name" : "";
        else if (value.trim().length < 2) message = "❗️Name must be minimum 2 characters long";
        else if (value.trim().length >= 50) message = "❗️Name cannot be longer than 50 characters.";
        else if (!/^[a-zA-Z\s]+$/.test(value.trim())) message = "❗️Name can only contain letters and spaces";
        break;
      case "email":
        if (!value.trim()) message = showEmptyErrors ? "❗️Please enter your email address" : "";
        else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,20}$/;
          if (!emailRegex.test(value)) message = "❗️Please enter a valid email address";
        }
        break;
      case "topic":
        if (!value.trim()) message = showEmptyErrors ? "❗️Please enter a topic" : "";
        else if (value.trim().length >= 50) message = "❗️Topic cannot be longer than 50 characters.";
        break;
      case "purpose":
        if (!value.trim()) message = showEmptyErrors ? "❗️Please enter the purpose" : "";
        else if (value.replace(/\s/g, '').length < 50) message = `❗️Purpose must contain minimum 50 characters`;
        break;
      default:
        break;
    }
    setRequestErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const isRequestFormValid = () =>
    requestForm.name.trim() !== "" &&
    requestForm.email.trim() !== "" &&
    requestForm.topic.trim() !== "" &&
    requestForm.purpose.trim() !== "" &&
    !requestErrors.name &&
    !requestErrors.email &&
    !requestErrors.topic &&
    !requestErrors.purpose;

  const validateRequestForm = () => {
    const a = validateRequestField("name", requestForm.name, true);
    const b = validateRequestField("email", requestForm.email, true);
    const c = validateRequestField("topic", requestForm.topic, true);
    const d = validateRequestField("purpose", requestForm.purpose, true);
    return a && b && c && d;
  };

  // reCAPTCHA handlers
  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleRequestRecaptchaChange = (token: string | null) => {
    setRequestRecaptchaToken(token);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Prevent consecutive spaces for textarea fields
    if (e.target.tagName === 'TEXTAREA') {
      const lastChar = value.slice(-1);
      const secondLastChar = value.slice(-2, -1);
      if (lastChar === ' ' && secondLastChar === ' ') {
        return; // Prevent the change
      }
      
      // Enforce character limit for textarea fields
      if (name === 'authorBio' && value.replace(/\s/g, '').length > 500) {
        return; // Prevent typing beyond limit
      }
    }
    
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
    if (typeof value === "string" && value.trim() !== "") {
      // Only validate and mark as touched if user has actually entered some content
      setTouched((prev) => ({ ...prev, [name]: true }));
      validateField(name, value);
    }
    // Handle file validation on blur - only show error if user has interacted with file picker
    if (name === "uploadDocument") {
      // Only show error if the field was touched AND no file was selected
      // This prevents showing error immediately when just focusing the field
      if (!form.uploadDocument) {
        setErrors((prev) => ({ ...prev, uploadDocument: "❗️Please upload a document" }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (file.size > maxSize) {
        showToast("File size must be less than 5MB");
        setErrors((prev) => ({ ...prev, uploadDocument: "❗️File size must be less than 5MB" }));
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        showToast("Please upload only PDF or DOC files");
        setErrors((prev) => ({ ...prev, uploadDocument: "❗️Please upload only pdf or doc files" }));
        return;
      }

      setForm({ ...form, uploadDocument: file });

      // Clear any file-related errors if they exist
      if (errors.uploadDocument) {
        setErrors((prev) => ({ ...prev, uploadDocument: "" }));
      }
    }
  };

  const handleRequestChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Prevent consecutive spaces for textarea fields
    if (e.target.tagName === 'TEXTAREA') {
      const lastChar = value.slice(-1);
      const secondLastChar = value.slice(-2, -1);
      if (lastChar === ' ' && secondLastChar === ' ') {
        return; // Prevent the change
      }
      
      // Enforce character limit for textarea fields
      if (name === 'purpose' && value.replace(/\s/g, '').length > 500) {
        return; // Prevent typing beyond limit
      }
    }
    
    setRequestForm({ ...requestForm, [name]: value });
    if (requestErrors[name as keyof typeof requestErrors]) {
      setRequestErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Don't validate while typing - only clear errors
    // Validation will happen on blur or form submission
  };

  const handleRequestBlur = (name: string) => {
    const value = requestForm[name as keyof typeof requestForm];
    if (typeof value === "string" && value.trim() !== "") {
      // Only validate and mark as touched if user has actually entered some content
      setRequestTouched((prev) => ({ ...prev, [name]: true }));
      validateRequestField(name, value);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      blogTitle: true,
      // blogContent: true,
      // tags: true,
      authorBio: true,
      uploadDocument: true,
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

    try {
      // Upload file to Cloudinary if uploaded
      let cloudinaryUrl: string | null = null;
      if (form.uploadDocument) {
        try {
          cloudinaryUrl = await uploadToCloudinary(form.uploadDocument, "blog");
        } catch (uploadError) {
          console.error("Cloudinary upload failed:", uploadError);
          showToast("Error uploading file. Please try again.");
          return;
        }
      }

      // Build the fields object as per WPForms API (same structure as FAQ form)
      const fields: any = {
        1: {
          name: "Name",
          value: form.name,
          id: 1,
          type: "text",
        },
        2: {
          name: "Email",
          value: form.email,
          id: 2,
          type: "email",
        },
        3: {
          name: "Blog Title",
          value: form.blogTitle,
          id: 3,
          type: "text",
        },
        // 4: {
        //   name: "Blog Content",
        //   value: form.blogContent,
        //   id: 4,
        //   type: "textarea",
        // },
        // 6: {
        //   name: "Tags",
        //   value: form.tags,
        //   id: 6,
        //   type: "text",
        // },
        7: {
          name: "Author Bio",
          value: form.authorBio,
          id: 7,
          type: "textarea",
        },
      };

      // Add file information if uploaded
      if (form.uploadDocument && cloudinaryUrl) {
        fields[5] = {
          name: "Upload Document",
          value: cloudinaryUrl || "Document uploaded",
          id: 5,
          type: "file"
        };
      }

      const payload = {
        form_id: 1260,
        fields,
        recaptcha_token: recaptchaToken,
      };

      // Using fetch instead of axios to avoid dependency issues
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT_URL}/wp-json/custom/v1/submit-form`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      // Reset form on success
      setForm({
        name: "",
        email: "",
        blogTitle: "",
        // blogContent: "",
        uploadDocument: null,
        // tags: "",
        authorBio: "",
      });
      setIsSubmitted(true);

      // Reset validation states
      setTouched({
        name: false,
        email: false,
        blogTitle: false,
        // blogContent: false,
        // tags: false,
        authorBio: false,
        uploadDocument: false,
      });

      // Reset reCAPTCHA
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();

      // Show success toast and close modal after a small delay
      showToast("Form submitted successfully!", "success");

      // Small delay to ensure toast is visible before modal closes
      setTimeout(() => {
        closePopup();
        setIsSubmitted(false);
      }, 100);
    } catch (error: any) {
      console.error("Form submission error:", error);
      showToast("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setRequestTouched({ name: true, email: true, topic: true, purpose: true });

    // Validate form fields first
    if (!validateRequestForm()) {
      return;
    }

    // Check if reCAPTCHA is completed only after form validation passes
    if (!requestRecaptchaToken) {
      showToast("Please complete the reCAPTCHA verification");
      return;
    }

    setIsRequestSubmitting(true);
    try {
      const fields: any = {
        1: { name: "Name", value: requestForm.name, id: 1, type: "text" },
        2: { name: "Email", value: requestForm.email, id: 2, type: "email" },
        3: { name: "Topic", value: requestForm.topic, id: 3, type: "text" },
        8: { name: "Purpose", value: requestForm.purpose, id: 8, type: "textarea" },
      };

      const payload = {
        form_id: 2305,
        fields,
        recaptcha_token: requestRecaptchaToken,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT_URL}/wp-json/custom/v1/submit-form`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Form submission failed");

      setRequestForm({ name: "", email: "", topic: "", purpose: "" });
      setRequestTouched({ name: false, email: false, topic: false, purpose: false });
      setRequestRecaptchaToken(null);
      requestRecaptchaRef.current?.reset();
      showToast("Form submitted successfully!", "success");
      closeRequestModal();
    } catch (err) {
      console.error("Request Blog submission error:", err);
      showToast("Error submitting form. Please try again.");
    } finally {
      setIsRequestSubmitting(false);
    }
  };
  return (
    <>
      {
        techStory?.cards.length > 0 && (
          <section className="lg:pt-[120px] md:pt-[100px] pt-[60px] md:pb-[107px] pb-[80px]">
            <div className="container max-w-[1400px] px-[20px] mx-auto w-full">
              <div className="flex flex-col items-center justify-center gap-[16px] 2xl:mb-[60px] xl:mb-[60px] lg:mb-[50px] md:mb-[40px] sm:mb-[30px] mb-[60px]">
                <h2 className="h2 text-white text-center">{techStory?.title}</h2>
                <p className="font-lato font-normal text-[17px] leading-[26px] text-[#C3C3C3] text-center max-w-[1000px]">
                  {techStory?.description}
                </p>
              </div>
              <div className={`${techStory?.cards.length === 1 ? "" : "grid"} 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 2xl:gap-[60px] xl:gap-[60px] lg:gap-[40px] md:gap-[30px] sm:gap-[20px] gap-[20px]`}>
                {techStory?.cards?.map((card: any, index: number) => (
                  card.title && card.description && (
                    <div
                      key={index}
                      className="bg-[#FFFF]/10 2xl:py-[60px] xl:py-[60px] lg:py-[50px] md:py-[40px] sm:py-[30px] py-[20px] 2xl:px-[65px] xl:px-[65px] lg:px-[50px] md:px-[40px] sm:px-[40px] px-[40px] backdrop-blur-sm rounded-[16px]"
                    >
                      <div className="flex flex-col items-center justify-center 2xl:gap-[50px] xl:gap-[50px] lg:gap-[40px] md:gap-[30px] sm:gap-[20px] gap-[20px]">
                        <div className="flex flex-col items-center justify-center gap-[7px]">
                          <h4 className="font-denton 2xl:text-[34px] xl:text-[34px] lg:text-[30px] md:text-[25px] sm:text-[25px] text-[20px] text-white 2xl:leading-[45px] xl:leading-[45px] lg:leading-[40px] md:leading-[30px] sm:leading-[30px]leading-[30px] font-bold text-center">
                            {card.title}
                          </h4>
                          <p className="font-lato font-normal text-[17px] leading-[26px] text-center text-[#C3C3C3]">
                            {card.description}
                          </p>
                        </div>
                        <button
                          onClick={() => index === 0 ? openPopup() : openRequestModal()}
                          className="inline-block group"
                        >
                          <div className="btn-primary-outline">
                            <div className="btn-primary 2xl:px-[40px] xl:px-[40px] lg:px-[30px] md:px-[30px] sm:px-[20px] px-[20px]">
                              {card.buttonLink?.title}
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </section>
        )
      }

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999999]">
          <div onClick={closePopup} className="fixed inset-0"></div>
          <div className="min-h-screen px-4 sm:px-6 md:px-10 flex justify-center items-center">
            <div className="lg:w-[1000px] max-w-[1400px] 2xl:pt-[80px] xl:pt-[80px] lg:pt-[60px] md:pt-[50px] sm:pt-[60px] pt-[60px] 2xl:pb-[50px] xl:pb-[50px] lg:pb-[60px] md:pb-[50px] sm:pb-[40px] pb-[20px] 2xl:px-[130px] xl:px-[130px] lg:px-[60px] md:px-[50px] sm:px-[40px] px-[20px] bg-[#292929] rounded-[20px] mx-auto max-h-[90vh] overflow-y-auto relative custom-scrollbar">
              <button
                onClick={closePopup}
                className="absolute lg:top-[40px] lg:right-[40px] top-[20px] right-[5px] z-20 w-[43.84px] h-[43.84px] rounded-full flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity duration-300 group"
              >
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="1" className="group-hover:opacity-100 transition-opacity duration-300">
                    <path
                      d="M10.9603 10.9601C11.7413 10.1791 12.905 10.0764 13.5594 10.7308L33.1099 30.2813C33.7643 30.9357 33.6617 32.0994 32.8806 32.8804C32.0996 33.6615 30.9359 33.7641 30.2815 33.1098L10.731 13.5592C10.0766 12.9048 10.1792 11.7412 10.9603 10.9601Z"
                      fill="#E72125"
                    ></path>
                    <path
                      d="M32.8802 10.9598C33.6613 11.7409 33.7639 12.9045 33.1096 13.5589L13.559 33.1094C12.9046 33.7638 11.741 33.6612 10.9599 32.8801C10.1789 32.0991 10.0762 30.9354 10.7306 30.281L30.2811 10.7305C30.9355 10.0761 32.0992 10.1788 32.8802 10.9598Z"
                      fill="#E72125"
                    ></path>
                  </g>
                </svg>
              </button>
              <div className="flex flex-col items-center justify-center 2xl:mb-[30px] xl:mb-[30px] lg:mb-[25px] md:mb-[25px] sm:mb-[20px] mb-[20px]">
                <h2 className="font-denton px-[30px] md:px-[0px] font-bold 2xl:text-[66px] xl:text-[66px] lg:text-[50px] md:text-[40px] sm:text-[30px] text-[30px] 2xl:leading-[87px] xl:leading-[87px] lg:leading-[60px] md:leading-[55px] sm:leading-[35px] leading-[40px] text-center text-white">
                  Get Featured on Our Blog
                </h2>
                <p className="font-lato font-normal text-[17px] leading-[26px] text-[#C3C3C3]">
                  Share your original content and reach a wider audience.
                </p>
              </div>
              <form
                onSubmit={handleFormSubmit}
                className="flex flex-col items-center justify-center gap-[30px] w-full"
              >
                <div className="grid 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-cols-1 gap-[20px] w-full">
                  <div className="flex flex-col items-start">
                    <label className="font-lato font-normal text-[17px] leading-[100%] text-white mb-[16px]">
                      Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Your Name"
                      value={form.name}
                      onChange={handleFormChange}
                      onBlur={() => handleFieldBlur("name")}
                      maxLength={50}
                      className="rounded-[6px] py-[10px] px-[20px] text-left font-lato font-medium text-white text-[17px] leading-[20px] bg-[#D9D9D9]/20 w-full focus:bg-[#D9D9D9]/20 focus:border-transparent focus:outline-none focus:ring-0 autofill:bg-transparent placeholder:text-white-600"
                    />
                    {touched.name && errors.name && (
                      <p className="text-red-400 text-[14px] font-lato mt-2 ms-[16px]">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="font-lato font-normal text-[17px] leading-[100%] mb-[16px] text-white">
                      Email*
                    </label>
                    <input
                      type="text"
                      name="email"
                      placeholder="Enter Your Email"
                      value={form.email}
                      onChange={handleFormChange}
                      onBlur={() => handleFieldBlur("email")}
                      maxLength={50}
                      className="rounded-[6px] py-[10px] px-[20px] text-left font-lato font-medium text-white text-[17px] leading-[20px] bg-[#D9D9D9]/20 w-full focus:bg-[#D9D9D9]/20 focus:border-transparent focus:outline-none focus:ring-0 autofill:bg-transparent placeholder:text-white-600"
                    />
                    {touched.email && errors.email && (
                      <p className="text-red-400 text-[14px] font-lato mt-2 ms-[16px]">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="font-lato font-normal text-[17px] leading-[100%] mb-[16px] text-white">
                      Blog Title*
                    </label>
                    <input
                      type="text"
                      name="blogTitle"
                      placeholder="Enter Blog Title"
                      value={form.blogTitle}
                      onChange={handleFormChange}
                      onBlur={() => handleFieldBlur("blogTitle")}
                      maxLength={50}
                      className="rounded-[6px] py-[10px] px-[20px] text-left font-lato font-medium text-white text-[17px] leading-[20px] bg-[#D9D9D9]/20 w-full focus:bg-[#D9D9D9]/20 focus:border-transparent focus:outline-none focus:ring-0 autofill:bg-transparent placeholder:text-white-600"
                    />
                    {touched.blogTitle && errors.blogTitle && (
                      <p className="text-red-400 text-[14px] font-lato mt-2 ms-[16px]">
                        {errors.blogTitle}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="font-lato font-normal text-[17px] leading-[100%] mb-[16px] text-white">
                      Blog Content*
                    </label>
                    <div className="flex 2xl:flex-row xl:flex-row lg:flex-row md:flex-row sm:flex-col flex-col gap-[10px] w-full">
                      {/* <input
                        type="text"
                        name="blogContent"
                        placeholder="Enter Blog Content*"
                        value={form.blogContent}
                        onChange={handleFormChange}
                        onBlur={() => handleFieldBlur("blogContent")}
                        className="rounded-[6px] py-[10px] px-[20px] text-left font-lato font-medium text-white text-[17px] leading-[20px] bg-[#D9D9D9]/20 w-full focus:bg-[#D9D9D9]/20 focus:border-transparent focus:outline-none focus:ring-0 autofill:bg-transparent placeholder:text-[#E9E9E9] w-full"
                      /> */}
                      <div
                        className="flex items-start justify-start w-full py-[7px] px-[20px] rounded-[6px] border border-dashed border-[#FFFFFF66] text-white cursor-pointer transition focus-within:bg-[#D9D9D9]/30 bg-[#D9D9D9]/20 gap-[10px] focus-within:outline-none focus-within:ring-0 items-center"
                        tabIndex={0}
                        onClick={() => {
                          // Mark as touched only when user actually clicks to interact
                          setTouched((prev) => ({ ...prev, uploadDocument: true }));
                          document.getElementById('file-upload')?.click();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            // Mark as touched only when user actually interacts via keyboard
                            setTouched((prev) => ({ ...prev, uploadDocument: true }));
                            document.getElementById('file-upload')?.click();
                          }
                        }}
                      >
                        <span className="break-words max-w-[calc(100%-30px)] opacity-60">
                          {form.uploadDocument
                            ? (() => {
                                const fileName = form.uploadDocument.name;
                                if (fileName.length > 20) {
                                  const firstPart = fileName.substring(0, 10);
                                  const lastPart = fileName.substring(fileName.lastIndexOf('.'));
                                  const middlePart = fileName.substring(fileName.lastIndexOf('.') - 10, fileName.lastIndexOf('.'));
                                  return `${firstPart}...${middlePart}${lastPart}`;
                                }
                                return fileName;
                              })()
                            : "Upload Document"}
                        </span>
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px]">
                          <path d="M34.364 19.6362C33.93 19.6362 33.5138 19.8086 33.2069 20.1155C32.9 20.4224 32.7276 20.8386 32.7276 21.2726V28.1667C32.7263 29.3758 32.2454 30.5351 31.3904 31.3901C30.5354 32.2451 29.3762 32.726 28.167 32.7273H7.83335C6.62421 32.726 5.46496 32.2451 4.60996 31.3901C3.75497 30.5351 3.27406 29.3758 3.27276 28.1667V21.2726C3.27276 20.8386 3.10036 20.4224 2.79348 20.1155C2.48659 19.8086 2.07038 19.6362 1.63638 19.6362C1.20239 19.6362 0.786165 19.8086 0.479285 20.1155C0.172404 20.4224 0 20.8386 0 21.2726V28.1667C0.00216589 30.2435 0.828159 32.2347 2.29673 33.7033C3.7653 35.1719 5.75648 35.9979 7.83335 36H28.167C30.2439 35.9979 32.2351 35.1719 33.7036 33.7033C35.1722 32.2347 35.9982 30.2435 36.0004 28.1667V21.2726C36.0004 20.8386 35.828 20.4224 35.5211 20.1155C35.2142 19.8086 34.798 19.6362 34.364 19.6362Z" fill="#9E9E9E" />
                          <path d="M9.33765 12.6112L16.3626 5.58625V26.1817C16.3626 26.6157 16.535 27.0319 16.8419 27.3388C17.1488 27.6457 17.565 27.8181 17.999 27.8181C18.433 27.8181 18.8492 27.6457 19.1561 27.3388C19.463 27.0319 19.6354 26.6157 19.6354 26.1817V5.58625L26.6604 12.6112C26.969 12.9093 27.3823 13.0742 27.8114 13.0705C28.2405 13.0668 28.6509 12.8947 28.9543 12.5913C29.2577 12.2879 29.4298 11.8775 29.4335 11.4484C29.4372 11.0194 29.2723 10.606 28.9742 10.2974L19.1559 0.47911C18.8491 0.172336 18.4329 0 17.999 0C17.5651 0 17.149 0.172336 16.8421 0.47911L7.02381 10.2974C6.72573 10.606 6.56079 11.0194 6.56451 11.4484C6.56824 11.8775 6.74034 12.2879 7.04374 12.5913C7.34714 12.8947 7.75756 13.0668 8.18661 13.0705C8.61567 13.0742 9.02902 12.9093 9.33765 12.6112Z" fill="#9E9E9E" />
                        </svg>
                        <span className="opacity-50 text-[12px] ml-0 mt-[2px]">(.pdf, .doc, .docx)</span>
                        <input
                          id="file-upload"
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleFileChange}
                          onClick={(e) => {
                            // Reset the value so onChange can detect if user cancels
                            (e.target as HTMLInputElement).value = '';
                          }}
                          onBlur={() => {
                            // Check for validation error when field loses focus
                            if (touched.uploadDocument && !form.uploadDocument) {
                              setErrors((prev) => ({ ...prev, uploadDocument: "❗️Please upload a document" }));
                            }
                          }}
                          className="hidden"
                        />
                      </div>
                    </div>
                    {touched.uploadDocument && errors.uploadDocument && (
                      <p className="text-red-400 text-[14px] font-lato mt-2 ms-[16px]">
                        {errors.uploadDocument}
                      </p>
                    )}
                  </div>
                  {/* <div className="flex flex-col items-start gap-[16px]">
                    <label className="font-lato font-normal text-[17px] leading-[100%] text-white">
                      Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      placeholder="Enter Blog Tags"
                      value={form.tags}
                      onChange={handleFormChange}
                      onBlur={() => handleFieldBlur("tags")}
                      className="rounded-[6px] py-[10px] px-[20px] text-left font-lato font-medium text-white text-[17px] leading-[20px] bg-[#D9D9D9]/20 w-full focus:bg-[#D9D9D9]/20 focus:border-transparent focus:outline-none focus:ring-0 autofill:bg-transparent placeholder:text-[#E9E9E9]"
                    />
                    {touched.tags && errors.tags && (
                      <p className="text-red-400 text-[14px] font-lato">
                        {errors.tags}
                      </p>
                    )}
                  </div> */}
                  <div className="flex flex-col items-start lg:col-start-1 lg:col-span-2">
                    <label className="font-lato font-normal text-[17px] leading-[100%] mb-[16px] text-white">
                      Author Bio*
                    </label>
                    <textarea
                      name="authorBio"
                      placeholder="Enter Author Bio (minimum 150 characters)"
                      value={form.authorBio}
                      onChange={handleFormChange}
                      onBlur={() => handleFieldBlur("authorBio")}
                      className="rounded-[6px] py-[10px] px-[20px] text-left font-lato font-medium text-white text-[17px] leading-[20px] bg-[#D9D9D9]/20 w-full focus:bg-[#D9D9D9]/20 focus:border-transparent focus:outline-none focus:ring-0 autofill:bg-transparent placeholder:text-white-600 h-[100px]"
                    />
                    <div className="flex justify-between items-center w-full mt-2">
                      {touched.authorBio && errors.authorBio && (
                        <p className="text-red-400 text-[14px] font-lato ms-[16px]">
                          {errors.authorBio}
                        </p>
                      )}
                      <div className="flex items-center gap-1 ml-auto">
                        <span className="text-[12px] font-lato text-[#C3C3C3]">
                          {form.authorBio.replace(/\s/g, '').length}/500 characters
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-row flex-col sm:justify-between max-sm:justify-center max-sm:items-center items-center gap-[20px] w-full">
                  <div className="flex flex-col items-start mt-[0px] justify-start gap-[20px]">
                    <div className="flex justify-center">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                        onChange={handleRecaptchaChange}
                        theme="dark"
                        size="normal"
                      />
                    </div>
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
            </div>
          </div>
        </div>
      )}

      {isRequestOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999999]">
          <div onClick={closeRequestModal} className="fixed inset-0"></div>
          <div className="min-h-screen px-4 sm:px-6 md:px-10 flex justify-center items-center">
            <div className="lg:w-[1000px] max-w-[1400px] 2xl:pt-[80px] xl:pt-[80px] lg:pt-[60px] md:pt-[50px] sm:pt-[60px] pt-[60px] 2xl:pb-[50px] xl:pb-[5  0px] lg:pb-[60px] md:pb-[50px] sm:pb-[40px] pb-[20px] 2xl:px-[80px] xl:px-[80px] lg:px-[60px] md:px-[50px] sm:px-[40px] px-[20px] bg-[#292929] rounded-[20px] mx-auto max-h-[90vh] overflow-y-auto relative custom-scrollbar">
              <button
                onClick={closeRequestModal}
                className="absolute lg:top-[40px] lg:right-[40px] top-[20px] right-[5px] z-20 w-[43.84px] h-[43.84px] rounded-full flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity duration-300 group"
              >
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="1" className="group-hover:opacity-100 transition-opacity duration-300">
                    <path d="M10.9603 10.9601C11.7413 10.1791 12.905 10.0764 13.5594 10.7308L33.1099 30.2813C33.7643 30.9357 33.6617 32.0994 32.8806 32.8804C32.0996 33.6615 30.9359 33.7641 30.2815 33.1098L10.731 13.5592C10.0766 12.9048 10.1792 11.7412 10.9603 10.9601Z" fill="#E72125"></path>
                    <path d="M32.8802 10.9598C33.6613 11.7409 33.7639 12.9045 33.1096 13.5589L13.559 33.1094C12.9046 33.7638 11.741 33.6612 10.9599 32.8801C10.1789 32.0991 10.0762 30.9354 10.7306 30.281L30.2811 10.7305C30.9355 10.0761 32.0992 10.1788 32.8802 10.9598Z" fill="#E72125"></path>
                  </g>
                </svg>
              </button>

              <div className="flex flex-col items-center justify-center 2xl:mb-[30px] xl:mb-[30px] lg:mb-[25px] md:mb-[25px] sm:mb-[20px] mb-[20px]">
                <h2 className="font-denton px-[30px] md:px-[0px] font-bold 2xl:text-[66px] xl:text-[66px] lg:text-[50px] md:text-[40px] sm:text-[30px] text-[30px] 2xl:leading-[87px] xl:leading-[87px] lg:leading-[60px] md:leading-[55px] sm:leading-[35px] leading-[40px] text-center text-white">
                  Request A Blog
                </h2>
                <p className="font-lato font-normal text-[17px] leading-[26px] text-[#C3C3C3]">
                  Tell us what you'd like to read about on our blog.
                </p>
              </div>

              <form onSubmit={handleRequestSubmit} className="flex flex-col items-center justify-center gap-[30px] w-full">
                <div className="grid 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-cols-1 gap-[20px] w-full">
                  <div className="flex flex-col items-start">
                    <label className="font-lato font-normal text-[17px] leading-[100%] mb-[16px] text-white">Name*</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Your Name"
                      value={requestForm.name}
                      onChange={handleRequestChange}
                      onBlur={() => handleRequestBlur("name")}
                      maxLength={50}
                      className="rounded-[6px] py-[10px] px-[20px] text-left font-lato font-medium text-white text-[17px] leading-[20px] bg-[#D9D9D9]/20 w-full focus:bg-[#D9D9D9]/20 focus:border-transparent focus:outline-none focus:ring-0 autofill:bg-transparent placeholder:text-white-600"
                    />
                    {requestTouched.name && requestErrors.name && (
                      <p className="text-red-400 text-[14px] font-lat mt-2 ms-[16px]">{requestErrors.name}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-start">
                    <label className="font-lato font-normal text-[17px] leading-[100%] mb-[16px] text-white">Email*</label>
                    <input
                      type="text"
                      name="email"
                      placeholder="Enter Your Email"
                      value={requestForm.email}
                      onChange={handleRequestChange}
                      onBlur={() => handleRequestBlur("email")}
                      maxLength={50}
                      className="rounded-[6px] py-[10px] px-[20px] text-left font-lato font-medium text-white text-[17px] leading-[20px] bg-[#D9D9D9]/20 w-full focus:bg-[#D9D9D9]/20 focus:border-transparent focus:outline-none focus:ring-0 autofill:bg-transparent placeholder:text-white-600"
                    />
                    {requestTouched.email && requestErrors.email && (
                      <p className="text-red-400 text-[14px] font-lato mt-2 ms-[16px]">{requestErrors.email}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-start lg:col-start-1 lg:col-span-2">
                    <label className="font-lato font-normal text-[17px] leading-[100%] mb-[16px] text-white">Topic*</label>
                    <input
                      type="text"
                      name="topic"
                      placeholder="Enter Your Topic"
                      value={requestForm.topic}
                      onChange={handleRequestChange}
                      onBlur={() => handleRequestBlur("topic")}
                      maxLength={50}
                      className="rounded-[6px] py-[10px] px-[20px] text-left font-lato font-medium text-white text-[17px] leading-[20px] bg-[#D9D9D9]/20 w-full focus:bg-[#D9D9D9]/20 focus:border-transparent focus:outline-none focus:ring-0 autofill:bg-transparent placeholder:text-white-600"
                    />
                    {requestTouched.topic && requestErrors.topic && (
                      <p className="text-red-400 text-[14px] font-lato mt-2 ms-[16px]">{requestErrors.topic}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-start lg:col-start-1 lg:col-span-2">
                    <label className="font-lato font-normal text-[17px] leading-[100%] mb-[16px] text-white">Purpose*</label>
                    <textarea
                      name="purpose"
                      placeholder="Enter Your Purpose (minimum 50 characters)"
                      value={requestForm.purpose}
                      onChange={handleRequestChange}
                      onBlur={() => handleRequestBlur("purpose")}
                      className="rounded-[6px] py-[10px] px-[20px] text-left font-lato font-medium text-white text-[17px] leading-[20px] bg-[#D9D9D9]/20 w-full focus:bg-[#D9D9D9]/20 focus:border-transparent focus:outline-none focus:ring-0 autofill:bg-transparent placeholder:text-white-600 h-[100px]"
                    />
                    <div className="flex justify-between items-center w-full mt-2">
                      {requestTouched.purpose && requestErrors.purpose && (
                        <p className="text-red-400 text-[14px] font-lato ms-[16px]">{requestErrors.purpose}</p>
                      )}
                      <div className="flex items-center gap-1 ml-auto">
                        <span className="text-[12px] font-lato text-[#C3C3C3]">
                          {requestForm.purpose.replace(/\s/g, '').length}/500 characters
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-row flex-col sm:justify-between max-sm:justify-center max-sm:items-center items-center gap-[20px] w-full">
                  <div className="flex flex-col items-start mt-[0px] justify-start gap-[20px]">
                    <div className="flex justify-center">
                      <ReCAPTCHA
                        ref={requestRecaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                        className=""
                        onChange={handleRequestRecaptchaChange}
                        theme="dark"
                        size="normal"
                        />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isRequestSubmitting}
                    className="btn-primary bg-[#E72125] hover:bg-gradient-to-r from-[#E72125] to-[#8E1D1D] transition-all duration-300 ease-in-out [background-size:100%_153.5%] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRequestSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryToShare;
