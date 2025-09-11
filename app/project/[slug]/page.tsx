import React from "react";
import { Metadata } from "next";
import { generateProjectSeoMetadata } from "@/components/ProjectSEOComponent";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { GET_MARKET_OPS_AND_OVERVIEW, GET_PROJECT_SEO } from "@/lib/queries";
import ProjectDetailWrapper from "./ProjectDetailWrapper";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

// Generate metadata for the project page
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
      query: GET_PROJECT_SEO,
      variables: { slug: slug },
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    const project = data?.project;

    if (project) {
      return await generateProjectSeoMetadata(project);
    }
    return {
      title: "",
      description: "",
    };
  } catch (error) {
    console.error("Error generating project metadata:", error);
    return {
      title: "",
      description: "",
    };
  }
}

const page = async ({ params }: Props) => {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

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
      query: GET_MARKET_OPS_AND_OVERVIEW,
      variables: { slug: slug },
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    const projectNode = data?.project;

    if (!projectNode) {
      notFound();
    }

    return <ProjectDetailWrapper project={projectNode} />;
  } catch (error) {
    console.error("Error loading project data:", error);
    notFound();
  }
};

export default page;
