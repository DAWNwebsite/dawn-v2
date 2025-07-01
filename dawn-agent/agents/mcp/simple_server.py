#!/usr/bin/env python3
"""
DAWN AI Study - Simplified MCP Server

A working FastAPI server for AI diagnostic assessments and learning profiles.
"""

import json
import logging
from typing import Any, Dict, List, Optional
from datetime import datetime
from dataclasses import dataclass, asdict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("dawn-mcp-server")

# Data Models
@dataclass
class LearningProfile:
    user_id: str
    learning_style: str
    attention_span: int
    processing_speed: str
    sensory_preferences: Dict[str, Any]
    cognitive_load_preference: str
    accessibility_needs: List[str]
    created_at: datetime
    updated_at: datetime

@dataclass
class DiagnosticResult:
    user_id: str
    assessment_type: str
    confidence_level: float
    indicators: List[str]
    recommendations: List[str]
    raw_data: Dict[str, Any]
    assessed_at: datetime

# In-memory storage
learning_profiles: Dict[str, LearningProfile] = {}
diagnostic_results: Dict[str, List[DiagnosticResult]] = {}

# Assessment Functions
async def run_adhd_assessment(user_id: str, responses: Dict[str, Any]) -> Dict[str, Any]:
    """Run ADHD diagnostic assessment"""
    try:
        attention_questions = responses.get("attention_questions", [])
        hyperactivity_questions = responses.get("hyperactivity_questions", [])
        impulsivity_questions = responses.get("impulsivity_questions", [])
        
        attention_score = sum(attention_questions) / max(len(attention_questions), 1)
        hyperactivity_score = sum(hyperactivity_questions) / max(len(hyperactivity_questions), 1)
        impulsivity_score = sum(impulsivity_questions) / max(len(impulsivity_questions), 1)
        
        total_score = (attention_score + hyperactivity_score + impulsivity_score) / 3
        confidence = min(total_score / 5.0, 1.0)
        
        indicators = []
        recommendations = []
        
        if attention_score >= 3.5:
            indicators.append("Significant attention difficulties")
            recommendations.append("Structured learning with minimal distractions")
        
        if hyperactivity_score >= 3.5:
            indicators.append("Hyperactivity patterns observed")
            recommendations.append("Movement breaks and kinesthetic activities")
        
        if impulsivity_score >= 3.5:
            indicators.append("Impulsivity challenges noted")
            recommendations.append("Clear routines and visual cues")
        
        result = DiagnosticResult(
            user_id=user_id,
            assessment_type="adhd",
            confidence_level=confidence,
            indicators=indicators,
            recommendations=recommendations,
            raw_data=responses,
            assessed_at=datetime.now()
        )
        
        if user_id not in diagnostic_results:
            diagnostic_results[user_id] = []
        diagnostic_results[user_id].append(result)
        
        return {
            "assessment_type": "adhd",
            "confidence_level": confidence,
            "indicators": indicators,
            "recommendations": recommendations,
            "next_steps": [
                "Review results with educational specialist",
                "Implement recommended learning strategies",
                "Monitor progress over 4-6 weeks"
            ]
        }
        
    except Exception as e:
        logger.error(f"Error in ADHD assessment: {e}")
        return {"error": f"Error running ADHD assessment: {str(e)}"}

