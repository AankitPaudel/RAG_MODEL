# File: backend/rag/vector_store.py
from typing import List, Dict, Optional
from langchain.vectorstores import Chroma
from langchain.embeddings.base import Embeddings
from app.config import settings

class VectorStore:
    def __init__(self, embeddings: Embeddings):
        self.embeddings = embeddings
        self.store = Chroma(
            persist_directory=settings.VECTOR_STORE_PATH,
            embedding_function=embeddings
        )

    def add_texts(
        self, 
        texts: List[str], 
        metadatas: Optional[List[Dict]] = None
    ) -> None:
        """Add texts to vector store"""
        self.store.add_texts(texts, metadatas)
        self.store.persist()

    async def similarity_search(
        self, 
        query: str, 
        k: int = 3
    ) -> List[Dict]:
        """Search for similar texts"""
        docs = self.store.similarity_search(query, k=k)
        return [
            {
                "content": doc.page_content,
                "metadata": doc.metadata
            }
            for doc in docs
        ]

    def clear(self) -> None:
        """Clear vector store"""
        self.store.delete_collection()
        self.store = Chroma(
            persist_directory=settings.VECTOR_STORE_PATH,
            embedding_function=self.embeddings
        )