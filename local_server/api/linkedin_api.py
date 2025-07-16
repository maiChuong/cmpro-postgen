from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.scraper import scrape_linkedin_with_selenium
import base64

router = APIRouter()

class LinkedInRequest(BaseModel):
    api_key: Optional[str] = None
    credentials: str  # base64 encoded "email:password"
    posts: int = 10
    comments: int = 10

@router.post("/fetch")
async def fetch_linkedin(data: LinkedInRequest):
    # Decode credentials
    try:
        email, password = base64.b64decode(data.credentials).decode().split(":", 1)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid credentials encoding.")

    # If API key is provided, use API (pseudo-code, implement as needed)
    if data.api_key:
        # posts, comments = fetch_linkedin_with_api(data.api_key, email, password, data.posts, data.comments)
        # return {"posts": posts, "comments": comments}
        return {"posts": ["API mode not implemented"], "comments": []}

    # Otherwise, use Selenium to scrape
    try:
        posts, comments = scrape_linkedin_with_selenium(email, password, data.posts, data.comments)
        return {"posts": posts, "comments": comments}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Selenium scraping failed: {e}")