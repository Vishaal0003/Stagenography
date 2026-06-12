# 🔐 Image Steganography - Complete Guide

## What is Steganography?

Steganography is an ancient technique of hiding secret messages or data within other non-secret data or media. Unlike cryptography, which makes data unreadable, steganography hides the **existence** of the message itself.

### Key Concepts

| Concept | Definition |
|---------|-----------|
| **Steganography** | Art of hiding data in plain sight |
| **Cryptography** | Art of making data unreadable |
| **Steganalysis** | Art of detecting hidden messages |
| **LSB (Least Significant Bit)** | Method of embedding data in the smallest unit of image data |

---

## How This Application Works

### 1️⃣ The Encoding Process

```
User's Message
    ↓
[AES-256-CBC Encryption with your password]
    ↓
Encrypted Binary Data
    ↓
[LSB Steganography]
    ↓
Replace LSBs in image pixels with encrypted bits
    ↓
Encoded PNG Image (looks identical to original!)
```

### 2️⃣ The Decoding Process

```
Encoded PNG Image
    ↓
[Extract LSBs from image pixels]
    ↓
Encrypted Binary Data
    ↓
[AES-256-CBC Decryption with your password]
    ↓
Original Message
```

### 3️⃣ Security Layers

#### Layer 1: LSB Steganography
- Hides the **existence** of the message
- Imperceptible to human eye
- Image appears completely normal

#### Layer 2: AES-256-CBC Encryption
- Even if someone extracts the LSBs, they get encrypted gibberish
- 256-bit key = 2^256 possible combinations
- Military-grade encryption standard

#### Layer 3: PBKDF2 Key Derivation
- Converts your password to encryption key
- 100,000 iterations make brute-force attacks expensive
- ~1 million times slower than simple SHA256

---

## Step-by-Step Usage Guide

### 📝 ENCODING (Hiding a Message)

#### Step 1: Upload Your Image
- Click **"Encode"** tab
- Drag & drop or click to upload PNG/JPG/JPEG
- Capacity is calculated automatically
- Larger images = bigger capacity

#### Step 2: Enter Your Secret Message
- Type the message in the text area
- Watch the capacity bar (must be ≤ 100%)
- Can include any characters, emojis, special symbols

#### Step 3: Set a Strong Password
- Minimum 6 characters (use 12+ for security)
- Use uppercase, lowercase, numbers, symbols
- **This password cannot be recovered if forgotten!**

#### Step 4: Encode & Download
- Click "Encode and Download"
- The PNG will be downloaded as "encoded.png"
- Encoding takes a few seconds depending on file size

#### Step 5: Share Safely
- Send the "encoded.png" to anyone
- To observers, it looks like a regular image
- Only recipients with the password can decode it

### 🔓 DECODING (Extracting a Message)

