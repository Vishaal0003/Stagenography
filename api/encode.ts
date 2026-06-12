import { VercelRequest, VercelResponse } from '@vercel/node';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import { encodeMessage } from '../backend/dist/steganography';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: VercelRequest, res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm();
    const [fields, files] = await form.parse(req);

    const imageFiles = files.image;
    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const imageFile = imageFiles[0];
    const message = fields.message?.[0] || '';
    const password = fields.password?.[0] || '';

    if (!message || !password) {
      return res.status(400).json({ error: 'Message and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const imageBuffer = await fs.readFile(imageFile.filepath);
    const encodedBuffer = await encodeMessage(imageBuffer, message, password);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="encoded.png"');
    res.send(encodedBuffer);
  } catch (error: any) {
    console.error('Encode error:', error);
    res.status(500).json({ error: error.message || 'Encoding failed' });
  }
};
