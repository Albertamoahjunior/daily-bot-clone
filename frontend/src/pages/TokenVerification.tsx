import {useEffect} from 'react';
import { useAuthService } from '../services/api';
import { toast } from 'react-toastify';

// TokenVerification.tsx
export function TokenVerification() {
  const {verifyUser, redirectAfterLogin} = useAuthService();

    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
  
      async function handleTokenVerification() {
        if (token) {
          const userData = await verifyUser(token);
          
          if (userData) {
            toast.success("Successfully Signed In!!✨🎉");
            redirectAfterLogin(userData);
          } else {
            alert('Invalid or expired login link');
          }
        }
      }
  
      handleTokenVerification();
    }, []);
  
    return <div>Verifying your login...</div>;
  }