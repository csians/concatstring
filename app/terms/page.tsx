import React from "react";
import TermsAndConditions from "@/components/termsAndConditions";
import { Metadata } from "next";

import LoadingProvider from "@/components/LoadingContext";

export const metadata: Metadata = {
  title: "Terms and Conditions - Concatstring Legal Agreement & User Rights",
  description: "Read Concatstring’s Terms and Conditions to understand user rights, responsibilities, and our commitment to providing secure, reliable services.",
  keywords: "terms and conditions, concatstring, IT services, web development, mobile app development, software development, legal terms",
};

const page = () => {
  return (
    <LoadingProvider>
      <TermsAndConditions />
    </LoadingProvider>
  );
};

export default page;
