// Utility functions for storing, retrieving, and removing auth tokens in localStorage

// Store the authentication token in localStorage
export const storeToken = (token: string) => {
  // Save JWT token to localStorage under the key 'live_chat_token'
  localStorage.setItem('live_chat_token', token)
}

// Retrieve the authentication token from localStorage
export const getToken = () => {
  // Get JWT token from localStorage by key 'live_chat_token'
  return localStorage.getItem('live_chat_token')
}

// Remove the authentication token from localStorage
export const removeToken = () => {
  // Remove the JWT token from localStorage
  localStorage.removeItem('live_chat_token')
}

/**
 * Parse a JWT and extract its 'exp' (expiration) field in milliseconds since epoch.
 * Returns 0 if token is invalid or no exp field found.
 * @param token - JWT token string
 * @returns Expiration timestamp in ms, or 0 if not present/parse error
 */
export const getTokenExp = (token: string) => {
  if (!token) return 0
  try {
    // Convert base64url to base64 for decoding
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    // Decode base64 segment and parse as JSON
    const json = JSON.parse(atob(base64))
    // 'exp' field of JWT is in seconds; convert to milliseconds
    return typeof json.exp === 'number' ? json.exp * 1000 : 0
  } catch {
    // Return 0 if token cannot be parsed
    return 0
  }
}

/**
 * Check if a JWT token is expired, given a skew time in ms.
 * @param token - JWT token string
 * @param skewMs - Optional time in ms added to current time for early expiration (default 5000ms)
 * @returns true if expired or invalid, false otherwise
 */
export const isExpired = (token: string, skewMs = 5000) => {
  const expMs = getTokenExp(token)
  if (!expMs) return true // Consider no-exp or invalid tokens as expired
  // If current time + skew >= expiration, token is expired (or about to expire)
  return Date.now() + skewMs >= expMs
}
