# api/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from strands import Agent
from pydantic import BaseModel
from typing import Optional
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file (only for local development)
if os.path.exists('.env'):
    load_dotenv()

app = FastAPI(
    title="Diet plan Agent API",
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

class UserDietRequest(BaseModel):
    height: float
    weight: float
    food_preference: str
    allergens: str
    medical_conditions: str
    budget: float
    target: str

class MealMacros(BaseModel):
    protein: float
    carbs: float
    fat: float

class Meal(BaseModel):
    name: str
    time: str
    items: list[str]
    calories: int
    macros: MealMacros

class DayPlan(BaseModel):
    day: str
    meals: list[Meal]
    targetCalories: int
    mealsPerDay: int

class DietPlanResponse(BaseModel):
    week_plan: list[DayPlan]


    


# Use static meal plan for demo and to avoid agent errors
@app.post("/food", response_model=DietPlanResponse)
def suggest_diet_plan(user_diet_request: UserDietRequest):
    import logging
    agent = Agent()
    height = user_diet_request.height
    weight = user_diet_request.weight
    food_preference = user_diet_request.food_preference
    allergens = user_diet_request.allergens
    medical_conditions = user_diet_request.medical_conditions
    budget = user_diet_request.budget
    target = user_diet_request.target

    message = f"""
        I am {height} cm tall and weigh {weight} kg. I
         follow a {food_preference} diet and have allergies to {allergens}. My medical conditions include 
         {medical_conditions}. My budget for groceries is ${budget}. My fitness target is {target}. Based on this information, can you suggest a suitable meal plan for me? for each of  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    """
    try:
        result = agent.structured_output(DietPlanResponse, message)
        logging.info(f"DietPlanResponse: {result}")
        print("DietPlanResponse:", result)
        return result
    except Exception as e:
        logging.error(f"Error generating diet plan: {e}")
        # Fallback to static plan if agent fails
        meals = [
            Meal(
                name="Breakfast",
                time="8:00 AM",
                items=["Oatmeal", "Banana", "Almond milk"],
                calories=400,
                macros=MealMacros(protein=25, carbs=50, fat=10),
            ),
            Meal(
                name="Lunch",
                time="1:00 PM",
                items=["Grilled chicken", "Brown rice", "Broccoli"],
                calories=600,
                macros=MealMacros(protein=45, carbs=70, fat=15),
            ),
            Meal(
                name="Snack",
                time="4:00 PM",
                items=["Yogurt", "Nuts"],
                calories=200,
                macros=MealMacros(protein=10, carbs=20, fat=8),
            ),
            Meal(
                name="Dinner",
                time="7:00 PM",
                items=["Salmon", "Quinoa", "Spinach"],
                calories=550,
                macros=MealMacros(protein=40, carbs=45, fat=18),
            ),
        ]
        week_days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        week_plan = [
            DayPlan(
                day=day,
                meals=meals,
                targetCalories=1800,
                mealsPerDay=len(meals),
            )
            for day in week_days
        ]
        fallback_response = DietPlanResponse(week_plan=week_plan)
        logging.warning(f"Fallback DietPlanResponse: {fallback_response}")
        print("Fallback DietPlanResponse:", fallback_response)
        return fallback_response

    
# -------------------------
# Health check
# -------------------------
@app.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(
        status="ok",
        owner="AI-Hackathon Team"
    )





# -------------------------
# Lambda handler
# -------------------------
handler = Mangum(app)
