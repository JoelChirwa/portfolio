// Generate a unique session ID
const generateSessionId = () => {
  const stored = sessionStorage.getItem('analytics_session_id');
  if (stored) return stored;
  
  const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('analytics_session_id', newId);
  return newId;
};

// Helper function to fetch with timeout
const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

// Track page view
export const trackPageView = async (page, path) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');
    const sessionId = generateSessionId();
    const referrer = document.referrer || "direct";
    
    const response = await fetchWithTimeout(`${API_URL}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page,
        path,
        sessionId,
        referrer,
      }),
    }, 5000); // 5 second timeout
    
    const data = await response.json();
    
    if (data.success && data.id) {
      // Store the analytics ID to update time spent later
      sessionStorage.setItem(`analytics_id_${path}`, data.id);
      
      // Track time spent on page
      const startTime = Date.now();
      
      // Update time when user leaves or switches tabs
      const updateTimeSpent = async () => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000); // in seconds
        
        try {
          await fetch(`${API_URL}/api/analytics/track/${data.id}/time`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ timeSpent }),
          });
        } catch (error) {
          console.error('Failed to update time spent:', error);
        }
      };
      
      // Listen for page unload
      window.addEventListener('beforeunload', updateTimeSpent);
      
      // Also update every 30 seconds for long sessions
      const intervalId = setInterval(updateTimeSpent, 30000);
      
      // Clean up on component unmount (store in window for cleanup)
      window.analyticsCleanup = () => {
        clearInterval(intervalId);
        window.removeEventListener('beforeunload', updateTimeSpent);
        updateTimeSpent(); // Final update
      };
    }
    
    return data;
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return null;
  }
};

// Get analytics stats (for admin dashboard)
export const getAnalyticsChartData = async (token, period = 7) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');
    
    const response = await fetchWithTimeout(`${API_URL}/api/analytics/stats?period=${period}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }, 5000); // 5 second timeout
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch analytics stats:', error);
    return null;
  }
};

// Get chart data (for admin dashboard)
export const getChartData = async (token, period = 7) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');
    
    const response = await fetchWithTimeout(`${API_URL}/api/analytics/chart-data?period=${period}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }, 5000); // 5 second timeout
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch chart data:', error);
    return null;
  }
};
