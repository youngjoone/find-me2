import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fetchWithErrorHandler from '../utils/api'; // Import the new utility

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
          const data = await fetchWithErrorHandler<{ id: string, email: string, nickname: string }>(
            'http://localhost:8080/api/me',
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );
          setUserEmail(data.email);
          setUserNickname(data.nickname);
        } catch (error) {
          // fetchWithErrorHandler already handles alert/console.error
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
      const data = await fetchWithErrorHandler<{ poem: string }>(
        'http://localhost:8000/ai/generate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mood: '기쁨' }),
        }
      );
      setPoem(data.poem);
    } catch (error) {
      // Error handled by fetchWithErrorHandler
      setPoem('시를 받아오는데 실패했습니다.'); // Clear previous poem or set a default
    }
  };

  const handleGetHealth = async () => {
    try {
      const data = await fetchWithErrorHandler<{ status: string }>(
        'http://localhost:8080/api/health'
      );
      setHealthStatus(JSON.stringify(data));
    } catch (error) {
      // Error handled by fetchWithErrorHandler
      setHealthStatus('백엔드 상태를 확인하는데 실패했습니다.'); // Clear previous status or set a default
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
      <Link to="/tests">테스트 목록 보기</Link>
      <br />
      <Link to="/my/results">내 결과 히스토리</Link> {/* Added link to MyResults page */}
      <br />
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