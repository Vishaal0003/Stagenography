# Image Steganography Web Application

A modern web application for encoding and decoding secret messages within images using AES-256 encryption and LSB (Least Significant Bit) steganography.

## Features

✨ **Encode Tab:**
- Upload PNG/JPG images
- Hide encrypted messages inside images
- Password-protected encryption
- Visual capacity indicator
- Real-time upload progress

🔍 **Decode Tab:**
- Extract hidden messages from encoded images
- Password verification
- Copy decoded message to clipboard
- Support for PNG images

🔐 **Security:**
- AES-256-CBC encryption
- PBKDF2 key derivation (100,000 iterations)
- Password-based security
- Client-to-server HTTPS ready

🎨 **UI/UX:**
- Modern gradient background
- Glass morphism cards
- Drag & drop file upload
- Responsive design (mobile + desktop)
- Toast notifications
- Loading states with progress bars

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Shadcn/ui** inspired components
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Sharp** for image processing
- **Multer** for file uploads
- **Crypto** (Node.js built-in) for encryption

## Project Structure

```
Steganography/
├── frontend/                 # React + TypeScript app
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ui/         # Reusable UI components
│   │   │   ├── EncodeTab.tsx
│   │   │   ├── DecodeTab.tsx
│   │   │   └── App.tsx
│   │   ├── utils/          # Utilities and API calls
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Tailwind styles
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── package.json
│
└── backend/                  # Express + TypeScript API
    ├── src/
    │   ├── index.ts        # Express server
    │   └── steganography.ts # Core LSB + encryption logic
    ├── dist/               # Compiled output
    ├── tsconfig.json
    ├── .env
    └── package.json
```

## Installation

### Prerequisites
- Node.js 16+ and npm

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder (already included):
```
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=10485760
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

The API will run on `http://localhost:5000`

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000` in your browser

## API Endpoints

### POST `/api/encode`
Encodes a message into an image

**Request:**
- `Content-Type: multipart/form-data`
- `image`: PNG or JPG file
- `message`: Text message to encode
- `password`: Encryption password (min 6 chars)

**Response:**
- Returns encoded PNG image as binary

### POST `/api/decode`
Decodes a message from an image

**Request:**
- `Content-Type: multipart/form-data`
- `image`: PNG image (previously encoded)
- `password`: Decryption password

**Response:**
```json
{
  "message": "Your secret message",
  "success": true
}
```

### POST `/api/capacity`
Calculates how much data can be hidden in an image

**Request:**
- `Content-Type: multipart/form-data`
- `image`: PNG or JPG file

**Response:**
```json
{
  "capacity": 50000,
  "capacityKB": 48.83
}
```

### GET `/api/health`
Health check endpoint

**Response:**
```json
{ "status": "ok" }
```

## How It Works

### Encoding Process

1. **Message Encryption:** The secret message is encrypted using AES-256-CBC with PBKDF2 key derivation
2. **LSB Embedding:** Encrypted bytes are embedded into the least significant bits of image pixels
3. **Image Export:** Modified image is saved as PNG

### Decoding Process

1. **LSB Extraction:** Extract bits from image pixels
2. **Message Decryption:** Decrypt extracted bytes using provided password
3. **Message Display:** Show decrypted message to user

## Security Notes

- **AES-256-CBC:** Military-grade encryption algorithm
- **PBKDF2:** 100,000 iterations for strong key derivation
- **LSB Steganography:** Visually imperceptible, mathematically secure for small payloads
- **No Server Storage:** Files are processed and immediately deleted
- **HTTPS Ready:** Can be deployed with SSL/TLS

## Limitations

- Maximum message size depends on image dimensions
- Larger images can hide larger messages
- Image quality must be preserved for successful decoding
- LSB steganography is vulnerable to steganalysis with large payloads

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT License

## Future Enhancements

- [ ] Support for video steganography
- [ ] Multiple file format support
- [ ] Batch encoding/decoding
- [ ] Cloud storage integration
- [ ] Mobile app (React Native)
- [ ] Advanced steganalysis resistance

## Troubleshooting

### Backend Connection Error
- Ensure backend is running on port 5000
- Check firewall settings
- Verify `.env` configuration

### Encoding/Decoding Failures
- Ensure image format is PNG or JPG
- Verify password is correct
- Check image file size is under 10MB

### Build Issues
- Delete `node_modules` and run `npm install` again
- Clear TypeScript cache: `rm -rf dist/`
- Ensure Node.js version is 16+

---

Built with ❤️ for secure communication
