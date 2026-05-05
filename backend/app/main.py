from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.models.user import User, Resume, JobDescription, CandidateMatch
from app.api import auth, resumes, jobs

app = FastAPI(title="AI Resume Scanner")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    await init_beanie(database=client[settings.DB_NAME], document_models=[User, Resume, JobDescription, CandidateMatch])

app.include_router(auth.router)
app.include_router(resumes.router)
app.include_router(jobs.router)

@app.get("/health")
def health():
    return {"status": "ok"}
