import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import Button from '@/components/ui/Button';
import { setTokens, clearTokens, getAccess } from '../lib/auth'; // Import auth utilities

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAccess();
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'testUser' }), // Use a dummy username for dev
      });

      if (response.ok) {
        const data = await response.json();
        setTokens(data.token);
        setIsLoggedIn(true);
        navigate('/'); // Redirect to home or refresh
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.message);
        alert(`로그인 실패: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Network error during login:', error);
      alert('네트워크 오류가 발생했습니다. 백엔드가 실행 중인지 확인해주세요.');
    }
  };

  const handleLogout = () => {
    clearTokens();
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home or login page after logout
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-background text-foreground">
      <Link to="/" className="text-2xl font-bold">
        find-me
      </Link>
      <nav className="flex items-center space-x-4">
        <Link to="/tests" className="hover:text-primary">테스트</Link>
        <Link to="/my/results" className="hover:text-primary">내 결과</Link>
        <Link to="/me/entitlements" className="hover:text-primary">내 권한</Link> {/* Added link to entitlements */}
        {isLoggedIn ? (
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            로그아웃
          </Button>
        ) : (
          <>
            <Link to="/signup" className="hover:text-primary">회원가입</Link>
            <Button variant="ghost" size="sm" onClick={handleLogin}>
              로그인
            </Button>
          </>
        )}
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </Button>
      </nav>
    </header>
  );
};

export default Header;