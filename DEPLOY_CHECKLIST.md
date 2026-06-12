# 🚀 Deployment Checklist - Vercel

## Pre-Deployment (Local Testing)

- [ ] Run `npm run install-all` to install all dependencies
- [ ] Test backend locally: `npm run dev:backend` (should see "Server running on port 5000")
- [ ] Test frontend locally: `npm run dev:frontend` (should see "ready in" message)
- [ ] Open browser and test:
  - [ ] Try encoding an image (frontend should not show connection error)
  - [ ] Try decoding an image with correct password
  - [ ] Try decoding with wrong password (should show error message)
- [ ] Check console for any errors (Ctrl+Shift+I)

## Pre-Deployment (Code Check)

- [ ] Run build commands to verify no compilation errors:
  ```bash
  npm run build:backend
  npm run build:frontend
  ```
- [ ] Check that `backend/dist` folder exists with compiled files
- [ ] Check that `frontend/dist` folder exists with built frontend

## Deployment to Vercel

### Option A: Using Vercel CLI (Easiest)

```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Login to Vercel (opens browser window)
vercel login

# Deploy to Vercel
vercel

# Deploy to production (recommended)
vercel --prod
```

### Option B: Using GitHub (Recommended for teams)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Setup Vercel deployment"
   git push origin main
   ```

2. Go to https://vercel.com/new

3. Select your GitHub repository

4. Click "Deploy" (Vercel auto-detects settings from `vercel.json`)

5. Wait for deployment to complete (~2-3 minutes)

## Post-Deployment Verification

- [ ] Visit your Vercel deployment URL
- [ ] Test upload/encode functionality (should work without errors)
- [ ] Test download/decode functionality
- [ ] Check browser console for errors (Ctrl+Shift+I)
- [ ] Verify no "Backend Connection Failed" error appears

## If Deployment Fails

1. **Check Vercel Logs**:
   ```bash
   vercel logs your-project-name.vercel.app
   ```

2. **Common Issues**:
   - Backend didn't compile: `npm run build:backend`
   - Missing dependencies: Run `npm run install-all`
   - Environment variables: Already set in `vercel.json`

3. **Need Help?**:
   - Check `DEPLOYMENT_FIX.md` for detailed troubleshooting
   - Check `VERCEL_DEPLOYMENT.md` for structure overview

## Files Modified/Created

**Created**:
- ✅ `/api/encode.ts` - Serverless encode function
- ✅ `/api/decode.ts` - Serverless decode function
- ✅ `/api/capacity.ts` - Serverless capacity function
- ✅ `/api/health.ts` - Health check function
- ✅ `/api/tsconfig.json` - API TypeScript config
- ✅ `frontend/.env.local` - Local dev config
- ✅ `frontend/.env.production` - Production config
- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Build optimization
- ✅ `DEPLOYMENT_FIX.md` - Detailed guide
- ✅ `VERCEL_DEPLOYMENT.md` - Quick reference

**Modified**:
- ✅ `frontend/src/utils/api.ts` - Uses env variable
- ✅ `backend/src/steganography.ts` - Accepts Buffer input
- ✅ `backend/package.json` - Added formidable
- ✅ `package.json` - Added build commands & dependencies

## Expected Result

After following these steps:

- Frontend deployed at: `https://your-project.vercel.app`
- Backend API available at: `https://your-project.vercel.app/api/*`
- All features working (encode, decode, capacity)
- No connection errors

---

**Happy Deploying! 🎉**
