from fastapi import FastAPI, Request, HTTPException, Body, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import boto3
import json
import uuid
from datetime import datetime
from typing import Optional, List
from boto3.dynamodb.conditions import Attr
import logging
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import secrets

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables (for non-sensitive configuration)
load_dotenv()

# Initialize FastAPI with rate limiting
limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOWED_ORIGINS", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Key security
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME)

def get_secret():
    """Retrieve secrets from AWS Secrets Manager"""
    secret_name = os.getenv("AWS_SECRET_NAME", "terraform-demo-secrets")
    region_name = os.getenv("AWS_REGION", "us-east-1")
    
    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )
    
    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except Exception as e:
        logger.error(f"Error retrieving secrets: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve AWS credentials"
        )
    else:
        if 'SecretString' in get_secret_value_response:
            secret = json.loads(get_secret_value_response['SecretString'])
            return secret
        else:
            raise HTTPException(
                status_code=500,
                detail="Invalid secret format"
            )

# Get secrets
try:
    secrets = get_secret()
    AWS_ACCESS_KEY_ID = secrets.get('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = secrets.get('AWS_SECRET_ACCESS_KEY')
    API_KEY = secrets.get('API_KEY')
except Exception as e:
    logger.error(f"Failed to initialize secrets: {str(e)}")
    raise

async def get_api_key(api_key: str = Depends(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(
            status_code=403,
            detail="Invalid API Key"
        )
    return api_key

# DynamoDB setup with error handling
try:
    dynamodb = boto3.resource(
        'dynamodb',
        region_name=os.getenv("AWS_REGION", "us-east-1"),
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )
    table = dynamodb.Table('smstable')
except Exception as e:
    logger.error(f"Failed to initialize DynamoDB: {str(e)}")
    raise

# Pydantic models
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

# Rate-limited endpoints
@app.post("/chat/chat2")
@limiter.limit("5/minute")
async def chat2(request: Request):
    try:
        data = await request.json()
        logger.info(f"Received chat request: {data}")
        return {
            "session_id": data.get("session_id", "demo-session"),
            "response": f"Demo response to: {data.get('message', '')}"
        }
    except Exception as e:
        logger.error(f"Error in chat2 endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/chat/create-chatbot4")
@limiter.limit("10/minute")
def create_chatbot4(request: ChatbotCreateRequest = Body(...), api_key: str = Depends(get_api_key)):
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
        logger.info(f"Created new chatbot with ID: {chatbot_id}")
        return {"id": chatbot_id, "message": "Chatbot created successfully"}
    except Exception as e:
        logger.error(f"Error creating chatbot: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/chat/get-all-chatbots")
@limiter.limit("20/minute")
def get_all_chatbots(api_key: str = Depends(get_api_key)):
    try:
        response = table.scan(
            FilterExpression=Attr("type").eq("chatbot")
        )
        chatbots = response.get("Items", [])
        logger.info(f"Retrieved {len(chatbots)} chatbots")
        return chatbots
    except Exception as e:
        logger.error(f"Error retrieving chatbots: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/store")
@limiter.limit("10/minute")
async def store_item(item: dict, api_key: str = Depends(get_api_key)):
    try:
        table.put_item(Item=item)
        logger.info("Successfully stored item")
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error storing item: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get/{item_id}")
@limiter.limit("20/minute")
async def get_item(item_id: str, api_key: str = Depends(get_api_key)):
    try:
        response = table.get_item(Key={"id": item_id})
        item = response.get("Item", {})
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        return item
    except Exception as e:
        logger.error(f"Error retrieving item {item_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/chat/dashboard/metrics")
@limiter.limit("30/minute")
def dashboard_metrics(api_key: str = Depends(get_api_key)):
    try:
        return {
            "total_campaigns": 3,
            "active_campaigns": 2,
            "total_leads": 42,
            "success_rate": 97,
            "monthly_messages": 1234
        }
    except Exception as e:
        logger.error(f"Error retrieving dashboard metrics: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Generate a random API key if not set in environment
    if not os.getenv("API_KEY"):
        api_key = secrets.token_urlsafe(32)
        logger.warning(f"No API_KEY found in environment. Generated temporary key: {api_key}")
        os.environ["API_KEY"] = api_key
    
    uvicorn.run(app, host="0.0.0.0", port=8000) 