import { useCallback } from 'react';
import { useToast } from '../components/ui/ToastProvider'; // Import useToast

interface CommonErrorResponse {
    code: string;
    message: string;
    requestId: string;
    timestamp: string;
}

function useApi() {
    const { addToast } = useToast();

    const fetchWithErrorHandler = useCallback(async <T>(
        url: string,
        options?: RequestInit
    ): Promise<T> => {
        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                let errorData: CommonErrorResponse | null = null;
                try {
                    errorData = await response.json();
                } catch (jsonError) {
                    console.error("Failed to parse error response JSON:", jsonError);
                }

                const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
                const errorCode = errorData?.code || `HTTP_${response.status}`;
                const requestId = errorData?.requestId || 'N/A';
                const timestamp = errorData?.timestamp || new Date().toISOString();

                const fullErrorMessage = `${errorMessage} (요청ID: ${requestId})`;
                addToast(fullErrorMessage, 'error'); // Show toast
                console.error("API Error Details:", {
                    code: errorCode,
                    message: errorMessage,
                    requestId: requestId,
                    timestamp: timestamp,
                    status: response.status,
                    url: url,
                });

                throw new Error(fullErrorMessage);
            }

            return response.json();
        } catch (networkError) {
            console.error("Network error:", networkError);
            const errorMessage = "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
            addToast(errorMessage, 'error'); // Show toast
            throw new Error(errorMessage);
        }
    }, [addToast]);

    return { fetchWithErrorHandler };
}

export default useApi;
