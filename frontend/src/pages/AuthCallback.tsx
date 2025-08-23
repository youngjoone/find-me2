import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setTokens, clearTokens, getAccess } from '../lib/auth'; // Import auth utilities

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    // Assuming 'refresh' token might also be passed if needed in the future
    // const refreshToken = params.get('refresh');

    if (token) {
      setTokens(token); // Store access token
      console.log('saved', getAccess()); // Defensive logging
      navigate('/'); // Redirect to home page
    } else {
      // Handle error or no token case
      console.error('No token found in callback URL');
      clearTokens(); // Clear any partial tokens
      navigate('/login-error'); // Or some error page
    }
  }, [location, navigate]);

  return (
    <div>
      <p>로그인 처리 중...</p>
    </div>
  );
};

export default AuthCallback;
