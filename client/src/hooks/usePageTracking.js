import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

/**
 * Hook to automatically track page views
 * Usage: usePageTracking('Home Page');
 */
export const usePageTracking = (pageName) => {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view when component mounts or location changes
    trackPageView(pageName, location.pathname);
    
    // Cleanup function
    return () => {
      if (window.analyticsCleanup) {
        window.analyticsCleanup();
      }
    };
  }, [location.pathname, pageName]);
};

export default usePageTracking;
