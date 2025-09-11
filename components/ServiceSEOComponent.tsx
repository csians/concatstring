import type { Metadata } from "next";
export async function generateServiceSeoMetadata(
  serviceData: any
): Promise<Metadata> {
  try {
    const seoData = serviceData?.seo;
    const serviceTitle = serviceData?.title;
    const serviceSlug = serviceData?.slug;
    const featuredImage = serviceData?.featuredImage?.node;

    const title = seoData?.title || serviceTitle;
    const description = seoData?.metaDesc;
    const ogUrl = `https://concatstring.com/services/${serviceSlug}`;
    const ogImage = featuredImage?.sourceUrl;

    // Create metadata object
    const metadata: Metadata = {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        url: ogUrl,
        images: ogImage
          ? [
              {
                url: ogImage,
                alt: featuredImage?.altText || serviceTitle,
                width: 1200,
                height: 630,
              },
            ]
          : [],
      },
    };
    return metadata;
  } catch (error) {
    console.error(
      `Error generating Service SEO data for slug ${serviceData?.slug}:`,
      error
    );

    return {
      title: "",
      description: "",
    };
  }
}
