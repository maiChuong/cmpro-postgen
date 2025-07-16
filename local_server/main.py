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
