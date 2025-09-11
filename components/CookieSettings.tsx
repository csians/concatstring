"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setPreferences, setConsent } from '@/store/slices/cookieSlice';
import { CookieManager, CookiePreferences, COOKIE_CATEGORIES, COOKIE_DETAILS } from '@/lib/cookie-utils';

interface CookieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const CookieSettings: React.FC<CookieSettingsProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const preferences = useSelector((state: RootState) => state.cookie.preferences);
  const isMainPopupVisible = useSelector((state: RootState) => state.cookie.isVisible);
  const [localPreferences, setLocalPreferences] = useState(() => ({
    necessary: preferences.necessary,
    analytics: preferences.analytics,
    marketing: preferences.marketing,
    socialMedia: preferences.socialMedia,
  }));
  const [isTouchDevice, setIsTouchDevice] = useState(() => {
    if (typeof window === 'undefined') return false;
    // More aggressive detection - assume touch if any mobile indicators
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    
    return isMobile || hasTouch || isSmallScreen;
  });

  const handlePreferenceChange = (category: 'analytics' | 'marketing' | 'socialMedia', value: boolean) => {
    setLocalPreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSave = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    // Force disable hover effects on any touch interaction
    setIsTouchDevice(true);
    
    // Only save the 4 categories that are shown in the UI
    const visiblePreferences = {
      necessary: localPreferences.necessary,
      analytics: localPreferences.analytics,
      marketing: localPreferences.marketing,
      socialMedia: localPreferences.socialMedia,
    };
    
    // Update Redux state first
    dispatch(setPreferences(visiblePreferences));
    dispatch(setConsent('accepted')); // This should set isVisible to false
    
    // Update cookie storage
    CookieManager.setPreferences(visiblePreferences);
    CookieManager.setConsent('accepted');
    
    // Close the modal
    onClose();
  };

  const handleAcceptAll = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    // Force disable hover effects on any touch interaction
    setIsTouchDevice(true);
    
    // Only accept the 4 categories that are shown in the UI
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      socialMedia: true,
    };
    
    // Update local state
    setLocalPreferences(allAccepted);
    
    // Update Redux state
    dispatch(setPreferences(allAccepted));
    dispatch(setConsent('accepted')); // This should set isVisible to false
    
    // Update cookie storage
    CookieManager.setPreferences(allAccepted);
    CookieManager.setConsent('accepted');
    
    // Close the modal
    onClose();
  };

  const handleRejectAll = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    // Force disable hover effects on any touch interaction
    setIsTouchDevice(true);
    
    // Only reject the 4 categories that are shown in the UI
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      socialMedia: false,
    };
    
    // Update local state
    setLocalPreferences(onlyNecessary);
    
    // Update Redux state
    dispatch(setPreferences(onlyNecessary));
    dispatch(setConsent('declined')); // This should set isVisible to false
    
    // Update cookie storage
    CookieManager.setPreferences(onlyNecessary);
    CookieManager.setConsent('declined');
    CookieManager.clearNonNecessaryCookies();
    
    // Close the modal
    onClose();
  };

  const getCookieCount = (category: 'necessary' | 'analytics' | 'marketing' | 'socialMedia') => {
    return COOKIE_DETAILS.filter(cookie => cookie.category === category).length;
  };

  // Detect touch device - improved detection
  useEffect(() => {
    const checkTouchDevice = () => {
      const userAgent = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      const isCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      
      const isTouch = isMobile || hasTouch || isSmallScreen || isCoarsePointer;
      setIsTouchDevice(isTouch);
    };
    
    // Check immediately
    checkTouchDevice();
    
    // Also check after a small delay to ensure all APIs are available
    const timeoutId = setTimeout(checkTouchDevice, 100);
    
    // Add multiple touch event listeners to immediately detect touch interactions
    const handleTouchStart = () => {
      setIsTouchDevice(true);
    };
    
    const handleTouchEnd = () => {
      setIsTouchDevice(true);
    };
    
    // Add listeners to document and window for immediate detection
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    
    // Listen for changes in touch capability (e.g., when device is rotated)
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(pointer: coarse)');
      mediaQuery.addEventListener('change', checkTouchDevice);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('touchstart', handleTouchStart);
        mediaQuery.removeEventListener('change', checkTouchDevice);
      };
    }
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Disable scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        // Only re-enable scroll if the main cookie popup is not visible
        // If the main popup is still visible, it will handle scroll management
        if (!isMainPopupVisible) {
          // Re-enable scroll
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          document.documentElement.style.overflow = '';
          
          // Restore scroll position
          window.scrollTo(0, scrollY);
        }
      };
    }
  }, [isOpen, isMainPopupVisible]);

  if (!isOpen) return null;

  return (
    <>
      {/* CSS to disable hover effects on touch devices */}
      <style jsx global>{`
        /* Global mobile hover disable */
        @media (max-width: 768px) {
          .cookie-btn:hover,
          .cookie-btn-reject:hover,
          .cookie-btn-save:hover,
          .cookie-btn-accept:hover {
            background: inherit !important;
            transform: none !important;
            color: inherit !important;
            box-shadow: none !important;
          }
        }
        
        @media (hover: none) and (pointer: coarse) {
          .cookie-btn:hover,
          .cookie-btn-reject:hover,
          .cookie-btn-save:hover,
          .cookie-btn-accept:hover {
            background: inherit !important;
            transform: none !important;
            color: inherit !important;
            box-shadow: none !important;
          }
        }
        
        @media (pointer: coarse) {
          .cookie-btn:hover,
          .cookie-btn-reject:hover,
          .cookie-btn-save:hover,
          .cookie-btn-accept:hover {
            background: inherit !important;
            transform: none !important;
            color: inherit !important;
            box-shadow: none !important;
          }
        }
        
        /* Force disable hover on touch devices */
        @media (hover: none) {
          .cookie-btn:hover,
          .cookie-btn-reject:hover,
          .cookie-btn-save:hover,
          .cookie-btn-accept:hover {
            background: inherit !important;
            transform: none !important;
            color: inherit !important;
            box-shadow: none !important;
          }
        }
      `}</style>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#00182D] rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-denton font-bold text-white">Cookie Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Necessary Cookies */}
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-denton font-bold text-white">Necessary</h3>
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium font-lato">
                  Always Active
                </div>
              </div>
              <p className="text-gray-300 text-sm font-lato">
                These cookies are essential for the website to function properly. They cannot be disabled.
                These cookies protect against security threats and maintain secure sessions.
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-denton font-bold text-white">Analytics</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPreferences.analytics}
                    onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#DA2124]"></div>
                </label>
              </div>
              <p className="text-gray-300 text-sm font-lato">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
              </p>
            </div>

            {/* Marketing Cookies */}
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-denton font-bold text-white">Marketing</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPreferences.marketing}
                    onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#DA2124]"></div>
                </label>
              </div>
              <p className="text-gray-300 text-sm font-lato">
                These cookies are used to track visitors across websites to display relevant and engaging advertisements.
              </p>
            </div>

            {/* Social Media Cookies */}
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-denton font-bold text-white">Social Media</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPreferences.socialMedia}
                    onChange={(e) => handlePreferenceChange('socialMedia', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#DA2124]"></div>
                </label>
              </div>
              <p className="text-gray-300 text-sm font-lato">
                These cookies enable social media features and allow you to share content on social platforms.
              </p>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={handleRejectAll}
              className="cookie-btn cookie-btn-reject flex-1 px-6 py-3 text-sm font-denton font-bold text-gray-300 border border-gray-600 rounded-[50px] transition-all duration-300"
              style={{
                pointerEvents: 'auto',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
              onTouchStart={() => setIsTouchDevice(true)}
            >
              Reject All
            </button>
            <button
              onClick={handleSave}
              className="cookie-btn cookie-btn-save flex-1 px-6 py-3 text-sm font-denton font-bold text-white bg-[#E72125] rounded-[50px] transition-all duration-300"
              style={{
                pointerEvents: 'auto',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
              onTouchStart={() => setIsTouchDevice(true)}
            >
              Save Preferences
            </button>
            <button
              onClick={handleAcceptAll}
              className="cookie-btn cookie-btn-accept flex-1 px-6 py-3 text-sm font-denton font-bold text-white bg-green-600 rounded-[50px] transition-all duration-300"
              style={{
                pointerEvents: 'auto',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
              onTouchStart={() => setIsTouchDevice(true)}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CookieSettings;
