import { useState } from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { FileUpload } from './ui/FileUpload';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useToast } from './ui/ToastProvider';
import { decodeImage } from '../utils/api';

export function DecodeTab() {
  const { addToast } = useToast();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageSelect = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setMessage(null);
  };

  const handleDecode = async () => {
    if (!image || !password) {
      addToast({
        title: 'Missing Information',
        description: 'Please provide image and password',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const response = await decodeImage(
        { image, password },
        setProgress
      );

      if (response.success) {
        setMessage(response.message);
        addToast({
          title: 'Success!',
          description: 'Message decoded successfully.',
        });
      } else {
        addToast({
          title: 'Decoding Failed',
          description: 'Could not decode message from image',
          variant: 'destructive',
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to decode image';
      addToast({
        title: 'Decoding Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleCopyMessage = () => {
    if (message) {
      navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast({
        title: 'Copied!',
        description: 'Message copied to clipboard',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Encoded File</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFileSelect={handleImageSelect}
            preview={preview}
            disabled={loading}
          />
        </CardContent>
      </Card>

      {image && (
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
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password to decode"
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
                <p className="text-sm text-text-muted mb-2">Decoding...</p>
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

      {message && (
        <Card className="bg-dark-card border-dark-border">
          <CardHeader>
            <CardTitle className="text-accent-orange">Decoded Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-dark-input rounded-lg p-4 border border-dark-border">
                <p className="text-text-dark whitespace-pre-wrap break-words">
                  {message}
                </p>
              </div>
              <Button
                onClick={handleCopyMessage}
                variant="outline"
                className="w-full gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={handleDecode}
        disabled={!image || !password || loading}
        className="w-full"
        size="lg"
        variant="default"
      >
        {loading ? 'Decoding...' : 'Decode Message'}
      </Button>
    </div>
  );
}
