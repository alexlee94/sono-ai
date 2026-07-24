from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.rag_service import ask_question, ingest_documents

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

class IngestRequest(BaseModel):
    texts: list[str]

class ChatResponse(BaseModel):
    answer: str

class IngestResponse(BaseModel):
    message: str

@router.post("/chat", response_model=ChatResponse)
def chat(request: QuestionRequest):
    try:
        answer = ask_question(request.question)
        return ChatResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ingest", response_model=IngestResponse)
def ingest(request: IngestRequest):
    try:
        message = ingest_documents(request.texts)
        return IngestResponse(message=message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))