import type { Metadata } from "next";
import { DYNAMIC_AUTHOR_SEO_QUERY } from "@/lib/queries";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// Reusable Author SEO component that can be used on any author page
export async function generateAuthorSeoMetadata(
  userId: string
): Promise<Metadata> {
  try {
    const httpLink = createHttpLink({
      uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT,
    });

    const client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
      ssrMode: true,
    });

    const { data } = await client.query({
      query: DYNAMIC_AUTHOR_SEO_QUERY,
      variables: { userId },
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    const seoData = data?.user?.seo;
    const userData = data?.user;

    // console.log(`Author SEO Data for user ID ${userId}:`, seoData);
    // console.log(`Author Data for user ID ${userId}:`, userData);

    if (seoData) {
      return {
        title: seoData.title,
        description: seoData.metaDesc,
        openGraph: {
          title: seoData.title,
          description: seoData.metaDesc,
          images: userData?.userProfileImage?.userProfileImage?.node?.sourceUrl
            ? [
              {
                url: userData.userProfileImage.userProfileImage.node
                  .sourceUrl,
                alt:
                  userData.userProfileImage.userProfileImage.node.altText ||
                  userData.name ||
                  "",
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
