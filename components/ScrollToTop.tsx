'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Force scroll to top immediately on route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Also try after a small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 100);

    // Additional scroll to top after images and content are loaded
    const handleLoad = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    // Listen for load event (page reload)
    window.addEventListener('load', handleLoad);
    
    // Also scroll to top on component mount (covers initial page load)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, [pathname]);

  useEffect(() => {
    // Handle page reload/refresh with additional safety measures
    const handleLoad = () => {
      // Multiple attempts to ensure scroll to top works
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Listen for load event (page reload)
    window.addEventListener('load', handleLoad);
    
    // Also scroll to top on component mount (covers initial page load)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return null; // This component doesn't render anything
}
