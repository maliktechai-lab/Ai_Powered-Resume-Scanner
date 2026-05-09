import re
from io import BytesIO

import docx
import fitz  # PyMuPDF
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer


# Broad skill taxonomy covering tech and non-tech skills.
SKILLS_DB = {
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", "sql", "nosql",
    "react", "vue", "angular", "node.js", "fastapi", "flask", "django", "spring",
    "docker", "kubernetes", "aws", "gcp", "azure", "terraform", "ci/cd", "git",
    "machine learning", "deep learning", "nlp", "computer vision", "data analysis",
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "spark",
    "mongodb", "postgresql", "mysql", "redis", "elasticsearch",
    "rest api", "graphql", "microservices", "agile", "scrum",
    "communication", "leadership", "project management", "problem solving",
    "excel", "tableau", "power bi", "figma", "photoshop",
}


def extract_text_from_file(content: bytes, filename: str) -> str:
    if filename.lower().endswith(".pdf"):
        doc = fitz.open(stream=content, filetype="pdf")
        return " ".join(page.get_text() for page in doc)
    if filename.lower().endswith(".docx"):
        doc = docx.Document(BytesIO(content))
        return " ".join(p.text for p in doc.paragraphs)
    raise ValueError("Unsupported file type. Use PDF or DOCX.")


def extract_skills(text: str) -> list[str]:
    text_lower = text.lower()
    found = [skill for skill in SKILLS_DB if re.search(r"\b" + re.escape(skill) + r"\b", text_lower)]
    return sorted(set(found))


def compute_ats_score(resume_text: str, jd_text: str) -> float:
    vectors = TfidfVectorizer(stop_words="english", ngram_range=(1, 2)).fit_transform([resume_text, jd_text])
    score = float(cosine_similarity(vectors[0], vectors[1])[0][0])
    return round(score * 100, 2)


def match_resume_to_jd(resume_skills: list[str], jd_skills: list[str], resume_text: str, jd_text: str) -> dict:
    matched = [s for s in resume_skills if s in jd_skills]
    missing = [s for s in jd_skills if s not in resume_skills]
    semantic_score = compute_ats_score(resume_text, jd_text)

    skill_score = (len(matched) / len(jd_skills) * 100) if jd_skills else 0
    final_score = round(0.6 * semantic_score + 0.4 * skill_score, 2)

    explanation = (
        f"Matched {len(matched)}/{len(jd_skills)} required skills. "
        f"Semantic similarity: {semantic_score:.1f}%. "
        f"Missing: {', '.join(missing[:5]) or 'none'}."
    )
    return {
        "score": final_score,
        "matched_skills": matched,
        "missing_skills": missing,
        "explanation": explanation,
    }
