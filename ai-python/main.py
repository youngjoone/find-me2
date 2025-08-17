from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS settings
origins = [
    "http://localhost:5173",  # React frontend origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Mood(BaseModel):
    mood: str

class Poem(BaseModel):
    poem: str

@app.get("/ai/health")
def health_check():
    return {"status": "ok"}

@app.post("/ai/generate", response_model=Poem)
def generate_poem(mood: Mood):
    if mood.mood == "기쁨":
        return Poem(poem="기쁨에 대한 짧은 시")
    else:
        return Poem(poem=f"{mood.mood}에 대한 짧은 시")
