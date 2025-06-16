# 📘 AI Exam Preparation Chatbot

An intelligent, AI-powered assistant to help students prepare for exams by uploading books, PDFs, and YouTube links. It summarizes content, generates questions, and answers queries using a custom Retrieval-Augmented Generation (RAG) pipeline powered by Gemini and ChromaDB.

## 🚀 Features

- 📄 PDF/Book Upload & Summarization
- 📺 YouTube Transcript Summarization
- ❓ Question Generation (from books or videos)
- 💬 RAG-based QA Chat Interface
- 🧠 Gemini 1.5 Flash LLM Integration
- 🧠 ChromaDB for Vector Search
- 🔐 Firebase Auth (Login/Signup)
- 🌐 Built using FastAPI, React, Tailwind, Firebase

---

## 🧩 Project Structure

```
backend/
├── routes/
│   ├── summarize.py         # Summarize syllabus/book
│   ├── yt_summarize.py      # Summarize YouTube video
│   ├── question_gen.py      # Generate questions from text
│   ├── rag_query.py         # RAG query handler (QA using context)
│   └── upload.py            # Handles PDF upload, chunking, and storage
├── services/
│   ├── pdf_processor.py     # Extract text from PDFs using PyMuPDF
│   ├── chunker.py           # Recursive chunking of extracted text
│   ├── embedder.py          # Generate embeddings using Gemini API
│   ├── vector_db.py         # Store & query chunks in ChromaDB
│   ├── llm_wrapper.py       # Gemini API integration
│   └── yt_summarizer.py     # Fetch transcript and summarize YouTube videos
├── config/
│   ├── env.py               # Environment variables (API keys etc.)
│   └── firebase_admin.py    # Firebase Admin SDK for Firestore usage
└── main.py                  # FastAPI app entrypoint
```

---

## 📥 How It Works (Flow)

### Step-by-step Flow (PDF Upload to QA)

1. **User uploads PDF** ➝ Frontend POSTs to `/upload/`
2. **`upload.py`** calls `pdf_processor.py` to extract text
3. **Text** ➝ `chunker.py` ➝ breaks into recursive chunks
4. **Chunks** ➝ `embedder.py` ➝ embeddings generated via Gemini
5. **Chunks + embeddings** ➝ stored into `ChromaDB` via `vector_db.py`
6. **User asks question** ➝ POSTs to `/query/` in `rag_query.py`
7. **Top chunks retrieved** ➝ `vector_db.py`
8. **Prompt built with context** ➝ `llm_wrapper.py` sends to Gemini
9. **Answer returned** ➝ back to user

---

## 🛠️ Tech Stack

### Backend
- ⚡ FastAPI (Python)
- 🔍 ChromaDB (Vector DB)
- 🌐 Gemini API (via `google.generativeai`)
- 🔐 Firebase Admin SDK (Firestore for chat history)

### Frontend (not included here)
- React + Tailwind + Firebase Auth

---

## 🔑 Setup Instructions

1. Clone the repo

```bash
git clone https://github.com/yourusername/ExamPrep.git
cd ExamPrep/backend
```

2. Create a `.env` file for backend

```env
GOOGLE_API_KEY=your_gemini_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=abc@yourproject.iam.gserviceaccount.com
```

3. Install dependencies

```bash
pip install -r requirements.txt
```

4. Run the FastAPI server

```bash
uvicorn main:app --reload
```

---

## 📦 API Endpoints

| Route              | Method | Description |
|-------------------|--------|-------------|
| `/upload/`        | POST   | Upload PDF |
| `/summarize/`     | GET    | Summarize given text |
| `/yt-summarize/`  | GET    | Summarize YouTube transcript |
| `/question-gen/`  | POST   | Generate questions from content |
| `/query/`         | POST   | Ask a question (RAG pipeline) |

---

## 🤖 Credits

Built with ❤️ using FastAPI + Gemini + ChromaDB.
