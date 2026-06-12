import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Book, Lock, Eye, Zap, AlertCircle, CheckCircle } from 'lucide-react';

export function HelpTab() {
  return (
    <div className="space-y-6">
      {/* What is Steganography */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Book className="w-6 h-6 text-accent-orange" />
            What is Steganography?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-text-muted leading-relaxed">
            Steganography is the practice of hiding secret messages or data inside other non-secret data or media. 
            Unlike cryptography (which scrambles data to make it unreadable), steganography hides the existence of 
            the message itself.
          </p>
          <div className="bg-dark-input border border-dark-border rounded-lg p-4">
            <p className="font-semibold text-accent-orange mb-2">Key Difference:</p>
            <ul className="space-y-2 text-text-muted text-sm">
              <li>🔐 <strong>Cryptography:</strong> Makes data unreadable (everyone knows something is hidden)</li>
              <li>🙈 <strong>Steganography:</strong> Hides data in plain sight (no one knows something is hidden)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-accent-orange" />
            How Does This Application Work?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-text-dark mb-2">1. LSB (Least Significant Bit) Steganography</p>
              <p className="text-text-muted text-sm leading-relaxed">
                The application uses LSB steganography, which replaces the least significant bits of image pixels 
                with message bits. Since these bits have minimal visual impact, the encoded image looks nearly identical 
                to the original.
              </p>
            </div>

            <div>
              <p className="font-semibold text-text-dark mb-2">2. AES-256-CBC Encryption</p>
              <p className="text-text-muted text-sm leading-relaxed">
                Before embedding, your message is encrypted using AES-256-CBC (military-grade encryption). This means 
                even if someone extracts the message, they cannot read it without the correct password.
              </p>
            </div>

            <div>
              <p className="font-semibold text-text-dark mb-2">3. PBKDF2 Key Derivation</p>
              <p className="text-text-muted text-sm leading-relaxed">
                Your password is converted to an encryption key using PBKDF2 with 100,000 iterations. This makes it 
                extremely difficult to crack the password even if someone has access to the encrypted message.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Use - Encoding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-accent-orange" />
            How to Use - Encoding (Hiding Messages)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="space-y-3">
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">1.</span>
              <span className="text-text-muted"><strong>Go to Encode Tab:</strong> Click the "Encode" button at the top</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">2.</span>
              <span className="text-text-muted"><strong>Upload Image:</strong> Drag and drop or click to upload a PNG/JPG image. The capacity will be shown automatically.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">3.</span>
              <span className="text-text-muted"><strong>Enter Your Secret Message:</strong> Type the message you want to hide. Watch the capacity bar to ensure it fits.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">4.</span>
              <span className="text-text-muted"><strong>Set a Password:</strong> Create a strong password (minimum 6 characters). Remember this password - you'll need it to decode!</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">5.</span>
              <span className="text-text-muted"><strong>Encode & Download:</strong> Click "Encode and Download". The encoded image will be downloaded as "encoded.png"</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">6.</span>
              <span className="text-text-muted"><strong>Share Safely:</strong> Share the encoded image with others. To them, it looks like a normal image!</span>
            </li>
          </ol>

          <div className="bg-accent-orange/10 border border-accent-orange/30 rounded-lg p-4 mt-4">
            <p className="text-text-muted text-sm">
              💡 <strong>Tip:</strong> Use larger images for bigger message capacity. The visual difference between original and encoded is imperceptible to the human eye.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* How to Use - Decoding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-accent-orange" />
            How to Use - Decoding (Extracting Messages)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="space-y-3">
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">1.</span>
              <span className="text-text-muted"><strong>Go to Decode Tab:</strong> Click the "Decode" button at the top</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">2.</span>
              <span className="text-text-muted"><strong>Upload Encoded Image:</strong> Upload the PNG image that contains the hidden message</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">3.</span>
              <span className="text-text-muted"><strong>Enter Password:</strong> Enter the password that was used to encode the message</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">4.</span>
              <span className="text-text-muted"><strong>Decode Message:</strong> Click "Decode Message" to extract the hidden text</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">5.</span>
              <span className="text-text-muted"><strong>View & Copy:</strong> The decoded message appears in a card. Click "Copy to Clipboard" to save it</span>
            </li>
          </ol>

          <div className="bg-accent-orange/10 border border-accent-orange/30 rounded-lg p-4 mt-4">
            <p className="text-text-muted text-sm">
              ⚠️ <strong>Important:</strong> If you get a decoding error, the password is wrong or the image is not properly encoded.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-accent-orange" />
            Technical Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="bg-dark-input border border-dark-border rounded-lg p-4">
              <p className="font-semibold text-accent-orange mb-2">Encryption Algorithm</p>
              <p className="text-text-muted text-sm">AES-256-CBC (Advanced Encryption Standard, 256-bit key)</p>
            </div>

            <div className="bg-dark-input border border-dark-border rounded-lg p-4">
              <p className="font-semibold text-accent-orange mb-2">Key Derivation</p>
              <p className="text-text-muted text-sm">PBKDF2 with 100,000 iterations, SHA-256 hash</p>
            </div>

            <div className="bg-dark-input border border-dark-border rounded-lg p-4">
              <p className="font-semibold text-accent-orange mb-2">Steganography Method</p>
              <p className="text-text-muted text-sm">LSB (Least Significant Bit) - 1 bit per image channel</p>
            </div>

            <div className="bg-dark-input border border-dark-border rounded-lg p-4">
              <p className="font-semibold text-accent-orange mb-2">Supported Formats</p>
              <p className="text-text-muted text-sm">PNG, JPG for encoding • PNG for decoding</p>
            </div>

            <div className="bg-dark-input border border-dark-border rounded-lg p-4">
              <p className="font-semibold text-accent-orange mb-2">Maximum Message Size</p>
              <p className="text-text-muted text-sm">Depends on image dimensions (typically 50-300 KB for standard images)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-accent-orange" />
            Important Notes & Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-3">
            <li className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
              <span className="text-text-muted"><strong>Use Strong Passwords:</strong> Always use passwords that are at least 8 characters with a mix of letters, numbers, and symbols</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
              <span className="text-text-muted"><strong>Remember Your Password:</strong> There's no password recovery. If you forget, the message cannot be recovered</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
              <span className="text-text-muted"><strong>Don't Re-compress Images:</strong> Keep the encoded PNG intact. Re-compressing or converting to JPG will corrupt the hidden data</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
              <span className="text-text-muted"><strong>Use Quality Images:</strong> Higher resolution images can hide larger messages. Avoid small or compressed images</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
              <span className="text-text-muted"><strong>Privacy:</strong> All processing happens on your device. Messages are never stored on our servers</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
              <span className="text-text-muted"><strong>Not Watermarking:</strong> This is true steganography, not watermarking. The message is embedded at the bit level</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Security Considerations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-accent-orange" />
            Security Considerations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-text-dark mb-2">✅ What's Secure</p>
              <ul className="list-disc list-inside space-y-1 text-text-muted text-sm">
                <li>Your password is never transmitted or stored</li>
                <li>Encrypted messages are AES-256, military-grade encryption</li>
                <li>The hidden message is imperceptible to casual observation</li>
                <li>PBKDF2 makes brute-force attacks computationally expensive</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-text-dark mb-2">⚠️ Limitations</p>
              <ul className="list-disc list-inside space-y-1 text-text-muted text-sm">
                <li>LSB steganography can be detected with advanced steganalysis tools</li>
                <li>Not suitable for hiding large amounts of data (capacity is limited)</li>
                <li>Image must remain PNG format after encoding</li>
                <li>An observer analyzing the image statistically might detect anomalies</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-text-dark mb-2">🔒 Best Use Cases</p>
              <ul className="list-disc list-inside space-y-1 text-text-muted text-sm">
                <li>Sharing sensitive information discretely</li>
                <li>Adding hidden metadata to images</li>
                <li>Protecting small messages with both hiding and encryption</li>
                <li>Watermarking original artwork as proof of ownership</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold text-accent-orange mb-2">Q: Can the message be detected?</p>
            <p className="text-text-muted text-sm">
              A: The message is imperceptible to the human eye. Advanced steganalysis tools might detect anomalies in the image, but the content remains encrypted.
            </p>
          </div>

          <div>
            <p className="font-semibold text-accent-orange mb-2">Q: How large can messages be?</p>
            <p className="text-text-muted text-sm">
              A: For a 1920x1080 24-bit image, you can hide roughly 270 KB of encrypted data. Exact capacity depends on image dimensions and color depth.
            </p>
          </div>

          <div>
            <p className="font-semibold text-accent-orange mb-2">Q: Is my data safe?</p>
            <p className="text-text-muted text-sm">
              A: Yes! All processing happens locally on your computer. Nothing is sent to or stored on any server. Your passwords and messages never leave your device.
            </p>
          </div>

          <div>
            <p className="font-semibold text-accent-orange mb-2">Q: What if I forget the password?</p>
            <p className="text-text-muted text-sm">
              A: The message cannot be recovered without the correct password. There is no password recovery mechanism. Remember to save your passwords securely.
            </p>
          </div>

          <div>
            <p className="font-semibold text-accent-orange mb-2">Q: Can I use JPEG images?</p>
            <p className="text-text-muted text-sm">
              A: You can encode in JPEG, but it will be converted to PNG. Always decode from PNG. JPEG compression destroys the hidden data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
