import type { Metadata } from "next";

// Simplified Blog Post SEO component
export async function generateBlogPostSeoMetadata(
  postData: any
): Promise<Metadata> {
  try {
    const seoData = postData?.seo;
    const postTitle = postData?.title;
    const featuredImage = postData?.featuredImage?.node;
    const authorData = postData?.author?.node;
    const authorName = authorData?.name;
    const title = seoData?.title || postTitle;
    const description = seoData?.metaDesc;
    const ogUrl = seoData?.opengraphUrl;
    const ogImage =
      featuredImage?.sourceUrl || seoData?.opengraphImage?.sourceUrl;

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
              alt: featuredImage?.altText || postTitle,
              width: 1200,
              height: 630,
            },
          ]
          : [],
        authors: authorName ? [authorName] : [],
        publishedTime: postData?.date || new Date().toISOString(),
        modifiedTime: postData?.modified || new Date().toISOString(),
      },
      icons: {
        icon: "/favicon.png", // Or favicon.ico if you have that
      }
    };
    return metadata;
  } catch (error) {
    return {
      title: "White Label Web Design & Development Service - Concatstring",
      description:
        "Discover seamless Ecommerce solutions tailored for your business with Shopify and WooCommerce services. Empower your online store with robust features, flexible customization, and reliable support.",
      icons: {
        icon: "/favicon.png", // Or favicon.ico if you have that
      },
    };
  }
}
