# Quick Start Guide

## 🚀 Getting Started

### Option 1: Using npm scripts (Recommended)

From the root directory, install all dependencies at once:

```bash
npm run install-all
```

### Option 2: Manual Installation

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

## ▶️ Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Steganography API running on http://localhost:5000
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:3000/
```

### Open in Browser
Navigate to `http://localhost:3000` and you're ready to encode/decode!

## 📋 Features Overview

### Encoding (Hide a Message)
1. Click **Encode** tab
2. Upload an image (PNG/JPG)
3. Enter your secret message
4. Set a password (min 6 characters)
5. Click **Encode and Download**
6. Share the encoded image safely!

### Decoding (Extract a Message)
1. Click **Decode** tab
2. Upload the encoded PNG image
3. Enter the password used during encoding
4. Click **Decode Message**
5. View and copy the extracted message

## 🛠️ Development

### Build for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

### Type Checking
Both backend and frontend use TypeScript for full type safety.

### Code Structure

- **Backend:** Express.js REST API with LSB steganography and AES-256 encryption
- **Frontend:** React SPA with Tailwind CSS and modern UI components

## 🔐 Security Details

- **Encryption:** AES-256-CBC
- **Key Derivation:** PBKDF2 with 100,000 iterations
- **Steganography:** Least Significant Bit (LSB) method
- **Server:** No data is stored permanently

## ⚙️ Environment Variables

### Backend (.env)
```
PORT=5000                          # API server port
NODE_ENV=development               # Environment mode
MAX_FILE_SIZE=10485760            # Max upload size (10MB)
```

### Frontend (automatic proxy)
Frontend automatically proxies `/api` requests to `http://localhost:5000`

## 📦 Project Structure

```
Steganography/
├── backend/                    # Express + TypeScript API
│   ├── src/
│   │   ├── index.ts           # Express server & routes
│   │   └── steganography.ts   # Core LSB + encryption
│   ├── dist/                  # Compiled JavaScript
│   └── package.json
├── frontend/                   # React + TypeScript UI
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── utils/             # API & utilities
│   │   ├── main.tsx           # Entry point
│   │   └── App.tsx            # Main component
│   ├── index.html
│   └── package.json
├── README.md                  # Full documentation
└── QUICKSTART.md              # This file
```

## 🐛 Troubleshooting

### "Backend Connection Failed" Error
- Check if backend is running: `npm run dev` in backend folder
- Verify port 5000 is not in use: `netstat -ano | findstr :5000` (Windows)
- Check firewall settings

### "Invalid file type" Error
- Only PNG and JPG files are supported for upload
- For decoding, specifically use PNG (the encoded image format)

### "Message Too Large" Error
- The capacity depends on image dimensions
- Larger images can hide larger messages
- Check the capacity indicator when encoding

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Vite will auto-increment port if 3000 is busy

## 📱 Browser Support

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
❌ Internet Explorer (not supported)

## 💡 Tips

- Use high-quality images for encoding (larger images = bigger capacity)
- Remember your password - there's no recovery without it!
- For production, deploy with HTTPS enabled
- Test with small messages first
- Keep the encoded image file intact (don't re-compress)

## 🚢 Deployment

### Deploying to Production

**Backend (Node.js hosting):**
```bash
npm run build
npm start
```

**Frontend (Static hosting):**
```bash
npm run build
# Deploy the 'dist' folder to your static hosting
```

### Environment Configuration for Production
- Update API_URL in frontend
- Enable HTTPS
- Set NODE_ENV=production
- Use strong database credentials if storing data

---

Need help? Check the main [README.md](./README.md) for complete documentation!
