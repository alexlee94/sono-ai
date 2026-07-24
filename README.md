# Sono AI

An AI-powered RAG (Retrieval-Augmented Generation) chatbot built with Python, FastAPI, LangChain, and React. Upload any document and ask questions about it — Sono AI retrieves the most relevant context and generates accurate answers using Llama 3.3 via Groq.

## Tech Stack

**Backend:** Python, FastAPI, LangChain, ChromaDB, Groq (Llama 3.3), Google Gemini Embeddings  
**Frontend:** React, TypeScript, Material UI  
**Tools:** Git, Docker

## Features

- Upload any text document and process it into a vector database
- Ask natural language questions and get AI-generated answers based on document context
- RAG pipeline splits documents into chunks, converts them to embeddings, stores in ChromaDB, and retrieves relevant context before generating answers
- Answers are grounded in the document — the model will not make up information outside the provided context

## How It Works

```
User uploads document
        ↓
Text split into chunks (500 tokens, 50 overlap)
        ↓
Chunks converted to embeddings (Gemini text-embedding-004)
        ↓
Embeddings stored in ChromaDB (in-memory vector store)
        ↓
User asks a question
        ↓
Top 3 most relevant chunks retrieved
        ↓
Chunks + question sent to Llama 3.3 (via Groq)
        ↓
Answer generated based only on retrieved context
```

## Running Locally

### Prerequisites
- Python 3.13+
- Node.js 18+

### Backend

1. Create and activate virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
```

2. Install dependencies:
```bash
pip install fastapi uvicorn langchain langchain-groq langchain-google-genai langchain-community langchain-text-splitters chromadb python-dotenv
```

3. Create `.env` file:
```
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
```

4. Run the server:
```bash
python -m uvicorn app.main:app --reload
```

API runs at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ingest` | Upload and process a document |
| POST | `/api/chat` | Ask a question about the document |
| GET | `/` | Health check |