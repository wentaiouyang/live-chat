import axios from 'axios'
const version =
  (await axios.get('https://api.github.com/repos/wentaiouyang/live-chat/tags')) || null
// Environment configuration
const config = {
  // Development environment configuration
  development: {
    apiBaseUrl: 'http://localhost:3000',
    appName: 'Live Chat (Dev)',
    version: version.data[0].name,
  },

  // Production environment configuration
  production: {
    apiBaseUrl: 'https://api.yourapp.com',
    appName: 'Live Chat',
    version: version.data[0].name,
  },
}

// Get current environment
const getCurrentEnv = () => {
  // Prioritize VITE_ENV environment variable
  if (import.meta.env.VITE_ENV) {
    return import.meta.env.VITE_ENV
  }

  // Next, use NODE_ENV
  if (import.meta.env.NODE_ENV) {
    return import.meta.env.NODE_ENV
  }

  // Finally, use MODE (Vite default)
  return import.meta.env.MODE || 'development'
}

// Get configuration for the current environment
const currentEnv = getCurrentEnv()
const currentConfig = config[currentEnv] || config.development

// Export configuration object
export default {
  ...currentConfig,
  env: currentEnv,
}

// Export environment detection functions
export const isDevelopment = () => currentEnv === 'development'
export const isProduction = () => currentEnv === 'production'
