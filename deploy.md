# Quick Deployment Guide

## 🚀 Step-by-Step Deployment

### 1. Deploy Backend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Environment Variables:
   - `JWT_SECRET` = `your-super-secret-jwt-key-change-this`
   - `NODE_ENV` = `production`
6. Click "Deploy"
7. **Copy your Vercel URL** (e.g., `https://book-heaven-abc123.vercel.app`)

### 2. Update Configuration

Replace `YOUR-BACKEND-URL` in these files with your actual Vercel URL:

**Files to update:**
- `netlify.toml` (line 11)
- `_redirects` (line 2) 
- `lib/config.ts` (lines 9 & 13)

**Quick find & replace:**
- Find: `YOUR-BACKEND-URL`
- Replace: `your-actual-vercel-url` (without https://)

### 3. Deploy Frontend to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "New site from Git"
3. Connect your GitHub repository
4. Build settings:
   - Build Command: `npm run build:netlify`
   - Publish Directory: `out`
   - Node Version: 18
5. Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `https://your-vercel-url.vercel.app`
   - `DEPLOY_TARGET` = `netlify`
   - `NODE_ENV` = `production`
6. Click "Deploy site"

### 4. Test Your Deployment

1. **Backend Test:** Visit `https://your-vercel-url.vercel.app/api/books`
2. **Frontend Test:** Visit your Netlify URL and test the app

## 🔧 Troubleshooting

- **API not working?** Check that redirects are set correctly
- **Build failing?** Check Node.js version is 18
- **Environment variables?** Make sure they're set in both platforms

## 📝 Quick Commands

```bash
# Test locally
npm run dev

# Build for Netlify
npm run build:netlify

# Check build output
ls -la out/
```
