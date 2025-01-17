# File: backend/rag/processor.py
from typing import List, Dict
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from .vector_store import VectorStore
from app.config import settings

class RAGProcessor:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=settings.OPENAI_API_KEY
        )
        self.vector_store = VectorStore(self.embeddings)

    def process_lecture(self, lecture_id: int, content: str) -> None:
        """Process lecture content and store in vector store"""
        chunks = self.text_splitter.split_text(content)
        
        texts = []
        metadatas = []
        
        for i, chunk in enumerate(chunks):
            texts.append(chunk)
            metadatas.append({
                "lecture_id": lecture_id,
                "chunk_id": i,
                "source": f"lecture_{lecture_id}"
            })
        
        self.vector_store.add_texts(texts, metadatas)

    async def find_relevant_context(
        self, 
        question: str, 
        num_chunks: int = 3
    ) -> List[Dict]:
        """Find relevant context for a question"""
        return await self.vector_store.similarity_search(
            question,
            k=num_chunks
        )

