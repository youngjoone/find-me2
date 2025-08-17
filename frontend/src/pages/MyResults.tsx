import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fetchWithErrorHandler from '../utils/api';

interface ResultListItem {
    id: number;
    testCode: string;
    score: number;
    createdAt: string;
}

interface PaginatedResponse<T> {
    items: T[];
    nextCursor: string | null;
}

const MyResults: React.FC = () => {
    const [results, setResults] = useState<ResultListItem[]>([]);
    const [nextPage, setNextPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchResults = async (page: number) => {
        setIsLoading(true);
        try {
            const data = await fetchWithErrorHandler<PaginatedResponse<ResultListItem>>(
                `http://localhost:8080/api/results?page=${page}&size=10`
            );
            setResults(prev => [...prev, ...data.items]);
            if (data.nextCursor) {
                setNextPage(parseInt(data.nextCursor));
            } else {
                setHasMore(false);
            }
        } catch (error) {
            // Error handled by fetchWithErrorHandler
            setHasMore(false); // Stop trying to load more on error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResults(0); // Load initial page
    }, []);

    const handleLoadMore = () => {
        if (hasMore && !isLoading) {
            fetchResults(nextPage);
        }
    };

    return (
        <div>
            <h1>내 결과 히스토리</h1>
            {results.length === 0 && !isLoading && <p>저장된 결과가 없습니다.</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {results.map(result => (
                    <div key={result.id} style={{ border: '1px solid #eee', padding: '10px', borderRadius: '5px' }}>
                        <Link to={`/my/results/${result.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h3>테스트 코드: {result.testCode}</h3>
                            <p>점수: {result.score.toFixed(2)}</p>
                            <p>생성일: {new Date(result.createdAt).toLocaleString()}</p>
                        </Link>
                    </div>
                ))}
            </div>
            {isLoading && <p>결과를 불러오는 중...</p>}
            {hasMore && !isLoading && (
                <button onClick={handleLoadMore} style={{ marginTop: '20px' }}>
                    더보기
                </button>
            )}
        </div>
    );
};

export default MyResults;
