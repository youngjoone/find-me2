import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi'; // Use useApi hook
import { Card, CardContent } from '../components/ui/Card'; // Import Card components
import Skeleton from '../components/ui/Skeleton'; // Import Skeleton
import EmptyState from '../components/ui/EmptyState'; // Import EmptyState

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
    const { fetchWithErrorHandler } = useApi(); // Use useApi hook
    const [results, setResults] = useState<ResultListItem[]>([]);
    const [nextPage, setNextPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(''); // For API errors

    const fetchResults = async (page: number) => {
        setIsLoading(true);
        setError('');
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
        } catch (err) {
            // Error handled by fetchWithErrorHandler, but we can set local error state if needed
            setError(err instanceof Error ? err.message : String(err));
            setHasMore(false); // Stop trying to load more on error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResults(0); // Load initial page
    }, [fetchWithErrorHandler]);

    const handleLoadMore = () => {
        if (hasMore && !isLoading) {
            fetchResults(nextPage);
        }
    };

    if (isLoading && results.length === 0) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">내 결과 히스토리</h1>
                <div className="flex flex-col gap-4">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i}>
                            <CardContent>
                                <Skeleton className="h-4 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error && results.length === 0) {
        return (
            <EmptyState
                title="결과를 불러오는데 실패했습니다."
                description={error}
                icon="⚠️"
            />
        );
    }

    if (results.length === 0 && !isLoading) {
        return (
            <EmptyState
                title="저장된 결과가 없습니다."
                description="테스트를 풀고 결과를 저장해보세요!"
                icon="📝"
            />
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">내 결과 히스토리</h1>
            <div className="flex flex-col gap-4">
                {results.map(result => (
                    <Card key={result.id}>
                        <CardContent>
                            <Link to={`/my/results/${result.id}`} className="block">
                                <h3 className="text-lg font-semibold">테스트 코드: {result.testCode}</h3>
                                <p className="text-muted-foreground">점수: {result.score.toFixed(2)}</p>
                                <p className="text-muted-foreground">생성일: {new Date(result.createdAt).toLocaleString()}</p>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {isLoading && <p className="text-center mt-4">결과를 불러오는 중...</p>}
            {hasMore && !isLoading && (
                <button onClick={handleLoadMore} className="mt-4 w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                    더보기
                </button>
            )}
        </div>
    );
};

export default MyResults;