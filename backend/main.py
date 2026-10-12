import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from backend.generator import get_sections, generate_answer, generate_answer_stream


app = FastAPI(
    title="Vedant AI",
    description="Personal AI Portfolio Assistant for Vedant Butle",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str | None = None
    question: str | None = None
    query: str | None = None
    prompt: str | None = None

    def get_message(self) -> str:
        return (self.message or self.question or self.query or self.prompt or "").strip()


class ChatResponse(BaseModel):
    answer: str
    sources: list[str]


@app.get("/")
@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "Vedant AI",
        "sections": len(get_sections()),
        "portfolio": "https://vedantbutle-portfolio.vercel.app",
    }


@app.post("/chat", response_model=ChatResponse)
@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    question = request.get_message()

    if not question:
        return ChatResponse(answer="Please enter a question.", sources=[])

    try:
        answer, metadatas = generate_answer(question)
        sources = list({m.get("source", "") for m in metadatas if m.get("source")})
        return ChatResponse(answer=answer, sources=sources)
    except Exception as e:
        print("ERROR:", e)
        return ChatResponse(
            answer="Sorry, I encountered an error while processing your question.",
            sources=[],
        )


@app.post("/chat/stream")
@app.post("/api/chat/stream")
def chat_stream(request: ChatRequest):
    question = request.get_message()

    if not question:
        def empty_gen():
            yield f"data: {json.dumps({'type': 'token', 'token': 'Please enter a question.'})}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(empty_gen(), media_type="text/event-stream")

    def event_generator():
        try:
            for item in generate_answer_stream(question):
                yield f"data: {json.dumps(item)}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            print("STREAM ERROR:", e)
            yield f"data: {json.dumps({'type': 'error', 'error': 'Sorry, an error occurred while streaming response.'})}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )