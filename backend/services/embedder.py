from sentence_transformers import SentenceTransformer
from typing import List, Union
import numpy as np

# Load the embedding model once globally
embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

def get_embeddings(text_chunks: List[str]) -> List[List[float]]:
    """
    Generate embeddings for a list of text chunks.
    """
    embeddings = embedding_model.encode(text_chunks, show_progress_bar=True)
    # Convert to list if needed
    return embeddings.tolist() if isinstance(embeddings, np.ndarray) else embeddings

def get_embedding(text: str) -> List[float]:
    """
    Generate embedding for a single text string.
    """
    embedding = embedding_model.encode(text)
    return embedding.tolist() if isinstance(embedding, np.ndarray) else embedding
