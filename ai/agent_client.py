# /ai/agent_client.py
import boto3
import json
import os

# Minimal Bedrock Agent client
REGION = os.getenv("AWS_REGION", "us-west-2")
client = boto3.client("bedrock-runtime", region_name=REGION)

# Example prompt template
AGENT_PROMPT = "You are a friendly AI assistant. Respond politely."

def call_agent(prompt: str):
    response = client.invoke_model(
        modelId="anthropic.claude-v2",  # Replace with any Bedrock-supported LLM
        body=json.dumps({
            "prompt": f"{AGENT_PROMPT}\n{prompt}",
            "max_tokens_to_sample": 50
        }),
        contentType="application/json"
    )
    return response["body"].read().decode("utf-8")

# Test
if __name__ == "__main__":
    print(call_agent("Hello Agent!"))
