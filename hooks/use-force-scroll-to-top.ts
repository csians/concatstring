import { useEffect } from 'react';

export const useForceScrollToTop = () => {
  useEffect(() => {
    // Force scroll to top immediately
    window.scrollTo(0, 0);
    
    // Also try after a small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    // Additional scroll to top after images and content are loaded
    const handleLoad = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('load', handleLoad);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // Return a function to manually scroll to top if needed
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return { scrollToTop };
};
