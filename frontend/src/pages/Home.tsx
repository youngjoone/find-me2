import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import Meta from '../lib/seo'; // Import Meta component

const Home: React.FC = () => {
  const { fetchWithErrorHandler } = useApi();
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
          localStorage.removeItem('jwtToken');
          setUserEmail(null);
          setUserNickname(null);
        }
      }
    };
    fetchUserInfo();
  }, [fetchWithErrorHandler]);

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
      setPoem('시를 받아오는데 실패했습니다.');
    }
  };

  const handleGetHealth = async () => {
    try {
      const data = await fetchWithErrorHandler<{ status: string }>(
        'http://localhost:8080/api/health'
      );
      setHealthStatus(JSON.stringify(data));
    } catch (error) {
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
    <>
      <Meta
        title="find-me — 성향 테스트와 감정 기반 창작"
        description="당신의 성향을 분석하고 감정에 기반한 시와 이미지를 생성해주는 서비스입니다. 자신을 더 깊이 이해하고 창의적인 영감을 얻어보세요."
      />
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
        <Link to="/my/results">내 결과 히스토리</Link>
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
    </>
  );
};

export default Home;