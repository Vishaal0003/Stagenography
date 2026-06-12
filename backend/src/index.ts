import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import {
  encodeMessage,
  decodeMessage,
  calculateCapacity,
} from './steganography';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PNG and JPG allowed.'));
    }
  },
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

/**
 * POST /api/encode
 * Encodes a message into an image
 */
app.post(
  '/api/encode',
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image provided' });
      }

      const { message, password } = req.body;

      if (!message || !password) {
        fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json({ error: 'Message and password are required' });
      }

      if (password.length < 6) {
        fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json({ error: 'Password must be at least 6 characters' });
      }

      // Encode message into image
      const encodedBuffer = await encodeMessage(
        req.file.path,
        message,
        password
      );

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      // Send encoded image
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'attachment; filename=encoded.png');
      res.send(encodedBuffer);
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: errorMessage });
    }
  }
);

/**
 * POST /api/decode
 * Decodes a message from an image
 */
app.post(
  '/api/decode',
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image provided' });
      }

      const { password } = req.body;

      if (!password) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Password is required' });
      }

      // Decode message from image
      const message = await decodeMessage(req.file.path, password);

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      res.json({ message, success: true });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: errorMessage, success: false });
    }
  }
);

/**
 * POST /api/capacity
 * Calculates how much data can be hidden in the image
 */
app.post(
  '/api/capacity',
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image provided' });
      }

      const capacity = await calculateCapacity(req.file.path);

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      res.json({
        capacity,
        capacityKB: Math.round((capacity / 1024) * 100) / 100,
      });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: errorMessage });
    }
  }
);

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({ error: error.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Steganography API running on http://localhost:${PORT}`);
});
