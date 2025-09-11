import React from "react";
import { Metadata } from "next";
import { generateServiceSeoMetadata } from "@/components/ServiceSEOComponent";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import {
  GET_SERVICE_BY_SLUG,
  GET_SERVICE_SOLUTIONS,
  GET_SERVICE_SEO,
} from "@/lib/queries";
import Banner from "./banner";
import AboutSolutions from "./aboutSolutions";
import Technology from "./technology";
import WhyChooseUs from "./whyChooseUs";
import WhyConcatString from "./whyConcatString";
import Industries from "./industries";
import Faq from "./faq";
import OurProcess from "./ourProcess";
import StartBuilding from "./startBuilding";
import Service from "./services";
import { notFound } from "next/navigation";

import LoadingProvider from "@/components/LoadingContext";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";
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
      query: GET_SERVICE_SEO,
      variables: { slug: slug },
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    const service = data?.technology;

    if (service) {
      return await generateServiceSeoMetadata(service);
    }

    return {
      title: "",
      description: "",
    };
  } catch (error) {
    console.error("Error generating service metadata:", error);
    return {
      title: "",
      description: "",
    };
  }
}

const ServiceDetailPage = async ({ params }: Props) => {
  const { slug } = await params;

  // Create a server-side Apollo Client instance
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
      query: GET_SERVICE_BY_SLUG,
      variables: { slug: slug },
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    if (!data || !data.technology) {
      notFound();
    }

    const serviceName = data?.technology?.title;
    const serviceSlug = data?.technology?.slug;

    return (
      <LoadingProvider>
        <Banner data={data} />
        <Service data={data} />
        <Technology data={data} />
        <WhyConcatString data={data} />
        <WhyChooseUs data={data} />
        <Industries data={data} />
        <OurProcess data={data} />
        <StartBuilding data={data} />
        <Faq data={data} />
      </LoadingProvider>
    );
  } catch (error) {
    // For any GraphQL errors, treat as 404 to avoid showing error stacks
    notFound();
  }
};

export default ServiceDetailPage;
