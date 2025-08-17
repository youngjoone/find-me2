from fastapi import FastAPI, Body
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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

# --- Pydantic Models for /ai/generate ---

class Traits(BaseModel):
    A: Optional[float] = 0.0
    B: Optional[float] = 0.0
    C: Optional[float] = 0.0

class Profile(BaseModel):
    traits: Optional[Traits] = Field(default_factory=Traits)

class Mood(BaseModel):
    tags: Optional[List[str]] = Field(default_factory=list)
    intensity: Optional[int] = 50

class GenerateRequest(BaseModel):
    profile: Optional[Profile] = Field(default_factory=Profile)
    mood: Optional[Mood] = Field(default_factory=Mood)
    want: Optional[List[str]] = Field(default_factory=list)

class PoemResponse(BaseModel):
    poem: str

# --- API Endpoints ---

@app.get("/ai/health")
def health_check():
    return {"status": "ok"}

@app.post("/ai/generate", response_model=PoemResponse)
def generate_poem(request: GenerateRequest = Body(...)):
    # Use default values if parts of the request are missing
    profile = request.profile if request.profile is not None else Profile()
    mood = request.mood if request.mood is not None else Mood()
    traits = profile.traits if profile.traits is not None else Traits()
    
    # Simple dummy logic based on inputs
    main_mood = mood.tags[0] if mood.tags else "평온함"
    trait_a_level = traits.A if traits.A is not None else 50

    poem_text = f"'{main_mood}'의 감정과 성향 A({trait_a_level:.0f})가 어우러진, 120자 내의 짧은 시입니다. 지금 당신의 마음을 담아보세요."

    # Simple check for forbidden words or length
    if "금칙어" in poem_text:
        poem_text = "부적절한 단어가 포함되어 시를 생성할 수 없습니다."
    
    return PoemResponse(poem=poem_text[:120])