'use client';

import Error500 from '@/components/Error500';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Don't handle 404 errors here - let not-found.tsx handle them
  if (error.message?.includes('NEXT_NOT_FOUND') || 
      error.digest === 'NEXT_NOT_FOUND' ||
      error.message?.includes('404')) {
    // Let the error bubble up to be handled by not-found.tsx
    throw error;
  }
  
  // Only handle actual server errors
  return (
    <html>
      <body>
        <Error500 />
      </body>
    </html>
  );
}


