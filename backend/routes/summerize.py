# routes/summarize.py

from fastapi import APIRouter, Query
from services.llm_wrapper import get_llm_response

router = APIRouter()

@router.get("/summarize/")
async def summarize_text(input_text: str = Query(..., description="Text to summarize")):
    prompt = f"Summarize the following content in bullet points:\n\n{input_text}"
    summary = get_llm_response(prompt)
    return {"summary": summary}
