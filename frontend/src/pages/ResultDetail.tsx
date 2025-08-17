import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link
import fetchWithErrorHandler from '../utils/api';

interface ResultDetailData {
    id: number;
    testCode: string;
    score: number;
    traits: string; // JSON string
    poem: string;
    createdAt: string;
}

const ResultDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [result, setResult] = useState<ResultDetailData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchResult = async () => {
            setIsLoading(true);
            try {
                const data = await fetchWithErrorHandler<ResultDetailData>(
                    `http://localhost:8080/api/results/${id}`
                );
                setResult(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setIsLoading(false);
            }
        };
        fetchResult();
    }, [id]);

    if (isLoading) return <p>결과를 불러오는 중...</p>;
    if (error) return <p style={{ color: 'red' }}>오류: {error}</p>;
    if (!result) return <p>결과를 찾을 수 없습니다.</p>;

    let parsedTraits: { [key: string]: number } = {};
    try {
        parsedTraits = JSON.parse(result.traits);
    } catch (e) {
        console.error("Failed to parse traits JSON:", e);
        setError("성향 데이터를 파싱하는데 실패했습니다.");
    }

    return (
        <div>
            <h1>결과 상세 보기 #{result.id}</h1>
            <p><strong>테스트 코드:</strong> {result.testCode}</p>
            <p><strong>점수:</strong> {result.score.toFixed(2)}</p>
            <p><strong>생성일:</strong> {new Date(result.createdAt).toLocaleString()}</p>
            <hr />
            <h2>당신의 성향</h2>
            {parsedTraits && (
                <ul>
                    {Object.entries(parsedTraits).map(([key, value]) => (
                        <li key={key}>{key}: {Number(value).toFixed(2)}</li>
                    ))}
                </ul>
            )}
            <hr />
            <h2>AI가 생성한 시</h2>
            <p style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '15px' }}>
                {result.poem}
            </p>
            <hr />
            <Link to={`/share/${result.id}`}>
                <button>공유하기</button>
            </Link>
        </div>
    );
};

export default ResultDetail;