#### Step 1: Upload the Encoded Image
- Click **"Decode"** tab
- Upload the PNG that contains the hidden message
- Must be PNG format (JPG won't work)

#### Step 2: Enter the Password
- Use the exact password from encoding
- Incorrect password will cause decoding to fail
- Password is case-sensitive

#### Step 3: Decode the Message
- Click "Decode Message"
- Hidden message appears in a green card
- Click "Copy to Clipboard" to save it

---

## Technical Specifications

### 🔒 Encryption Details

| Parameter | Value | Why? |
|-----------|-------|------|
| Algorithm | AES-256-CBC | Military-grade, proven secure |
| Key Size | 256 bits | Maximum security |
| Block Size | 128 bits | Standard AES |
| Mode | CBC | Secure block chaining |
| IV | Random 16 bytes | Prevents pattern analysis |
| Salt | Random 16 bytes | Prevents dictionary attacks |
| KDF | PBKDF2-SHA256 | Industry standard |
| Iterations | 100,000 | Makes brute-force expensive |

### 🖼️ LSB Steganography Details

```
Original Pixel:    RGB(10101010, 11001100, 11110000)
                        ||||    ||||    ||||
                        LSBs:   0      0      0

After Encoding:    RGB(10101010, 11001100, 11110001)
                        ||||    ||||    ||||
                        LSBs:   0      0      1  (message bit)

Visual Difference: Imperceptible to human eye
                   Pixel value changed by ~0.4%
```

### 📊 Capacity Calculation

```
Capacity = (Width × Height × Channels × 8 bits - 32 bits) / 8

Example: 1920×1080 24-bit image
= (1920 × 1080 × 3 × 8 - 32) / 8
= 622,080 bits / 8
= ~77,760 bytes

After subtracting encryption overhead (32 bytes):
≈ 77,728 bytes or ~75 KB usable capacity
```

### 🎨 Supported Formats

| Format | Encoding | Decoding | Notes |
|--------|----------|----------|-------|
| PNG | ✅ Yes | ✅ Yes | Lossless, preserves LSBs |
| JPG/JPEG | ✅ Yes | ❌ No | Lossy compression destroys data |
| GIF | ❌ No | ❌ No | Indexed color mode |
| BMP | ❌ No | ❌ No | Not supported |
| WEBP | ❌ No | ❌ No | Not supported |

---

## Important Warnings & Best Practices

### ⚠️ Critical Points

1. **Remember Your Password**
   - No password recovery mechanism exists
   - Forgotten password = Lost message forever
   - Write down passwords in a secure location

2. **Preserve File Format**
   - Keep encoded image as PNG
   - Don't convert to JPG or resize
   - JPG compression will destroy the message

3. **Use Strong Passwords**
   - At least 12 characters
   - Mix uppercase, lowercase, numbers, symbols
   - Avoid dictionary words
   - Don't reuse passwords across applications

4. **Image Quality Matters**
   - Use high-resolution images (1024×768 minimum)
   - Avoid heavily compressed or small images
   - Higher quality = larger capacity

### 💡 Best Practices

- ✅ Use unique passwords for each encoded message
- ✅ Keep a backup of the password somewhere safe
- ✅ Test with small messages first
- ✅ Use PNG images you trust
- ✅ Don't share passwords through the same channel as images
- ✅ For critical messages, combine with other security methods

### ❌ What NOT to Do

- ❌ Don't forget your password
- ❌ Don't re-compress the PNG
- ❌ Don't convert PNG to JPG
- ❌ Don't edit the image after encoding
- ❌ Don't use weak/simple passwords
- ❌ Don't assume complete invisibility (steganalysis exists)

---

## Security Considerations

### What's Secure ✅

- **Encryption**: AES-256 is unbreakable with current technology
- **Hiding**: LSB is imperceptible to human observation
- **Derivation**: PBKDF2 with 100k iterations is slow and secure
- **No Storage**: Everything happens locally, nothing stored server-side
- **No Transmission**: Passwords never leave your device

### Limitations ⚠️

- **Steganalysis**: Advanced tools can detect LSB modifications
- **Capacity**: Limited by image resolution (typically 50-300 KB)
- **Format**: Must remain PNG to preserve data
- **Statistical**: Repeated patterns might be detected
- **Not Watermarking**: This embeds in LSBs, not invisible ink

### Threat Model

| Threat | Protected Against? | Notes |
|--------|-------------------|-------|
| Casual Observation | ✅ Yes | Image looks normal |
| Statistical Analysis | ⚠️ Partial | Detectable with tools |
| Password Brute-Force | ✅ Yes | 100k iterations make it expensive |
| Decryption without Password | ✅ Yes | AES-256 is unbreakable |
| Image Tampering | ✅ Yes | Any edit will corrupt message |

---

## Real-World Use Cases

### 📬 Secure Communication
- Hide sensitive messages in innocent-looking images
- Send via email or social media without raising suspicion
- Both parties need the password for decoding

### 🎨 Digital Ownership
- Embed copyright info in artwork
- Prove ownership of creative work
- Invisible watermarking

### 🤫 Covert Messaging
- Share information discreetly
- Hide during times of censorship
- Plausible deniability ("It's just a photo!")

### 📋 Document Protection
- Embed metadata in images
- Hidden signatures for authenticity
- Version control information

---

## Troubleshooting

### ❌ "Message Too Large" Error
**Solution:** Use a larger image or shorter message
- Capacity depends on image dimensions
- Formula: `(Width × Height × Channels × 8 - 32) / 8`

### ❌ "Failed to Decrypt" Error
**Solutions:**
- Check password spelling and case
- Ensure image is the correct encoded file
- Image might be corrupted

### ❌ "Invalid File Type" Error
**Solution:** Only upload PNG, JPG, or JPEG
- For encoding: PNG, JPG, JPEG → outputs PNG
- For decoding: Only PNG files

### ❌ "Image Capacity Not Calculated"
**Solution:** Try a different image
- Image might be too small
- Try minimum 800×600 pixels

### ❌ Decoded Message is Gibberish
**Solution:** Wrong password
- Verify exact password (case-sensitive)
- Check for typos

---

## FAQ - Frequently Asked Questions

### Q: Is this truly invisible?
**A:** To human eyes, yes. The message is imperceptible in the image. However, statistical analysis tools can detect LSB modifications.

### Q: What if someone intercepts the image?
**A:** The message remains encrypted. Without the correct password, it's just random data. Even with advanced tools, AES-256 is unbreakable.

### Q: Can I hide multiple messages in one image?
**A:** No, this application supports one message per image. Multiple messages would exceed capacity for most images.

### Q: What's the maximum message size?
**A:** For a 1920×1080 24-bit image: approximately 77 KB (after encryption overhead).

### Q: Is the password stored anywhere?
**A:** No! Passwords are never stored. They're only used to derive the encryption key during encoding/decoding.

### Q: Can I recover a forgotten password?
**A:** No. There's no recovery mechanism. The message cannot be decoded without the correct password.

### Q: Is this legal?
**A:** Yes, steganography itself is legal in most countries. However, local laws may apply to content and use cases.

### Q: How is this different from watermarking?
**A:** Watermarking embeds visible or semi-visible marks. Steganography hides data at the bit level, completely invisibly.

### Q: Can JPEG images be used?
**A:** For encoding: Yes (converted to PNG). For decoding: No, only PNG works because JPEG compression destroys the hidden data.

### Q: How long does encoding/decoding take?
**A:** Usually a few seconds depending on image size. Larger images and complex passwords might take longer.

---

## Advanced Topics

### LSB Attack Vectors

#### 1. Statistical Analysis
- Large-scale LSB modifications show statistical anomalies
- Chi-square analysis can detect non-random LSBs

#### 2. Steganalysis Tools
- Programs like Steg Detect can identify LSB use
- Cannot decrypt but can confirm existence

#### 3. Visual Attacks
- Histogram analysis
- Spectral analysis
- Noise floor examination

#### 4. Mitigation
- Use larger images (more LSBs to modify)
- Compress messages more
- Use higher-resolution source images

### Password Strength Analysis

```
Password Length:  8 chars    = 10^14 combinations
Password Length: 12 chars    = 10^21 combinations
Password Length: 16 chars    = 10^27 combinations

With 100k PBKDF2 iterations:
- 8-char password:  ~500 years to crack (1 attempt/ms)
- 12-char password: ~500 billion years to crack
- 16-char password: Effectively uncrackable
```

---

## Getting Started Quick Reference

```markdown
📝 TO ENCODE A MESSAGE:
1. Click "Encode" tab
2. Upload your image (PNG/JPG)
3. Type your secret message
4. Set a strong password (≥6 chars)
5. Click "Encode and Download"
6. Share the PNG file

🔓 TO DECODE A MESSAGE:
1. Click "Decode" tab
2. Upload the encoded PNG
3. Enter the password
4. Click "Decode Message"
5. Copy the extracted message

🔐 REMEMBER:
- Write down your passwords!
- Never forget the password
- Keep PNG files intact
- Use strong passwords
- Never reuse passwords
```

---

## Additional Resources

### Learning More
- [Steganography on Wikipedia](https://en.wikipedia.org/wiki/Steganography)
- [LSB Steganography](https://en.wikipedia.org/wiki/Least_significant_bit)
- [AES Encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
- [Steganalysis](https://en.wikipedia.org/wiki/Steganalysis)

### Related Tools
- OpenStego - Open source steganography tool
- DeepSound - Audio steganography
- SilentEye - Multimedia steganography
- Xiao Steganography - Windows GUI tool

---

## Contact & Support

For issues or questions, check the Help tab in the application or review this documentation.

---

**Last Updated:** June 2026
**Version:** 1.0.0
**Status:** Production Ready ✅

🔒 **Privacy Promise:** All encryption happens on your device. We never see your data, passwords, or messages.
