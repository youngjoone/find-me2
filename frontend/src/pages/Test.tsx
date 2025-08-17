import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchWithErrorHandler from '../utils/api'; // Import the new utility

// Define types for our data
interface Question {
    id: string;
    body: string;
}

interface TestData {
    code: string;
    title: string;
    questions: Question[];
}

interface Answer {
    questionId: string;
    value: number;
}

interface ScoreData {
    score: number;
    traits: Record<string, number>;
}

interface AiResponse {
    poem?: string;
    img_prompt?: string;
    moderation: {
        safe: boolean;
        flags: string[];
    };
}

const Test: React.FC = () => {
    const [testData, setTestData] = useState<TestData | null>(null);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [error, setError] = useState<string>(''); // This error is for form validation, not API errors
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTest = async () => {
            setIsLoading(true);
            try {
                const data = await fetchWithErrorHandler<TestData>(
                    'http://localhost:8080/api/tests/trait_v1'
                );
                setTestData(data);
            } catch (err) {
                // Error handled by fetchWithErrorHandler, but we can set local error state if needed
                // setError(err instanceof Error ? err.message : String(err));
            } finally {
                setIsLoading(false);
            }
        };
        fetchTest();
    }, []);

    const handleAnswerChange = (questionId: string, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (testData && Object.keys(answers).length !== testData.questions.length) {
            setError('모든 문항에 답변해주세요.');
            return;
        }
        
        setError(''); // Clear form validation error
        setIsLoading(true);

        try {
            // 1. Submit answers to backend
            const submissionAnswers: Answer[] = Object.entries(answers).map(([questionId, value]) => ({
                questionId,
                value,
            }));
            
            const scoreData = await fetchWithErrorHandler<ScoreData>(
                'http://localhost:8080/api/tests/trait_v1/submit',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ answers: submissionAnswers }),
                }
            );

            // 2. Call AI service with traits
            const aiRequestBody = {
                profile: { traits: scoreData.traits },
                mood: { tags: ["기쁨", "벅참"], intensity: 85 },
                want: ["poem"]
            };

            const aiData = await fetchWithErrorHandler<AiResponse>(
                'http://localhost:8000/ai/generate',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(aiRequestBody),
                }
            );

            // 3. Navigate to result page with data
            navigate('/result', { state: { traits: scoreData.traits, poem: aiData.poem } });

        } catch (err) {
            // API errors are handled by fetchWithErrorHandler
            // This catch block is for re-thrown errors from fetchWithErrorHandler if needed
            // setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !testData) return <p>테스트를 불러오는 중...</p>;
    
    return (
        <div>
            <h1>{testData?.title || '테스트'}</h1>
            {error && <p style={{ color: 'red' }}>오류: {error}</p>} {/* Display form validation error */}
            <form onSubmit={handleSubmit}>
                {testData?.questions.map((q, index) => (
                    <div key={q.id} style={{ margin: '20px 0' }}>
                        <p><strong>{index + 1}. {q.body}</strong></p>
                        <div>
                            {[1, 2, 3, 4, 5].map(value => (
                                <label key={value} style={{ marginRight: '10px' }}>
                                    <input
                                        type="radio"
                                        name={q.id}
                                        value={value}
                                        onChange={() => handleAnswerChange(q.id, value)}
                                        required
                                    /> {value}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? '제출 중...' : '제출'}
                </button>
            </form>
        </div>
    );
};

export default Test;
