export interface EncodeRequest {
  image: File;
  message: string;
  password: string;
}

export interface DecodeRequest {
  image: File;
  password: string;
}

export interface CapacityResponse {
  capacity: number;
  capacityKB: number;
}

export interface DecodeResponse {
  message: string;
  success: boolean;
}

const ALGORITHM = 'AES-CBC';

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: ALGORITHM, length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptMessage(message: string, password: string): Promise<Uint8Array> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt);
  const enc = new TextEncoder();
  
  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv: iv },
    key,
    enc.encode(message)
  );
  
  const encryptedArray = new Uint8Array(encrypted);
  const result = new Uint8Array(salt.length + iv.length + encryptedArray.length);
  result.set(salt, 0);
  result.set(iv, 16);
  result.set(encryptedArray, 32);
  
  return result;
}

async function decryptMessage(encryptedData: Uint8Array, password: string): Promise<string> {
  const salt = encryptedData.slice(0, 16);
  const iv = encryptedData.slice(16, 32);
  const encrypted = encryptedData.slice(32);
  
  const key = await deriveKey(password, salt);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: iv },
    key,
    encrypted
  );
  
  const dec = new TextDecoder();
  return dec.decode(decrypted);
}

function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function getImageData(img: HTMLImageElement): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get canvas context');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function dataToBlob(imageData: ImageData): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(new Error('Could not get canvas context'));
    ctx.putImageData(imageData, 0, 0);
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas to Blob failed'));
    }, 'image/png');
  });
}

/**
 * Encode a message into an image
 */
export const encodeImage = async (data: EncodeRequest, onProgress?: (progress: number) => void): Promise<Blob> => {
  onProgress?.(10);
  const img = await fileToImage(data.image);
  onProgress?.(20);
  const imageData = getImageData(img);
  const pixelData = imageData.data;

  const bitsAvailable = pixelData.length;
  
  onProgress?.(30);
  const encryptedData = await encryptMessage(data.message, data.password);
  
  const messageLengthBuffer = new Uint8Array(4);
  const view = new DataView(messageLengthBuffer.buffer);
  view.setUint32(0, encryptedData.length, false); // Big Endian
  
  const fullMessage = new Uint8Array(messageLengthBuffer.length + encryptedData.length);
  fullMessage.set(messageLengthBuffer, 0);
  fullMessage.set(encryptedData, 4);

  if (fullMessage.length * 8 > bitsAvailable) {
    throw new Error(`Message too large. Max size: ${Math.floor(bitsAvailable / 8)} bytes`);
  }

  onProgress?.(50);
  let bitIndex = 0;
  for (let i = 0; i < fullMessage.length; i++) {
    for (let bit = 0; bit < 8; bit++) {
      const byte = fullMessage[i];
      const bitValue = (byte >> (7 - bit)) & 1;
      
      if (bitIndex < pixelData.length) {
        // Clear LSB and set to bitValue
        pixelData[bitIndex] = (pixelData[bitIndex] & 0xfe) | bitValue;
      }
      bitIndex++;
    }
  }

  onProgress?.(80);
  const blob = await dataToBlob(imageData);
  onProgress?.(100);
  return blob;
};

/**
 * Decode a message from an image
 */
export const decodeImage = async (data: DecodeRequest, onProgress?: (progress: number) => void): Promise<DecodeResponse> => {
  onProgress?.(20);
  const img = await fileToImage(data.image);
  const imageData = getImageData(img);
  const pixelData = imageData.data;

  onProgress?.(50);
  // Read 32 bits for length
  const messageLengthBuffer = new Uint8Array(4);
  for (let i = 0; i < 32; i++) {
    const bitValue = pixelData[i] & 1;
    const byteIndex = Math.floor(i / 8);
    const bitIndex = 7 - (i % 8);
    messageLengthBuffer[byteIndex] |= bitValue << bitIndex;
  }
  
  const view = new DataView(messageLengthBuffer.buffer);
  const messageLength = view.getUint32(0, false);
  
  const maxLength = Math.floor((pixelData.length - 32) / 8);
  if (messageLength > maxLength || messageLength <= 0) {
    throw new Error('Invalid or corrupted image data');
  }

  onProgress?.(70);
  const encryptedData = new Uint8Array(messageLength);
  let bitIndexRaw = 32;
  
  for (let i = 0; i < messageLength; i++) {
    let byte = 0;
    for (let bit = 0; bit < 8; bit++) {
      const bitValue = pixelData[bitIndexRaw] & 1;
      byte |= bitValue << (7 - bit);
      bitIndexRaw++;
    }
    encryptedData[i] = byte;
  }

  onProgress?.(90);
  try {
    const message = await decryptMessage(encryptedData, data.password);
    onProgress?.(100);
    return { success: true, message };
  } catch (error) {
    throw new Error('Failed to decrypt message. Wrong password or corrupted data?');
  }
};

/**
 * Get image capacity
 */
export const getImageCapacity = async (image: File): Promise<CapacityResponse> => {
  const img = await fileToImage(image);
  const totalBits = img.width * img.height * 4; // 4 channels RGBA
  
  const availableBytes = Math.floor((totalBits - 32) / 8);
  const encryptionOverhead = 32; // 16 bytes salt + 16 bytes iv
  
  const capacity = Math.max(0, availableBytes - encryptionOverhead);
  return {
    capacity,
    capacityKB: capacity / 1024
  };
};

/**
 * Check API health
 */
export const checkHealth = async (): Promise<boolean> => {
  return true;
};
