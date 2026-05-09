"""Basic smoke tests for the NLP service."""
from app.services.nlp import extract_skills, compute_ats_score, match_resume_to_jd


def test_extract_skills_finds_known_skills():
    text = "Experience with Python, Docker, and React."
    skills = extract_skills(text)
    assert "python" in skills
    assert "docker" in skills
    assert "react" in skills


def test_extract_skills_empty_text():
    assert extract_skills("") == []


def test_compute_ats_score_identical_texts():
    score = compute_ats_score("python developer", "python developer")
    assert score == 100.0


def test_compute_ats_score_unrelated_texts():
    score = compute_ats_score("python machine learning", "cooking recipes baking")
    assert score < 10.0


def test_match_resume_to_jd():
    result = match_resume_to_jd(
        resume_skills=["python", "docker"],
        jd_skills=["python", "docker", "kubernetes"],
        resume_text="python docker developer",
        jd_text="python docker kubernetes engineer",
    )
    assert result["score"] >= 0
    assert "python" in result["matched_skills"]
    assert "kubernetes" in result["missing_skills"]
    assert result["explanation"]
