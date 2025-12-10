# Vercel Deployment Guide

## Project Structure
This is a monorepo containing:
- **client/** - React frontend built with Vite
- **server/** - Express.js backend API
- **api/** - Vercel serverless function wrapper

## Deployment Steps

### 1. Prerequisites
- GitHub repository connected to Vercel
- Environment variables configured in Vercel dashboard

### 2. Required Environment Variables
Set these in your Vercel project settings:

**Server Variables:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLIENT_URL` - Your frontend URL (e.g., https://yourdomain.vercel.app)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `EMAIL_USER` - Email for nodemailer
- `EMAIL_PASSWORD` - Email password/app password

### 3. Deploy to Vercel

#### Option A: Via Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Via GitHub Integration
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration
5. Add environment variables
6. Click "Deploy"

### 4. Project Settings in Vercel Dashboard

**Framework Preset:** Other

**Build Command:** `npm run build`

**Output Directory:** Leave empty (configured in vercel.json)

**Install Command:** `npm install`

**Root Directory:** Leave as root (.)

### 5. How It Works

- **Frontend:** The React app is built and served as static files from `client/dist/`
- **Backend:** The Express server runs as a serverless function via `api/index.js`
- **Routing:** All `/api/*` requests go to the serverless function, everything else serves the React app

### 6. Local Development

```bash
# Install all dependencies
npm run install:all

# Run client (in one terminal)
cd client
npm run dev

# Run server (in another terminal)
cd server
npm run dev
```

### 7. Troubleshooting

**Issue:** API routes return 404
- Check that environment variables are set in Vercel dashboard
- Verify MongoDB connection string is correct

**Issue:** Build fails
- Check Node.js version (should be 18.x or 20.x)
- Verify all dependencies are in package.json files
- Check build logs for specific errors

**Issue:** CORS errors
- Update `CLIENT_URL` environment variable to match your Vercel domain
- Check CORS configuration in `server/src/index.js`

### 8. Post-Deployment

- Seed admin user if needed: Access your Vercel project terminal and run seed script
- Test all API endpoints
- Verify file uploads work with Cloudinary
- Check analytics tracking

## Notes

- The `api/` folder contains only a wrapper that imports your server
- Your existing `server/` folder code remains unchanged
- Vercel automatically handles serverless function creation
- Database connections are handled per-request in serverless environment
