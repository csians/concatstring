'use client'

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { BatchHttpLink } from '@apollo/client/link/batch-http';

// Detect Safari browser
const isSafari = typeof window !== 'undefined' && 
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
  !navigator.userAgent.includes('Chrome');

// Determine if we should use the proxy
// Use proxy for client-side requests to avoid Safari CORS issues
const useProxy = typeof window !== 'undefined';

// Get the appropriate endpoint
const getGraphQLEndpoint = () => {
  if (useProxy) {
    // Use Next.js API route proxy for client-side requests
    // This works reliably in Safari because it's same-origin
    return '/api/graphql';
  }
  // Use direct endpoint for server-side requests
  return process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT || '';
};

// Safari needs non-batched requests, even through proxy
// Chrome can use batched requests for better performance
const httpLink = isSafari 
  ? new HttpLink({
      uri: getGraphQLEndpoint(),
      credentials: 'same-origin', // same-origin for proxy
      fetchOptions: {
        keepalive: false,
      },
    })
  : new BatchHttpLink({
      uri: getGraphQLEndpoint(),
      batchInterval: 100,
      batchMax: 20,
      credentials: 'same-origin', // same-origin for proxy
    });

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          page: {
            merge: true,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-only',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
  },
  queryDeduplication: true,
  connectToDevTools: process.env.NODE_ENV !== 'production',
});

export default client; 