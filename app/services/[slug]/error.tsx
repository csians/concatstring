'use client';

import { useEffect } from 'react';
import { notFound } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for debugging
    console.error('Service detail error:', error);
    
    // If this is a 404-related error, redirect to notFound
    if (error.message?.includes('NEXT_NOT_FOUND') || 
        error.digest === 'NEXT_NOT_FOUND' ||
        error.message?.includes('404') ||
        error.message?.includes('Cannot read properties of undefined')) {
      notFound();
    }
  }, [error]);

  // Show a simple error message while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}


