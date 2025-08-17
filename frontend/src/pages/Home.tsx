import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [poem, setPoem] = useState<string>('');
  const [healthStatus, setHealthStatus] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/api/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserEmail(data.email);
            setUserNickname(data.nickname);
          } else {
            // Token might be expired or invalid
            localStorage.removeItem('jwtToken');
            setUserEmail(null);
            setUserNickname(null);
          }
        } catch (error) {
          console.error("Failed to fetch user info:", error);
          localStorage.removeItem('jwtToken');
          setUserEmail(null);
          setUserNickname(null);
        }
      }
    };
    fetchUserInfo();
  }, []);

  const handleGetPoem = async () => {
    try {
      const response = await fetch('http://localhost:8000/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood: '기쁨' }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPoem(data.poem);
    } catch (error) {
      console.error("Fetching poem failed:", error);
      setPoem('시를 받아오는데 실패했습니다.');
    }
  };

  const handleGetHealth = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/health');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHealthStatus(JSON.stringify(data));
    } catch (error) {
      console.error("Fetching health status failed:", error);
      setHealthStatus('백엔드 상태를 확인하는데 실패했습니다.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setUserEmail(null);
    setUserNickname(null);
    alert('로그아웃 되었습니다.');
  };

  return (
    <div>
      <h1>홈 페이지</h1>
      {userEmail ? (
        <div>
          <p>환영합니다, {userNickname || userEmail}님!</p>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <div>
          <a href="http://localhost:8080/oauth2/authorization/google">
            <button>Google로 로그인</button>
          </a>
        </div>
      )}
      <hr />
      <Link to="/test">테스트 시작하기</Link>
      <hr />
      <div>
        <h2>E2E 테스트</h2>
        <div>
          <button onClick={handleGetPoem}>AI 시 받아오기</button>
          {poem && <p><strong>응답:</strong> {poem}</p>}
        </div>
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleGetHealth}>백엔드 상태 확인</button>
          {healthStatus && <p><strong>응답:</strong> {healthStatus}</p>}
        </div>
      </div>
    </div>
  );
};

export default Home;