async def run_dyslexia_assessment(user_id: str, responses: Dict[str, Any]) -> Dict[str, Any]:
    """Run dyslexia diagnostic assessment"""
    try:
        reading_speed = responses.get("reading_speed", 0)
        comprehension = responses.get("comprehension_score", 0)
        phonological = sum(responses.get("phonological_awareness", [])) / max(len(responses.get("phonological_awareness", [])), 1)
        spelling = responses.get("spelling_accuracy", 0)
        word_recognition = sum(responses.get("word_recognition", [])) / max(len(responses.get("word_recognition", [])), 1)
        
        indicators = []
        recommendations = []
        risk_factors = 0
        
        if reading_speed < 100:
            risk_factors += 1
            indicators.append("Below-average reading speed")
            recommendations.append("Text-to-speech and extended time")
        
        if comprehension < 70:
            risk_factors += 1
            indicators.append("Reading comprehension difficulties")
            recommendations.append("Graphic organizers and strategies")
        
        if phonological < 3.0:
            risk_factors += 1
            indicators.append("Phonological processing challenges")
            recommendations.append("Phonics-based interventions")
        
        confidence = min(risk_factors / 5.0, 1.0)
        
        result = DiagnosticResult(
            user_id=user_id,
            assessment_type="dyslexia",
            confidence_level=confidence,
            indicators=indicators,
            recommendations=recommendations,
            raw_data=responses,
            assessed_at=datetime.now()
        )
        
        if user_id not in diagnostic_results:
            diagnostic_results[user_id] = []
        diagnostic_results[user_id].append(result)
        
        return {
            "assessment_type": "dyslexia",
            "confidence_level": confidence,
            "indicators": indicators,
            "recommendations": recommendations,
            "accommodations": [
                "Extended time for reading tasks",
                "Audio versions of texts",
                "Dyslexia-friendly fonts",
                "Spell-check tools"
            ]
        }
        
    except Exception as e:
        logger.error(f"Error in dyslexia assessment: {e}")
        return {"error": f"Error running dyslexia assessment: {str(e)}"}

async def create_learning_profile(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Create learning profile"""
    try:
        profile = LearningProfile(
            user_id=profile_data["user_id"],
            learning_style=profile_data["learning_style"],
            attention_span=profile_data["attention_span"],
            processing_speed=profile_data.get("processing_speed", "average"),
            sensory_preferences=profile_data.get("sensory_preferences", {}),
            cognitive_load_preference=profile_data.get("cognitive_load_preference", "medium"),
            accessibility_needs=profile_data.get("accessibility_needs", []),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        learning_profiles[profile_data["user_id"]] = profile
        
        return {
            "status": "success",
            "message": "Learning profile created successfully",
            "profile": asdict(profile)
        }
        
    except Exception as e:
        logger.error(f"Error creating learning profile: {e}")
        return {"error": f"Error creating learning profile: {str(e)}"}

# FastAPI App
def create_app():
    app = FastAPI(title="DAWN AI Study MCP Server", version="1.0.0")
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    @app.get("/api/health")
    async def health_check():
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "profiles_count": len(learning_profiles),
            "results_count": sum(len(results) for results in diagnostic_results.values())
        }
    
    @app.post("/api/assessment/adhd")
    async def adhd_assessment(data: dict):
        user_id = data.get("user_id")
        responses = data.get("responses")
        
        if not user_id or not responses:
            raise HTTPException(status_code=400, detail="Missing user_id or responses")
        
        result = await run_adhd_assessment(user_id, responses)
        return result
    
    @app.post("/api/assessment/dyslexia")
    async def dyslexia_assessment(data: dict):
        user_id = data.get("user_id")
        responses = data.get("responses")
        
        if not user_id or not responses:
            raise HTTPException(status_code=400, detail="Missing user_id or responses")
        
        result = await run_dyslexia_assessment(user_id, responses)
        return result
    
    @app.post("/api/profile/create")
    async def create_profile(data: dict):
        result = await create_learning_profile(data)
        return result
    
    @app.get("/api/profile/{user_id}")
    async def get_profile(user_id: str):
        if user_id in learning_profiles:
            profile = learning_profiles[user_id]
            return asdict(profile)
        else:
            return {"status": "not_found", "message": f"No profile found for user {user_id}"}
    
    return app

if __name__ == "__main__":
    import uvicorn
    
    app = create_app()
    
    logger.info("🚀 Starting DAWN AI Study MCP Server...")
    logger.info("🌐 Server will be available at http://localhost:8000")
    logger.info("📚 API documentation at http://localhost:8000/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info") 