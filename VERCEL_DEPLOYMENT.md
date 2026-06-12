# Vercel Deployment Configuration for Steganography App

## How to Deploy

### 1. Connect Your Repository
```bash
vercel link
```

### 2. Set Up Environment Variables
In your Vercel project settings, add:
- `VITE_API_URL=/api` (automatically set in vercel.json)

### 3. Deploy
```bash
vercel
```

## What Gets Deployed

- **Frontend**: React/Vite app deployed to `https://your-project.vercel.app`
- **Backend API**: Serverless functions deployed to `/api/*` endpoints
  - `POST /api/encode` - Encodes message into image
  - `POST /api/decode` - Decodes message from image
  - `POST /api/capacity` - Calculates image capacity
  - `GET /api/health` - Health check

## Project Structure

```
├── api/                    # Serverless functions
│   ├── encode.ts
│   ├── decode.ts
│   ├── capacity.ts
│   └── health.ts
├── backend/               # Backend source (compiled for APIs)
├── frontend/              # React frontend
└── vercel.json           # Vercel configuration
```

## Notes

- The frontend uses relative API paths (`/api/*`) which work on Vercel
- Backend code is compiled and used by serverless functions
- File uploads are temporary and automatically cleaned up
- Maximum file size: 10MB
