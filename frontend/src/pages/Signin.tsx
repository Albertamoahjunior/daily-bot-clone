import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
//import { useDispatch } from 'react-redux';
import { authService } from '@/services/api';
import {toast} from 'react-toastify'


const Signin = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirected, setRedirected] = useState(false);
  const { login } = authService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      console.log('Signing in with:', email);
      const response = await login(email);
      if(response){
        toast.success("Click on the link sent to your email to register");
        setRedirected(true);
      }
      // Add your actual authentication logic here
      // const userId = "1332323244"
      // // dispatch(LOGIN({email, userId}))

    } catch (err) {
      setError(err ? err as string : 'An error occurred while signing in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="w-12 h-14  flex bg-blue-500 rounded-full items-center justify-center" ><p className="font-bold items-center justify-center">TDG</p></div>
        </div>
        
        {redirected? 
        <Card className="w-full">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold text-slate-900">
            Redirected
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-slate-500">You have been redirected. Click on the link sent to your email to register</p>
        </CardContent>
      </Card>

        : <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold text-slate-900">
              Welcome Back
            </CardTitle>
            <p className="text-sm text-slate-500">
              Enter your credentials to access your account.
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-[18px] h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full hover:border hover:border-black rounded-lg  p-4 items-center justify-center"
                  />
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            

          </CardContent>
        </Card>}
      </div>
    </div>
  );
};

export default Signin;