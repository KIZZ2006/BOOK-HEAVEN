# Book Heaven Deployment Guide

This guide covers deploying Book Heaven with a backend on Vercel and frontend on Netlify.

## Architecture Overview

- **Backend (Vercel)**: API routes, authentication, file uploads, database operations
- **Frontend (Netlify)**: Static site with client-side routing, UI components

## Prerequisites

1. Vercel account
2. Netlify account
3. GitHub repository with your code

## Backend Deployment (Vercel)

### 1. Deploy Backend to Vercel

1. **Connect Repository to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Choose the repository containing your Book Heaven code

2. **Configure Vercel Settings:**
   - **Framework Preset**: Next.js
   - **Root Directory**: Leave as default (or set to project root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default for Next.js)

3. **Set Environment Variables:**
   In Vercel dashboard, go to Project Settings > Environment Variables:
   ```
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=production
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://book-heaven-backend.vercel.app`)

### 2. Update Configuration

After getting your Vercel backend URL, update these files:

1. **Update `netlify.toml`:**
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://YOUR-BACKEND-URL.vercel.app/api/:splat"
     status = 200
     force = true
   ```

2. **Update `_redirects`:**
   ```
   /api/* https://YOUR-BACKEND-URL.vercel.app/api/:splat 200
   ```

3. **Update `lib/config.ts`:**
   ```typescript
   production: {
     baseUrl: 'https://YOUR-BACKEND-URL.vercel.app',
   },
   netlify: {
     baseUrl: 'https://YOUR-BACKEND-URL.vercel.app',
   },
   ```

## Frontend Deployment (Netlify)

### 1. Deploy Frontend to Netlify

1. **Connect Repository to Netlify:**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Choose your GitHub repository

2. **Configure Build Settings:**
   - **Build Command**: `npm run build:netlify`
   - **Publish Directory**: `out`
   - **Node Version**: 18

3. **Set Environment Variables:**
   In Netlify dashboard, go to Site Settings > Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL.vercel.app
   DEPLOY_TARGET=netlify
   NODE_ENV=production
   ```

4. **Deploy:**
   - Click "Deploy site"
   - Wait for deployment to complete

### 2. Configure Redirects

The `netlify.toml` and `_redirects` files will handle API redirects to your Vercel backend.

## File Structure for Deployment

```
book-heaven/
├── app/
│   ├── api/                 # Backend API routes (Vercel)
│   └── (pages)/            # Frontend pages (Netlify)
├── components/             # React components (Netlify)
├── lib/
│   ├── config.ts          # API configuration
│   └── pdfUtils.ts        # PDF utilities
├── vercel.json            # Vercel configuration
├── netlify.toml           # Netlify configuration
├── _redirects             # Netlify redirects
└── next.config.js         # Next.js configuration
```

## Environment Variables

### Vercel (Backend)
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Set to `production`

### Netlify (Frontend)
- `NEXT_PUBLIC_API_URL`: Your Vercel backend URL
- `DEPLOY_TARGET`: Set to `netlify`
- `NODE_ENV`: Set to `production`

## Testing Deployment

1. **Test Backend:**
   - Visit `https://your-backend.vercel.app/api/books`
   - Should return JSON with books data

2. **Test Frontend:**
   - Visit your Netlify URL
   - Test login/signup functionality
   - Test book upload (admin only)
   - Test book reading

## Troubleshooting

### Common Issues

1. **API calls failing:**
   - Check that `NEXT_PUBLIC_API_URL` is set correctly
   - Verify redirects are working in Netlify dashboard

2. **Build failures:**
   - Ensure all dependencies are in `package.json`
   - Check Node.js version compatibility

3. **Authentication issues:**
   - Verify `JWT_SECRET` is set in Vercel
   - Check token expiration settings

### Debugging

1. **Check Vercel Function Logs:**
   - Go to Vercel dashboard > Functions tab
   - View logs for API route errors

2. **Check Netlify Build Logs:**
   - Go to Netlify dashboard > Deploys
   - Click on failed deploy to see logs

## Security Considerations

1. **JWT Secret:**
   - Use a strong, random secret
   - Never commit secrets to version control

2. **CORS:**
   - API routes should handle CORS properly
   - Consider adding domain restrictions

3. **File Uploads:**
   - Implement file size limits
   - Validate file types
   - Consider virus scanning

## Monitoring

1. **Vercel Analytics:**
   - Monitor API usage and performance
   - Set up alerts for errors

2. **Netlify Analytics:**
   - Track frontend performance
   - Monitor build success rates

## Updates and Maintenance

1. **Backend Updates:**
   - Push changes to main branch
   - Vercel will auto-deploy

2. **Frontend Updates:**
   - Push changes to main branch
   - Netlify will auto-deploy

3. **Database Migrations:**
   - Currently using JSON files
   - Consider migrating to a proper database for production

## Scaling Considerations

1. **Database:**
   - Current JSON file storage won't scale
   - Consider PostgreSQL, MongoDB, or similar

2. **File Storage:**
   - Current local file storage won't work on Vercel
   - Consider AWS S3, Cloudinary, or similar

3. **CDN:**
   - Netlify provides CDN for static assets
   - Consider CDN for uploaded files

## Support

For issues with this deployment setup:
1. Check the troubleshooting section above
2. Review Vercel and Netlify documentation
3. Check the project's GitHub issues
