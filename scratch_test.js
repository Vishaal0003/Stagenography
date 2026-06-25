async function test() {
  console.log('1. Uploading to catbox.moe...');
  try {
    const formData = new FormData();
    const blob = new Blob(['hello catbox'], { type: 'text/plain' });
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', blob, 'test.txt');

    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData
    });

    console.log('Upload status:', res.status);
    const url = await res.text();
    console.log('Uploaded URL:', url);

    if (url.startsWith('http')) {
      console.log('\n2. Fetching catbox URL...');
      const getRes = await fetch(url.trim());
      console.log('Fetch status:', getRes.status);
      console.log('Fetch headers:');
      for (const [k, v] of getRes.headers.entries()) {
        console.log(`  ${k}: ${v}`);
      }
      console.log('Content:', await getRes.text());
    }
  } catch (err) {
    console.error('Catbox test failed:', err);
  }
}

test();
