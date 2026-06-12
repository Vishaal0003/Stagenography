import axios from 'axios';

const API_URL = '/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

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

/**
 * Encode a message into an image
 */
export const encodeImage = async (data: EncodeRequest, onProgress?: (progress: number) => void): Promise<Blob> => {
  const formData = new FormData();
  formData.append('image', data.image);
  formData.append('message', data.message);
  formData.append('password', data.password);

  const response = await apiClient.post('/encode', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress?.(progress);
      }
    },
    responseType: 'blob',
  });

  return response.data;
};

/**
 * Decode a message from an image
 */
export const decodeImage = async (data: DecodeRequest, onProgress?: (progress: number) => void): Promise<DecodeResponse> => {
  const formData = new FormData();
  formData.append('image', data.image);
  formData.append('password', data.password);

  const response = await apiClient.post('/decode', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress?.(progress);
      }
    },
  });

  return response.data;
};

/**
 * Get image capacity
 */
export const getImageCapacity = async (image: File): Promise<CapacityResponse> => {
  const formData = new FormData();
  formData.append('image', image);

  const response = await apiClient.post('/capacity', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Check API health
 */
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch {
    return false;
  }
};
