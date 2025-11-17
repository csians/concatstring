import { NextRequest, NextResponse } from "next/server";
import { readLifeCache, writeLifeCache, lifeCacheExists } from "@/lib/cache-utils";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { GET_LIFE_AT_COMPANY, GET_EVENTS_BANNER } from "@/lib/queries";

/**
 * GET endpoint - Returns cached data if available, otherwise fetches from GraphQL
 */
export async function GET(request: NextRequest) {
  try {
    // Check if cache exists
    const cachedData = readLifeCache();
    
    if (cachedData) {
      return NextResponse.json({
        success: true,
        fromCache: true,
        data: cachedData,
      });
    }

    // Cache doesn't exist, fetch from GraphQL
    const graphqlEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT;
    
    if (!graphqlEndpoint) {
      throw new Error("GraphQL endpoint not configured");
    }

    const httpLink = createHttpLink({
      uri: graphqlEndpoint,
    });

    const client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
      ssrMode: true,
    });

    // Fetch both queries
    const [lifeAtCompanyResult, eventsBannerResult] = await Promise.all([
      client.query({
        query: GET_LIFE_AT_COMPANY,
        fetchPolicy: "no-cache",
      }),
      client.query({
        query: GET_EVENTS_BANNER,
        fetchPolicy: "no-cache",
      }),
    ]);

    const cacheData = {
      lifeAtCompany: lifeAtCompanyResult.data,
      eventsBanner: eventsBannerResult.data,
      timestamp: new Date().toISOString(),
    };

    // Write to cache
    writeLifeCache(cacheData);

    return NextResponse.json({
      success: true,
      fromCache: false,
      data: cacheData,
    });
  } catch (error: any) {
    console.error("Error in life-cache API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch life data",
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint - Force refresh cache from GraphQL
 */
export async function POST(request: NextRequest) {
  try {
    const graphqlEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT;
    
    if (!graphqlEndpoint) {
      throw new Error("GraphQL endpoint not configured");
    }

    const httpLink = createHttpLink({
      uri: graphqlEndpoint,
    });

    const client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
      ssrMode: true,
    });

    // Fetch both queries
    const [lifeAtCompanyResult, eventsBannerResult] = await Promise.all([
      client.query({
        query: GET_LIFE_AT_COMPANY,
        fetchPolicy: "no-cache",
      }),
      client.query({
        query: GET_EVENTS_BANNER,
        fetchPolicy: "no-cache",
      }),
    ]);

    const cacheData = {
      lifeAtCompany: lifeAtCompanyResult.data,
      eventsBanner: eventsBannerResult.data,
      timestamp: new Date().toISOString(),
    };

    // Write to cache
    writeLifeCache(cacheData);

    return NextResponse.json({
      success: true,
      message: "Cache refreshed successfully",
      data: cacheData,
    });
  } catch (error: any) {
    console.error("Error refreshing life cache:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to refresh cache",
      },
      { status: 500 }
    );
  }
}

