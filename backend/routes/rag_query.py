from fastapi import APIRouter
from pydantic import BaseModel
from services.vector_db import query_similar_documents , show_all_documents
from services.llm_wrapper import get_llm_response

router = APIRouter()

class QueryInput(BaseModel):
    question: str

def generate_prompt(contexts, question):
    context_text = "\n\n".join(contexts)  # join outside the f-string to avoid backslash issue
    return f"""
You are an AI assistant helping students understand academic content.
Answer the following question using only the provided context.

Context:
{context_text}

Question:
{question}

Answer:"""

@router.post("/query/book")
async def query_book(data: QueryInput):
    results = query_similar_documents(data.question, k=4, source="book_companion")
    contexts = results["documents"][0] if results["documents"] else []
    prompt = generate_prompt(contexts, data.question)
    answer = get_llm_response(prompt)
    return {"response": answer}

@router.post("/query/pdf")
async def query_pdf(data: QueryInput):
    results = query_similar_documents(data.question, k=4, source="pdf_syllabus")
    print("results :- ", results)
    all_documents = show_all_documents()
    print("all_documents :- ", all_documents)
    contexts = results["documents"][0] if results["documents"] else []
    print("contexts:- ", contexts)
    prompt = generate_prompt(contexts, data.question)
    answer = get_llm_response(prompt)
    return {"response": answer}

@router.post("/query/youtube")
async def query_youtube(data: QueryInput):
    results = query_similar_documents(data.question, k=4, source="youtube")
    contexts = results["documents"][0] if results["documents"] else []
    prompt = generate_prompt(contexts, data.question)
    answer = get_llm_response(prompt)
    return {"response": answer}
