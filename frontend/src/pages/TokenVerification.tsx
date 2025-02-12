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
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <h2 className="text-2xl font-semibold text-gray-700">Logging in</h2>
        <p className="text-gray-500">Please wait while we secure your session...</p>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
  }