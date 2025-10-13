import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const graphqlEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT;
    
    if (!graphqlEndpoint) {
      return NextResponse.json(
        { error: 'GraphQL endpoint not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
      // Server-side fetch doesn't have Safari's restrictions
      cache: 'no-store',
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('GraphQL proxy error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch from GraphQL endpoint',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Support GET for introspection queries (optional)
export async function GET() {
  return NextResponse.json(
    { message: 'GraphQL endpoint - use POST requests' },
    { status: 200 }
  );
}

