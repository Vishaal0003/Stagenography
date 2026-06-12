import { useState, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { FileUpload } from './ui/FileUpload';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useToast } from './ui/ToastProvider';
import { encodeImage, getImageCapacity } from '../utils/api';

export function EncodeTab() {
  const { addToast } = useToast();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [capacity, setCapacity] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const handleImageSelect = async (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Get capacity
    try {
      const cap = await getImageCapacity(file);
      setCapacity(cap.capacity);
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to calculate image capacity',
        variant: 'destructive',
      });
    }
  };

  const handleEncode = async () => {
    if (!image || !message || !password) {
      addToast({
        title: 'Missing Information',
        description: 'Please provide image, message, and password',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      addToast({
        title: 'Invalid Password',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    if (message.length > (capacity || 0)) {
      addToast({
        title: 'Message Too Large',
        description: `Message exceeds image capacity. Max: ${capacity} bytes`,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const blob = await encodeImage(
        { image, message, password },
        setProgress
      );

      // Create download link
      const url = URL.createObjectURL(blob);
      if (downloadRef.current) {
        downloadRef.current.href = url;
        downloadRef.current.download = 'encoded.png';
        downloadRef.current.click();
        URL.revokeObjectURL(url);
      }

      addToast({
        title: 'Success!',
        description: 'Image encoded successfully. Download started.',
      });

      // Reset form
      setImage(null);
      setPreview(null);
      setMessage('');
      setPassword('');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to encode image';
      addToast({
        title: 'Encoding Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const messageLength = message.length;
  const capacityPercentage = capacity ? (messageLength / capacity) * 100 : 0;

  return (
    <div className="space-y-6">
      <a ref={downloadRef} className="hidden" />

      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFileSelect={handleImageSelect}
            preview={preview}
            disabled={loading}
          />
        </CardContent>
      </Card>

      {image && capacity !== null && (
        <Card>
          <CardHeader>
            <CardTitle>Image Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-text-dark">Filename:</span>{' '}
                <span className="text-text-muted">{image.name}</span>
              </p>
              <p>
                <span className="font-medium text-text-dark">Size:</span>{' '}
                <span className="text-text-muted">
                  {(image.size / 1024).toFixed(2)} KB
                </span>
              </p>
              <p>
                <span className="font-medium text-text-dark">Max Capacity:</span>{' '}
                <span className="text-text-muted">
                  {capacity} bytes (~{(capacity / 1024).toFixed(2)} KB)
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Secret Message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Textarea
              placeholder="Enter your secret message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              maxLength={capacity || 10000}
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>
                {messageLength} / {capacity || 0} characters
              </span>
            </div>
            {capacity && (
              <div className="w-full bg-dark-input rounded-full h-2">
                <div
                  className="bg-accent-orange h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark transition-colors"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <LoadingSpinner />
              <div className="text-center">
                <p className="text-sm text-text-muted mb-2">Encoding...</p>
                <div className="w-full bg-dark-input rounded-full h-2">
                  <div
                    className="bg-accent-orange h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-text-muted mt-2">{progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={handleEncode}
        disabled={!image || !message || !password || loading}
        className="w-full"
        size="lg"
      >
        {loading ? 'Encoding...' : 'Encode and Download'}
      </Button>
    </div>
  );
}
