import React from "react";
import PrivacyPolicy from "@/components/privacyPolicy";
import LoadingProvider from "@/components/LoadingContext";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Concatstring Data Protection & User Security",
  description: "Concatstring’s Privacy Policy ensures your data protection and user security with transparent practices, safeguarding trust and confidentiality.",
  keywords: "privacy policy, concatstring, data protection, personal information, privacy rights, data security, GDPR compliance, user privacy",
};

const page = () => {
  return (
    <LoadingProvider>
      <PrivacyPolicy />
    </LoadingProvider>
  );
};

export default page;