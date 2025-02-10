import {useEffect} from 'react';
import { useAuthService } from '../services/api';
import { toast } from 'react-toastify';
import {useDispatch} from 'react-redux';
import {LOGIN} from "../state/authState/authSlice"

// TokenVerification.tsx
export function TokenVerification(){
  const dispatch = useDispatch();
  const {verifyUser, redirectAfterLogin} = useAuthService();

    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
  
      async function handleTokenVerification() {
        if (token) {
          const userData = await verifyUser(token);
          console.log("Verify User Response", userData);
          if (userData) {
            toast.success("Successfully Signed In!!✨🎉");
            dispatch(LOGIN(userData));

            // redirectAfterLogin(userData);
          } else {
            alert('Invalid or expired login link');
          }
        }
      }
  
      handleTokenVerification();
    }, []);
  
    return <div>Verifying your login...</div>;
  }