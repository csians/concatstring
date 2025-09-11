import React from "react";
import { Metadata } from "next";
import { generateBlogPostSeoMetadata } from "@/components/BlogPostSEOComponent";
import FutureOfAi from "./futureOfAi";
import ShareItOn from "./shareItOn";
import Comments from "./comments";
import AboutTheAuthor from "./aboutTheAuthor";
import MoreFromMe from "./moreFromMe";
import { GET_POST_BY_SLUG, GET_BLOG_POST_SEO } from "@/lib/queries";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import LoadingProvider from "@/components/LoadingContext";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;

    const httpLink = createHttpLink({
      uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT,
    });

    const client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
      ssrMode: true,
    });

    const { data } = await client.query({
      query: GET_BLOG_POST_SEO,
      variables: { slug: slug },
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    const post = data?.post;

    if (post) {
      return await generateBlogPostSeoMetadata(post);
    }

    return {
      title: "",
      description: "",
    };
  } catch (error) {
    console.error("Error generating blog post metadata:", error);
    const { slug } = await params;
    return {
      title: "",
      description: "",
    };
  }
}

const page = async ({ params }: Props) => {
  const { slug } = await params;

  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT,
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    ssrMode: true,
  });

  try {
    const { data } = await client.query({
      query: GET_POST_BY_SLUG,
      variables: { slug: slug },
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    const post = data?.post;

    if (!post) {
      notFound();
    }

    return (
      <LoadingProvider>
        <FutureOfAi post={post} />
        <ShareItOn post={post?.blogDetail} />
        <Comments post={post} />
        <AboutTheAuthor post={post} />
        <MoreFromMe post={post} />
      </LoadingProvider>
    );
  } catch (error) {
    console.error("Error loading blog post data:", error);
    notFound();
  }
};

export default page;
