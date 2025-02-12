import axios, { 
  AxiosInstance, 
  InternalAxiosRequestConfig, 
  AxiosResponse, 
  AxiosHeaders,
  AxiosError 
} from 'axios';
import axiosRetry from 'axios-retry';
import { LOGIN } from '@/state/authState/authSlice';
import { Store as store } from '../state/store';
import { RootState } from '../state/store';

// Define custom error type for API errors
export class ApiError extends Error {
  constructor(
      message: string,
      public statusCode?: number,
      public response?: unknown
  ) {
      super(message);
      this.name = 'ApiError';
  }
}

// Create custom type for API client configuration
interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Extended axios config interface to include _retry flag
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Interface for refresh token response
interface RefreshTokenResponse {
  id: string;
  token: string;
  is_admin: boolean;
}

// Default configuration
const defaultConfig: ApiClientConfig = {
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
      'Content-Type': 'application/json',
  },
};

// Create and configure API client
const createApiClient = (config: ApiClientConfig = defaultConfig): AxiosInstance => {
  const apiClient = axios.create(config);

  // Flag to prevent multiple simultaneous token refreshes
  let isRefreshing = false;
  let refreshSubscribers: ((token: string) => void)[] = [];

  // Helper function to refresh token
  const refreshToken = async (): Promise<string> => {
      try {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log(refreshToken);
          const response = await axios.get<RefreshTokenResponse>(
              `${config.baseURL}/auth/verify?token=${refreshToken}`,
          );

          store.dispatch(LOGIN(response.data)); //dispatch the data
          return response.data.token;
      } catch (error) {
          store.dispatch({ type: 'LOGOUT' });
          throw new ApiError(error as string || 'Failed to refresh token');
      }
  };

  // Configure axios-retry
  axiosRetry(apiClient, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error: AxiosError) => {
          return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
                 (error.response?.status !== undefined && error.response.status >= 500);
      },
  });

  // Request interceptor - only adds token if present
  apiClient.interceptors.request.use(
      async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
          const state: RootState = store.getState();
          const token = state.authState.token;

          // Create new headers instance
          const headers = new AxiosHeaders(config.headers);

          if (token) {
              headers.set('Authorization', `Bearer ${token}`);
          }

          config.headers = headers;

          // Log request in development
          if (process.env.NODE_ENV === 'development') {
              console.log('API Request:', {
                  method: config.method,
                  url: config.url,
                  headers: config.headers,
                  data: config.data,
              });
          }

          return config;
      },
      (error: AxiosError) => {
          console.error('Request Error:', error.message);
          return Promise.reject(new ApiError('Failed to send request', error.response?.status));
      }
  );

  // Response interceptor - handles 401 errors
  apiClient.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
          const originalRequest = error.config as ExtendedAxiosRequestConfig;
          
          // Only attempt refresh on 401 errors and if we're not already refreshing
          if (error.response?.status === 401 && !originalRequest._retry) {
              if (isRefreshing) {
                  try {
                      // Wait for the token refresh
                      const newToken = await new Promise<string>(resolve => {
                          refreshSubscribers.push(resolve);
                      });
                      
                      // Update the original request with new token
                      const headers = new AxiosHeaders(originalRequest.headers);
                      headers.set('Authorization', `Bearer ${newToken}`);
                      originalRequest.headers = headers;
                      return apiClient(originalRequest);
                  } catch (error) {
                      return Promise.reject(error);
                  }
              }

              originalRequest._retry = true;
              isRefreshing = true;

              try {
                  const newToken = await refreshToken();
                  refreshSubscribers.forEach(callback => callback(newToken));
                  refreshSubscribers = [];
                  
                  // Update the failed request with new token and retry
                  const headers = new AxiosHeaders(originalRequest.headers);
                  headers.set('Authorization', `Bearer ${newToken}`);
                  originalRequest.headers = headers;
                  return apiClient(originalRequest);
              } catch (error) {
                  return Promise.reject(error);
              } finally {
                  isRefreshing = false;
              }
          }

          return Promise.reject(error);
      }
  );

  return apiClient;
};

// Create instance with default config
const apiClient = createApiClient();

export default apiClient;

// Export helper types for use in API calls
export type ApiResponse<T> = Promise<AxiosResponse<T>>;
export type ApiRequest<T> = Promise<T>;