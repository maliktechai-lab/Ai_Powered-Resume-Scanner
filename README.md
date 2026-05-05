# AI Resume Scanner

Two-sided platform: Job Seekers upload resumes, Recruiters post JDs and rank candidates with explainable AI.

## Stack
- **Frontend**: React + Vite + Tailwind CSS + Zustand
- **Backend**: FastAPI + Beanie (MongoDB ODM) + JWT auth
- **AI/ML**: sentence-transformers (`all-MiniLM-L6-v2`) + cosine similarity
- **Database**: MongoDB

## Quick Start

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/docs

## How It Works

1. Register as **Seeker** or **Recruiter**
2. **Seeker**: Upload PDF/DOCX → auto skill extraction → match against any job → see score + skill gap
3. **Recruiter**: Post JD → upload multiple resumes → get ranked candidates with explanation

## Scoring Formula

```
final_score = 0.6 × semantic_similarity + 0.4 × skill_overlap_ratio
```

Semantic similarity uses sentence-transformers embeddings + cosine similarity.
