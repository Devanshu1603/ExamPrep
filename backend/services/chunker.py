import re
from typing import List, Dict, Union
from langchain.text_splitter import RecursiveCharacterTextSplitter

def split_by_headers(text: str) -> List[Dict[str, Union[str, Dict[str, str]]]]:
    """
    Splits text using academic headers like 'Chapter 1', 'Unit 2', etc.
    Returns chunks with metadata if headers exist.
    """
    header_regex = r'(?m)^(Unit\s+\d+|Chapter\s+\d+|Q\.\d+|Section\s+\d+|Part\s+\d+)'
    parts = re.split(header_regex, text)

    # Filter empty strings
    parts = [p.strip() for p in parts if p.strip()]

    if len(parts) <= 1:
        # No structured headers found, return entire text as one chunk
        return [{"text": text.strip(), "metadata": {"chapter": "Unknown"}}]

    combined_chunks = []
    i = 0
    while i < len(parts) - 1:
        header = parts[i]
        content = parts[i + 1]
        combined_chunks.append({"text": f"{header}\n{content}", "metadata": {"chapter": header}})
        i += 2

    # If odd number of parts, append last leftover content
    if i == len(parts) - 1:
        combined_chunks.append({"text": parts[i], "metadata": {"chapter": "Unknown"}})

    return combined_chunks

def recursive_chunk(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
    """
    Recursively splits large text using LangChain's RecursiveCharacterTextSplitter.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ".", " ", ""]
    )
    return splitter.split_text(text)

def header_aware_recursive_chunk(text: str) -> List[Dict[str, Union[str, Dict[str, str]]]]:
    """
    Hybrid strategy:
    - If structured headers found: split by header, then chunk and attach metadata.
    - If not: fallback to naive recursive chunking.
    """
    header_chunks = split_by_headers(text)

    final_chunks = []
    for item in header_chunks:
        raw_text = item["text"]
        header = item["metadata"]["chapter"]
        if len(raw_text) > 1000:
            for subchunk in recursive_chunk(raw_text):
                final_chunks.append({"text": subchunk, "metadata": {"chapter": header}})
        else:
            final_chunks.append(item)
    return final_chunks
