import React from 'react';
import { useLocation } from 'react-router-dom';

const Result: React.FC = () => {
    const location = useLocation();
    const { traits, poem } = location.state || { traits: null, poem: '결과가 없습니다.' };

    return (
        <div>
            <h1>테스트 결과</h1>
            {traits ? (
                <div>
                    <h2>당신의 성향</h2>
                    <ul>
                        {Object.entries(traits).map(([key, value]) => (
                            <li key={key}>{key}: {Number(value).toFixed(2)}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>성향 데이터를 불러올 수 없습니다.</p>
            )}
            <hr />
            <h2>AI가 생성한 시</h2>
            <p style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '15px' }}>
                {poem}
            </p>
        </div>
    );
};

export default Result;
