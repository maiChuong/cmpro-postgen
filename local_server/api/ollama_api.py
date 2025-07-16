from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/generate")
async def generate_ollama(request: Request):
    # TODO: Implement Ollama integration
    return {"generated": "Sample Ollama output"}
