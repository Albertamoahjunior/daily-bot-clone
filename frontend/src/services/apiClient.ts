import axios, { 
    AxiosInstance, 
    InternalAxiosRequestConfig, 
    AxiosResponse, 
    AxiosHeaders,
    AxiosError 
  } from 'axios';
  import axiosRetry from 'axios-retry'; // Import axios-retry
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
  
    // Configure axios-retry
    axiosRetry(apiClient, {
      retries: 3, // Number of retries
      retryDelay: axiosRetry.exponentialDelay, // Use exponential backoff delay between retries
      retryCondition: (error: AxiosError) => {
        // Retry on network errors or 5xx responses
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response?.status !== undefined && error.response.status >= 500);
      },
    });
  
    // Request interceptor
    apiClient.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
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
  
    return apiClient;
  };
  
  // Create instance with default config
  const apiClient = createApiClient();
  
  export default apiClient;
  
  // Export helper types for use in API calls
  export type ApiResponse<T> = Promise<AxiosResponse<T>>;
  export type ApiRequest<T> = Promise<T>;
  