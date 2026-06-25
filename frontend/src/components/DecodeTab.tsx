import { useState } from 'react';
import { Eye, EyeOff, Copy, Check, Link, Upload } from 'lucide-react';
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

  // New Decode Source States
  const [decodeSource, setDecodeSource] = useState<'file' | 'link'>('file');
  const [linkUrl, setLinkUrl] = useState('');
  const [fetchingLink, setFetchingLink] = useState(false);

  const handleImageSelect = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setMessage(null);
  };

  const handleFetchLink = async () => {
    if (!linkUrl) return;
    setFetchingLink(true);
    try {
      let targetUrl = linkUrl.trim();
      // Auto-correct tmpfiles.org URLs to their direct download variants
      if (targetUrl.includes('tmpfiles.org/') && !targetUrl.includes('tmpfiles.org/dl/')) {
        targetUrl = targetUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      }

      // Use our custom CORS proxy (works in both local development and Vercel production)
      const proxyUrl = `/cors-proxy?url=${encodeURIComponent(targetUrl)}`;
      
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error('Failed to download image from link. Make sure the link is correct and active.');
      }
      
      const blob = await response.blob();
      const file = new File([blob], 'encoded.png', { type: 'image/png' });
      
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      setMessage(null);
      
      addToast({
        title: 'Success!',
        description: 'Shared image loaded successfully.',
      });
    } catch (error) {
      addToast({
        title: 'Load Failed',
        description: error instanceof Error ? error.message : 'Could not fetch image from URL. Try downloading the image manually first.',
        variant: 'destructive',
      });
    } finally {
      setFetchingLink(false);
    }
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
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <CardTitle>Select Encoded Image</CardTitle>
            <div className="flex bg-dark-input p-1 rounded-lg border border-dark-border text-xs">
              <button
                type="button"
                onClick={() => setDecodeSource('file')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all ${
                  decodeSource === 'file'
                    ? 'bg-accent-orange text-dark-bg font-semibold'
                    : 'text-text-muted hover:text-text-dark'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setDecodeSource('link')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all ${
                  decodeSource === 'link'
                    ? 'bg-accent-orange text-dark-bg font-semibold'
                    : 'text-text-muted hover:text-text-dark'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                Paste Link
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {decodeSource === 'file' ? (
            <FileUpload
              onFileSelect={handleImageSelect}
              preview={preview}
              disabled={loading}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Paste direct link (e.g. tmpfiles.org/dl/...)"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  disabled={loading || fetchingLink}
                  className="flex-1"
                />
                <Button
                  onClick={handleFetchLink}
                  disabled={!linkUrl || loading || fetchingLink}
                  variant="outline"
                  className="min-w-24 gap-1"
                >
                  {fetchingLink ? (
                    <>
                      <LoadingSpinner />
                      Loading...
                    </>
                  ) : (
                    'Load Link'
                  )}
                </Button>
              </div>
              
              {preview ? (
                <div className="space-y-2">
                  <img
                    src={preview}
                    alt="Loaded Preview"
                    className="max-w-full max-h-64 mx-auto rounded-lg border border-dark-border"
                  />
                  <p className="text-center text-xs text-green-400">✓ Loaded successfully</p>
                </div>
              ) : (
                <div className="text-center py-8 text-text-muted text-xs border border-dashed border-dark-border rounded-lg">
                  Paste the temporary cloud link shared by the sender to load the image directly.
                </div>
              )}
            </div>
          )}
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
        <Card className="bg-dark-card border-dark-border animate-fade-in">
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
                    <Check className="w-4 h-4 text-green-500" />
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
