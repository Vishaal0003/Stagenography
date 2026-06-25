import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [
        react(),
        {
            name: 'cors-proxy',
            configureServer(server) {
                server.middlewares.use('/cors-proxy', async (req, res) => {
                    try {
                        const reqUrl = req.url || '';
                        const parsedUrl = new URL(reqUrl, 'http://localhost');
                        const targetUrl = parsedUrl.searchParams.get('url');
                        if (!targetUrl) {
                            res.statusCode = 400;
                            res.end('Missing url parameter');
                            return;
                        }
                        const response = await fetch(targetUrl);
                        if (!response.ok) {
                            res.statusCode = response.status;
                            res.end(`Target server responded with ${response.status}`);
                            return;
                        }
                        const contentType = response.headers.get('content-type');
                        if (contentType) {
                            res.setHeader('Content-Type', contentType);
                        }
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        const arrayBuffer = await response.arrayBuffer();
                        res.end(new Uint8Array(arrayBuffer));
                    }
                    catch (error) {
                        res.statusCode = 500;
                        res.end(`Proxy error: ${error.message}`);
                    }
                });
            }
        }
    ],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
});
