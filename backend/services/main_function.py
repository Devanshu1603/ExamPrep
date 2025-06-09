# backend/main_function.py

# main_function.py (inside backend/services/)
from services.pdf_processor import extract_text_from_any_pdf
from services.chunker import header_aware_recursive_chunk
from services.vector_db import add_documents
from services.vector_db import show_all_documents

def process_and_store_pdf(pdf_path):
    # Step 1: Extract text from PDF
    full_text = extract_text_from_any_pdf(pdf_path)
    print("\n📄 FULL TEXT PREVIEW (first 1000 chars):")
    print(full_text[:1000])
    
    # Step 2: Smart chunking
    chunks = header_aware_recursive_chunk(full_text)
    print(f"\n📦 Total Chunks Created: {len(chunks)}\n")
    for i, chunk in enumerate(chunks):
        print(f"\n--- Chunk {i+1} ---\n{chunk[:300]}{'...' if len(chunk) > 300 else ''}")

    # Step 3: Store chunks with embeddings in vector DB
    add_documents(chunks)

    print(f"\n✅ Successfully stored {len(chunks)} chunks in the Chroma vector database.")

# Example usage (for testing)
if __name__ == "__main__":
    pdf_path = "uploads/DevanshuKumarSingh_resume (3).pdf"  # Replace with your PDF path
    process_and_store_pdf(pdf_path)

show_all_documents()