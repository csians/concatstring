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
      // Use Next.js cache for better performance
      // Revalidate every hour, but allow stale-while-revalidate
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data as T;
  } catch (error) {
    console.error('GraphQL fetch error:', error);
    throw error;
  }
}

