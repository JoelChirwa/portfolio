import app from '../server/src/index.js';

// Vercel serverless function handler
export default async (req, res) => {
  // Let Express handle the request
  return app(req, res);
};
