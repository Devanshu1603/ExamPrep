# routes/question_gen.py

from fastapi import APIRouter, Query
from services.llm_wrapper import get_llm_response

router = APIRouter()

@router.get("/generate-questions/")
async def generate_questions(topic: str = Query(..., description="Topic to generate questions from")):
    prompt = f"Generate important questions and their answers from the topic: {topic}"
    questions = get_llm_response(prompt)
    return {"questions": questions}
