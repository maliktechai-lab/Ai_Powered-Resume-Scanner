from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from beanie import PydanticObjectId
from app.models.user import JobDescription, Resume, CandidateMatch
from app.services.nlp import extract_skills, match_resume_to_jd, extract_text_from_file

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

class JDRequest(BaseModel):
    title: str
    description: str

@router.post("/", status_code=201)
async def post_job(body: JDRequest):
    jd = JobDescription(
        recruiter_id=None,
        title=body.title,
        description=body.description,
        required_skills=extract_skills(body.description),
    )
    await jd.insert()
    return {"id": str(jd.id), "required_skills": jd.required_skills}

@router.get("/")
async def list_jobs():
    jobs = await JobDescription.find_all().to_list()
    return [{"id": str(j.id), "title": j.title, "required_skills": j.required_skills} for j in jobs]

@router.post("/{jd_id}/rank")
async def rank_candidates(
    jd_id: PydanticObjectId,
    files: list[UploadFile] = File(...),
):
    jd = await JobDescription.get(jd_id)
    if not jd:
        raise HTTPException(status_code=404, detail="Job not found")

    results = []
    for file in files:
        content = await file.read()
        try:
            raw_text = extract_text_from_file(content, file.filename)
        except ValueError:
            continue

        resume_skills = extract_skills(raw_text)
        match = match_resume_to_jd(resume_skills, jd.required_skills, raw_text, jd.description)

        # Persist or upsert match record (keyed by filename for bulk uploads)
        resume = Resume(user_id=None, filename=file.filename, raw_text=raw_text, skills=resume_skills)
        await resume.insert()

        candidate = CandidateMatch(
            jd_id=jd.id,
            resume_id=resume.id,
            user_id=None,
            **match,
        )
        await candidate.insert()
        results.append({"filename": file.filename, **match})

    results.sort(key=lambda x: x["score"], reverse=True)
    return results

@router.get("/{jd_id}/matches")
async def get_matches(jd_id: PydanticObjectId):
    matches = await CandidateMatch.find(CandidateMatch.jd_id == jd_id).to_list()
    return sorted(
        [{"id": str(m.id), "score": m.score, "matched_skills": m.matched_skills,
          "missing_skills": m.missing_skills, "explanation": m.explanation} for m in matches],
        key=lambda x: x["score"], reverse=True
    )

@router.get("/{jd_id}/match-my-resume")
async def match_my_resume(
    jd_id: PydanticObjectId,
    resume_id: PydanticObjectId,
):
    jd = await JobDescription.get(jd_id)
    resume = await Resume.get(resume_id)
    if not jd or not resume:
        raise HTTPException(status_code=404, detail="Not found")

    result = match_resume_to_jd(resume.skills, jd.required_skills, resume.raw_text, jd.description)
    # Update ATS score on resume
    await resume.set({"ats_score": result["score"]})
    return result
