// API configuration
// In production (Vercel), use relative URLs (empty string)
// In development, use localhost:5000
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');

export default API_URL;
