from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from beanie import PydanticObjectId
from app.models.user import Resume, User
from app.services.nlp import extract_text_from_file, extract_skills
from app.core.security import get_current_user, require_role

router = APIRouter(prefix="/api/resumes", tags=["resumes"])

@router.post("/upload", status_code=201)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(require_role("seeker")),
):
    content = await file.read()
    try:
        raw_text = extract_text_from_file(content, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    skills = extract_skills(raw_text)
    resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        raw_text=raw_text,
        skills=skills,
    )
    await resume.insert()
    return {"id": str(resume.id), "skills": skills, "filename": file.filename}

@router.get("/mine")
async def my_resumes(current_user: User = Depends(require_role("seeker"))):
    resumes = await Resume.find(Resume.user_id == current_user.id).to_list()
    return [{"id": str(r.id), "filename": r.filename, "skills": r.skills, "ats_score": r.ats_score} for r in resumes]

@router.get("/{resume_id}")
async def get_resume(resume_id: PydanticObjectId, current_user: User = Depends(get_current_user)):
    resume = await Resume.get(resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if current_user.role == "seeker" and resume.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return resume
