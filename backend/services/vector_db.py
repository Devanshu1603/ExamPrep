import chromadb
from chromadb.config import Settings
from services.embedder import get_embeddings, get_embedding

# Setup Chroma client with persistence
chroma_client = chromadb.Client(Settings(
    allow_reset=True,
    persist_directory=".chroma_db"
))
collection = chroma_client.get_or_create_collection(name="exam_chunks")

def add_documents(texts, metadatas=None, source_filename="upload"):
    print(f"\n[DEBUG] Received {len(texts)} chunks for source: {source_filename}")
    if not texts:
        print("[ERROR] No text chunks received.")
        return

    if isinstance(texts[0], dict) and "text" in texts[0]:
        documents = [t["text"] for t in texts]
        if metadatas is None:
            metadatas = [t.get("metadata", {}) for t in texts]
            print("[DEBUG] Extracted metadata from chunk dicts.")
    else:
        documents = texts
        if metadatas is None:
            metadatas = [{"chunk_index": i, "source": source_filename} for i in range(len(documents))]
            print("[DEBUG] Created default metadata for chunks.")

    # Ensure metadata contains 'source'
    for meta in metadatas:
        meta.setdefault("source", source_filename)

    print("[DEBUG] Example Document:", documents[0] if documents else "N/A")
    print("[DEBUG] Example Metadata:", metadatas[0] if metadatas else "N/A")

    embeddings = get_embeddings(documents)
    if not embeddings or not isinstance(embeddings, list) or embeddings[0] is None:
        print("[ERROR] Failed to generate embeddings.")
        return

    ids = [f"{source_filename}_chunk_{i}" for i in range(len(documents))]
    print("[DEBUG] Generated IDs:", ids[:1], "...")

    try:
        collection.add(
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
        print("[DEBUG] Chunks added to Chroma collection.")
    except Exception as e:
        print(f"[ERROR] Failed to add documents to Chroma: {e}")
        return

    try:
        chroma_client.persist()
        print("[DEBUG] Chroma DB persisted successfully.")
    except Exception as e:
        print(f"[WARNING] Could not persist Chroma DB: {e}")

    # Show verification
    try:
        all_docs = collection.get()
        print(f"[DEBUG] Total documents in DB: {len(all_docs.get('documents', []))}")
        for i in range(len(all_docs["ids"])):
            print(f"→ ID: {all_docs['ids'][i]} | Source: {all_docs['metadatas'][i].get('source')}")
    except Exception as e:
        print(f"[WARNING] Could not fetch documents for verification: {e}")


def query_similar_documents(query_text, k=5, source=None):
    query_embedding = get_embedding(query_text)
    if not query_embedding:
        print("[ERROR] Failed to generate query embedding.")
        return {"documents": [[]]}

    print("[DEBUG] Query embedding generated.")

    try:
        if source:
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=k,
                where={"source": source}
            )
        else:
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=k
            )

        print("[DEBUG] Query results fetched.")
        return results
    except Exception as e:
        print(f"[ERROR] Chroma query failed: {e}")
        return {"documents": [[]]}


def show_all_documents():
    try:
        results = collection.get()
        print("[DEBUG] All documents in the vector DB:")
        for i in range(len(results["ids"])):
            print(f"\n--- Document ID: {results['ids'][i]} ---")
            print(f"Document:\n{results['documents'][i]}")
            print(f"Metadata:\n{results['metadatas'][i]}")
    except Exception as e:
        print(f"[ERROR] Failed to fetch documents from Chroma: {e}")
