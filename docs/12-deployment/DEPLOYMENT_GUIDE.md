# Deployment Guide (Static Hosting)

## 1. Static Web Hosting
Because OFFER MODE is a pure client-side SPA, the contents of `dist/` can be deployed to any static host:
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --dir=dist --prod`
- **GitHub Pages**: Deploy `dist/` branch with SPA redirect script (`index.html` fallback).
