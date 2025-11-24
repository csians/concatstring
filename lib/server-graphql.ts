import { print } from 'graphql';
import type { DocumentNode } from 'graphql';

function getGraphQLEndpoint(): string {
  const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT;
  if (!endpoint) {
    throw new Error('NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT is not defined');
  }
  return endpoint;
}

export async function fetchGraphQL<T = any>(
  query: DocumentNode,
  variables?: Record<string, any>
): Promise<T> {
  try {
    const graphqlEndpoint = getGraphQLEndpoint();
    
    // Create an AbortController for timeout
    // Use shorter timeout in production (15s) vs development (30s)
    const timeout = process.env.NODE_ENV === 'production' ? 15000 : 30000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: print(query),
          variables: variables || {},
        }),
        signal: controller.signal,
        // Use Next.js cache for better performance
        // Revalidate every hour, but allow stale-while-revalidate
        next: { revalidate: 3600 },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.statusText} (${response.status})`);
      }

      const result = await response.json();

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }

      return result.data as T;
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError' || fetchError.code === 23) {
        const timeoutMsg = `GraphQL request timed out after ${timeout / 1000} seconds`;
        console.error(timeoutMsg, { endpoint: graphqlEndpoint });
        throw new Error(timeoutMsg);
      }
      throw fetchError;
    }
  } catch (error) {
    // Only log error details in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('GraphQL fetch error:', error);
    }
    throw error;
  }
}

