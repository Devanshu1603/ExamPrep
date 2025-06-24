from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
# from services.embedder import get_model

# Import routers
from routes import (
    upload,
    summerize,
    question_gen,
    yt_summarize,
    rag_query
)

app = FastAPI(
    title="AI Exam Preparation Chatbot",
    description="Upload PDFs, books, or YouTube links. Get summaries, answers, and key insights using RAG.",
    version="2.0.0"
)

# ✅ Specify exact frontend origins
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://13.60.137.213:8000",  # Optional, if directly accessing IP in browser
    "https://exam-preparation-ai.vercel.app/",  # Vercel deployment
]

# ✅ Updated CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 👈 REPLACED "*" with actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include routers
app.include_router(upload, tags=["Upload Handler"])
app.include_router(rag_query, tags=["RAG: Query System"])
app.include_router(summerize, tags=["Text Summarizer"])
app.include_router(question_gen, tags=["Question Generator"])
app.include_router(yt_summarize, tags=["YouTube Transcript Extractor"])

@app.get("/")
def read_root():
    return {"message": "AI Exam Preparation API is live and ready!"}

# @app.get("/health")
# async def health_check():
    
#     model = get_model()
#     return {"status": "ok", "model_loaded": str(type(model).__name__)}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
