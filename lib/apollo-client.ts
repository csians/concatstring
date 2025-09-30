'use client'

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';

const httpLink = new BatchHttpLink({
  uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT,
  // Increased batch interval to allow more queries to batch together
  // This gives all component queries time to fire before sending the request
  batchInterval: 100, // Increased from 20ms to 100ms
  batchMax: 20, // Increased from 10 to handle more queries per batch
  credentials: 'omit',
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
      nextFetchPolicy: 'cache-only', // Changed to cache-only to prevent refetches
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
  },
  // Enable query deduplication to prevent duplicate queries
  queryDeduplication: true,
  // Only connect to dev tools in development
  connectToDevTools: process.env.NODE_ENV !== 'production',
});

export default client; 