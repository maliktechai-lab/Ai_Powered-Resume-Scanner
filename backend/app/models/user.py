from beanie import Document, PydanticObjectId
from pydantic import EmailStr, Field
from typing import Optional, List
from datetime import datetime

class User(Document):
    email: EmailStr
    hashed_password: str
    role: str  # "seeker" | "recruiter"
    full_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"

class Resume(Document):
    user_id: Optional[PydanticObjectId] = None
    filename: str
    raw_text: str
    skills: List[str] = Field(default_factory=list)
    ats_score: Optional[float] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "resumes"

class JobDescription(Document):
    recruiter_id: Optional[PydanticObjectId] = None
    title: str
    description: str
    required_skills: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "job_descriptions"

class CandidateMatch(Document):
    jd_id: PydanticObjectId
    resume_id: PydanticObjectId
    user_id: Optional[PydanticObjectId] = None
    score: float
    matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    explanation: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "candidate_matches"
