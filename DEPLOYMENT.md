# Bakone Trades Frontend Deployment

This frontend is a Vite React app and should be deployed separately from the backend.

## Environment

Create the deployment environment variable:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

For local development:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Commands

```bash
npm install
npm run build
```

Deploy the generated `dist` folder to your static hosting provider.

## Backend CORS

On the backend, set:

```env
FRONTEND_URL=https://your-frontend-domain.com
CORS_ORIGINS=https://your-frontend-domain.com
```

If you need multiple frontend origins, separate them with commas.
