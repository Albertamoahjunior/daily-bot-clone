import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { authService } from '../services/api';
import { toast } from 'react-toastify';
import {useDispatch} from 'react-redux';
import {LOGIN} from "../state/authState/authSlice"

// TokenVerification.tsx
export function TokenVerification(){
  const dispatch = useDispatch();
  const {verifyUser} = authService();
  const navigate = useNavigate();

    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      localStorage.setItem('refreshToken', token as string);
  
      async function handleTokenVerification() {
        if (token) {
          const userData = await verifyUser(token);
          console.log("Verify User Response", userData);
          if (userData) {
            toast.success("Successfully Signed In!!✨🎉");
            dispatch(LOGIN(userData));

            //redirect to home page
            navigate('/');
          } else {
            alert('Invalid or expired login link');
          }
        }
      }
  
      handleTokenVerification();
    }, [dispatch, verifyUser, navigate]);
  
    return <div>Verifying your login...</div>;
  }