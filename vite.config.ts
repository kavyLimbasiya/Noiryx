import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function localWallpaperServer(): Plugin {
  return {
    name: 'local-wallpaper-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url ? req.url.split('?')[0] : '';
        const decodedUrl = decodeURIComponent(rawUrl);

        if (decodedUrl.startsWith('/assets/wallpapers/') || decodedUrl.startsWith('/wallpapers/')) {
          const cleanPath = decodedUrl.replace(/^\/(assets\/)?wallpapers\//, '');
          let localFilePath = path.resolve(__dirname, 'src/assets/wallpapers', cleanPath);

          // If thumbnail requested but doesn't exist, fallback immediately to local original file
          if (!fs.existsSync(localFilePath) && cleanPath.startsWith('thumbnails/')) {
            const originalPath = cleanPath
              .replace(/^thumbnails\//, '')
              .replace(/\.webp$/i, '');
            for (const ext of ['.png', '.jpg', '.jpeg', '.webp']) {
              const testPath = path.resolve(__dirname, 'src/assets/wallpapers', `${originalPath}${ext}`);
              if (fs.existsSync(testPath)) {
                localFilePath = testPath;
                break;
              }
            }
          }

          if (fs.existsSync(localFilePath) && fs.statSync(localFilePath).isFile()) {
            const ext = path.extname(localFilePath).toLowerCase();
            const mimeMap: Record<string, string> = {
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.webp': 'image/webp',
              '.svg': 'image/svg+xml',
            };
            res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            fs.createReadStream(localFilePath).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), localWallpaperServer()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/assets/wallpapers': {
          target: 'https://kavylimbasiya.github.io/Noiryx.com',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/assets\/wallpapers/, '/wallpapers'),
        },
        '/wallpapers': {
          target: 'https://kavylimbasiya.github.io/Noiryx.com',
          changeOrigin: true,
        },
      },
    },
  };
});

