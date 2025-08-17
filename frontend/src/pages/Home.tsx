import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <h1>홈 페이지</h1>
      <Link to="/test">테스트 시작하기</Link>
    </div>
  );
};

export default Home;
