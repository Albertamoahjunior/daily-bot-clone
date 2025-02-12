import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ToastContainer } from 'react-toastify';
import App from './App.tsx'
import {Store} from './state/store';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a QueryClient instance
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={Store}>
    <ToastContainer/>
    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
