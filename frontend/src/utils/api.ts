interface CommonErrorResponse {
    code: string;
    message: string;
    requestId: string;
    timestamp: string;
}

async function fetchWithErrorHandler<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            let errorData: CommonErrorResponse | null = null;
            try {
                errorData = await response.json();
            } catch (jsonError) {
                // If response is not JSON or cannot be parsed
                console.error("Failed to parse error response JSON:", jsonError);
            }

            const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
            const errorCode = errorData?.code || `HTTP_${response.status}`;
            const requestId = errorData?.requestId || 'N/A';
            const timestamp = errorData?.timestamp || new Date().toISOString();

            const fullErrorMessage = `${errorMessage} (요청ID: ${requestId})`;
            alert(`오류: ${fullErrorMessage}`); // Simple toast/alert

            console.error("API Error Details:", {
                code: errorCode,
                message: errorMessage,
                requestId: requestId,
                timestamp: timestamp,
                status: response.status,
                url: url,
            });

            throw new Error(fullErrorMessage); // Re-throw for component-specific handling
        }

        return response.json();
    } catch (networkError) {
        console.error("Network error:", networkError);
        const errorMessage = "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
        alert(`오류: ${errorMessage}`); // Simple toast/alert
        throw new Error(errorMessage);
    }
}

export default fetchWithErrorHandler;
