from sentence_transformers import SentenceTransformer
from typing import List, Union
import numpy as np

# Internal cache for the model
_embedding_model = None

def get_model() -> SentenceTransformer:
    """
    Lazily load the SentenceTransformer model.
    Ensures it is loaded only once.
    """
    global _embedding_model
    if _embedding_model is None:
        try:
            print("[INFO] Loading SentenceTransformer model...")
            _embedding_model = SentenceTransformer('paraphrase-MiniLM-L3-v2')
            print("[INFO] Model loaded successfully.")
        except Exception as e:
            print(f"❌ Failed to load SentenceTransformer model: {e}")
            raise e
    return _embedding_model

def get_embeddings(text_chunks: List[str]) -> List[List[float]]:
    """
    Generate embeddings for a list of text chunks.
    """
    try:
        model = get_model()
        if not text_chunks:
            print("[ERROR] Empty input passed to get_embeddings.")
            return []
        
        embeddings = model.encode(text_chunks, show_progress_bar=True)
        if isinstance(embeddings, np.ndarray):
            return embeddings.tolist()
        return embeddings
    except Exception as e:
        print(f"❌ Error generating embeddings: {e}")
        return []

def get_embedding(text: str) -> Union[List[float], None]:
    """
    Generate embedding for a single text string.
    """
    try:
        model = get_model()
        if not text.strip():
            print("[ERROR] Empty string passed to get_embedding.")
            return None

        embedding = model.encode(text)
        if isinstance(embedding, np.ndarray):
            return embedding.tolist()
        return embedding
    except Exception as e:
        print(f"❌ Error generating single embedding: {e}")
        return None
