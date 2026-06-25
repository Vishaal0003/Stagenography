import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Book, Lock, Eye, Zap, AlertCircle, CheckCircle, Share2, AlertTriangle } from 'lucide-react';

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

      {/* The Compression Problem */}
      <Card className="border-red-500/20 bg-red-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="w-6 h-6" />
            Why Sharing Fails: The Compression Problem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-text-muted text-sm leading-relaxed">
            Steganography hides messages by slightly changing the colors of pixels (changing the Least Significant Bit). 
            When you send an image through messaging apps like <strong>WhatsApp, Discord, Telegram, or Facebook Messenger</strong>, 
            these apps heavily compress the image to save bandwidth. This compression alters the pixels, 
            <strong> destroying the hidden message completely</strong>.
          </p>
          <div className="bg-dark-input border border-dark-border rounded-lg p-4 space-y-2">
            <p className="font-semibold text-accent-orange text-sm">How to send it correctly:</p>
            <ul className="space-y-2 text-text-muted text-xs">
              <li>☁️ <strong>Option A (Easiest):</strong> Use our built-in <strong>"Upload to Cloud"</strong> option after encoding. It generates a temporary link you can send to your friends. They can paste that link directly into the Decode tab.</li>
              <li>📄 <strong>Option B (Manual):</strong> Send the file as a <strong>Document / File</strong>. On WhatsApp, click the '+' icon &gt; choose <strong>Document</strong>. On Telegram, choose <strong>File</strong> (uncompressed). This keeps the PNG byte-for-byte identical.</li>
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
              <span className="text-text-muted"><strong>Upload File:</strong> Select or drag & drop any image. The capacity will be shown automatically.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">3.</span>
              <span className="text-text-muted"><strong>Enter Secret Message:</strong> Type the message you want to hide. Watch the capacity bar to ensure it fits.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">4.</span>
              <span className="text-text-muted"><strong>Set a Password:</strong> Create a strong password (minimum 6 characters). Remember this password - you'll need it to decode!</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">5.</span>
              <span className="text-text-muted"><strong>Encode & Download:</strong> Click "Encode and Download". The encoded file will be saved.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">6.</span>
              <span className="text-text-muted"><strong>Share Online (Optional):</strong> On the success screen, click <strong>"Upload to Cloud"</strong> to generate a direct link. Send this link and the password to the recipient.</span>
            </li>
          </ol>
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
              <span className="text-text-muted"><strong>Load the Image:</strong> Choose either <strong>"Upload File"</strong> to select a downloaded PNG file, or <strong>"Paste Link"</strong> to load a shared URL directly.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">3.</span>
              <span className="text-text-muted"><strong>Enter Password:</strong> Enter the password that was used to encode the message.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent-orange min-w-6">4.</span>
              <span className="text-text-muted"><strong>Decode Message:</strong> Click "Decode Message" to extract the hidden text.</span>
            </li>
          </ol>
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
              <p className="text-text-muted text-sm">PNG, JPG, PDF, DOC, DOCX, TXT, ZIP and more for encoding & decoding</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
