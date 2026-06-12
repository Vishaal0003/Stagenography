# Vercel Deployment Fix - Complete Guide

## What Was Fixed

Your app was failing to deploy because the frontend couldn't connect to the backend. The issue was:

1. **No Backend**: Vercel was deploying only the frontend, not the backend server
2. **API Connection Issue**: The frontend used `/api` which only worked locally with Vite's proxy
3. **Missing Serverless Functions**: No serverless backend functions were configured

## Solution Implemented

### 1. **Converted Backend to Serverless Functions**
   - Created `/api/encode.ts` - For encoding messages into images
   - Created `/api/decode.ts` - For decoding messages from images  
   - Created `/api/capacity.ts` - For calculating image capacity
   - Created `/api/health.ts` - Health check endpoint

### 2. **Updated Frontend Configuration**
   - Modified `frontend/src/utils/api.ts` to use environment variable: `VITE_API_URL`
   - Created `.env.local` for local development (points to `localhost:5000`)
   - Created `.env.production` for Vercel deployment (uses `/api`)

### 3. **Added Vercel Configuration**
   - Created `vercel.json` with proper build and routing configuration
   - Created `.vercelignore` to optimize build size
   - Updated root `package.json` with build commands and dependencies

### 4. **Updated Backend for Buffer Input**
   - Modified `backend/src/steganography.ts` functions to accept `Buffer` input (not just file paths)
   - This allows serverless functions to work with in-memory files

## How to Deploy Now

### Step 1: Install Dependencies (Local Development)
```bash
npm run install-all
```

### Step 2: Test Locally First
```bash
# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Start frontend
npm run dev:frontend
```

Open `http://localhost:3000` and test the encode/decode functionality.

### Step 3: Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI if you don't have it
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Using Git (Recommended)
1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Select your repository
4. Vercel will auto-detect the configuration and deploy

### Step 4: Verify Deployment
After deployment, you'll get a URL like `https://your-project.vercel.app`

- Visit the URL in your browser
- Test the encode functionality
- Test the decode functionality
- Both should now work without "Backend Connection Failed" error

## File Structure After Fix

```
steganography/
├── api/                          # NEW: Serverless functions
│   ├── health.ts                # NEW: Health check
│   ├── encode.ts                # NEW: Encoding serverless function
│   ├── decode.ts                # NEW: Decoding serverless function
│   ├── capacity.ts              # NEW: Capacity calculation function
│   └── tsconfig.json            # NEW: TypeScript config for API
├── backend/                      # Existing backend code
│   ├── src/
│   │   ├── index.ts            # Express server (for local dev only)
│   │   └── steganography.ts    # MODIFIED: Now accepts Buffer input
│   ├── package.json            # MODIFIED: Added formidable
│   └── tsconfig.json
├── frontend/                     # Existing frontend
│   ├── src/
│   │   ├── utils/
│   │   │   └── api.ts          # MODIFIED: Uses env variable for API URL
│   │   └── ...
│   ├── .env.local              # NEW: Local development config
│   ├── .env.production         # NEW: Production config
│   └── ...
├── package.json                 # MODIFIED: Added formidable, build commands
├── vercel.json                 # NEW: Vercel deployment config
├── .vercelignore               # NEW: Build optimization
├── VERCEL_DEPLOYMENT.md        # NEW: Quick reference guide
└── README.md
```

## Important Notes

### ⚠️ Important Differences in Deployment

| Feature | Local | Vercel |
|---------|-------|--------|
| **API Base URL** | `/api` → proxied to `localhost:5000` | `/api` → serverless functions |
| **Backend Server** | Express server running on `5000` | Not needed (serverless) |
| **File Uploads** | Saved to disk | Temporary in memory |
| **Database** | N/A | N/A |

### Troubleshooting

**Problem**: Still getting "Backend Connection Failed"
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check if Vercel deployment is complete in dashboard

**Problem**: Upload/Download not working
- Check Vercel logs: `vercel logs your-project.vercel.app`
- Verify formidable is installed: `npm ls formidable`

**Problem**: Images not encoding/decoding properly
- Ensure backend compiled successfully: `npm run build:backend`
- Check that `backend/dist` folder exists with compiled code
- Verify `backend/dist/steganography.js` is present

### Environment Variables in Vercel

The `VITE_API_URL` variable is automatically set in Vercel via `vercel.json`:
- No need to manually add it to Vercel dashboard
- Frontend automatically uses `/api` when deployed

## Next Steps

1. ✅ Run `npm run install-all` to ensure all dependencies are installed
2. ✅ Test locally with `npm run dev:backend` and `npm run dev:frontend`
3. ✅ Push to GitHub
4. ✅ Deploy to Vercel using CLI or GitHub integration
5. ✅ Test your app at the Vercel URL

## Support

- Vercel Docs: https://vercel.com/docs
- Serverless Functions: https://vercel.com/docs/functions/quickstart
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs (reference for API routes)

---

**Last Updated**: 2024
**Status**: Ready for Production Deployment
