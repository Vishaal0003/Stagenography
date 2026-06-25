import { useState, useRef } from 'react';
import { Eye, EyeOff, Share2, Globe, Download, CheckCircle, AlertCircle, Copy, Check } from 'lucide-react';
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
  
  // Cloud sharing states
  const [encodedBlob, setEncodedBlob] = useState<Blob | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

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

      // Keep the blob in state for sharing
      setEncodedBlob(blob);

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

  const handleDownloadAgain = () => {
    if (!encodedBlob) return;
    const url = URL.createObjectURL(encodedBlob);
    if (downloadRef.current) {
      downloadRef.current.href = url;
      downloadRef.current.download = 'encoded.png';
      downloadRef.current.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleUploadToCloud = async () => {
    if (!encodedBlob) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', encodedBlob, 'encoded.png');
      formData.append('expire', '300'); // Delete after 5 minutes (300 seconds)
      
      const response = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Cloud upload failed');
      }

      const result = await response.json();
      if (result.status === 'success' && result.data?.url) {
        const rawUrl = result.data.url;
        // Convert to direct download url by adding /dl/
        const directUrl = rawUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
        setShareUrl(directUrl);
        addToast({
          title: 'Link Generated!',
          description: 'Secure temporary sharing link created successfully.',
        });
      } else {
        throw new Error(result.message || 'Invalid API response');
      }
    } catch (error) {
      addToast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Could not upload to cloud',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCopyShareUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
      addToast({
        title: 'Copied!',
        description: 'Link copied to clipboard. Share it along with the password.',
      });
    }
  };

  const handleResetForm = () => {
    setImage(null);
    setPreview(null);
    setMessage('');
    setPassword('');
    setEncodedBlob(null);
    setShareUrl(null);
  };

  const messageLength = message.length;
  const capacityPercentage = capacity ? (messageLength / capacity) * 100 : 0;

  // Render Success screen if encoding is done
  if (encodedBlob) {
    return (
      <div className="space-y-6">
        <a ref={downloadRef} className="hidden" />
        <Card className="border-accent-orange/30 shadow-lg shadow-accent-orange/5">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl text-accent-orange flex items-center justify-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              Encoding Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <p className="text-center text-text-muted text-sm max-w-md mx-auto">
              Your secret message has been securely encrypted and hidden inside the image. The file has been saved to your downloads.
            </p>

            {/* Preview of the encoded image */}
            {preview && (
              <div className="flex justify-center">
                <div className="relative group rounded-lg overflow-hidden border border-dark-border max-w-xs">
                  <img src={preview} alt="Encoded Preview" className="max-h-48 object-contain" />
                  <div className="absolute inset-0 bg-dark-bg/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                      onClick={handleDownloadAgain}
                      className="p-3 bg-accent-orange text-dark-bg rounded-full hover:scale-105 transition-transform shadow-lg"
                      title="Download Image Again"
                    >
                      <Download className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Cloud Sharing Options */}
            <div className="bg-dark-input border border-dark-border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-text-dark flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent-orange" />
                Share Online (5-Min Expiry)
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                ⚠️ <strong>Avoid Chat Compression:</strong> Sharing this image directly via WhatsApp, Discord, or Telegram as a photo will compress it, which destroys the hidden message.
                Use this temporary cloud upload to generate a link that **expires automatically in 5 minutes**.
              </p>

              {shareUrl ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input readOnly value={shareUrl} className="font-mono text-xs bg-dark-card border-accent-orange/20" />
                    <Button onClick={handleCopyShareUrl} className="px-4">
                      {copiedShare ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-[11px] text-green-400">
                    ✓ Link generated! It will expire in 5 minutes. Send this link and the password to your recipient. They can paste this link directly in the Decode tab.
                  </p>
                </div>
              ) : (
                <Button onClick={handleUploadToCloud} disabled={uploading} className="w-full gap-2" variant="outline">
                  {uploading ? (
                    <>
                      <LoadingSpinner />
                      Uploading to Cloud...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      Upload to Cloud & Get Share Link
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* WhatsApp Document Share Warning */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-4 text-xs text-text-muted space-y-2">
              <span className="font-medium text-text-dark flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-accent-orange" />
                Sharing manually?
              </span>
              <p>
                If you prefer sending the image file directly, make sure to send it as a <strong>Document / File</strong>.
                For example, on WhatsApp, click the attachment icon, choose <strong>Document</strong>, and select the downloaded PNG file.
              </p>
            </div>

            <Button onClick={handleResetForm} className="w-full">
              Encode Another Image
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <a ref={downloadRef} className="hidden" />

      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
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
        variant="default"
      >
        {loading ? 'Encoding...' : 'Encode and Download'}
      </Button>
    </div>
  );
}
