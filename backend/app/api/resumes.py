from fastapi import APIRouter, UploadFile, File, HTTPException
from beanie import PydanticObjectId
from app.models.user import Resume
from app.services.nlp import extract_text_from_file, extract_skills

router = APIRouter(prefix="/api/resumes", tags=["resumes"])

@router.post("/upload", status_code=201)
async def upload_resume(
    file: UploadFile = File(...),
):
    content = await file.read()
    try:
        raw_text = extract_text_from_file(content, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    skills = extract_skills(raw_text)
    resume = Resume(
        user_id=None,
        filename=file.filename,
        raw_text=raw_text,
        skills=skills,
    )
    await resume.insert()
    return {"id": str(resume.id), "skills": skills, "filename": file.filename}

@router.get("/mine")
async def my_resumes():
    resumes = await Resume.find_all().to_list()
    return [{"id": str(r.id), "filename": r.filename, "skills": r.skills, "ats_score": r.ats_score} for r in resumes]

@router.get("/{resume_id}")
async def get_resume(resume_id: PydanticObjectId):
    resume = await Resume.get(resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume
