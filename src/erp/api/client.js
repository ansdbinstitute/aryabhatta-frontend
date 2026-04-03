import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';

// With the Vite proxy configured, we use a relative base so all /api/* requests
// go through the dev proxy to Strapi (no CORS needed).
// In production, set VITE_STRAPI_URL to your live Strapi domain.
const API_BASE_URL = import.meta.env.VITE_STRAPI_URL || '';

const client = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
  timeout: 30000,
});

// ─── Request Interceptor: Attach JWT ───
client.interceptors.request.use(
  (config) => {
    const isStudentPortal = window.location.pathname.startsWith('/student');
    const tokenKey = isStudentPortal ? STORAGE_KEYS.STUDENT_TOKEN : STORAGE_KEYS.TOKEN;
    const token = localStorage.getItem(tokenKey);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} - Token: ${token.substring(0, 20)}... (${isStudentPortal ? 'STUDENT' : 'ERP'})`);
    } else {
      console.warn(`[API Request] ${config.method?.toUpperCase()} ${config.url} - NO TOKEN (${isStudentPortal ? 'STUDENT' : 'ERP'})`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle errors globally ───
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          // Token expired or invalid — clear auth and redirect based on portal
          const isStudentPortal = window.location.pathname.startsWith('/student');
          
          if (isStudentPortal) {
            localStorage.removeItem(STORAGE_KEYS.STUDENT_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.STUDENT_USER);
            if (!window.location.pathname.includes('/student/login')) {
              window.location.href = '/student/login';
            }
          } else {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            // Only redirect if we're in the ERP section
            if (window.location.pathname.startsWith('/erp') &&
                !window.location.pathname.includes('/erp/login')) {
              window.location.href = '/erp/login';
            }
          }
          break;

        case 403:
          console.error('[API] Forbidden:', response.data);
          break;

        case 404:
          console.error('[API] Not found:', response.config.url);
          break;

        case 429:
          console.error('[API] Rate limited');
          break;

        case 500:
          console.error('[API] Server error:', response.data);
          break;

        default:
          break;
      }
    } else if (error.request) {
      console.error('[API] Network error — no response received');
    }

    return Promise.reject(error);
  }
);

/**
 * Parse Strapi error response into a user-friendly message
 */
export const parseStrapiError = (error) => {
  if (error.response?.data?.error) {
    const strapiError = error.response.data.error;
    // Strapi v5 error format
    if (strapiError.details?.errors?.length) {
      return strapiError.details.errors.map((e) => e.message).join(', ');
    }
    return strapiError.message || 'An error occurred';
  }
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};

/**
 * Helper to extract data from Strapi v5 response format
 * Strapi v5 wraps responses in { data: { id, attributes } }
 */
export const extractData = (response) => {
  const deepMap = (item) => {
    if (!item) return item;
    if (Array.isArray(item)) return item.map(deepMap);
    
    if (typeof item === 'object') {
      const mapped = { ...item };
      
      // Map relations if they are in { data: ... } format (Strapi 4/5 mix)
      if (mapped.data !== undefined) {
        return deepMap(mapped.data);
      }

      // Preserve original ID as integerId
      if (mapped.id && !mapped.integerId) {
        mapped.integerId = mapped.id;
      }
      
      // Prefer documentId as the primary identifier
      if (mapped.documentId) {
        mapped.id = mapped.documentId;
      }

      // Recursively map all properties
      Object.keys(mapped).forEach(key => {
        if (mapped[key] && (typeof mapped[key] === 'object' || Array.isArray(mapped[key]))) {
          // Avoid infinite loops with certain Strapi structures if necessary
          // But usually, standard population is fine
          mapped[key] = deepMap(mapped[key]);
        }
      });
      
      return mapped;
    }
    return item;
  };

  const { data } = response.data;
  return deepMap(data);
};

/**
 * Extract pagination metadata from Strapi response
 */
export const extractPagination = (response) => {
  return response.data?.meta?.pagination || {
    page: 1,
    pageSize: 25,
    pageCount: 1,
    total: 0,
  };
};

export default client;
