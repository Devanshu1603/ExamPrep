from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
# Import routers
from routes import (
    upload,
    summerize,
    question_gen,
    yt_summarize,
    rag_query  # ✅ Single router for all RAG queries
)

app = FastAPI(
    title="AI Exam Preparation Chatbot",
    description="Upload PDFs, books, or YouTube links. Get summaries, answers, and key insights using RAG.",
    version="2.0.0"
)

# CORS settings (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include feature-specific routers
app.include_router(upload, tags=["Upload Handler"])
app.include_router(rag_query, tags=["RAG: Query System"])  # ✅ Unified router
app.include_router(summerize, tags=["Text Summarizer"])
app.include_router(question_gen, tags=["Question Generator"])
app.include_router(yt_summarize, tags=["YouTube Transcript Extractor"])

@app.get("/")
def read_root():
    return {"message": "AI Exam Preparation API is live and ready!"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)