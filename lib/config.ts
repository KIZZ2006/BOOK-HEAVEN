// API Configuration for different environments
export const API_CONFIG = {
  // Development
  development: {
    baseUrl: 'http://localhost:3000',
  },
  // Production - Vercel backend
  production: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://yasemin-book-heaven.vercel.app',
  },
  // Netlify frontend (points to Vercel backend)
  netlify: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://yasemin-book-heaven.vercel.app',
  },
};

export const getApiConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  const deployTarget = process.env.DEPLOY_TARGET;
  
  if (deployTarget === 'netlify') {
    return API_CONFIG.netlify;
  }
  
  return API_CONFIG[env as keyof typeof API_CONFIG] || API_CONFIG.development;
};

export const API_BASE_URL = getApiConfig().baseUrl;
