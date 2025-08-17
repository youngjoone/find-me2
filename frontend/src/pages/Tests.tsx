import React from 'react';
import { Link } from 'react-router-dom';

const Tests: React.FC = () => {
    // Hardcoded test for now
    const tests = [
        { code: 'trait_v1', title: '성향 테스트 v1', description: '당신의 성향을 알아보세요.' },
        // Add more tests here if needed
    ];

    return (
        <div>
            <h1>테스트 목록</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {tests.map((test) => (
                    <div key={test.code} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '250px' }}>
                        <h2>{test.title}</h2>
                        <p>{test.description}</p>
                        <Link to={`/test?code=${test.code}`}>
                            <button>시작하기</button>
                        </Link>
                    </div>
                ))}
            </div>
        );
    };

export default Tests;
