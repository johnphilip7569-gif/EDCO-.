"""
Ingestion script for Myra AI (Level 2: RAG on Syllabus Content).
Chunks text files into 300-500 word passages and indexes them into Chroma DB.
"""

import glob
import os
import sys
import chromadb

def chunks(text: str, size: int = 400):
    """Splits text into chunks of specified word count."""
    words = text.split()
    if not words:
        return
    for i in range(0, len(words), size):
        yield " ".join(words[i : i + size])

def ingest_syllabus(base_dir: str = "data/syllabus", db_path: str = "vectordb"):
    os.makedirs(db_path, exist_ok=True)
    client = chromadb.PersistentClient(path=db_path)
    col = client.get_or_create_collection(
        name="syllabus",
        metadata={"description": "EdWorld Co. Syllabus RAG Knowledge Base"}
    )

    pattern = os.path.join(base_dir, "**", "*.txt")
    files = glob.glob(pattern, recursive=True)

    if not files:
        print(f"No syllabus files found under {pattern}")
        return 0

    total_chunks = 0
    print(f"Found {len(files)} syllabus files to ingest...")

    for path in files:
        # Normalize slashes for cross-platform
        norm_path = os.path.normpath(path)
        parts = norm_path.split(os.sep)
        
        # e.g. data/syllabus/class10/maths/ch1_real_numbers.txt
        grade = "unknown"
        subject = "unknown"
        chapter = os.path.basename(path).replace(".txt", "")

        try:
            if "syllabus" in parts:
                idx = parts.index("syllabus")
                if len(parts) > idx + 1:
                    grade = parts[idx + 1]
                if len(parts) > idx + 2:
                    subject = parts[idx + 2]
        except Exception:
            pass

        with open(path, "r", encoding="utf-8") as f:
            text = f.read()

        file_chunks = list(chunks(text, size=350))
        for i, chunk_text in enumerate(file_chunks):
            chunk_id = f"{grade}-{subject}-{chapter}-chunk-{i}"
            col.upsert(
                ids=[chunk_id],
                documents=[chunk_text],
                metadatas=[{
                    "class": grade,
                    "subject": subject,
                    "chapter": chapter,
                    "source": norm_path,
                    "chunk_index": i
                }]
            )
            total_chunks += 1

        print(f"  [+] Ingested {len(file_chunks)} chunks from {norm_path} ({grade}/{subject})")

    print(f"Ingestion complete: {total_chunks} total chunks indexed into '{db_path}'.")
    return total_chunks

if __name__ == "__main__":
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    syllabus_dir = os.path.join(base, "data", "syllabus")
    vectordb_dir = os.path.join(base, "vectordb")
    ingest_syllabus(base_dir=syllabus_dir, db_path=vectordb_dir)
