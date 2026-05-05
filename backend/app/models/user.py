from beanie import Document, PydanticObjectId
from pydantic import EmailStr
from typing import Optional, List
from datetime import datetime

class User(Document):
    email: EmailStr
    hashed_password: str
    role: str  # "seeker" | "recruiter"
    full_name: str
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "users"

class Resume(Document):
    user_id: PydanticObjectId
    filename: str
    raw_text: str
    skills: List[str] = []
    ats_score: Optional[float] = None
    uploaded_at: datetime = datetime.utcnow()

    class Settings:
        name = "resumes"

class JobDescription(Document):
    recruiter_id: PydanticObjectId
    title: str
    description: str
    required_skills: List[str] = []
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "job_descriptions"

class CandidateMatch(Document):
    jd_id: PydanticObjectId
    resume_id: PydanticObjectId
    user_id: PydanticObjectId
    score: float
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    explanation: str = ""
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "candidate_matches"
