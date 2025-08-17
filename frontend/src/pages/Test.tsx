import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

const Test: React.FC = () => {
    const [testData, setTestData] = useState<TestData | null>(null);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTest = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api/tests/trait_v1');
                if (!response.ok) {
                    throw new Error('테스트 데이터를 불러오는데 실패했습니다.');
                }
                const data = await response.json();
                setTestData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
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
        
        setError('');
        setIsLoading(true);

        try {
            // 1. Submit answers to backend
            const submissionAnswers: Answer[] = Object.entries(answers).map(([questionId, value]) => ({
                questionId,
                value,
            }));
            
            const scoreResponse = await fetch('http://localhost:8080/api/tests/trait_v1/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: submissionAnswers }),
            });

            if (!scoreResponse.ok) {
                throw new Error('답변 제출에 실패했습니다.');
            }
            const scoreData = await scoreResponse.json();

            // 2. Call AI service with traits
            const aiRequestBody = {
                profile: { traits: scoreData.traits },
                mood: { tags: ["기쁨", "벅참"], intensity: 85 },
                want: ["poem"]
            };

            const aiResponse = await fetch('http://localhost:8000/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aiRequestBody),
            });

            if (!aiResponse.ok) {
                throw new Error('AI 시 생성에 실패했습니다.');
            }
            const aiData = await aiResponse.json();

            // 3. Navigate to result page with data
            navigate('/result', { state: { traits: scoreData.traits, poem: aiData.poem } });

        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !testData) return <p>테스트를 불러오는 중...</p>;
    
    return (
        <div>
            <h1>{testData?.title || '테스트'}</h1>
            {error && <p style={{ color: 'red' }}>오류: {error}</p>}
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