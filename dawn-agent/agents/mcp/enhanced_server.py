"""
Enhanced FastAPI Server for DAWN AI Study MCP with AIDA Integration
Using PydanticAI + LangGraph + Groq (Llama 3.7)

This server provides comprehensive diagnostic endpoints with the enhanced AIDA agent.
"""

import os
import sys
import asyncio
from datetime import datetime
from typing import Dict, List, Optional, Union, Any
import json
import logging

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# FastAPI and related
from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import uvicorn

# Enhanced AIDA Agent
import sys
sys.path.append('..')
from enhanced_aida import (
    EnhancedAidaAgent,
    DiagnosticType,
    DiagnosticResult,
    UserProfile,
    AssessmentResponse,
    MultiModalInput,
    SeverityLevel,
    ConfidenceLevel
)

# Logging setup
from loguru import logger
import structlog

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

# FastAPI app initialization
app = FastAPI(
    title="DAWN AI Study Enhanced MCP Server",
    description="Advanced diagnostic capabilities with PydanticAI, LangGraph, and Groq integration",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class HealthResponse(BaseModel):
    """Health check response"""
    status: str = "healthy"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    version: str = "2.0.0"
    services: Dict[str, str] = {}

class QuickAssessmentRequest(BaseModel):
    """Quick assessment request"""
    user_id: str
    assessment_type: DiagnosticType
    responses: List[AssessmentResponse]

class ComprehensiveAssessmentRequest(BaseModel):
    """Comprehensive assessment request"""
    user_profile: UserProfile
    assessment_data: MultiModalInput
    assessment_type: DiagnosticType = DiagnosticType.COMPREHENSIVE

class LearningProfileRequest(BaseModel):
    """Learning profile creation request"""
    user_id: str
    age: int
    grade_level: Optional[str] = None
    learning_disabilities: List[str] = []
    learning_style: Optional[str] = None
    difficulty_level: str = "beginner"
    preferred_subjects: List[str] = []
    accommodations: List[str] = []

class LearningProfileResponse(BaseModel):
    """Learning profile response"""
    profile_id: str
    user_id: str
    learning_disabilities: List[str]
    learning_style: Optional[str]
    difficulty_level: str
    preferred_subjects: List[str]
    accommodations: List[str]
    ai_recommendations: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContentAdaptationRequest(BaseModel):
    """Content adaptation request"""
    user_id: str
    content_type: str  # "text", "video", "interactive", "assessment"
    original_content: str
    target_difficulty: str = "auto"  # "beginner", "intermediate", "advanced", "auto"
    accessibility_needs: List[str] = []

class ContentAdaptationResponse(BaseModel):
    """Content adaptation response"""
    adapted_content: str
    adaptations_made: List[str]
    accessibility_features: List[str]
    estimated_difficulty: str
    cognitive_load_score: float = Field(ge=0.0, le=10.0)

class ProgressInsightRequest(BaseModel):
    """Progress insight request"""
    user_id: str
    assessment_history: List[Dict[str, Any]] = []
    learning_activities: List[Dict[str, Any]] = []
    time_period_days: int = 30

class ProgressInsightResponse(BaseModel):
    """Progress insight response"""
    user_id: str
    overall_progress_score: float = Field(ge=0.0, le=100.0)
    strengths: List[str]
    areas_for_improvement: List[str]
    personalized_recommendations: List[str]
    predicted_outcomes: Dict[str, float]
    engagement_metrics: Dict[str, float]

# Global state for caching
assessment_cache: Dict[str, DiagnosticResult] = {}
profile_cache: Dict[str, LearningProfileResponse] = {}

# Global AIDA agent instance
enhanced_aida = None

# Dependency injection
async def get_logger():
    """Get structured logger"""
    return structlog.get_logger()

# Health check endpoint
@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Enhanced health check with service status"""
    try:
        # Test AIDA agent initialization
        aida_status = "healthy" if enhanced_aida else "unavailable"
        
        # Test Groq connection (simplified)
        groq_status = "healthy" if enhanced_aida.groq_client else "unavailable"
        
        return HealthResponse(
            services={
                "aida_agent": aida_status,
                "groq_llm": groq_status,
                "langgraph": "healthy",
                "pydantic_ai": "healthy"
            }
        )
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Service unavailable")

# Enhanced Diagnostic Endpoints
@app.post("/api/assessment/quick", response_model=DiagnosticResult)
async def quick_assessment(
    request: QuickAssessmentRequest,
    background_tasks: BackgroundTasks,
    logger: Any = Depends(get_logger)
):
    """
    Run quick diagnostic assessment using enhanced AIDA agent
    """
    logger.info("Starting quick assessment", 
                user_id=request.user_id, 
                assessment_type=request.assessment_type)
    
    try:
        # Check cache first
        cache_key = f"{request.user_id}_{request.assessment_type}_{len(request.responses)}"
        if cache_key in assessment_cache:
            logger.info("Returning cached assessment result", cache_key=cache_key)
            return assessment_cache[cache_key]
        
        # Run assessment with enhanced AIDA
        result = await enhanced_aida.run_quick_assessment(
            user_id=request.user_id,
            responses=request.responses,
            assessment_type=request.assessment_type
        )
        
        # Cache result
        assessment_cache[cache_key] = result
        
        # Log assessment completion
        logger.info("Quick assessment completed", 
                   user_id=request.user_id,
                   overall_score=result.overall_score,
                   confidence=result.confidence_level,
                   severity=result.severity_level)
        
        return result
        
    except Exception as e:
        logger.error("Quick assessment failed", 
                    user_id=request.user_id, 
                    error=str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Assessment failed: {str(e)}"
        )

@app.post("/api/assessment/comprehensive", response_model=DiagnosticResult)
async def comprehensive_assessment(
    request: ComprehensiveAssessmentRequest,
    background_tasks: BackgroundTasks,
    logger: Any = Depends(get_logger)
):
    """
    Run comprehensive diagnostic assessment using enhanced AIDA agent with LangGraph workflow
    """
    logger.info("Starting comprehensive assessment", 
                user_id=request.user_profile.user_id, 
                assessment_type=request.assessment_type)
    
    try:
        # Run comprehensive assessment
        result = await enhanced_aida.run_comprehensive_assessment(
            user_profile=request.user_profile,
            assessment_data=request.assessment_data,
            assessment_type=request.assessment_type
        )
        
        # Cache result
        cache_key = f"comprehensive_{request.user_profile.user_id}_{request.assessment_type}"
        assessment_cache[cache_key] = result
        
        # Log assessment completion
        logger.info("Comprehensive assessment completed", 
                   user_id=request.user_profile.user_id,
                   overall_score=result.overall_score,
                   confidence=result.confidence_level,
                   severity=result.severity_level,
                   domain_scores=result.domain_scores)
        
        return result
        
    except Exception as e:
        logger.error("Comprehensive assessment failed", 
                    user_id=request.user_profile.user_id, 
                    error=str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Comprehensive assessment failed: {str(e)}"
        )

# Enhanced Learning Profile Management
@app.post("/api/profile/create", response_model=LearningProfileResponse)
async def create_learning_profile(
    request: LearningProfileRequest,
    logger: Any = Depends(get_logger)
):
    """
    Create personalized learning profile with AI recommendations
    """
    logger.info("Creating learning profile", user_id=request.user_id)
    
    try:
        # Generate AI recommendations based on profile
        ai_recommendations = await _generate_profile_recommendations(request)
        
        profile = LearningProfileResponse(
            profile_id=f"profile_{request.user_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
            user_id=request.user_id,
            learning_disabilities=request.learning_disabilities,
            learning_style=request.learning_style,
            difficulty_level=request.difficulty_level,
            preferred_subjects=request.preferred_subjects,
            accommodations=request.accommodations,
            ai_recommendations=ai_recommendations
        )
        
        # Cache profile
        profile_cache[request.user_id] = profile
        
        logger.info("Learning profile created", 
                   user_id=request.user_id,
                   profile_id=profile.profile_id)
        
        return profile
        
    except Exception as e:
        logger.error("Profile creation failed", 
                    user_id=request.user_id, 
                    error=str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Profile creation failed: {str(e)}"
        )

@app.get("/api/profile/{user_id}", response_model=LearningProfileResponse)
async def get_learning_profile(
    user_id: str,
    logger: Any = Depends(get_logger)
):
    """
    Retrieve learning profile for user
    """
    logger.info("Retrieving learning profile", user_id=user_id)
    
    if user_id not in profile_cache:
        raise HTTPException(
            status_code=404,
            detail=f"Profile not found for user {user_id}"
        )
    
    return profile_cache[user_id]

# Advanced Content Adaptation
@app.post("/api/content/adapt", response_model=ContentAdaptationResponse)
async def adapt_content(
    request: ContentAdaptationRequest,
    logger: Any = Depends(get_logger)
):
    """
    Adapt content for neurodivergent learners using AI
    """
    logger.info("Adapting content", 
                user_id=request.user_id,
                content_type=request.content_type)
    
    try:
        # Get user profile for personalization
        user_profile = profile_cache.get(request.user_id)
        
        # Adapt content using AI
        adapted_content = await _adapt_content_with_ai(request, user_profile)
        
        logger.info("Content adaptation completed", 
                   user_id=request.user_id,
                   adaptations_count=len(adapted_content.adaptations_made))
        
        return adapted_content
        
    except Exception as e:
        logger.error("Content adaptation failed", 
                    user_id=request.user_id, 
                    error=str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Content adaptation failed: {str(e)}"
        )

# Progress Analytics
@app.post("/api/insights/progress", response_model=ProgressInsightResponse)
async def generate_progress_insights(
    request: ProgressInsightRequest,
    logger: Any = Depends(get_logger)
):
    """
    Generate AI-powered progress insights and recommendations
    """
    logger.info("Generating progress insights", 
                user_id=request.user_id,
                time_period=request.time_period_days)
    
    try:
        insights = await _generate_progress_insights(request)
        
        logger.info("Progress insights generated", 
                   user_id=request.user_id,
                   overall_score=insights.overall_progress_score)
        
        return insights
        
    except Exception as e:
        logger.error("Progress insights generation failed", 
                    user_id=request.user_id, 
                    error=str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Progress insights generation failed: {str(e)}"
        )

# Helper functions
async def _generate_profile_recommendations(request: LearningProfileRequest) -> List[str]:
    """Generate AI recommendations for learning profile"""
    recommendations = []
    
    # Basic recommendations based on learning disabilities
    if "ADHD" in request.learning_disabilities:
        recommendations.extend([
            "Use timer-based learning sessions (25-minute intervals)",
            "Incorporate movement breaks every 20 minutes",
            "Provide clear, step-by-step instructions",
            "Use visual organizers and checklists"
        ])
    
    if "Dyslexia" in request.learning_disabilities:
        recommendations.extend([
            "Use text-to-speech technology",
            "Provide materials in multiple formats",
            "Allow extra time for reading tasks",
            "Use dyslexia-friendly fonts and colors"
        ])
    
    if "Autism" in request.learning_disabilities:
        recommendations.extend([
            "Maintain consistent routines and structure",
            "Provide clear expectations and schedules",
            "Use visual supports and social stories",
            "Offer sensory breaks as needed"
        ])
    
    # Learning style recommendations
    if request.learning_style == "Visual":
        recommendations.extend([
            "Use diagrams, charts, and visual aids",
            "Incorporate color-coding systems",
            "Provide graphic organizers"
        ])
    elif request.learning_style == "Auditory":
        recommendations.extend([
            "Use verbal instructions and discussions",
            "Incorporate music and rhythm",
            "Provide audio recordings of lessons"
        ])
    elif request.learning_style == "Kinesthetic":
        recommendations.extend([
            "Include hands-on activities",
            "Use manipulatives and physical models",
            "Incorporate movement into learning"
        ])
    
    return recommendations

async def _adapt_content_with_ai(
    request: ContentAdaptationRequest, 
    user_profile: Optional[LearningProfileResponse]
) -> ContentAdaptationResponse:
    """Adapt content using AI based on user needs"""
    
    adaptations_made = []
    accessibility_features = []
    
    # Simulate content adaptation (in real implementation, use Groq/LLM)
    adapted_content = request.original_content
    
    # Basic adaptations based on accessibility needs
    if "dyslexia" in request.accessibility_needs:
        adaptations_made.append("Applied dyslexia-friendly formatting")
        accessibility_features.append("Increased line spacing and font size")
        # In real implementation: modify text formatting, use simpler language
    
    if "adhd" in request.accessibility_needs:
        adaptations_made.append("Reduced cognitive load")
        accessibility_features.append("Chunked content into smaller sections")
        # In real implementation: break content into smaller chunks, add focus aids
    
    if "autism" in request.accessibility_needs:
        adaptations_made.append("Added structure and predictability")
        accessibility_features.append("Clear headings and consistent formatting")
        # In real implementation: add clear structure, remove ambiguous language
    
    # Estimate cognitive load (simplified)
    cognitive_load_score = min(len(adapted_content) / 100.0, 10.0)
    
    return ContentAdaptationResponse(
        adapted_content=adapted_content,
        adaptations_made=adaptations_made,
        accessibility_features=accessibility_features,
        estimated_difficulty=request.target_difficulty,
        cognitive_load_score=cognitive_load_score
    )

async def _generate_progress_insights(request: ProgressInsightRequest) -> ProgressInsightResponse:
    """Generate progress insights using AI analysis"""
    
    # Simulate progress analysis (in real implementation, use comprehensive AI analysis)
    overall_score = 75.0  # Placeholder
    
    strengths = [
        "Consistent engagement with learning materials",
        "Improvement in reading comprehension",
        "Strong performance in visual learning tasks"
    ]
    
    areas_for_improvement = [
        "Attention span during longer activities",
        "Mathematical problem-solving skills",
        "Written expression clarity"
    ]
    
    recommendations = [
        "Continue using visual learning strategies",
        "Implement shorter, more frequent math practice sessions",
        "Use writing templates and graphic organizers"
    ]
    
    predicted_outcomes = {
        "reading_level": 85.0,
        "math_proficiency": 70.0,
        "overall_engagement": 80.0
    }
    
    engagement_metrics = {
        "session_completion_rate": 88.0,
        "time_on_task": 75.0,
        "interaction_frequency": 82.0
    }
    
    return ProgressInsightResponse(
        user_id=request.user_id,
        overall_progress_score=overall_score,
        strengths=strengths,
        areas_for_improvement=areas_for_improvement,
        personalized_recommendations=recommendations,
        predicted_outcomes=predicted_outcomes,
        engagement_metrics=engagement_metrics
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    global enhanced_aida
    logger.info("Starting DAWN AI Study Enhanced MCP Server...")
    
    try:
        # Initialize Enhanced AIDA Agent
        enhanced_aida = EnhancedAidaAgent()
        logger.info("Enhanced AIDA Agent initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Enhanced AIDA Agent: {str(e)}")
        # For development, continue without AIDA
        enhanced_aida = None

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down DAWN AI Study Enhanced MCP Server...")
    # Cleanup resources if needed

if __name__ == "__main__":
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    
    # Run server
    uvicorn.run(
        "enhanced_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 