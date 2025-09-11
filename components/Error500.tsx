'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Error500: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        {/* 500 Image - You can use the same 404 image or create a specific 500 image */}
        <div className="mb-8">
          <Image
            src="/images/404.png"
            alt="500 Internal Server Error"
            width={400}
            height={300}
            className="mx-auto"
          />
        </div>
        
        {/* 500 Text */}
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
          500
        </h1>
        
        {/* Error Message */}
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
          Internal Server Error
        </h2>
        
        {/* Description */}
        <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
          Something went wrong on our end. We're working to fix the issue. Please try again later.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-[#E72125] to-[#54A3DA] text-white font-semibold rounded-lg hover:from-[#54A3DA] hover:to-[#E72125] transition-all duration-300 transform hover:scale-105"
          >
            Go Home
          </Link>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error500;


