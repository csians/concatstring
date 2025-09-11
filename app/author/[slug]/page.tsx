import React from "react";
import { Metadata } from "next";
import { generateAuthorSeoMetadata } from "@/components/AuthorSEOComponent";
import { GET_AUTHORS } from "@/lib/queries";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { notFound } from "next/navigation";

import LoadingProvider from "@/components/LoadingContext";
// Import the existing components from author-details
import Founder from "./founder";
import FutureOfAi from "./futureOfAi";
import ConnectNow from "./connectNow";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

function createApolloClient() {
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT,
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    ssrMode: true,
  });
}

function findAuthorBySlug(authors: any[], slug: string) {
  return authors?.find((user: any) => {
    const userSlug = user?.name
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    return userSlug === slug;
  });
}

function generateFallbackMetadata(slug: string): Metadata {
  return {
    title: "",
    description: "",
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const client = createApolloClient();

    const { data, error } = await client.query({
      query: GET_AUTHORS,
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    if (error) {
      // GraphQL error occurred, but we'll continue with fallback
    }

    const author = findAuthorBySlug(data?.users?.nodes, slug);

    if (author?.id) {
      try {
        return await generateAuthorSeoMetadata(author.id);
      } catch (seoError) {
        return generateFallbackMetadata(slug);
      }
    }

    return generateFallbackMetadata(slug);
  } catch (error) {
    console.error("Error generating author metadata:", error);
    const { slug } = await params;
    return generateFallbackMetadata(slug);
  }
}

// Generate static params for all authors
export async function generateStaticParams() {
  try {
    const client = createApolloClient();

    const { data, error } = await client.query({
      query: GET_AUTHORS,
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    if (error) {
      // Return a fallback list of known reliable authors
      return [
        { slug: 'adarsh-verma' },
        { slug: 'vishal-sharma' },
        { slug: 'csadmin' },
        { slug: 'smit-dudhat' }
      ];
    }

    const authors = data?.users?.nodes || [];

    if (authors.length === 0) {
      // Return a fallback list of known reliable authors
      return [
        { slug: 'adarsh-verma' },
        { slug: 'vishal-sharma' },
        { slug: 'csadmin' },
        { slug: 'smit-dudhat' }
      ];
    }

    // Use a known reliable list of authors to avoid inconsistencies
    const reliableAuthorNames = ['Adarsh Verma', 'Vishal Sharma', 'csadmin', 'Smit Dudhat'];
    
    const reliableAuthors = authors.filter((author: any) => {
      return author?.name && author?.id && reliableAuthorNames.includes(author.name);
    });

    const params = reliableAuthors
      .map((author: any) => {
        const slug = author.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        
        return { slug };
      })
      .filter((param: any) => param && param.slug);

    return params;
  } catch (error) {
    console.error("Error generating static params:", error);
    // Return a fallback list of known reliable authors
    return [
      { slug: 'adarsh-verma' },
      { slug: 'vishal-sharma' },
      { slug: 'csadmin' },
      { slug: 'smit-dudhat' }
    ];
  }
}

const AuthorPage = async ({ params }: Props) => {
  const { slug } = await params;
  const client = createApolloClient();

  try {
    const { data, error } = await client.query({
      query: GET_AUTHORS,
      fetchPolicy: "cache-first", // Use cached data if available for faster loading
      errorPolicy: "all",
    });

    if (error) {
      // GraphQL error occurred, but we'll continue
    }

    const authors = data?.users?.nodes || [];
    const author = findAuthorBySlug(authors, slug);

    if (!author) {
      notFound();
    }

    return (
      <LoadingProvider>
        <Founder userId={author.id} />
        <FutureOfAi userId={author.id} />
        <ConnectNow userId={author.id} />
      </LoadingProvider>
    );
  } catch (error) {
    console.error("Error loading author data:", error);
    notFound();
  }
};

export default AuthorPage;
