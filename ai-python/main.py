from fastapi import FastAPI, Body, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from schemas import GenerateRequest, GenerateResponse # Import all necessary models
from service.openai_client import OpenAIClient # Import OpenAIClient

app = FastAPI()

# Initialize OpenAIClient
openai_client = OpenAIClient()

# CORS settings
origins = [
    "http://localhost:5173",  # React frontend
    "http://localhost:8080",  # Spring Boot backend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ai/health")
def health_check():
    return {"status": "ok"}

@app.post("/ai/generate", response_model=GenerateResponse)
def generate_poem(request: GenerateRequest = Body(...)):
    try:
        # Call OpenAIClient to generate text
        response = openai_client.generate_text(request)
        return response
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "INVALID_REQUEST", "message": str(e)}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "GENERATION_ERROR", "message": f"시 생성 중 오류 발생: {e}"}
        )