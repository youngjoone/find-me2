import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Import Helmet and HelmetProvider
import fetchWithErrorHandler from '../utils/api';

interface ResultDetailData {
    id: number;
    testCode: string;
    score: number;
    traits: string; // JSON string
    poem: string;
    createdAt: string;
}

const Share: React.FC = () => {
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

    if (isLoading) return <p>공유 정보를 불러오는 중...</p>;
    if (error) return <p style={{ color: 'red' }}>오류: {error}</p>;
    if (!result) return <p>공유 정보를 찾을 수 없습니다.</p>;

    let parsedTraits: { [key: string]: number } = {};
    try {
        parsedTraits = JSON.parse(result.traits);
    } catch (e) {
        console.error("Failed to parse traits JSON for share:", e);
        setError("성향 데이터를 파싱하는데 실패했습니다.");
    }

    const ogTitle = `find-me 결과 #${result.id}`;
    const ogDescription = `점수 ${result.score.toFixed(2)} | 주요 성향 A:${parsedTraits.A?.toFixed(2) || 'N/A'} B:${parsedTraits.B?.toFixed(2) || 'N/A'} C:${parsedTraits.C?.toFixed(2) || 'N/A'}`;
    const ogImage = "https://via.placeholder.com/1200x630.png?text=FindMe+Result"; // Placeholder image URL

    return (
        <HelmetProvider>
            <Helmet>
                <title>{ogTitle}</title>
                <meta property="og:title" content={ogTitle} />
                <meta property="og:description" content={ogDescription} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
                {/* Add Twitter Card tags if needed */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={ogTitle} />
                <meta name="twitter:description" content={ogDescription} />
                <meta name="twitter:image" content={ogImage} />
            </Helmet>
            <div>
                <h1>공유 카드 미리보기</h1>
                <p>이 페이지는 주로 SNS 공유 시 미리보기 이미지와 텍스트를 제공하기 위한 메타 태그를 포함합니다.</p>
                <p>실제 사용자에게는 결과 상세 페이지로 리디렉션될 수 있습니다.</p>
                <hr />
                <h2>결과 요약</h2>
                <p><strong>테스트 코드:</strong> {result.testCode}</p>
                <p><strong>점수:</strong> {result.score.toFixed(2)}</p>
                <p><strong>생성일:</strong> {new Date(result.createdAt).toLocaleString()}</p>
                {parsedTraits && (
                    <ul>
                        {Object.entries(parsedTraits).map(([key, value]) => (
                            <li key={key}>{key}: {Number(value).toFixed(2)}</li>
                        ))}
                    </ul>
                )}
                <h2>AI가 생성한 시</h2>
                <p style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '15px' }}>
                    {result.poem}
                </p>
            </div>
        </HelmetProvider>
    );
};

export default Share;
