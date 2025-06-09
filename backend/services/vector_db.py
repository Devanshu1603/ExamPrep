import chromadb
from chromadb.config import Settings
from services.embedder import get_embeddings, get_embedding

# Setup Chroma with persistence
chroma_client = chromadb.Client(Settings(allow_reset=True, persist_directory=".chroma_db"))
collection = chroma_client.get_or_create_collection(name="exam_chunks")


def add_documents(texts, metadatas=None, source_filename="upload"):
    print(f"\n[DEBUG] Received {len(texts)} chunks for source: {source_filename}")
    if len(texts) > 0:
        print("[DEBUG] Example chunk:", texts[0])
    else:
        print("[ERROR] Empty input received for add_documents!")
        return

    # Handle input formats: list of dicts OR plain text list
    if isinstance(texts[0], dict) and "text" in texts[0]:
        documents = [t["text"] for t in texts]
        if metadatas is None:
            metadatas = [t.get("metadata", {}) for t in texts]
            print("[DEBUG] Metadata extracted from chunks.")
    else:
        documents = texts
        if metadatas is None:
            metadatas = [{"chunk_index": i, "source": source_filename} for i in range(len(documents))]
            print("[DEBUG] Default metadata created.")

    # Confirm metadata has "source" key for filtering
    for i, meta in enumerate(metadatas):
        if "source" not in meta:
            metadatas[i]["source"] = source_filename

    print("[DEBUG] Documents:", documents[:1], "...")  # show sample
    print("[DEBUG] Metadatas:", metadatas[:1], "...")

    embeddings = get_embeddings(documents)
    if not embeddings or embeddings[0] is None:
        print("[ERROR] Embedding generation failed or returned None.")
        return

    print("[DEBUG] First embedding:", embeddings[0])

    # Unique IDs
    ids = [f"{source_filename}_chunk_{i}" for i in range(len(documents))]
    print("[DEBUG] IDs:", ids)

    collection.add(
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )

    try:
        chroma_client.persist()
        print("[DEBUG] Chroma persisted successfully.")
    except AttributeError:
        print("⚠️ WARNING: chroma_client.persist() not supported in your ChromaDB version. Skipping...")

    # Immediate verification
    print("\n[DEBUG] Verifying documents after insertion...")
    all_docs = collection.get()
    print("[DEBUG] Total documents in DB:", len(all_docs["documents"]))
    for i in range(len(all_docs["ids"])):
        print(f"→ ID: {all_docs['ids'][i]} | Source: {all_docs['metadatas'][i].get('source')}")


def query_similar_documents(query_text, k=5, source=None):
    query_embedding = get_embedding(query_text)
    if not query_embedding:
        print("[ERROR] Query embedding failed!")
        return {"documents": [[]]}

    print("[DEBUG] Query embedding generated.")

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

    print("[DEBUG] Query Results:", results)
    return results


def show_all_documents():
    results = collection.get()
    print("[DEBUG] Showing all documents in the vector DB...")
    for i in range(len(results["ids"])):
        print(f"\n--- Document ID: {results['ids'][i]} ---")
        print(f"Document:\n{results['documents'][i]}")
        print(f"Metadata:\n{results['metadatas'][i]}")
