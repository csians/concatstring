"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useQuery } from "@apollo/client";
import { GET_CONTACT_US } from "@/lib/queries";
import { uploadToCloudinary } from "@/lib/cloudinary-client";
import { setContactUsData } from "@/store/slices/contactSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";

// Type definitions
interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "textarea" | "select";
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface FormStep {
  id: string;
  title: string;
  fields?: FormField[];
  type?: "radio" | "file" | "textarea" | "multiselect";
  options?: string[];
  otherField?: boolean;
  description?: string;
  required?: boolean;
}

interface FormData {
  [key: string]: any;
}

type FormType = "startProject" | "joinTeam" | "dropLine" | null;

const MultiStepForm = () => {
  const dispatch = useDispatch();
  const cachedData = useSelector((state: RootState) => state.contact.contactUs);

  const { data } = useQuery(GET_CONTACT_US);

  // Store data in Redux when it comes from query
  useEffect(() => {
    if (data) {
      dispatch(setContactUsData(data));
    }
  }, [data, dispatch]);

  // Use cached data from Redux if available, otherwise use fresh data from query
  const contactData = cachedData || data;

  const [currentStep, setCurrentStep] = useState(0);
  const [formType, setFormType] = useState<FormType>(null);
  const [formData, setFormData] = useState<FormData>({});

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

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
  // Extract the first block with contactTitle and contactUsDescription
  const contactBlock =
    contactData?.page?.flexibleContent?.flexibleContent?.find(
      (block: any) =>
        block?.contactTitle &&
        block?.contactUsDescription &&
        block?.joinOurTeamLink
    );

  // Form steps configuration
  const formSteps: Record<string, FormStep[]> = {
    startProject: [
      {
        id: "contact-info",
        title: "Contact Information",
        fields: [
          {
            name: "fullName",
            label: "Full Name",
            type: "text",
            required: true,
          },
          {
            name: "email",
            label: "Email Address",
            type: "email",
            required: true,
          },
          {
            name: "phone",
            label: "Phone Number",
            type: "number",
            required: true,
          },
          {
            name: "agencyName",
            label: "Agency Name",
            type: "text",
            required: true,
          },
        ],
      },
      {
        id: "project-details",
        title: "Project Details",
        fields: [
          {
            name: "projectTitle",
            label: "Project Title",
            type: "textarea",
            required: true,
            placeholder: "Project Title (minimum 10 characters)",
          },
          {
            name: "projectDescription",
            label: "Project Description",
            type: "textarea",
            required: true,
            placeholder:
              "Provide Us Details About Your Project. (minimum 100 characters)",
          },
        ],
      },
      {
        id: "projectType",
        title: "What Type Of Project?",
        type: "multiselect",
        options: [
          "Web Development",
          "Mobile App Development",
          "UI/UX Design",
          "Backend/API Development",
          "Product Strategy / Consulting",
          "Maintenance & Support",
          "Other",
        ],
        otherField: true,
        required: true,
      },
      {
        id: "budget",
        title: "What Is the Budget for the Project?",
        type: "radio",
        options: [
          "<$5,000",
          "$5,000 – $10,000",
          "$10,000 – $25,000",
          "$25,000 – $50,000",
          "$50,000+",
          "Not sure yet",
        ],
        required: true,
      },
      {
        id: "timeline",
        title: "Project Timeline",
        type: "radio",
        options: [
          "ASAP",
          "1–3 months",
          "3–6 months",
          "Flexible",
          "Not sure yet",
        ],
        required: true,
      },
      {
        id: "attachments",
        title: "Attachments",
        type: "file",
        description: "Upload a brief, wireframe, or spec (.pdf, .doc, .docx, .txt)",
      },
      {
        id: "referral",
        title: "How Did You Hear About Us?",
        type: "radio",
        options: ["Google", "LinkedIn", "Referral", "Close friend", "Other"],
        otherField: true,
        required: true,
      },
      {
        id: "additionalNotes",
        title: "Additional Notes / Questions",
        type: "textarea",
        required: false,
      },
    ],
    joinTeam: [
      {
        id: "contact-info",
        title: "Contact Information",
        fields: [
          {
            name: "fullName",
            label: "Full name",
            type: "text",
            required: true,
          },
          {
            name: "email",
            label: "Email address",
            type: "email",
            required: true,
          },
          {
            name: "phone",
            label: "Phone number",
            type: "number",
            required: true,
          },
          {
            name: "agencyName",
            label: "Agency name",
            type: "text",
            required: true,
          },
        ],
      },
    ],
    dropLine: [
      {
        id: "contact-info",
        title: "Contact Information",
        fields: [
          {
            name: "fullName",
            label: "Full Name",
            type: "text",
            required: true,
          },
          { name: "email", label: "Email", type: "email", required: true },
          {
            name: "phone",
            label: "Phone Number",
            type: "number",
            required: true,
          },
          {
            name: "enquiryType",
            label: "Enquiry Type",
            type: "select",
            required: true,
            options: [
              "General Question",
              "New Project Inquiry",
              "Partnership Opportunity",
              "Support Request",
              "Other",
            ],
          },
          {
            name: "message",
            label: "Your Message",
            type: "textarea",
            required: true,
          },
        ],
      },
    ],
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleFormTypeSelect = (type: FormType) => {
    setFormType(type);
    setCurrentStep(0);

    // Clear all error states, touched states, and form data when switching forms
    setErrors({});
    setTouched({});
    setFormData({});
    setShowValidation(false);
    setCurrentStep(0);

    // Reset reCAPTCHA when switching forms
    setRecaptchaToken(null);
    recaptchaRef.current?.reset();

    // Initialize form data for multiselect fields
    if (type === "startProject") {
      const initialData: FormData = {};
      formSteps[type].forEach((step) => {
        if (step.type === "multiselect") {
          initialData[step.id] = [];
        }
      });
      setFormData(initialData);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    // Enforce character limits for specific fields (excluding spaces)
    if (field === "projectTitle" && typeof value === "string" && value.replace(/\s/g, '').length > 50) {
      return; // Prevent typing beyond limit
    }
    if (field === "projectDescription" && typeof value === "string" && value.replace(/\s/g, '').length > 500) {
      return; // Prevent typing beyond limit
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Don't validate while typing - only clear errors
    // Validation will happen on blur or form submission
  };

  const validateStep = (step: number) => {
    if (!formType) return false;

    const steps = formSteps[formType];
    if (!steps || step >= steps.length) return false;

    const currentStepData = steps[step];
    if (!currentStepData) return false;

    // Validate fields if they exist
    if (currentStepData.fields) {
      const fieldsValid = currentStepData.fields.every((field) => {
        const value = formData[field.name]?.trim?.() || "";

        if (field.required && !value) {
          return false;
        }

        // Email validation
        if (field.type === "email" && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,20}$/;
          if (!emailRegex.test(value)) {
            return false;
          }
        }

        // Phone number validation (10-15 digits)
        if (field.type === "number" && value) {
          const phoneRegex = /^[0-9]{10,15}$/;
          if (!phoneRegex.test(value)) {
            return false;
          }
        }

        // Name validation (only alphabets, no numbers or special characters, and length)
        if (field.name === "fullName" && value) {
          const nameRegex = /^[a-zA-Z\s]+$/;
          if (!nameRegex.test(value)) {
            return false;
          }
          // Check name length (minimum 2 characters, maximum 25 characters)
          if (value.trim().length < 2) {
            return false;
          }
          if (value.trim().length >= 25) {
            return false;
          }
        }

        // Agency name validation (minimum 5 characters, maximum 25 characters)
        if (field.name === "agencyName" && value) {
          if (value.trim().length < 5) {
            return false;
          }
          if (value.trim().length >= 25) {
            return false;
          }
        }

        // Project title validation (minimum 10 characters, maximum 50 characters)
        if (field.name === "projectTitle" && value) {
          if (value.replace(/\s/g, '').length < 10) {
            return false;
          }
          if (value.replace(/\s/g, '').length > 50) {
            return false;
          }
        }

        // Project description validation (minimum 100 characters, maximum 500 characters)
        if (field.name === "projectDescription" && value) {
          if (value.replace(/\s/g, '').length < 100) {
            return false;
          }
          if (value.replace(/\s/g, '').length > 500) {
            return false;
          }
        }

        return true;
      });

      if (!fieldsValid) return false;
    }

    // Validate radio button steps
    if (currentStepData.type === "radio") {
      const value = formData[currentStepData.id];
      if (value === undefined || value === "") {
        return false;
      }
      
      // If "Other" is selected, validate that the "Other" field is filled
      if (currentStepData.otherField && value === "Other") {
        const otherFieldValue = formData[`${currentStepData.id}Other`];
        if (!otherFieldValue || otherFieldValue.trim() === "") {
          return false;
        }
      }
      
      return true;
    }

    // Validate multiselect steps
    if (currentStepData.type === "multiselect") {
      const selectedValues = formData[currentStepData.id];
      if (!Array.isArray(selectedValues) || selectedValues.length === 0) {
        return false;
      }

      // If "Other" is selected, validate that the "Other" field is filled
      if (currentStepData.otherField && selectedValues.includes("Other")) {
        const otherFieldValue = formData[`${currentStepData.id}Other`];
        if (!otherFieldValue || otherFieldValue.trim() === "") {
          return false;
        }
      }

      return true;
    }

    // Validate file upload steps (optional)
    if (currentStepData.type === "file") {
      // File upload is optional, so always return true
      return true;
    }

    // Validate textarea steps (if they have required property)
    if (currentStepData.type === "textarea") {
      if (currentStepData.required) {
        const value = formData[currentStepData.id]?.trim?.() || "";
        if (!value) {
          return false;
        }
      }
      return true;
    }

    return true;
  };

  const canGoNext = () => {
    if (!formType) return false;
    
    // For the last step, don't allow going next
    if (currentStep >= formSteps[formType].length - 1) return false;
    
    // Always allow going to next step (validation will happen in handleNext)
    return true;
  };

  const canSubmit = () => {
    if (!formType) return false;

    const steps = formSteps[formType];
    if (!steps || currentStep !== steps.length - 1) return false;

    // Always allow submission (validation will happen in handleSubmit)
    return true;
  };

  const canGoBack = () => {
    // Allow going back if we're not at the first step, OR if we have a form type selected (to go back to form type selection)
    return currentStep > 0 || formType !== null;
  };

  const handleNext = () => {
    if (!formType) return;
    
    // Mark all fields in current step as touched to show validation errors
    const currentStepData = formSteps[formType][currentStep];
    if (currentStepData?.fields) {
      const touchedFields: Record<string, boolean> = {};
      currentStepData.fields.forEach((field: FormField) => {
        touchedFields[field.name] = true;
      });
      setTouched(prev => ({ ...prev, ...touchedFields }));
    }
    
    // Mark step-specific fields as touched for validation
    if (currentStepData?.type === "radio" || currentStepData?.type === "multiselect") {
      setTouched(prev => ({ ...prev, [currentStepData.id]: true }));
      // If "Other" is selected, mark the "Other" field as touched
      if (currentStepData.otherField) {
        const value = formData[currentStepData.id];
        if (currentStepData.type === "radio" && value === "Other") {
          setTouched(prev => ({ ...prev, [`${currentStepData.id}Other`]: true }));
        } else if (currentStepData.type === "multiselect" && Array.isArray(value) && value.includes("Other")) {
          setTouched(prev => ({ ...prev, [`${currentStepData.id}Other`]: true }));
        }
      }
    }
    
    // Validate the current step and set all validation errors
    validateCurrentStepAndSetErrors(currentStep);
    
    // Only proceed if validation passes
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (canGoBack()) {
      if (currentStep > 0) {
        // Go back to previous step within the form
        setCurrentStep((prev) => prev - 1);
      } else if (formType !== null) {
        // Go back to form type selection
        setFormType(null);
        setCurrentStep(0);
        setFormData({});
        setShowValidation(false);
        setErrors({});
        setTouched({});
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enable validation display when form submission is attempted
    setShowValidation(true);

    // Get current step data
    if (!formType) return;
    const steps = formSteps[formType];
    const currentStepData = steps[currentStep];

    // Mark all fields as touched to show validation errors
    if (currentStepData?.fields) {
      const touchedFields: Record<string, boolean> = {};
      currentStepData.fields.forEach((field: FormField) => {
        touchedFields[field.name] = true;
      });
      setTouched(prev => ({ ...prev, ...touchedFields }));
    }

    // Mark step-specific fields as touched for validation
    if (currentStepData?.type === "radio" || currentStepData?.type === "multiselect") {
      setTouched(prev => ({ ...prev, [currentStepData.id]: true }));
      // If "Other" is selected, mark the "Other" field as touched
      if (currentStepData.otherField) {
        const value = formData[currentStepData.id];
        if (currentStepData.type === "radio" && value === "Other") {
          setTouched(prev => ({ ...prev, [`${currentStepData.id}Other`]: true }));
        } else if (currentStepData.type === "multiselect" && Array.isArray(value) && value.includes("Other")) {
          setTouched(prev => ({ ...prev, [`${currentStepData.id}Other`]: true }));
        }
      }
    }

    // Validate the current step and set all validation errors
    validateCurrentStepAndSetErrors(currentStep);
    
    // Check if validation passed
    if (!validateStep(currentStep)) {
      return;
    }

    // Check if reCAPTCHA is completed
    if (!recaptchaToken) {
      showToast("Please complete the reCAPTCHA verification");
      return;
    }

    setIsSubmitting(true);
    let fields: any = {};
    let formId = 0;

    try {
      let uploadedFileUrl: string | null = null;

      // Step 1: If file exists, upload to Cloudinary
      if (formData.attachments && formData.attachments[0]) {
        try {
          uploadedFileUrl = await uploadToCloudinary(
            formData.attachments[0],
            "contact"
          );
        } catch (uploadError) {
          console.error("Cloudinary upload failed:", uploadError);
          showToast("Error uploading file. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }

      // Step 2: Build fields after file upload
      if (formType === "dropLine") {
        formId = 1841;
        fields = {
          6: {
            name: "How can we help?",
            value: formData.enquiryType,
            id: "6",
            type: "radio",
          },
          1: {
            name: "Full Name",
            value: formData.fullName,
            id: 1,
            type: "name",
          },
          2: { name: "Email", value: formData.email, id: 2, type: "textarea" },
          3: {
            name: "Phone",
            value: formData.phone || "",
            id: 3,
            type: "phone",
          },
          4: {
            name: "Enquiry",
            value: formData.enquiryType,
            id: 4,
            type: "select",
          },
          5: {
            name: "Message",
            value: formData.message,
            id: 5,
            type: "textarea",
          },
        };
      } else if (formType === "startProject") {
        formId = 1838;
        fields = {
          1: {
            name: "How can we help?",
            value: "Start A Project",
            id: 1,
            type: "radio",
          },
          5: { name: "Name", value: formData.fullName, id: 5, type: "name" },
          6: { name: "Email", value: formData.email, id: 6, type: "email" },
          7: {
            name: "Phone",
            value: formData.phone || "",
            id: 7,
            type: "phone",
          },
          8: {
            name: "Agency Name",
            value: formData.agencyName,
            id: 8,
            type: "text",
          },
          10: {
            name: "Project Title",
            value: formData.projectTitle,
            id: 10,
            type: "textarea",
          },
          11: {
            name: "Project Brief",
            value: formData.projectDescription,
            id: 11,
            type: "textarea",
          },
          13: {
            name: "What type of project?",
            value: formData.projectType.join(", "),
            id: 13,
            type: "checkbox",
          },
          15: {
            name: "What is the budget for the project?",
            value: formData.budget,
            id: 15,
            type: "radio",
          },
          16: {
            name: "Project Timeline",
            value: formData.timeline,
            id: 16,
            type: "checkbox",
          },
          19: {
            name: "Attatchment",
            value: uploadedFileUrl ? uploadedFileUrl : "",
            id: 19,
            type: "file",
          },
          21: {
            name: "How did you hear about us?",
            value: formData.referral,
            id: 21,
            type: "radio",
          },
          23: {
            name: "Additional Notes / Questions",
            value: formData.additionalNotes || "",
            id: 23,
            type: "radio",
          },
        };
      }

      // Step 3: Send to backend
      const payload = {
        form_id: formId,
        fields,
        // recaptcha_token: recaptchaToken
      };
      await axios.post(
        `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT_URL}/wp-json/custom/v1/submit-form`,
        payload,
        { headers: { "Content-Type": "application/json" }, timeout: 10000 }
      );

      setIsSubmitted(true);
      showToast("Form submitted successfully! We'll get back to you soon.", 'success');

      // Reset reCAPTCHA after successful submission
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      showToast("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (name: string) => {
    const value = formData[name] || "";
    if (typeof value === "string" && value.trim() !== "") {
      // Only validate and mark as touched if user has actually entered some content
      setTouched((prev) => ({ ...prev, [name]: true }));
      validateField(name, value, false); // Don't show empty errors on blur
    }
  };

  const validateCurrentStepAndSetErrors = (step: number) => {
    if (!formType) return;

    const steps = formSteps[formType];
    if (!steps || step >= steps.length) return;

    const currentStepData = steps[step];
    if (!currentStepData) return;

    const newErrors: Record<string, string> = {};

    // Validate fields if they exist
    if (currentStepData.fields) {
      currentStepData.fields.forEach((field) => {
        const value = formData[field.name]?.trim?.() || "";
        validateField(field.name, value, true); // Show all errors on submit
      });
    }

    // Validate radio button steps
    if (currentStepData.type === "radio") {
      const value = formData[currentStepData.id];
      if (value === undefined || value === "") {
        newErrors[currentStepData.id] = `❗️Please select an option`;
      }
      
      // If "Other" is selected, validate that the "Other" field is filled
      if (currentStepData.otherField && value === "Other") {
        const otherFieldValue = formData[`${currentStepData.id}Other`];
        if (!otherFieldValue || otherFieldValue.trim() === "") {
          newErrors[`${currentStepData.id}Other`] = "❗️Please specify the other option";
        }
      }
    }

    // Validate multiselect steps
    if (currentStepData.type === "multiselect") {
      const selectedValues = formData[currentStepData.id];
      if (!Array.isArray(selectedValues) || selectedValues.length === 0) {
        newErrors[currentStepData.id] = `❗️Please select at least one option for ${currentStepData.title}`;
      }

      // If "Other" is selected, validate that the "Other" field is filled
      if (currentStepData.otherField && selectedValues.includes("Other")) {
        const otherFieldValue = formData[`${currentStepData.id}Other`];
        if (!otherFieldValue || otherFieldValue.trim() === "") {
          newErrors[`${currentStepData.id}Other`] = "❗️Please specify the other option";
        }
      }
    }

    // Validate textarea steps (if they have required property)
    if (currentStepData.type === "textarea") {
      if (currentStepData.required) {
        const value = formData[currentStepData.id]?.trim?.() || "";
        if (!value) {
          newErrors[currentStepData.id] = `❗️Please enter ${currentStepData.title}`;
        }
      }
    }

    // Set all errors at once
    setErrors((prev) => ({ ...prev, ...newErrors }));
  };

  const validateField = (name: string, value: string, showEmptyErrors: boolean = false) => {
    let message = "";

    if (!formType) return false;

    const field = formSteps[formType]
      ?.flatMap((step) => step.fields || [])
      ?.find((f) => f.name === name);
    if (field) {
      // Check if field is required and empty
      if (field.required && !value.trim()) {
        if (showEmptyErrors) {
          switch (field.name) {
            case "fullName":
              message = "❗️Please enter your name";
              break;
            case "email":
              message = "❗️Please enter your email address";
              break;
            case "phone":
              message = "❗️Please enter your phone number";
              break;
            case "agencyName":
              message = "❗️Please enter your agency name";
              break;
            case "projectTitle":
              message = "❗️Please enter your project title";
              break;
            case "projectDescription":
              message = "❗️Please describe your project";
              break;
            case "enquiryType":
              message = "❗️Please select an enquiry type";
              break;
            case "message":
              message = "❗️Please enter your message";
              break;
            case "additionalNotes":
              message = "❗️Please enter additional notes or questions";
              break;
            default:
              message = `❗️Please enter ${field.label || name}`;
          }
        }
      }
      
      // Always validate field format/content if it has value (regardless of required status)
      if (value.trim()) {
        if (field.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,20}$/;
          if (!emailRegex.test(value)) {
            message = "❗️Please enter a valid email address";
          }
        } else if (field.type === "number") {
          const phoneRegex = /^[0-9]{10,15}$/;
          if (!phoneRegex.test(value)) {
            message = "❗️Phone number must be between 10 and 15 digits long.";
          }
        } else if (field.name === "fullName") {
          const nameRegex = /^[a-zA-Z\s]+$/;
          if (!nameRegex.test(value)) {
            message = "❗️Name can only contain letters and spaces";
          } else if (value.trim().length < 2) {
            message = "❗️Name must be at least 2 characters long";
          } else if (value.trim().length >= 25) {
            message = "❗️Name cannot be longer than 25 characters.";
          }
        } else if (field.name === "agencyName") {
          if (value.trim().length < 5) {
            message = "❗️Agency name must be atleast 5 characters long";
          } else if (value.trim().length >= 25) {
            message = "❗️Agency Name cannot be longer than 25 characters.";
          }
        } else if (field.name === "projectTitle") {
          if (value.replace(/\s/g, '').length < 10) {
            message = "❗️Project title must be at least 10 characters long";
          } else if (value.replace(/\s/g, '').length > 50) {
            message = "❗️Project title cannot be longer than 50 characters.";
          }
        } else if (field.name === "projectDescription") {
          if (value.replace(/\s/g, '').length < 100) {
            message = "❗️Project description must be at least 100 characters long";
          } else if (value.replace(/\s/g, '').length > 500) {
            message = "❗️Project description cannot be longer than 500 characters.";
          }
        }
      }
    }

    // Special validation for "Other" fields in multiselect
    if (name.endsWith("Other")) {
      const stepId = name.replace("Other", "");
      const step = formSteps[formType]?.find((s) => s.id === stepId);
      if (step?.type === "multiselect" && step.otherField) {
        const selectedValues = formData[stepId];
        if (
          selectedValues &&
          selectedValues.includes("Other") &&
          !value.trim()
        ) {
          message = "❗️Please specify the other option";
        }
      }
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const renderField = (field: FormField) => {
    const error = errors[field.name] || "";

    switch (field.type) {
      case "text":
      case "email":
        return (
          <div>
            <label className="font-lato font-normal text-[17px] leading-[100%] text-white mb-[16px]">
              {field.label}{field.required ? "*" : ""}
            </label>
            <input
              type={field.type}
              placeholder={field.label}
              required={field.required}
              value={formData[field.name] || ""}
              onBlur={() => handleBlur(field.name)}
              onChange={(e) => {
                let value = e.target.value;
                if (field.name === "fullName") {
                  // Only allow letters and spaces for name
                  value = value.replace(/[^a-zA-Z\s]/g, "");
                }
                handleInputChange(field.name, value);
              }}
              className="w-full h-[60px] mt-3 px-[20px] py-[15px] rounded-[12px] border border-[#FFFFFF70] bg-transparent text-white font-monte font-medium text-[16px] leading-[24px] placeholder:text-white-600 focus:bg-[#D9D9D94D] !focus:border-0 focus:outline-none focus:ring-0 transition-all duration-300"
            />
            {error && (
              <p className="font-denton mt-1 text-red-400 text-sm ms-[17px] mt-2">
                {error}
              </p>
            )}
          </div>
        );
      case "number":
        return (
          <div>
            <label className="font-lato font-normal text-[17px] leading-[100%] text-white mb-[16px]">
              {field.label}{field.required ? "*" : ""}
            </label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={field.label}
              required={field.required}
              value={formData[field.name] || ""}
              onBlur={() => handleBlur(field.name)}
              onChange={(e) => {
                let value = e.target.value;
                // Only allow numbers
                value = value.replace(/\D/g, "");
                // Limit to 15 digits
                if (value.length > 15) value = value.slice(0, 15);
                handleInputChange(field.name, value);
              }}
              onKeyPress={(e) => {
                // Prevent non-numeric characters
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className="w-full h-[60px] mt-3 px-[20px] py-[15px] rounded-[12px] border border-[#FFFFFF70] bg-transparent text-white font-monte font-medium text-[16px] leading-[24px] placeholder:text-white-600 focus:bg-[#D9D9D94D] !focus:border-0 focus:outline-none focus:ring-0 transition-all duration-300"
            />
            {error && (
              <p className="font-denton mt-1 text-red-400 text-sm ms-[17px] mt-2">
                {error}
              </p>
            )}
          </div>
        );
      case "textarea":
        return (
          <div>
            <label className="font-lato font-normal text-[17px] leading-[100%] text-white mb-[16px]">
              {field.label}{field.required ? "*" : ""}
            </label>
            <textarea
              placeholder={
                field.placeholder || field.label
              }
              required={field.required}
              value={formData[field.name] || ""}
              onBlur={() => handleBlur(field.name)}
              onChange={(e) => handleInputChange(field.name, e.target.value)}

              className="w-full min-h-[120px] mt-3 px-[20px] py-[15px] rounded-[12px] border border-[#FFFFFF70] bg-transparent text-white font-monte font-medium text-[16px] leading-[24px] placeholder:text-white-600 focus:bg-[#D9D9D94D] !focus:border-0 focus:outline-none focus:ring-0 transition-all duration-300 resize-none"
            />
            <div className="flex justify-between items-center w-full mt-2">
              {touched[field.name] && error && (
                <p className="font-denton text-red-400 text-sm ms-[17px]">
                  {error}
                </p>
              )}
              {(field.name === "projectTitle" || field.name === "projectDescription") && (
                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-[12px] font-lato text-[#C3C3C3]">
                    {(formData[field.name] || "").replace(/\s/g, '').length}/{field.name === "projectTitle" ? "50" : "500"} characters
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      case "select":
        return (
          <div>
            <label className="font-lato font-normal text-[17px] leading-[100%] text-white mb-[16px]">
              {field.label}{field.required ? "*" : ""}
            </label>
            <select
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              className="w-full h-[60px] mt-3 px-[20px] py-[15px] rounded-[12px] border border-[#FFFFFF70] bg-transparent text-white font-monte font-medium text-[16px] leading-[24px] focus:bg-[#D9D9D94D] !focus:border-0 focus:outline-none focus:ring-0 transition-all duration-300 appearance-none select"
            >
              <option
                value=""
                className="font-monte font-medium text-white leading-[24px] bg-[#2B2B2B]"
              >
                {field.label}
              </option>
              {field.options?.map((option, index) => (
                <option
                  key={index}
                  value={option}
                  className="font-monte font-medium text-white leading-[24px] bg-[#2B2B2B]"
                >
                  {option}
                </option>
              ))}
            </select>
            {errors[field.name] && (
              <p className="font-denton mt-1 text-red-400 text-sm ms-[17px] mt-2">
                {errors[field.name]}
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderRadioOptions = (step: FormStep) => {
    return (
      <div className="flex items-center justify-center w-full flex-row flex-wrap 2xl:gap-[30px] xl:gap-[30px] lg:gap-[25px] mb:gap-[20px] sm:gap-[20px] gap-[20px] 2xl:mb-[0px] xl:mb-[0px] lg:mb-[0px] md:mb-[10px] sm:mb-[15px] mb-[15px]">
        {step.options?.map((option, index) => (
          <div
            key={index}
            className="p-[1px] rounded-full bg-[linear-gradient(180deg,_#E72125_0%,_#8E1D1D_100%)] 2xl:w-[260px] xl:w-[260px] lg:w-[260px] md:w-full sm:w-full w-full cursor-pointer"
          >
            <div
              className={`flex items-center justify-center rounded-full p-[20px] 2xl:w-[258px] xl:w-[258px] lg:w-[258px] md:w-full sm:w-full w-full cursor-pointer transition-all duration-300 ${formData[step.id] === option
                ? "bg-[linear-gradient(180deg,_#E72125_0%,_#8E1D1D_100%)]"
                : "bg-[#2B2B2B] hover:bg-[linear-gradient(180deg,_#E72125_0%,_#8E1D1D_100%)]"
                }`}
              onClick={() => handleInputChange(step.id, option)}
            >
              <input
                type="radio"
                name={step.id}
                id={`${step.id}-${index}`}
                className="hidden"
                checked={formData[step.id] === option}
                onChange={() => handleInputChange(step.id, option)}
              />
              <label
                htmlFor={`${step.id}-${index}`}
                className="text-center text-white font-denton font-bold 2xl:text-[18px] xl:text-[18px] lg:text-[18px] md:text-[18px] sm:text-[16px] text-[16px] leading-[100%] cursor-pointer"
              >
                {option}
              </label>
            </div>
          </div>
        ))}

        {/* Error display for main step validation */}
        {errors[step.id] && (
          <div className="text-center mt-[15px] w-full">
            <p className="font-denton text-red-400 text-sm">
              {errors[step.id]}
            </p>
          </div>
        )}

        {step.otherField && formData[step.id] === "Other" && (
          <div className="w-full mx-auto text-center">
            <input
              type="text"
              placeholder="Please Specify*"
              value={formData[`${step.id}Other`] || ""}
              onChange={(e) =>
                handleInputChange(`${step.id}Other`, e.target.value)
              }
              onBlur={() => handleBlur(`${step.id}Other`)}
              className="w-full mt-3 h-[60px] px-[20px] py-[15px] rounded-[12px] border border-[#FFFFFF70] bg-transparent text-white font-monte font-medium text-[16px] leading-[24px] placeholder:text-white-600 focus:bg-[#D9D9D94D] !focus:border-0 focus:outline-none focus:ring-0 transition-all duration-300 lg:max-w-[500px] mx-auto"
            />
            {errors[`${step.id}Other`] && (
              <p className="font-denton mt-1 text-red-400 text-sm ms-[17px] mt-2">
                {errors[`${step.id}Other`]}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderMultiselect = (step: FormStep) => {
    const selectedValues = formData[step.id] || [];

    const handleOptionToggle = (option: string) => {
      const currentValues = Array.isArray(selectedValues) ? selectedValues : [];
      const newValues = currentValues.includes(option)
        ? currentValues.filter((val) => val !== option)
        : [...currentValues, option];

      handleInputChange(step.id, newValues);
    };

    return (
      <div className="w-full">
        {/* Instructions */}
        <div className="text-center mb-[20px]">
          <p className="text-white font-lato text-[16px] leading-[24px]">
            💡 <strong>Select one or more options</strong>
          </p>
        </div>

        <div className="flex items-center justify-center w-full flex-row flex-wrap 2xl:gap-[30px] xl:gap-[30px] lg:gap-[25px] mb:gap-[20px] sm:gap-[20px] gap-[20px] 2xl:mb-[0px] xl:mb-[0px] lg:mb-[0px] md:mb-[10px] sm:mb-[15px] mb-[15px]">
          {step.options?.map((option, index) => (
            <div
              key={index}
              className="p-[1px] rounded-full bg-[linear-gradient(180deg,_#E72125_0%,_#8E1D1D_100%)] 2xl:w-[260px] xl:w-[260px] lg:w-[260px] md:w-full sm:w-full w-full cursor-pointer"
            >
              <div
                className={`flex items-center justify-center rounded-full p-[20px] 2xl:w-[258px] xl:w-[258px] lg:w-[258px] md:w-full sm:w-full w-full cursor-pointer transition-all duration-300 relative ${selectedValues.includes(option)
                  ? "bg-[linear-gradient(180deg,_#E72125_0%,_#8E1D1D_100%)] text-white"
                  : "bg-[#2B2B2B] hover:bg-[linear-gradient(180deg,_#E72125_0%,_#8E1D1D_100%)] text-white"
                  }`}
                onClick={() => handleOptionToggle(option)}
              >

                <input
                  type="checkbox"
                  name={step.id}
                  id={`${step.id}-${index}`}
                  className="hidden"
                  checked={selectedValues.includes(option)}
                  onChange={() => handleOptionToggle(option)}
                />
                <span className="text-center font-denton font-bold 2xl:text-[18px] xl:text-[18px] lg:text-[18px] md:text-[18px] sm:text-[16px] text-[16px] leading-[100%] cursor-pointer pointer-events-none">
                  {option}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Error display */}
        {errors[step.id] && (
          <div className="text-center mt-[15px]">
            <p className="font-denton text-red-400 text-sm">
              {errors[step.id]}
            </p>
          </div>
        )}

        {step.otherField && selectedValues.includes("Other") && (
          <div className="w-full md:mt-[30px] lg:mt-[25px] mt-[20px] lg:max-w-[500px] mx-auto">
            <input
              type="text"
              placeholder="Please Specify*"
              value={formData[`${step.id}Other`] || ""}
              onChange={(e) =>
                handleInputChange(`${step.id}Other`, e.target.value)
              }
              onBlur={() => handleBlur(`${step.id}Other`)}
              className="w-full mt-3 h-[60px] px-[20px] py-[15px] rounded-[12px] border border-[#FFFFFF70] bg-transparent text-white font-monte font-medium text-[16px] leading-[24px] placeholder:text-white-600 focus:bg-[#D9D9D94D] !focus:border-0 focus:outline-none focus:ring-0 transition-all duration-300"
            />
            {errors[`${step.id}Other`] && (
              <p className="font-denton mt-1 text-red-400 text-sm ms-[17px] mt-2">
                {errors[`${step.id}Other`]}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderFileUpload = (step: FormStep) => {
    return (
      <div className="w-full flex justify-center">
        <div className="p-[1px] rounded-[20px] bg-[linear-gradient(180deg,_#E72125_0%,_#8E1D1D_100%)] w-full cursor-pointer">
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center bg-[#2B2B2B] rounded-[20px] p-[30px] w-full hover:bg-[linear-gradient(180deg,_#E72125_0%,_#8E1D1D_100%)] cursor-pointer flex-col gap-[15px] transition-all duration-300 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="36"
              viewBox="0 0 40 36"
              fill="none"
            >
              <path d="M34.364 19.6362C33.93 19.6362 33.5138 19.8086 33.2069 20.1155C32.9 20.4224 32.7276 20.8386 32.7276 21.2726V28.1667C32.7263 29.3758 32.2454 30.5351 31.3904 31.3901C30.5354 32.2451 29.3762 32.726 28.167 32.7273H7.83335C6.62421 32.726 5.46496 32.2451 4.60996 31.3901C3.75497 30.5351 3.27406 29.3758 3.27276 28.1667V21.2726C3.27276 20.8386 3.10036 20.4224 2.79348 20.1155C2.48659 19.8086 2.07038 19.6362 1.63638 19.6362C1.20239 19.6362 0.786165 19.8086 0.479285 20.1155C0.172404 20.4224 0 20.8386 0 21.2726V28.1667C0.00216589 30.2435 0.828159 32.2347 2.29673 33.7033C3.7653 35.1719 5.75648 35.9979 7.83335 36H28.167C30.2439 35.9979 32.2351 35.1719 33.7036 33.7033C35.1722 32.2347 35.9982 30.2435 36.0004 28.1667V21.2726C36.0004 20.8386 35.828 20.4224 35.5211 20.1155C35.2142 19.8086 34.798 19.6362 34.364 19.6362Z" fill="white" />
              <path d="M9.33765 12.6112L16.3626 5.58625V26.1817C16.3626 26.6157 16.535 27.0319 16.8419 27.3388C17.1488 27.6457 17.565 27.8181 17.999 27.8181C18.433 27.8181 18.8492 27.6457 19.1561 27.3388C19.463 27.0319 19.6354 26.6157 19.6354 26.1817V5.58625L26.6604 12.6112C26.969 12.9093 27.3823 13.0742 27.8114 13.0705C28.2405 13.0668 28.6509 12.8947 28.9543 12.5913C29.2577 12.2879 29.4298 11.8775 29.4335 11.4484C29.4372 11.0194 29.2723 10.606 28.9742 10.2974L19.1559 0.47911C18.8491 0.172336 18.4329 0 17.999 0C17.5651 0 17.149 0.172336 16.8421 0.47911L7.02381 10.2974C6.72573 10.606 6.56079 11.0194 6.56451 11.4484C6.56824 11.8775 6.74034 12.2879 7.04374 12.5913C7.34714 12.8947 7.75756 13.0668 8.18661 13.0705C8.61567 13.0742 9.02902 12.9093 9.33765 12.6112Z" fill="white" />
            </svg>
            <span className="font-lato font-normal text-[18px] leading-[24px] text-white text-center">
              {step.description}
            </span>
            <input
              id="file-upload"
              type="file"
              className="hidden mt-3"
              onChange={(e) => handleInputChange("attachments", e.target.files)}
              accept=".pdf,.doc,.docx,.txt"
            />
            {formData.attachments && formData.attachments.length > 0 && (
              <p className="text-sm text-white mt-1 mb-3">
                {formData.attachments[0].name}
              </p>
            )}
          </label>
        </div>
      </div>
    );
  };
  const renderStep = () => {
    if (!formType) {
      return (
        <div className="w-full">
          <div className="flex items-center justify-center w-full flex-row flex-wrap 2xl:gap-[30px] xl:gap-[30px] lg:gap-[25px] mb:gap-[20px] sm:gap-[20px] gap-[20px] 2xl:mb-[0px] xl:mb-[0px] lg:mb-[0px] md:mb-[10px] sm:mb-[15px] mb-[15px]">
            <div className="p-[1px] rounded-full bg-[linear-gradient(180deg,_#E72125_0%,_#8E1D1D_100%)] 2xl:w-[260px] xl:w-[260px] lg:w-[260px] md:w-full sm:w-full w-full cursor-pointer">
              <div
                className="flex items-center justify-center bg-[#2B2B2B] rounded-full 2xl:p-[20px] xl:p-[20px] lg:p-[20px] md:p-[15px] sm:p-[15px] p-[15px] 2xl:w-[258px] xl:w-[258px] lg:w-[258px] md:w-full sm:w-full w-full hover:bg-[linear-gradient(180deg,_#E72125_0%,_#8E1D1D_100%)] cursor-pointer"
                onClick={() => handleFormTypeSelect("startProject")}
              >
                <input
                  type="radio"
                  name="project-type"
                  id="start-project"
                  className="hidden"
                />
                <label
                  htmlFor="start-project"
                  className="text-center text-white font-denton font-bold text-[18px] leading-[100%] cursor-pointer"
                >
                  Start A Project
                </label>
              </div>
            </div>
            <div className="p-[1px] rounded-full bg-[linear-gradient(180deg,_#E72125_0%,_#8E1D1D_100%)] 2xl:w-[260px] xl:w-[260px] lg:w-[260px] md:w-full sm:w-full w-full cursor-pointer">
              <div
                className="flex items-center justify-center bg-[#2B2B2B] rounded-full 2xl:p-[20px] xl:p-[20px] lg:p-[20px] md:p-[15px] sm:p-[15px] p-[15px] 2xl:w-[258px] xl:w-[258px] lg:w-[258px] md:w-full sm:w-full w-full hover:bg-[linear-gradient(180deg,_#E72125_0%,_#8E1D1D_100%)] cursor-pointer"
                onClick={() =>
                  window.open(contactBlock?.joinOurTeamLink, "_blank")
                }
              >
                <input
                  type="radio"
                  name="project-type"
                  id="join"
                  className="hidden"
                />
                <label
                  htmlFor="join"
                  className="text-center text-white font-denton font-bold 2xl:text-[18px] xl:text-[18px] lg:text-[18px] md:text-[18px] sm:text-[16px] text-[16px] leading-[100%] cursor-pointer"
                >
                  Join Our Team
                </label>
              </div>
            </div>
            <div className="p-[1px] rounded-full bg-[linear-gradient(180deg,_#E72125_0%,_#8E1D1D_100%)] 2xl:w-[260px] xl:w-[260px] lg:w-[260px] md:w-full sm:w-full w-full cursor-pointer">
              <div
                className="flex items-center justify-center bg-[#2B2B2B] rounded-full 2xl:p-[20px] xl:p-[20px] lg:p-[20px] md:p-[15px] sm:p-[15px] p-[15px] 2xl:w-[258px] xl:w-[258px] lg:w-[258px] md:w-full sm:w-full w-full hover:bg-[linear-gradient(180deg,_#E72125_0%,_#8E1D1D_100%)] cursor-pointer"
                onClick={() => handleFormTypeSelect("dropLine")}
              >
                <input
                  type="radio"
                  name="project-type"
                  id="drop"
                  className="hidden"
                />
                <label
                  htmlFor="drop"
                  className="text-center text-white font-denton font-bold 2xl:text-[18px] xl:text-[18px] lg:text-[18px] md:text-[18px] sm:text-[16px] text-[16px] leading-[100%] cursor-pointer"
                >
                  Drop Us A Line
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const steps = formSteps[formType];
    const currentStepData = steps[currentStep];
    if (isSubmitted) {
      return (
        <div className="w-full text-center text-white">
          <h3 className="font-denton font-bold text-[40px] mb-[30px]">
            Thank you!
          </h3>
          <p className="font-lato text-[16px] mb-[30px]">
            Your submission has been received.
          </p>
          <button
            onClick={() => {
              setFormType(null);
              setCurrentStep(0);
              setFormData({});
              setIsSubmitted(false);
              setShowValidation(false);
              setErrors({});
              setTouched({});
            }}
            className="px-[40px] py-[16px] rounded-full bg-gradient-to-b from-[#E72125] to-[#8E1D1D] text-white font-denton font-bold text-[18px] leading-[120%] transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#E72125] focus:ring-opacity-50 2xl:mb-[0px] xl:mb-[0px] lg:mb-[0px] md:mb-[10px] sm:mb-[15px] mb-[15px]"
          >
            Start Over
          </button>
        </div>
      );
    }

    return (
      <div className="w-full">
        <div className="w-full">
          {currentStepData.fields && (
            <div className="flex items-start justify-start w-full 2xl:gap-[30px] xl:gap-[30px] lg:gap-[25px] mb:gap-[20px] sm:gap-[20px] gap-[20px] flex-wrap">
              {currentStepData.fields.map((field, index) => (
                <div
                  key={index}
                  className={`${field.name === "message"
                    ? "w-full"
                    : "2xl:w-[calc(50%-15px)] xl:w-[calc(50%-15px)] lg:w-[calc(50%-15px)] md:w-[calc(50%-15px)] sm:w-full w-full"
                    }`}
                >
                  {renderField(field)}
                </div>
              ))}
            </div>
          )}

          {currentStepData.type === "radio" && (
            <div className="w-full">{renderRadioOptions(currentStepData)}</div>
          )}

          {currentStepData.type === "multiselect" && (
            <div className="w-full">{renderMultiselect(currentStepData)}</div>
          )}

          {currentStepData.type === "file" && (
            <div className="w-full">{renderFileUpload(currentStepData)}</div>
          )}

          {currentStepData.type === "textarea" && (
            <div className="w-full">
              <label className="font-lato font-normal text-[17px] leading-[100%] text-white mb-[16px]">
                {currentStepData.title}{currentStepData.required ? "*" : ""}
              </label>
              <textarea
                placeholder={currentStepData.title}
                required={currentStepData.required}
                value={formData[currentStepData.id] || ""}
                onChange={(e) =>
                  handleInputChange(currentStepData.id, e.target.value)
                }
                className="w-full min-h-[120px] mt-3 px-[20px] py-[15px] rounded-[12px] border border-[#FFFFFF70] bg-transparent text-white font-monte font-medium text-[16px] leading-[24px] placeholder:text-white-600 focus:bg-[#D9D9D94D] !focus:border-0 focus:outline-none focus:ring-0 transition-all duration-300 resize-none"
              />
            </div>
          )}

          <div className="w-full flex justify-center">
            {currentStep === steps.length - 1 ? (
              <div className="flex flex-row justify-center max-sm:flex-col sm:mb-[100px] items-center gap-[20px] w-full">
                <div className="flex flex-row items-start mt-[20px] justify-between gap-[20px] w-full">
                  {/* reCAPTCHA */}
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
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit() || isSubmitting}
                  className={`2xl:mb-[0px] xl:mb-[0px] lg:mb-[0px] md:mb-[10px] sm:mb-[15px] mb-[15px] px-[40px] py-[16px] btn-primary bg-[#E72125] hover:bg-gradient-to-r from-[#E72125] to-[#8E1D1D] transition-all duration-300 ease-in-out [background-size:100%_153.5%] disabled:opacity-50 disabled:cursor-not-allowed ${
                    !canSubmit() || isSubmitting
                      ? "bg-gradient-to-b from-[#E72125] to-[#8E1D1D] cursor-not-allowed opacity-100 pointer-events-none hover:scale-100"
                      : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext()}
                className={`2xl:mb-[0px] xl:mb-[0px] lg:mb-[0px] md:mb-[0px] sm:mb-[15px] mb-[15px] mt-[30px] btn-primary bg-[#E72125] hover:bg-gradient-to-r from-[#E72125] to-[#8E1D1D] transition-all duration-300 ease-in-out [background-size:100%_153.5%] disabled:opacity-50 disabled:cursor-not-allowed ${
                  !canGoNext()
                    ? "bg-gray-600 cursor-not-allowed opacity-0 hover:scale-100"
                    : ""
                }`}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getStepTitle = () => {
    if (!formType) return "How can we help?";

    const steps = formSteps[formType];
    const currentStepData = steps[currentStep];

    if (!currentStepData) return "Thank you!";

    return currentStepData.title;
  };

  const getStepNumber = () => {
    if (!formType) return "";

    const steps = formSteps[formType];
    const currentStepNumber = currentStep + 1;
    const totalSteps = steps.length;

    return `${String(currentStepNumber).padStart(2, "0")}/${String(
      totalSteps
    ).padStart(2, "0")}`;
  };

  return (
    <section className="bg-[linear-gradient(358.24deg,_rgba(44,56,148,0)_-2.9%,_rgba(84,163,218,0.5)_98.71%)] py-[120px] pt-[200px] sm:pt-[200px] md:pt-[240px] lg:pt-[240px] xl:pt-[250px] 2xl:pt-[254px]">
      <div className="container max-w-[1640px] px-[20px] w-full mx-auto">        
        <div className="flex flex-col items-center justify-center lg:gap-[120px] md:gap-[80px] gap-[50px]">
          <div className="flex flex-col gap-[16px] items-center justify-center">
            <h2 className="h2 text-white text-center 2xl:leading-[120px] xl:leading-[120px] lg:leading-[100px] md:leading-[80px] sm:leading-[60px] leading-[50px]">
              {contactBlock?.contactTitle ||
                "Let's Build Something Great Together"}
            </h2>
            <p className="text-[#C3C3C3] font-lato text-[16px] leading-[26px] font-medium text-center">
              {contactBlock?.contactUsDescription ||
                "We're excited to hear about your ideas. Fill out the form below or reach out directly, and our team will get back to you shortly."}
            </p>
          </div>

          <div className="max-lg:bg-[#2e0707]  lg:bg-[url('/images/contact/box-bg.svg')] 2xl:px-[130px] xl:px-[130px] lg:px-[100px] md:px-[80px] sm:px-[50px] px-[30px] rounded-[34px] 2xl:min-h-[900px] xl:min-h-[900px] lg:min-h-[900px] md:min-h-full sm:min-h-full min-h-full mb-[24px] sm:mb-[40px] md:mb-[50px] lg:mb-[60px] w-full relative bg-cover bg-bottom h-full flex justify-center items-center relative pt-[50px] pb-[50px] overflow-hidden">
            <div className="flex flex-col items-center justify-center h-full w-full">
              <div className="flex flex-col items-center justify-center w-full self-center justify-self-center h-full">
                <h2 className="font-denton font-bold 2xl:text-[92px] xl:text-[92px] lg:text-[70px] md:text-[50px] sm:text-[40px] text-[30px] 2xl:leading-[122px] xl:leading-[122px] lg:leading-[100px] md:leading-[60px] sm:leading-[50px] leading-[40px] text-center text-white 2xl:mb-[60px] xl:mb-[60px] lg:mb-[50px] md:mb-[40px] sm:mb-[30px] mb-[20px]">
                  {getStepTitle()}
                </h2>
                <div className="w-full">{renderStep()}</div>
              </div>

              {formType && (
                <div className="flex items-center justify-center lg:justify-start w-full gap-[10px] 2xl:flex-row xl:flex-row lg:flex-row md:flex-row sm:flex-col flex-col 2xl:absolute xl:absolute lg:absolute md:static sm:static static left-0 2xl:bottom-[40px] xl:bottom-[40px] lg:bottom-[40px] md:bottom-[40px] md:top-[auto] md:left-[150px] sm:top-[20px] top-[20px] max-md:mt-[20px]">
                  <div className=" font-lato font-bold 2xl:text-[18px] xl:text-[18px] lg:text-[16px] md:text-[16px] sm:text-[16px] text-[16px] leading-[100%] text-white ">
                    {getStepNumber()}
                  </div>
                </div>
              )}
            </div>
            {/* Navigation buttons */}
            {formType && !isSubmitted && (
              <div className="absolute 2xl:right-[94px] xl:right-[94px] md:right-[80px] sm:right-[20px] right-[20px] 2xl:bottom-[67px] xl:bottom-[67px] lg:bottom-[60px] md:bottom-[50px] sm:bottom-[30px] bottom-[30px] flex 2xl:flex-row xl:flex-row lg:flex-row md:flex-row sm:flex-row flex-col gap-[12px] w-max mx-auto">
                <button
                  onClick={handleBack}
                  disabled={!canGoBack()}
                  id="scrollLeft"
                  className={`2xl:w-[64px] xl:w-[64px] lg:w-[64px] md:w-[64px] sm:w-[50px] w-[50px] 2xl:h-[64px] xl:h-[64px] lg:h-[64px] md:h-[64px] sm:h-[50px] h-[50px] rounded-full border border-white/50 flex items-center justify-center text-white bg-[#000000] ${!canGoBack() ? "opacity-0 cursor-not-allowed pointer-events-none" : ""
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="22"
                    viewBox="0 0 11 22"
                    fill="none"
                    className="2xl:h-[22px] xl:h-[22px] lg:h-[22px] md:h-[22px] sm:h-[15px] h-[15px] transform rotate-[-90deg]"
                  >
                    <defs>
                      <linearGradient
                        id="arrowGradient"
                        x1="100%"
                        y1="0%"
                        x2="0%"
                        y2="0%"
                      >
                        <stop offset="-10.69%" stopColor="#2C3894"></stop>
                        <stop offset="94.92%" stopColor="#54A3DA"></stop>
                      </linearGradient>
                    </defs>
                    <path
                      d="M4.67916 0.913869L4.67839 0.914595L0.484838 5.12847C0.170685 5.44415 0.171854 5.95476 0.48758 6.26899C0.803265 6.58319 1.31387 6.58198 1.62806 6.26629L4.44355 3.4371L4.44355 20.5161C4.44355 20.9615 4.8046 21.3225 5.25 21.3225C5.6954 21.3225 6.05645 20.9615 6.05645 20.5161L6.05645 3.43714L8.87194 6.26625C9.18613 6.58194 9.69674 6.58315 10.0124 6.26895C10.3282 5.95472 10.3293 5.44407 10.0152 5.12843L5.82162 0.914553L5.82085 0.913829C5.50561 0.597981 4.99335 0.59899 4.67916 0.913869Z"
                      fill="white"
                      className="arrow-path group-hover:opacity-0 transition-opacity duration-300"
                    ></path>
                    <path
                      d="M4.67916 0.913869L4.67839 0.914595L0.484838 5.12847C0.170685 5.44415 0.171854 5.95476 0.48758 6.26899C0.803265 6.58319 1.31387 6.58198 1.62806 6.26629L4.44355 3.4371L4.44355 20.5161C4.44355 20.9615 4.8046 21.3225 5.25 21.3225C5.6954 21.3225 6.05645 20.9615 6.05645 20.5161L6.05645 3.43714L8.87194 6.26625C9.18613 6.58194 9.69674 6.58315 10.0124 6.26895C10.3282 5.95472 10.3293 5.44407 10.0152 5.12843L5.82162 0.914553L5.82085 0.913829C5.50561 0.597981 4.99335 0.59899 4.67916 0.913869Z"
                      fill="arrowGradient"
                      className="arrow-path opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    ></path>
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canGoNext() || isSubmitting || currentStep === formSteps[formType].length - 1}
                  id="scrollRight"
                  className={`2xl:w-[64px] xl:w-[64px] lg:w-[64px] md:w-[64px] sm:w-[50px] w-[50px] 2xl:h-[64px] xl:h-[64px] lg:h-[64px] md:h-[64px] sm:h-[50px] h-[50px] rounded-full border border-white/50 flex items-center justify-center text-white bg-[#000000] ${!canGoNext() || isSubmitting || currentStep === formSteps[formType].length - 1 ? "opacity-0 cursor-not-allowed pointer-events-none" : ""
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="22"
                    viewBox="0 0 11 22"
                    fill="none"
                    className="2xl:h-[22px] xl:h-[22px] lg:h-[22px] md:h-[22px] sm:h-[15px] h-[15px] transform rotate-[-90deg]"
                  >
                    <defs>
                      <linearGradient
                        id="downArrowGradient"
                        x1="100%"
                        y1="0%"
                        x2="0%"
                        y2="0%"
                      >
                        <stop offset="-10.69%" stopColor="#2C3894"></stop>
                        <stop offset="94.92%" stopColor="#54A3DA"></stop>
                      </linearGradient>
                    </defs>
                    <path
                      d="M4.67916 21.0861L4.67839 21.0854L0.484838 16.8715C0.170685 16.5558 0.171854 16.0452 0.48758 15.731C0.803265 15.4168 1.31387 15.418 1.62806 15.7337L4.44355 18.5629L4.44355 1.48394C4.44355 1.03854 4.8046 0.67749 5.25 0.67749C5.6954 0.67749 6.05645 1.03854 6.05645 1.48394L6.05645 18.5629L8.87194 15.7337C9.18613 15.4181 9.69674 15.4169 10.0124 15.731C10.3282 16.0453 10.3293 16.5559 10.0152 16.8716L5.82162 21.0854L5.82085 21.0862C5.50561 21.402 4.99335 21.401 4.67916 21.0861Z"
                      fill="white"
                      className="arrow-path group-hover:opacity-0 transition-opacity duration-300"
                    ></path>
                    <path
                      d="M4.67916 21.0861L4.67839 21.0854L0.484838 16.8715C0.170685 16.5558 0.171854 16.0452 0.48758 15.731C0.803265 15.4168 1.31387 15.418 1.62806 15.7337L4.44355 18.5629L4.44355 1.48394C4.44355 1.03854 4.8046 0.67749 5.25 0.67749C5.6954 0.67749 6.05645 1.03854 6.05645 1.48394L6.05645 18.5629L8.87194 15.7337C9.18613 15.4181 9.69674 15.4169 10.0124 15.731C10.3282 16.0453 10.3293 16.5559 10.0152 16.8716L5.82162 21.0854L5.82085 21.0862C5.50561 21.402 4.99335 21.401 4.67916 21.0861Z"
                      fill="downArrowGradient"
                      className="arrow-path opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    ></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiStepForm;
