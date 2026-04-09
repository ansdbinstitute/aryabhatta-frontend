import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const host = '127.0.0.1';
const port = 4177;

const routes = ['/', '/about', '/courses', '/gallery', '/secretary', '/contact'];

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

const serveDist = () =>
  http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', `http://${host}:${port}`);
      const requestPath = decodeURIComponent(url.pathname);
      const normalizedPath = requestPath === '/' ? '/index.html' : requestPath;
      const filePath = path.join(distDir, normalizedPath.replace(/^\/+/, ''));

      try {
        const stat = await fs.stat(filePath);
        if (stat.isFile()) {
          const extension = path.extname(filePath);
          const data = await fs.readFile(filePath);
          res.writeHead(200, { 'Content-Type': mimeTypes[extension] || 'application/octet-stream' });
          res.end(data);
          return;
        }
      } catch {
        // Fall through to SPA HTML.
      }

      const html = await fs.readFile(path.join(distDir, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`Prerender server error: ${error.message}`);
    }
  });

const writeRouteHtml = async (route, html) => {
  const outputDir = route === '/' ? distDir : path.join(distDir, route.replace(/^\/+/, ''));
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf8');
};

const startServer = async () => {
  const server = serveDist();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });
  return server;
};

const prerender = async () => {
  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const route of routes) {
      const page = await browser.newPage();
      page.on('pageerror', (error) => {
        console.warn(`[prerender] pageerror on ${route}: ${error.message}`);
      });

      await page.goto(`http://${host}:${port}${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => document.readyState === 'complete');
      await page.waitForSelector('#root');
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await page.evaluate(() => {
        const keepFirst = (selector) => {
          const nodes = Array.from(document.head.querySelectorAll(selector));
          nodes.slice(1).forEach((node) => node.remove());
        };

        const keepLast = (selector) => {
          const nodes = Array.from(document.head.querySelectorAll(selector));
          nodes.slice(0, -1).forEach((node) => node.remove());
        };

        const bodySchemas = Array.from(
          document.querySelectorAll('#root script[type="application/ld+json"]')
        );
        bodySchemas.forEach((script) => document.head.appendChild(script));

        keepFirst('title');
        keepLast('meta[name="description"]');
        keepLast('meta[name="keywords"]');
        keepLast('meta[property="og:title"]');
        keepLast('meta[property="og:description"]');
        keepLast('meta[property="og:type"]');
        keepLast('meta[property="og:url"]');
        keepLast('meta[property="og:site_name"]');
        keepLast('meta[property="og:image"]');
        keepLast('meta[name="twitter:card"]');
        keepLast('meta[name="twitter:title"]');
        keepLast('meta[name="twitter:description"]');
        keepLast('meta[name="twitter:image"]');
        keepLast('link[rel="canonical"]');
        keepFirst('script[type="application/ld+json"]');
      });

      const html = await page.content();
      await writeRouteHtml(route, html);
      await page.close();
    }
  } finally {
    await browser.close();
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
};

await prerender();
