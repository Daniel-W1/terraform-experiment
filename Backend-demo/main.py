from fastapi import FastAPI, Request, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import boto3
import uuid
from datetime import datetime
from typing import Optional, List
from boto3.dynamodb.conditions import Attr

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DynamoDB setup
dynamodb = boto3.resource('dynamodb', region_name=os.getenv("AWS_REGION", "us-east-1"))
table = dynamodb.Table('smstable')

@app.post("/chat/chat2")
async def chat2(request: Request):
    data = await request.json()
    return {
        "session_id": data.get("session_id", "demo-session"),
        "response": f"Demo response to: {data.get('message', '')}"
    }

# Pydantic model for chatbot creation
class ChatbotCreateRequest(BaseModel):
    name: Optional[str] = ""
    chatbot_script_id: Optional[str] = ""
    lead_information_list_ids: Optional[List[str]] = []
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
    job_title: Optional[str] = ""
    personality: Optional[str] = ""
    company_name: Optional[str] = ""
    company_address: Optional[str] = ""
    department: Optional[str] = ""
    industry: Optional[str] = ""
    year_established: Optional[int] = 0
    company_email: Optional[str] = ""
    phone_number: Optional[str] = ""
    company_website: Optional[str] = ""
    job_description: Optional[str] = ""
    priorities: Optional[List[str]] = []
    opinions: Optional[List[str]] = []
    ai_creativity: Optional[int] = 5

@app.post("/chat/create-chatbot4")
def create_chatbot4(request: ChatbotCreateRequest = Body(...)):
    try:
        chatbot_id = str(uuid.uuid4())
        item = {
            "id": chatbot_id,
            "type": "chatbot",
            "name": request.name,
            "chatbot_script_id": request.chatbot_script_id,
            "lead_information_list_ids": request.lead_information_list_ids,
            "first_name": request.first_name,
            "last_name": request.last_name,
            "job_title": request.job_title,
            "personality": request.personality,
            "company_name": request.company_name,
            "company_address": request.company_address,
            "department": request.department,
            "industry": request.industry,
            "year_established": request.year_established,
            "company_email": request.company_email,
            "phone_number": request.phone_number,
            "company_website": request.company_website,
            "job_description": request.job_description,
            "priorities": request.priorities,
            "opinions": request.opinions,
            "ai_creativity": request.ai_creativity,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }
        table.put_item(Item=item)
        return {"id": chatbot_id, "message": "Chatbot created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/chat/get-all-chatbots")
def get_all_chatbots():
    try:
        response = table.scan(
            FilterExpression=Attr("type").eq("chatbot")
        )
        chatbots = response.get("Items", [])
        return chatbots
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/store")
async def store_item(item: dict):
    table.put_item(Item=item)
    return {"status": "success"}

@app.get("/get/{item_id}")
async def get_item(item_id: str):
    response = table.get_item(Key={"id": item_id})
    return response.get("Item", {})

@app.get("/chat/dashboard/metrics")
def dashboard_metrics():
    return {
        "total_campaigns": 3,
        "active_campaigns": 2,
        "total_leads": 42,
        "success_rate": 97,
        "monthly_messages": 1234
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)