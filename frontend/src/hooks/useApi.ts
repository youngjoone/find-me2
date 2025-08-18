import { useCallback } from 'react';
import { useToast } from '../components/ui/ToastProvider';

interface CommonErrorResponse {
    code: string;
    message: string;
    requestId: string;
    timestamp: string;
}

// Custom error for 402 Payment Required
export class PaymentRequiredError extends Error {
    code: string;
    requestId: string;
    timestamp: string;

    constructor(message: string, code: string = "PAYMENT_REQUIRED", requestId: string = "N/A", timestamp: string = new Date().toISOString()) {
        super(message);
        this.name = "PaymentRequiredError";
        this.code = code;
        this.requestId = requestId;
        this.timestamp = timestamp;
    }
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

                if (response.status === 402 && errorCode === "PAYMENT_REQUIRED") {
                    throw new PaymentRequiredError(errorMessage, errorCode, requestId, timestamp);
                }

                throw new Error(fullErrorMessage); // Re-throw for component-specific handling
            }

            return response.json();
        } catch (networkError) {
            // Check if it's already a PaymentRequiredError re-thrown
            if (networkError instanceof PaymentRequiredError) {
                throw networkError; // Re-throw PaymentRequiredError directly
            }

            console.error("Network error:", networkError);
            const errorMessage = "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
            addToast(errorMessage, 'error'); // Show toast
            throw new Error(errorMessage);
        }
    }, [addToast]);

    return { fetchWithErrorHandler };
}

export default useApi;