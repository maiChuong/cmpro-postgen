#!/bin/bash

# Exit on error
set -e

# Create project structure
mkdir -p local_server/{app,api,templates,static}
cd local_server

# Create Python virtual environment
python3 -m venv env

# Activate environment and install FastAPI, Uvicorn, and other essentials
source env/bin/activate
python -m pip install --upgrade pip
python -m pip install fastapi uvicorn[standard] python-multipart jinja2 requests selenium

# Freeze requirements
python -m pip freeze > requirements.txt

# Create main FastAPI app
cat > main.py <<EOF
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app import models
from api import linkedin_api, ollama_api, puter_api

app = FastAPI()

# Allow CORS for local dev and ngrok
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(linkedin_api.router, prefix="/linkedin")
app.include_router(ollama_api.router, prefix="/ollama")
app.include_router(puter_api.router, prefix="/puter")
EOF

# Create minimal routers for endpoints
cat > api/linkedin_api.py <<EOF
from fastapi import APIRouter, Request
from pydantic import BaseModel

router = APIRouter()

class LinkedInRequest(BaseModel):
    api_key: str
    credentials: str
    posts: int
    comments: int

@router.post("/fetch")
async def fetch_linkedin(data: LinkedInRequest):
    # TODO: Implement LinkedIn scraping/cleaning logic
    return {"posts": ["Sample Post 1"], "comments": ["Sample Comment 1"]}
EOF

cat > api/ollama_api.py <<EOF
from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/generate")
async def generate_ollama(request: Request):
    # TODO: Implement Ollama integration
    return {"generated": "Sample Ollama output"}
EOF

cat > api/puter_api.py <<EOF
from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/generate")
async def generate_puter(request: Request):
    # TODO: Implement Puter.ai integration
    return {"generated": "Sample Puter.ai output"}
EOF

# Create minimal Pydantic models file
cat > app/models.py <<EOF
# Add your Pydantic models here as needed
EOF

# Print instructions
echo "---------------------------------------------"
echo "Local FastAPI server structure created."
echo "To start:"
echo "  cd local_server"
echo "  source env/bin/activate"
echo "  uvicorn main:app --reload"
echo ""
echo "To expose via Ngrok (if installed):"
echo "  ngrok http 8000"
echo ""
echo "Endpoints:"
echo "  POST /linkedin/fetch"
echo "  POST /ollama/generate"
echo "  POST /puter/generate"
echo "---------------------------------------------"