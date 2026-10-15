import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function archiveServerPlugin(): Plugin {
  const mimeMap: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.xml': 'application/xml; charset=utf-8',
    '.zip': 'application/zip',
  };

  const projectRoot = path.resolve(__dirname);

  return {
    name: 'archive-server-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const urlObj = new URL(req.url || '/', 'http://localhost');
        const pathname = decodeURIComponent(urlObj.pathname);

        // API endpoints
        if (pathname === '/api/archive-meta') {
          try {
            const requestedFolder = urlObj.searchParams.get('folder') || 'web20220817032451';
            const safeFolder = requestedFolder.includes('2023') ? 'web20230304112228' : 'web20220817032451';
            const baseDir = path.join(projectRoot, safeFolder);

            const files: Array<{ path: string; size: number; category: string; ext: string }> = [];
            function scan(dir: string, rel: string) {
              const entries = fs.readdirSync(dir, { withFileTypes: true });
              for (const entry of entries) {
                const subPath = path.join(dir, entry.name);
                const subRel = rel ? `${rel}/${entry.name}` : entry.name;
                if (entry.isDirectory()) {
                  scan(subPath, subRel);
                } else {
                  const stat = fs.statSync(subPath);
                  const ext = path.extname(entry.name).toLowerCase();
                  let category = 'other';
                  if (['.html', '.htm'].includes(ext)) category = 'html';
                  else if (['.css'].includes(ext)) category = 'css';
                  else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'].includes(ext)) category = 'image';
                  else if (['.json', '.xml'].includes(ext)) category = 'data';
                  files.push({ path: subRel, size: stat.size, category, ext });
                }
              }
            }
            if (fs.existsSync(baseDir)) {
              scan(baseDir, '');
            }

            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            });
            return res.end(JSON.stringify({ success: true, folder: safeFolder, count: files.length, files }));
          } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, error: err.message }));
          }
        }

        if (pathname === '/api/file-content') {
          const filePath = urlObj.searchParams.get('path');
          const requestedFolder = urlObj.searchParams.get('folder') || 'web20220817032451';
          const safeFolder = requestedFolder.includes('2023') ? 'web20230304112228' : 'web20220817032451';
          const baseDir = path.join(projectRoot, safeFolder);

          if (!filePath) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Missing path query parameter' }));
          }
          const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
          const target = path.join(baseDir, safePath);
          if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'File not found' }));
          }
          const ext = path.extname(target).toLowerCase();
          const isText = ['.html', '.css', '.js', '.json', '.txt', '.xml'].includes(ext);
          try {
            if (isText) {
              const content = fs.readFileSync(target, 'utf-8');
              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ isText: true, content, size: content.length, ext }));
            } else {
              const buffer = fs.readFileSync(target);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(
                JSON.stringify({
                  isText: false,
                  dataUrl: `data:${mimeMap[ext] || 'application/octet-stream'};base64,${buffer.toString('base64')}`,
                  size: buffer.length,
                  ext,
                })
              );
            }
          } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: err.message }));
          }
        }

        // Static files in web20220817032451 or web20230304112228
        const matchedArchive = ['/web20220817032451', '/web20230304112228'].find(prefix => pathname.startsWith(prefix));
        if (matchedArchive) {
          const folderName = matchedArchive.slice(1);
          const baseDir = path.join(projectRoot, folderName);
          let relPath = pathname.replace(new RegExp(`^\\/${folderName}\\/?`), '');
          let fullPath = path.join(baseDir, relPath);

          if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
            fullPath = path.join(fullPath, 'index.html');
          } else if (!fs.existsSync(fullPath) && fs.existsSync(fullPath + '.html')) {
            fullPath = fullPath + '.html';
          } else if (!fs.existsSync(fullPath) && fs.existsSync(path.join(fullPath, 'index.html'))) {
            fullPath = path.join(fullPath, 'index.html');
          }

          if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
            const ext = path.extname(fullPath).toLowerCase();
            const contentType = mimeMap[ext] || 'application/octet-stream';
            const data = fs.readFileSync(fullPath);
            res.writeHead(200, {
              'Content-Type': contentType,
              'Content-Length': data.length,
              'Cache-Control': 'no-cache',
              'Access-Control-Allow-Origin': '*',
            });
            return res.end(data);
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), archiveServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
