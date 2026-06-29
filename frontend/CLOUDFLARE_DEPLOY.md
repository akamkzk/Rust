# Cloudflare Pages Deployment

This project is configured for deployment on Cloudflare Pages.

## Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Cloudflare account (free tier available)

## Installation

```bash
cd frontend
npm install
```

## Development

### Local Development with Vite
```bash
npm run dev
```

### Cloudflare Pages Local Development
```bash
npm run pages:dev
```

## Deployment

### Option 1: Deploy via GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Select "Pages" → "Create a project"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `/dist`
   - **Root directory**: `frontend/`
6. Click "Deploy site"

### Option 2: Deploy via Wrangler CLI

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Pages
npm run pages:deploy
```

## Environment Variables

For production deployment, set these in Cloudflare Dashboard → Pages → Settings → Environment Variables:

- `VITE_API_URL`: Your backend API URL
- `VITE_APP_ENV`: production

## SPA Routing

This app uses React Router for client-side routing. Cloudflare Pages is configured to serve the `index.html` for all routes.

## Custom Domains

1. Go to Cloudflare Dashboard → Pages → Your Project → Custom Domains
2. Add your custom domain
3. Cloudflare will automatically configure SSL certificates

## Performance

Cloudflare Pages automatically:
- Serves assets from edge locations
- Minifies HTML, CSS, and JavaScript
- Sets cache headers for optimal performance
- Provides DDoS protection
- Enables HTTP/3 support
