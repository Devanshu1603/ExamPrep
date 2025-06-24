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

### Frontend
- 💻 React + TypeScript
- 🎨 Tailwind CSS
- 🔐 Firebase Authentication
- 📦 React Dropzone (PDF uploads)
- 🧠 Context + Hooks for state management
- ⚙️ Framer Motion for animations

---

## 🔑 Setup Instructions

### Backend

```bash
git clone https://github.com/yourusername/ExamPrep.git
cd ExamPrep/backend
```

1. Create a `.env` file:

```env
GOOGLE_API_KEY=your_gemini_key
PYTESSERACT_PATH=path of PYTESSERACT installed on your system
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the server:

```bash
uvicorn main:app --reload
```

### Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Add your Firebase config to `src/config/firebase.ts`

```ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
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

Built with ❤️ by Devanshu using FastAPI, Gemini, React, and Firebase.
