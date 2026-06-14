# Image Steganography Web Application

A modern, **100% client-side** web application for encoding and decoding secret messages within images. All processing is done securely in your browser using the native Web Crypto API and HTML5 Canvas API—no backend or server storage required!

## Features

✨ **Encode Tab:**
- Upload PNG/JPG images
- Hide encrypted messages inside images
- Password-protected encryption
- Visual capacity indicator
- Real-time processing
- Zero server interaction—100% private

🔍 **Decode Tab:**
- Extract hidden messages from encoded images
- Password verification
- Copy decoded message to clipboard
- Support for PNG images

🔐 **Security:**
- AES-256-CBC encryption (via Web Crypto API)
- PBKDF2 key derivation (100,000 iterations, SHA-256)
- Password-based security
- **No data leaves your device:** All encryption and steganography happen directly in the browser's memory.

🎨 **UI/UX:**
- Modern gradient background
- Glass morphism cards
- Drag & drop file upload
- Responsive design (mobile + desktop)
- Toast notifications

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** inspired components
- **Lucide React** for icons
- **Web Crypto API** for native, secure encryption
- **HTML5 Canvas API** for raw pixel manipulation (LSB Steganography)

## Project Structure

```text
Steganography/
├── frontend/                 # React + TypeScript app
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ui/         # Reusable UI components
│   │   │   ├── EncodeTab.tsx
│   │   │   ├── DecodeTab.tsx
│   │   │   └── App.tsx
│   │   ├── utils/          # Utilities (Crypto & Canvas logic in api.ts)
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Tailwind styles
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── package.json
└── package.json              # Root package config
```

## Installation & Running

Since there's no backend, setup is incredibly simple.

### Prerequisites
- Node.js 18+ and npm

### Quick Start

1. Install all dependencies from the root directory:
```bash
npm run install-all
```

2. Start the development server:
```bash
npm run dev
```

3. Open `http://localhost:5173` (or the port Vite provides) in your browser.

## How It Works

### Encoding Process
1. **Message Encryption:** The secret message is encrypted using AES-CBC with PBKDF2 key derivation via the browser's native `crypto.subtle` API.
2. **Canvas Loading:** The uploaded image is drawn onto an invisible HTML5 `<canvas>` element to extract the raw `ImageData` (RGBA pixel array).
3. **LSB Embedding:** The encrypted byte array (along with a 4-byte length header) is embedded bit-by-bit into the Least Significant Bits (LSB) of the image's pixel data.
4. **Image Export:** The modified `ImageData` is put back onto the canvas and exported as a new PNG blob for the user to download.

### Decoding Process
1. **Canvas Loading:** The encoded PNG image is drawn onto a `<canvas>` to read the `ImageData`.
2. **LSB Extraction:** The hidden bits are extracted from the pixel data to reconstruct the encrypted byte array.
3. **Message Decryption:** The payload is decrypted using the provided password via the Web Crypto API.
4. **Message Display:** The plaintext message is revealed to the user.

## Limitations

- Maximum message size depends on the image dimensions (Total Pixels × 4 channels).
- Larger images can hide larger messages.
- The exported image **must remain in a lossless format (PNG)**. Compressing it via JPEG or sending it through platforms that compress images (like WhatsApp or Discord, unless sent as a file) will destroy the hidden message.

## Building for Production

To build the optimized static files:

```bash
npm run build
```

This will output the static assets to `frontend/dist/`. Since it's a purely static client-side app, you can host the contents of `dist/` on GitHub Pages, Vercel, Netlify, Cloudflare Pages, or any static file host.

## Browser Support

Requires modern browsers supporting ES modules, Web Crypto API, and modern Canvas features:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT License
