이 디렉토리는 Python FastAPI 프로젝트입니다.

## API Endpoints

### GET /ai/health

Returns the health status of the AI service.

**Response Example:**
```json
{
  "status": "ok"
}
```

### POST /ai/generate

Generates a poem based on user profile traits and mood.

**Request Example:**
```json
{
  "profile": {
    "traits": {
      "A": 65.0,
      "B": 40.0,
      "C": 80.0
    }
  },
  "mood": {
    "tags": ["기쁨", "벅참"],
    "intensity": 85
  },
  "want": ["poem"]
}
```

**Response Example:**
```json
{
  "poem": "'기쁨'의 감정과 성향 A(65)가 어우러진, 120자 내의 짧은 시입니다. 지금 당신의 마음을 담아보세요."
}
```

## OpenAI API 연동

이 서비스는 OpenAI API를 사용하여 시를 생성합니다.

### API 키 설정

`OPENAI_API_KEY` 환경 변수를 설정해야 합니다. `.env` 파일에 다음 형식으로 추가할 수 있습니다.

```
OPENAI_API_KEY=sk-your_openai_api_key_here
```

### 모델 설정

기본적으로 `gpt-5-mini` 모델을 사용하며, `config.py`에서 `OPENAI_MODEL`, `OPENAI_MAX_OUTPUT_TOKENS`, `OPENAI_TEMPERATURE` 값을 조정할 수 있습니다.

### 샘플 요청/응답 (OpenAI 연동 후)

**Request Example (POST /ai/generate):**
```json
{
  "profile": {
    "traits": {
      "A": 70.0,
      "B": 40.0,
      "C": 60.0
    }
  },
  "mood": {
    "tags": ["기쁨", "벅참"],
    "intensity": 85
  },
  "want": ["poem"]
}
```

**Response Example (POST /ai/generate):**
```json
{
  "poem": "'기쁨'의 감정과 성향 A(70)가 어우러진, 120자 내의 짧은 시입니다. 지금 당신의 마음을 담아보세요.",
  "img_prompt": null,
  "moderation": {
    "safe": true,
    "flags": []
  }
}
```