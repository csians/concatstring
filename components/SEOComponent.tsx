import type { Metadata } from "next";
import { DYNAMIC_SEO_QUERY } from "@/lib/queries";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// Reusable SEO component that can be used on any page
export async function generateSeoMetadata(pageId: string): Promise<Metadata> {
  try {
    const httpLink = createHttpLink({
      uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT,
    });

    const client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
      ssrMode: true,
    });
    // console.log('=========')
    const { data } = await client.query({
      query: DYNAMIC_SEO_QUERY,
      variables: { pageId },
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    const seoData = data?.page?.seo;
    const pageData = data?.page;

    // console.log(`SEO Data for page ID ${pageId}:`, seoData);
    // console.log(`Page Data for page ID ${pageId}:`, pageData);

    if (seoData) {
      return {
        title: seoData.title,
        description: seoData.metaDesc,
        // keywords: seoData.focuskw || "",
        openGraph: {
          title: seoData.title,
          description: seoData.metaDesc,
          url: seoData.opengraphUrl || "",
          images: pageData?.featuredImage?.node?.sourceUrl
            ? [
              {
                url: pageData.featuredImage.node.sourceUrl,
                alt: pageData.featuredImage.node.altText || "",
              },
            ]
            : [],
        },
        icons: {
          icon: "/favicon.png", // Or favicon.ico if you have that
        },
      };
    } else {

      return {
        title: "White Label Web Design & Development Service - Concatstring",
        description:
          "Discover seamless Ecommerce solutions tailored for your business with Shopify and WooCommerce services. Empower your online store with robust features, flexible customization, and reliable support.",
        icons: {
          icon: "/favicon.png", // Or favicon.ico if you have that
        }
      };
    }
  } catch (error) {
    console.error(`Error fetching SEO data for page ID ${pageId}:`, error);
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
