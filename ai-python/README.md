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
