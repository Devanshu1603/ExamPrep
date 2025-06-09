from fastapi import APIRouter, UploadFile, File
import os
from services.pdf_processor import extract_text_from_any_pdf
from services.chunker import header_aware_recursive_chunk
from services.vector_db import add_documents

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload/pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_text_from_any_pdf(file_path)
    print(text)
    chunks = header_aware_recursive_chunk(text)
    print(chunks)
    add_documents(chunks, source_filename="pdf_syllabus")
    return {"message": f"Uploaded and processed {file.filename}", "chunks": len(chunks)}

@router.post("/upload/book/")
async def upload_book(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_text_from_any_pdf(file_path)  # or your book text extractor
    chunks = header_aware_recursive_chunk(text)
    add_documents(chunks, source_filename="book_companion")
    return {"message": f"Uploaded and processed book {file.filename}", "chunks": len(chunks)}

@router.post("/upload/youtube/")
async def upload_youtube_transcript(file: UploadFile = File(...)):
    # Assume a plain text transcript upload
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()
    chunks = header_aware_recursive_chunk(text)
    add_documents(chunks, source_filename="youtube")
    return {"message": f"Uploaded and processed youtube transcript {file.filename}", "chunks": len(chunks)}
