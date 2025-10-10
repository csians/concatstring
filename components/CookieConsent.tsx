"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setConsent, setPreferences, hideCookiePopup } from '@/store/slices/cookieSlice';
import { CookieManager } from '@/lib/cookie-utils';
import CookieSettings from './CookieSettings';
import Link from 'next/link';

interface CookieConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  const dispatch = useDispatch();
  const { consent, isVisible } = useSelector((state: RootState) => state.cookie);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Initialize cookie state from cookies
    const cookieConsent = CookieManager.getConsentStatus();
    const preferences = CookieManager.getPreferences();
    
    dispatch({
      type: 'cookie/initializeCookieState',
      payload: { consent: cookieConsent, preferences }
    });
  }, [dispatch]);

  // Disable body scroll when cookie popup is visible
  useEffect(() => {
    if (isVisible) {
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Disable scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        // Re-enable scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.documentElement.style.overflow = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isVisible]);

  const handleAccept = () => {
    const defaultPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      socialMedia: true,
    };
    
    dispatch(setConsent('accepted'));
    dispatch(setPreferences(defaultPreferences));
    CookieManager.setConsent('accepted');
    CookieManager.setPreferences(defaultPreferences);
    onAccept?.();
  };

  const handleDecline = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      socialMedia: false,
    };
    
    dispatch(setConsent('declined'));
    dispatch(setPreferences(onlyNecessary));
    CookieManager.setConsent('declined');
    CookieManager.setPreferences(onlyNecessary);
    CookieManager.clearNonNecessaryCookies();
    onDecline?.();
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
    // The settings modal will have already updated the Redux state
    // if the user saved their preferences, so we don't need to do anything here
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[999999] max-w-sm">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-white text-lg font-denton font-bold mb-2">
              🍪 Cookie Preferences
            </h3>
            <p className="text-gray-300 text-sm font-lato leading-relaxed">
              We use cookies to enhance your experience and analyze site usage. 
              <Link href="/privacy" className="text-[#4CA0FF] hover:text-[#54A3DA] underline ml-1">
                Learn more
              </Link>
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <button
              onClick={handleAccept}
              className="w-full px-4 py-2 text-sm font-denton font-bold text-white bg-[#E72125] hover:bg-gradient-to-r hover:from-[#E72125] hover:to-[#8E1D1D] rounded-[50px] transition-all duration-300"
            >
              Accept All
            </button>
            <button
              onClick={handleShowSettings}
              className="w-full px-4 py-2 text-sm font-denton font-bold text-gray-300 border border-gray-600 rounded-[50px] hover:bg-gray-800 hover:text-white transition-all duration-300"
            >
              Customize
            </button>
            <button
              onClick={handleDecline}
              className="w-full px-4 py-2 text-sm font-denton font-bold text-gray-400 border border-gray-700 rounded-[50px] hover:bg-gray-800 hover:text-gray-300 transition-all duration-300"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
      
      <CookieSettings 
        isOpen={showSettings} 
        onClose={handleSettingsClose} 
      />
    </div>
  );
};

export default CookieConsent;
