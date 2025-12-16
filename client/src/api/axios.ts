import axios from 'axios';

import { APP_ROUTES } from '@/constants/routes';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let csrfToken: string | null = null;

export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

api.interceptors.request.use(
  (config) => {
    if (csrfToken && config.method !== 'get' && config.method !== 'head') {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const isAuthEndpoint =
        error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');

      if (!isAuthEndpoint) {
        window.location.href = APP_ROUTES.AUTH;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
