from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from agent_client import call_agent  # Import your Bedrock agent client

app = FastAPI(title="AI Agent Service")

class ABTestRequest(BaseModel):
    product_id: int
    current_position: Optional[str] = None

class ABTestResponse(BaseModel):
    product_id: int
    suggestion: str

@app.post("/ab-test", response_model=ABTestResponse)
def ab_test(request: ABTestRequest):
    prompt = f"Suggest an A/B test for product {request.product_id} at position {request.current_position or 'unknown'}."
    agent_response = call_agent(prompt)
    return ABTestResponse(product_id=request.product_id, suggestion=agent_response)
