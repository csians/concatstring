import type { Metadata } from "next";

// Project SEO component for project pages
export async function generateProjectSeoMetadata(
  projectData: any
): Promise<Metadata> {
  try {
    const seoData = projectData?.seo;
    const projectTitle = projectData?.title;
    const projectSlug = projectData?.slug;
    const featuredImage = projectData?.featuredImage?.node;
    const title = seoData?.title || projectTitle;
    const description = seoData?.metaDesc;
    const ogUrl = `https://concatstring.com/project/${projectSlug}`;
    const ogImage = featuredImage?.sourceUrl;

    // Create metadata object
    const metadata: Metadata = {
      title: title,
      description: description,
      // keywords: keywords,
      openGraph: {
        title: title,
        description: description,
        url: ogUrl,
        images: ogImage
          ? [
            {
              url: ogImage,
              alt: featuredImage?.altText || projectTitle,
              width: 1200,
              height: 630,
            },
          ]
          : [],
      },
      icons: {
        icon: "/favicon.png", // Or favicon.ico if you have that
      },
    };
    return metadata;
  } catch (error) {

    return {
      title: "White Label Web Design & Development Service - Concatstring",
      description:
        "Discover seamless Ecommerce solutions tailored for your business with Shopify and WooCommerce services. Empower your online store with robust features, flexible customization, and reliable support.",
      icons: {
        icon: "/favicon.png", // Or favicon.ico if you have that
      }
    };
  }
}
