import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('jwtToken', token);
      navigate('/'); // Redirect to home page
    } else {
      // Handle error or no token case
      console.error('No token found in callback URL');
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
