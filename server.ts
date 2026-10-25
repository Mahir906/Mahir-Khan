import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './server/routes.ts';
import { initDatabase } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Initialize JSON database and seeds
  initDatabase();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Standard security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Robots.txt for search engines
  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain');
    res.send(
      `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: https://usamatraders.com/sitemap.xml\n`
    );
  });

  // Sitemap.xml for search engine indexing
  app.get('/sitemap.xml', (_req, res) => {
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://usamatraders.com/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://usamatraders.com/#cement</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://usamatraders.com/#blocks</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://usamatraders.com/#fleet</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://usamatraders.com/#projects</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://usamatraders.com/#gallery</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://usamatraders.com/#contact</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>`);
  });

  // Serve uploaded images statically
  const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
  app.use('/uploads', express.static(uploadsDir));

  // Mount API Router under /api
  app.use('/api', apiRouter);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[USAMA TRADERS] Full-stack Server listening on port ${PORT}`);
  });
}

startServer();
