import {useEffect} from 'react';
import { authService } from '../services/api';

// TokenVerification.tsx
export function TokenVerification() {
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
  
      async function handleTokenVerification() {
        if (token) {
          const userData = await authService.verifyUser(token);
          
          if (userData) {
            authService.redirectAfterLogin(userData);
          } else {
            alert('Invalid or expired login link');
          }
        }
      }
  
      handleTokenVerification();
    }, []);
  
    return <div>Verifying your login...</div>;
  }