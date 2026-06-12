import crypto from 'crypto';
import sharp from 'sharp';

const ALGORITHM = 'aes-256-cbc';

/**
 * Derives encryption key from password using PBKDF2
 */
export function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
}

/**
 * Encrypts message with password
 */
export function encryptMessage(message: string, password: string): Buffer {
  const salt = crypto.randomBytes(16);
  const key = deriveKey(password, salt);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Combine salt + iv + encrypted message
  const result = Buffer.concat([salt, iv, Buffer.from(encrypted, 'hex')]);
  return result;
}

/**
 * Decrypts message with password
 */
export function decryptMessage(encryptedData: Buffer, password: string): string {
  const salt = encryptedData.slice(0, 16);
  const iv = encryptedData.slice(16, 32);
  const encrypted = encryptedData.slice(32).toString('hex');

  const key = deriveKey(password, salt);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Encodes message into image using LSB steganography
 */
export async function encodeMessage(
  imageData: string | Buffer,
  message: string,
  password: string
): Promise<Buffer> {
  const image = sharp(imageData);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Invalid image dimensions');
  }

  // Encrypt the message
  const encryptedData = encryptMessage(message, password);

  // Get raw pixel data
  let raw = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelData = raw.data;
  const channels = raw.info.channels;
  const totalPixels = metadata.width * metadata.height;
  const bitsAvailable = totalPixels * channels;

  // Store message size (4 bytes) + message data
  const messageLengthBuffer = Buffer.alloc(4);
  messageLengthBuffer.writeUInt32BE(encryptedData.length, 0);
  const fullMessage = Buffer.concat([messageLengthBuffer, encryptedData]);

  if (fullMessage.length * 8 > bitsAvailable) {
    throw new Error(
      `Message too large. Max size: ${Math.floor(bitsAvailable / 8)} bytes`
    );
  }

  // Embed message in LSB
  let bitIndex = 0;
  for (let i = 0; i < fullMessage.length; i++) {
    for (let bit = 0; bit < 8; bit++) {
      const byte = fullMessage[i];
      const bitValue = (byte >> (7 - bit)) & 1;
      const pixelIndex = bitIndex;

      if (pixelIndex < pixelData.length) {
        pixelData[pixelIndex] = (pixelData[pixelIndex] & 0xfe) | bitValue;
      }
      bitIndex++;
    }
  }

  // Convert back to image
  const encoded = sharp(pixelData, {
    raw: {
      width: metadata.width,
      height: metadata.height,
      channels: channels,
    },
  }).png();

  return encoded.toBuffer();
}

/**
 * Decodes message from image
 */
export async function decodeMessage(
  imageData: string | Buffer,
  password: string
): Promise<string> {
  const image = sharp(imageData);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height || !metadata.channels) {
    throw new Error('Invalid image dimensions or format');
  }

  // Get raw pixel data
  let raw = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelData = raw.data;
  const totalPixels = metadata.width * metadata.height;

  // Read message length (first 4 bytes = 32 bits)
  let messageLengthBits = Buffer.alloc(4);
  for (let i = 0; i < 32; i++) {
    const bitValue = pixelData[i] & 1;
    const byteIndex = Math.floor(i / 8);
    const bitIndex = 7 - (i % 8);
    messageLengthBits[byteIndex] |= bitValue << bitIndex;
  }

  const messageLength = messageLengthBits.readUInt32BE(0);

  // Validate message length
  const maxLength = Math.floor((totalPixels * metadata.channels - 32) / 8);
  if (messageLength > maxLength || messageLength <= 0) {
    throw new Error('Invalid or corrupted image data');
  }

  // Read encrypted message
  const messageData = Buffer.alloc(messageLength);
  let bitIndex = 32; // Start after length bytes

  for (let i = 0; i < messageLength; i++) {
    let byte = 0;
    for (let bit = 0; bit < 8; bit++) {
      const bitValue = pixelData[bitIndex] & 1;
      byte |= bitValue << (7 - bit);
      bitIndex++;
    }
    messageData[i] = byte;
  }

  // Decrypt and return message
  try {
    const decrypted = decryptMessage(messageData, password);
    return decrypted;
  } catch (error) {
    throw new Error('Failed to decrypt message. Wrong password?');
  }
}

/**
 * Calculate capacity of image
 */
export async function calculateCapacity(imageData: string | Buffer): Promise<number> {
  const image = sharp(imageData);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height || !metadata.channels) {
    throw new Error('Invalid image');
  }

  const totalBits = metadata.width * metadata.height * metadata.channels;
  // Reserve 32 bits for message length
  const availableBytes = Math.floor((totalBits - 32) / 8);

  // Account for encryption overhead (salt + iv)
  const encryptionOverhead = 32; // 16 bytes salt + 16 bytes iv

  return Math.max(0, availableBytes - encryptionOverhead);
}
