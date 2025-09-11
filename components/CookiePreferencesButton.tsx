"use client";

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CookieManager } from '@/lib/cookie-utils';
import CookieSettings from './CookieSettings';

const CookiePreferencesButton: React.FC = () => {
  const { consent } = useSelector((state: RootState) => state.cookie);
  const [showSettings, setShowSettings] = useState(false);

  // Only show the button if user has given consent (accepted or declined)
  if (!consent) return null;

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  return (
    <>
      <button
        onClick={handleOpenSettings}
        className="fixed bottom-6 left-6 z-40 bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105 group z-[999999] bg-gradient-to-b from-[#DA2124] to-[#8E1D1D]"
        title="Cookie Preferences"
        aria-label="Open cookie preferences"
      >
        <div className="flex items-center justify-center">
          <svg 
            className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </div>
        
       
      </button>

      <CookieSettings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </>
  );
};

export default CookiePreferencesButton;
