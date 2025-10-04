# api/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from pydantic import BaseModel
from typing import Optional
import requests
import os

app = FastAPI(
    title="Planogram A/B Agent API",
    description="API for UI → AI Agent communication",
    version="0.1.0"
)

# Enable CORS for all origins (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthResponse(BaseModel):
    status: str
    region: str
    owner: str

class ABTestRequest(BaseModel):
    product_id: int
    current_position: Optional[str] = None

class ABTestResponse(BaseModel):
    product_id: int
    suggestion: str

# -------------------------
# Health check
# -------------------------
@app.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(
        status="ok",
        region=os.getenv("AWS_REGION", "us-west-2"),
        owner="AI-Hackathon Team"
    )

# -------------------------
# Proxy to AI service
# -------------------------
AI_SERVICE_URL = "http://localhost:8001/ab-test"  # local AI service

@app.post("/suggest-ab-test", response_model=ABTestResponse)
def suggest_ab_test(request: ABTestRequest):
    resp = requests.post(AI_SERVICE_URL, json=request.dict())
    return ABTestResponse(**resp.json())

# -------------------------
# Lambda handler
# -------------------------
handler = Mangum(app)
