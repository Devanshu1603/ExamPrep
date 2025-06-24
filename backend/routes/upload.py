from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import os
from services.pdf_processor import extract_text_from_any_pdf
from services.chunker import header_aware_recursive_chunk
from services.vector_db import add_documents

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def success_response(message: str, chunks: int, file_id: str) -> JSONResponse:
    return JSONResponse(
        status_code=200,
        content={
            "status": "success",
            "message": message,
            "chunks": chunks,
            "file_id": file_id
        }
    )


def error_response(message: str = "Something went wrong during upload.") -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": message
        }
    )


@router.post("/upload/pdf/", response_class=JSONResponse)
async def upload_pdf(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())

        print(f"✅ PDF saved at: {file_path}")

        text = extract_text_from_any_pdf(file_path)
        print(f"✅ Extracted text length: {len(text)}")

        chunks = header_aware_recursive_chunk(text)
        print(f"✅ Chunked into {len(chunks)} sections")

        add_documents(chunks, source_filename="pdf_syllabus")
        print("✅ Embeddings stored")

        return success_response(f"Uploaded and processed {file.filename}", len(chunks), file.filename)

    except Exception as e:
        print(f"❌ Upload failed: {e}")
        return error_response(str(e))
