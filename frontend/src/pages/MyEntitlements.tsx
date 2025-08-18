import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Meta from '../lib/seo';

interface EntitlementItem {
    itemCode: string;
}

const MyEntitlements: React.FC = () => {
    const { fetchWithErrorHandler } = useApi();
    const [entitlements, setEntitlements] = useState<EntitlementItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchEntitlements = async () => {
            setIsLoading(true);
            try {
                const data = await fetchWithErrorHandler<EntitlementItem[]>(
                    'http://localhost:8080/api/entitlements/me',
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                        },
                    }
                );
                setEntitlements(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setIsLoading(false);
            }
        };
        fetchEntitlements();
    }, [fetchWithErrorHandler]);

    if (isLoading) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">내 권한</h1>
                <Card>
                    <CardContent>
                        <Skeleton className="h-6 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                </Card>
            );
        }

    if (error) {
        return (
            <EmptyState
                title="권한 정보를 불러오는데 실패했습니다."
                description={error}
                icon="⚠️"
            />
        );
    }

    if (entitlements.length === 0) {
        return (
            <EmptyState
                title="보유한 권한이 없습니다."
                description="고해상도 다운로드와 같은 유료 기능을 구매해보세요."
                icon="🎁"
            />
        );
    }

    return (
        <>
            <Meta title="내 권한 — find-me" description="find-me 서비스에서 보유하고 있는 권한 목록입니다." />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">내 권한</h1>
                <div className="flex flex-col gap-4">
                    {entitlements.map((entitlement, index) => (
                        <Card key={index}>
                            <CardContent>
                                <h3 className="text-lg font-semibold">{entitlement.itemCode}</h3>
                                <p className="text-muted-foreground">영구 권한</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MyEntitlements;
