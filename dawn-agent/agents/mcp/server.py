#!/usr/bin/env python3
"""
DAWN AI Study MCP Server

This server provides Model Context Protocol (MCP) tools for AI diagnostic agents,
learning profile management, and educational content adaptation.
"""

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional, Union
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from enum import Enum

from mcp.server.models import InitializationOptions
from mcp.server import NotificationOptions, Server
from mcp.types import (
    Resource, 
    Tool, 
    TextContent, 
    ImageContent, 
    EmbeddedResource,
    LoggingLevel
)
import mcp.types as types

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("dawn-mcp-server")

# Data Models
@dataclass
class LearningProfile:
    """Learning profile for neurodivergent learners"""
    user_id: str
    learning_style: str  # visual, auditory, kinesthetic, reading
    attention_span: int  # minutes
    processing_speed: str  # fast, average, slow
    sensory_preferences: Dict[str, Any]
    cognitive_load_preference: str  # low, medium, high
    accessibility_needs: List[str]
    created_at: datetime
    updated_at: datetime

@dataclass
class DiagnosticResult:
    """Diagnostic assessment results"""
    user_id: str
    assessment_type: str  # adhd, dyslexia, autism
    confidence_level: float  # 0.0 to 1.0
    indicators: List[str]
    recommendations: List[str]
    raw_data: Dict[str, Any]
    assessed_at: datetime
    reviewed_by: Optional[str] = None

@dataclass
class AdaptiveContent:
    """Adaptive learning content"""
    content_id: str
    original_content: str
    adapted_versions: Dict[str, str]  # learning_style -> adapted_content
    difficulty_level: int  # 1-10
    estimated_time: int  # minutes
    accessibility_features: List[str]
    created_at: datetime

class DiagnosticType(Enum):
    ADHD = "adhd"
    DYSLEXIA = "dyslexia"
    AUTISM = "autism"
    GENERAL = "general"

# Server instance
server = Server("dawn-ai-study")

# In-memory storage (in production, this would be a database)
learning_profiles: Dict[str, LearningProfile] = {}
diagnostic_results: Dict[str, List[DiagnosticResult]] = {}
adaptive_content: Dict[str, AdaptiveContent] = {}

@server.list_resources()
async def handle_list_resources() -> list[Resource]:
    """List available resources"""
    return [
        Resource(
            uri="dawn://learning-profiles",
            name="Learning Profiles",
            description="Neurodivergent learning profiles and preferences",
            mimeType="application/json",
        ),
        Resource(
            uri="dawn://diagnostic-results",
            name="Diagnostic Results",
            description="AI diagnostic assessment results",
            mimeType="application/json",
        ),
        Resource(
            uri="dawn://adaptive-content",
            name="Adaptive Content",
            description="Learning content adapted for different needs",
            mimeType="application/json",
        ),
    ]

@server.read_resource()
async def handle_read_resource(uri: str) -> str:
    """Read resource content"""
    if uri == "dawn://learning-profiles":
        return json.dumps([asdict(profile) for profile in learning_profiles.values()], default=str)
    elif uri == "dawn://diagnostic-results":
        all_results = []
        for user_results in diagnostic_results.values():
            all_results.extend([asdict(result) for result in user_results])
        return json.dumps(all_results, default=str)
    elif uri == "dawn://adaptive-content":
        return json.dumps([asdict(content) for content in adaptive_content.values()], default=str)
    else:
        raise ValueError(f"Unknown resource: {uri}")

@server.list_tools()
async def handle_list_tools() -> list[Tool]:
    """List available diagnostic and learning tools"""
    return [
        # Diagnostic Tools
        Tool(
            name="run_adhd_assessment",
            description="Run ADHD diagnostic assessment",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "User identifier"},
                    "responses": {
                        "type": "object",
                        "description": "Assessment responses",
                        "properties": {
                            "attention_questions": {"type": "array", "items": {"type": "number"}},
                            "hyperactivity_questions": {"type": "array", "items": {"type": "number"}},
                            "impulsivity_questions": {"type": "array", "items": {"type": "number"}},
                            "age": {"type": "number"},
                            "duration_months": {"type": "number"}
                        }
                    }
                },
                "required": ["user_id", "responses"]
            },
        ),
        Tool(
            name="run_dyslexia_assessment",
            description="Run dyslexia diagnostic assessment",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "User identifier"},
                    "responses": {
                        "type": "object",
                        "description": "Assessment responses",
                        "properties": {
                            "reading_speed": {"type": "number"},
                            "comprehension_score": {"type": "number"},
                            "phonological_awareness": {"type": "array", "items": {"type": "number"}},
                            "spelling_accuracy": {"type": "number"},
                            "word_recognition": {"type": "array", "items": {"type": "number"}}
                        }
                    }
                },
                "required": ["user_id", "responses"]
            },
        ),
        Tool(
            name="run_autism_assessment",
            description="Run autism spectrum diagnostic assessment",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "User identifier"},
                    "responses": {
                        "type": "object",
                        "description": "Assessment responses",
                        "properties": {
                            "social_communication": {"type": "array", "items": {"type": "number"}},
                            "repetitive_behaviors": {"type": "array", "items": {"type": "number"}},
                            "sensory_processing": {"type": "array", "items": {"type": "number"}},
                            "age_of_concerns": {"type": "number"}
                        }
                    }
                },
                "required": ["user_id", "responses"]
            },
        ),
        
        # Learning Profile Tools
        Tool(
            name="create_learning_profile",
            description="Create or update a learning profile",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "User identifier"},
                    "learning_style": {"type": "string", "enum": ["visual", "auditory", "kinesthetic", "reading"]},
                    "attention_span": {"type": "number", "description": "Attention span in minutes"},
                    "processing_speed": {"type": "string", "enum": ["fast", "average", "slow"]},
                    "sensory_preferences": {"type": "object", "description": "Sensory preferences"},
                    "cognitive_load_preference": {"type": "string", "enum": ["low", "medium", "high"]},
                    "accessibility_needs": {"type": "array", "items": {"type": "string"}}
                },
                "required": ["user_id", "learning_style", "attention_span"]
            },
        ),
        Tool(
            name="get_learning_profile",
            description="Get learning profile for a user",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "User identifier"}
                },
                "required": ["user_id"]
            },
        ),
        Tool(
            name="update_learning_profile",
            description="Update specific aspects of a learning profile",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "User identifier"},
                    "updates": {"type": "object", "description": "Fields to update"}
                },
                "required": ["user_id", "updates"]
            },
        ),
        
        # Content Adaptation Tools
        Tool(
            name="adapt_content",
            description="Adapt learning content for specific needs",
            inputSchema={
                "type": "object",
                "properties": {
                    "content": {"type": "string", "description": "Original content"},
                    "user_id": {"type": "string", "description": "User identifier"},
                    "adaptations": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Specific adaptations to apply"
                    }
                },
                "required": ["content", "user_id"]
            },
        ),
        Tool(
            name="generate_accessibility_features",
            description="Generate accessibility features for content",
            inputSchema={
                "type": "object",
                "properties": {
                    "content_type": {"type": "string", "description": "Type of content"},
                    "accessibility_needs": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Accessibility requirements"
                    }
                },
                "required": ["content_type", "accessibility_needs"]
            },
        ),
        
        # Progress Tracking Tools
        Tool(
            name="track_learning_progress",
            description="Track and analyze learning progress",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "User identifier"},
                    "activity_data": {
                        "type": "object",
                        "description": "Learning activity data",
                        "properties": {
                            "content_id": {"type": "string"},
                            "time_spent": {"type": "number"},
                            "completion_rate": {"type": "number"},
                            "difficulty_rating": {"type": "number"},
                            "engagement_level": {"type": "number"}
                        }
                    }
                },
                "required": ["user_id", "activity_data"]
            },
        ),
        Tool(
            name="get_progress_insights",
            description="Get insights and recommendations based on progress",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "User identifier"},
                    "time_period": {"type": "string", "description": "Time period for analysis"}
                },
                "required": ["user_id"]
            },
        ),
    ]

# Tool Implementations

@server.call_tool()
async def handle_call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    """Handle tool calls"""
    
    if name == "run_adhd_assessment":
        return await run_adhd_assessment(arguments["user_id"], arguments["responses"])
    
    elif name == "run_dyslexia_assessment":
        return await run_dyslexia_assessment(arguments["user_id"], arguments["responses"])
    
    elif name == "run_autism_assessment":
        return await run_autism_assessment(arguments["user_id"], arguments["responses"])
    
    elif name == "create_learning_profile":
        return await create_learning_profile(arguments)
    
    elif name == "get_learning_profile":
        return await get_learning_profile(arguments["user_id"])
    
    elif name == "update_learning_profile":
        return await update_learning_profile(arguments["user_id"], arguments["updates"])
    
    elif name == "adapt_content":
        return await adapt_content(arguments["content"], arguments["user_id"], arguments.get("adaptations", []))
    
    elif name == "generate_accessibility_features":
        return await generate_accessibility_features(arguments["content_type"], arguments["accessibility_needs"])
    
    elif name == "track_learning_progress":
        return await track_learning_progress(arguments["user_id"], arguments["activity_data"])
    
    elif name == "get_progress_insights":
        return await get_progress_insights(arguments["user_id"], arguments.get("time_period", "week"))
    
    else:
        raise ValueError(f"Unknown tool: {name}")

# Diagnostic Assessment Functions

async def run_adhd_assessment(user_id: str, responses: Dict[str, Any]) -> Dict[str, Any]:
    """Run ADHD diagnostic assessment"""
    try:
        # Process responses and calculate scores
        attention_score = sum(responses.get("attention_questions", [])) / max(len(responses.get("attention_questions", [])), 1)
        hyperactivity_score = sum(responses.get("hyperactivity_questions", [])) / max(len(responses.get("hyperactivity_questions", [])), 1)
        impulsivity_score = sum(responses.get("impulsivity_questions", [])) / max(len(responses.get("impulsivity_questions", [])), 1)
        
        # Calculate overall confidence
        total_score = (attention_score + hyperactivity_score + impulsivity_score) / 3
        confidence = min(total_score / 5.0, 1.0)  # Normalize to 0-1
        
        # Generate recommendations
        indicators = []
        recommendations = []
        
        if attention_score >= 3.5:
            indicators.append("Significant attention difficulties")
            recommendations.append("Consider structured learning environments with minimal distractions")
        
        if hyperactivity_score >= 3.5:
            indicators.append("Hyperactivity patterns observed")
            recommendations.append("Incorporate movement breaks and kinesthetic learning activities")
        
        if impulsivity_score >= 3.5:
            indicators.append("Impulsivity challenges noted")
            recommendations.append("Use clear routines and visual cues for task completion")
        
        # Store result
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
        # Process dyslexia-specific metrics
        reading_speed = responses.get("reading_speed", 0)
        comprehension = responses.get("comprehension_score", 0)
        phonological = sum(responses.get("phonological_awareness", [])) / max(len(responses.get("phonological_awareness", [])), 1)
        spelling = responses.get("spelling_accuracy", 0)
        word_recognition = sum(responses.get("word_recognition", [])) / max(len(responses.get("word_recognition", [])), 1)
        
        # Calculate confidence based on multiple indicators
        indicators = []
        recommendations = []
        
        risk_factors = 0
        if reading_speed < 100:  # words per minute
            risk_factors += 1
            indicators.append("Below-average reading speed")
            recommendations.append("Use text-to-speech technology and extended time for reading tasks")
        
        if comprehension < 70:  # percentage
            risk_factors += 1
            indicators.append("Reading comprehension difficulties")
            recommendations.append("Provide graphic organizers and reading comprehension strategies")
        
        if phonological < 3.0:  # out of 5
            risk_factors += 1
            indicators.append("Phonological processing challenges")
            recommendations.append("Implement phonics-based reading interventions")
        
        if spelling < 70:  # percentage accuracy
            risk_factors += 1
            indicators.append("Spelling difficulties")
            recommendations.append("Use multisensory spelling approaches")
        
        if word_recognition < 3.0:  # out of 5
            risk_factors += 1
            indicators.append("Word recognition challenges")
            recommendations.append("Practice sight word recognition and decoding strategies")
        
        confidence = min(risk_factors / 5.0, 1.0)
        
        # Store result
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
        
        return [types.TextContent(
            type="text",
            text=json.dumps({
                "assessment_type": "dyslexia",
                "confidence_level": confidence,
                "indicators": indicators,
                "recommendations": recommendations,
                "accommodations": [
                    "Extended time for reading and writing tasks",
                    "Audio versions of texts",
                    "Dyslexia-friendly fonts and formatting",
                    "Spell-check and grammar assistance tools"
                ]
            }, indent=2)
        )]
        
    except Exception as e:
        logger.error(f"Error in dyslexia assessment: {e}")
        return [types.TextContent(type="text", text=f"Error running dyslexia assessment: {str(e)}")]

async def run_autism_assessment(user_id: str, responses: Dict[str, Any]) -> list[types.TextContent]:
    """Run autism spectrum diagnostic assessment"""
    try:
        # Process autism-specific indicators
        social_comm = sum(responses.get("social_communication", [])) / max(len(responses.get("social_communication", [])), 1)
        repetitive_behaviors = sum(responses.get("repetitive_behaviors", [])) / max(len(responses.get("repetitive_behaviors", [])), 1)
        sensory_processing = sum(responses.get("sensory_processing", [])) / max(len(responses.get("sensory_processing", [])), 1)
        
        indicators = []
        recommendations = []
        
        if social_comm >= 3.5:
            indicators.append("Social communication differences")
            recommendations.append("Provide clear, explicit instructions and social scripts")
        
        if repetitive_behaviors >= 3.5:
            indicators.append("Repetitive behavior patterns")
            recommendations.append("Incorporate special interests into learning activities")
        
        if sensory_processing >= 3.5:
            indicators.append("Sensory processing differences")
            recommendations.append("Create sensory-friendly learning environments")
        
        # Calculate confidence
        total_score = (social_comm + repetitive_behaviors + sensory_processing) / 3
        confidence = min(total_score / 5.0, 1.0)
        
        # Store result
        result = DiagnosticResult(
            user_id=user_id,
            assessment_type="autism",
            confidence_level=confidence,
            indicators=indicators,
            recommendations=recommendations,
            raw_data=responses,
            assessed_at=datetime.now()
        )
        
        if user_id not in diagnostic_results:
            diagnostic_results[user_id] = []
        diagnostic_results[user_id].append(result)
        
        return [types.TextContent(
            type="text",
            text=json.dumps({
                "assessment_type": "autism",
                "confidence_level": confidence,
                "indicators": indicators,
                "recommendations": recommendations,
                "supports": [
                    "Visual schedules and routines",
                    "Sensory breaks and accommodations",
                    "Clear expectations and structure",
                    "Opportunities to engage special interests"
                ]
            }, indent=2)
        )]
        
    except Exception as e:
        logger.error(f"Error in autism assessment: {e}")
        return [types.TextContent(type="text", text=f"Error running autism assessment: {str(e)}")]

# Learning Profile Functions

async def create_learning_profile(args: Dict[str, Any]) -> list[types.TextContent]:
    """Create or update a learning profile"""
    try:
        profile = LearningProfile(
            user_id=args["user_id"],
            learning_style=args["learning_style"],
            attention_span=args["attention_span"],
            processing_speed=args.get("processing_speed", "average"),
            sensory_preferences=args.get("sensory_preferences", {}),
            cognitive_load_preference=args.get("cognitive_load_preference", "medium"),
            accessibility_needs=args.get("accessibility_needs", []),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        learning_profiles[args["user_id"]] = profile
        
        return [types.TextContent(
            type="text",
            text=json.dumps({
                "status": "success",
                "message": "Learning profile created successfully",
                "profile": asdict(profile)
            }, default=str, indent=2)
        )]
        
    except Exception as e:
        logger.error(f"Error creating learning profile: {e}")
        return [types.TextContent(type="text", text=f"Error creating learning profile: {str(e)}")]

async def get_learning_profile(user_id: str) -> list[types.TextContent]:
    """Get learning profile for a user"""
    try:
        if user_id in learning_profiles:
            profile = learning_profiles[user_id]
            return [types.TextContent(
                type="text",
                text=json.dumps(asdict(profile), default=str, indent=2)
            )]
        else:
            return [types.TextContent(
                type="text",
                text=json.dumps({
                    "status": "not_found",
                    "message": f"No learning profile found for user {user_id}"
                })
            )]
            
    except Exception as e:
        logger.error(f"Error getting learning profile: {e}")
        return [types.TextContent(type="text", text=f"Error getting learning profile: {str(e)}")]

async def update_learning_profile(user_id: str, updates: Dict[str, Any]) -> list[types.TextContent]:
    """Update learning profile"""
    try:
        if user_id not in learning_profiles:
            return [types.TextContent(
                type="text",
                text=json.dumps({
                    "status": "not_found",
                    "message": f"No learning profile found for user {user_id}"
                })
            )]
        
        profile = learning_profiles[user_id]
        
        # Update fields
        for key, value in updates.items():
            if hasattr(profile, key):
                setattr(profile, key, value)
        
        profile.updated_at = datetime.now()
        learning_profiles[user_id] = profile
        
        return [types.TextContent(
            type="text",
            text=json.dumps({
                "status": "success",
                "message": "Learning profile updated successfully",
                "profile": asdict(profile)
            }, default=str, indent=2)
        )]
        
    except Exception as e:
        logger.error(f"Error updating learning profile: {e}")
        return [types.TextContent(type="text", text=f"Error updating learning profile: {str(e)}")]

# Content Adaptation Functions

async def adapt_content(content: str, user_id: str, adaptations: List[str] = None) -> list[types.TextContent]:
    """Adapt content for specific learning needs"""
    try:
        if adaptations is None:
            adaptations = []
            
        # Get user's learning profile
        profile = learning_profiles.get(user_id)
        
        adapted_content = content
        applied_adaptations = []
        
        if profile:
            # Apply adaptations based on learning profile
            if profile.learning_style == "visual" or "visual" in adaptations:
                adapted_content = f"[VISUAL ADAPTATION]\n{adapted_content}\n\n💡 Visual learners: Look for diagrams, charts, and visual representations"
                applied_adaptations.append("visual_enhancement")
            
            if profile.learning_style == "auditory" or "auditory" in adaptations:
                adapted_content = f"[AUDIO ADAPTATION]\n{adapted_content}\n\n🔊 Audio available: This content can be read aloud"
                applied_adaptations.append("audio_support")
            
            if "dyslexia" in profile.accessibility_needs or "dyslexia" in adaptations:
                # Simplify sentence structure and add spacing
                adapted_content = adapted_content.replace(". ", ".\n\n")
                adapted_content = f"[DYSLEXIA-FRIENDLY]\n{adapted_content}\n\n📖 Formatted for easier reading"
                applied_adaptations.append("dyslexia_friendly")
            
            if "adhd" in profile.accessibility_needs or "adhd" in adaptations:
                # Break into smaller chunks
                sentences = adapted_content.split(". ")
                chunked_content = "\n\n• ".join(sentences)
                adapted_content = f"[ADHD-FRIENDLY]\n• {chunked_content}\n\n⚡ Broken into manageable chunks"
                applied_adaptations.append("adhd_friendly")
        
        # Store adapted content
        content_id = f"{user_id}_{datetime.now().timestamp()}"
        adaptive_content[content_id] = AdaptiveContent(
            content_id=content_id,
            original_content=content,
            adapted_versions={"default": adapted_content},
            difficulty_level=5,  # Default difficulty
            estimated_time=len(content.split()) // 200 * 60,  # Rough estimate
            accessibility_features=applied_adaptations,
            created_at=datetime.now()
        )
        
        return [types.TextContent(
            type="text",
            text=json.dumps({
                "content_id": content_id,
                "adapted_content": adapted_content,
                "applied_adaptations": applied_adaptations,
                "original_length": len(content),
                "adapted_length": len(adapted_content)
            }, indent=2)
        )]
        
    except Exception as e:
        logger.error(f"Error adapting content: {e}")
        return [types.TextContent(type="text", text=f"Error adapting content: {str(e)}")]

async def generate_accessibility_features(content_type: str, accessibility_needs: List[str]) -> list[types.TextContent]:
    """Generate accessibility features for content"""
    try:
        features = []
        
        for need in accessibility_needs:
            if need == "dyslexia":
                features.extend([
                    "Dyslexia-friendly font (OpenDyslexic)",
                    "Increased line spacing",
                    "Text-to-speech capability",
                    "Highlighting while reading",
                    "Simplified sentence structure"
                ])
            elif need == "adhd":
                features.extend([
                    "Content chunking",
                    "Progress indicators",
                    "Distraction-free mode",
                    "Timer and break reminders",
                    "Visual focus aids"
                ])
            elif need == "autism":
                features.extend([
                    "Predictable layout",
                    "Sensory controls",
                    "Clear instructions",
                    "Visual schedules",
                    "Reduced sensory input options"
                ])
            elif need == "low_vision":
                features.extend([
                    "High contrast mode",
                    "Large text options",
                    "Screen reader compatibility",
                    "Keyboard navigation",
                    "Alternative text for images"
                ])
        
        return [types.TextContent(
            type="text",
            text=json.dumps({
                "content_type": content_type,
                "accessibility_needs": accessibility_needs,
                "recommended_features": list(set(features)),  # Remove duplicates
                "implementation_priority": "high" if len(accessibility_needs) > 2 else "medium"
            }, indent=2)
        )]
        
    except Exception as e:
        logger.error(f"Error generating accessibility features: {e}")
        return [types.TextContent(type="text", text=f"Error generating accessibility features: {str(e)}")]

# Progress Tracking Functions

async def track_learning_progress(user_id: str, activity_data: Dict[str, Any]) -> list[types.TextContent]:
    """Track learning progress"""
    try:
        # In a real implementation, this would store to a database
        progress_data = {
            "user_id": user_id,
            "timestamp": datetime.now().isoformat(),
            "activity": activity_data,
            "insights": []
        }
        
        # Generate insights based on activity data
        time_spent = activity_data.get("time_spent", 0)
        completion_rate = activity_data.get("completion_rate", 0)
        engagement_level = activity_data.get("engagement_level", 0)
        
        insights = []
        if time_spent > 45:
            insights.append("Extended focus time - consider breaking into shorter sessions")
        if completion_rate < 0.5:
            insights.append("Low completion rate - content may be too challenging")
        if engagement_level < 3:
            insights.append("Low engagement - try alternative presentation methods")
        
        progress_data["insights"] = insights
        
        return [types.TextContent(
            type="text",
            text=json.dumps(progress_data, indent=2)
        )]
        
    except Exception as e:
        logger.error(f"Error tracking progress: {e}")
        return [types.TextContent(type="text", text=f"Error tracking progress: {str(e)}")]

async def get_progress_insights(user_id: str, time_period: str) -> list[types.TextContent]:
    """Get progress insights and recommendations"""
    try:
        # Mock insights based on user profile and diagnostic results
        profile = learning_profiles.get(user_id)
        results = diagnostic_results.get(user_id, [])
        
        insights = {
            "user_id": user_id,
            "time_period": time_period,
            "learning_patterns": [],
            "recommendations": [],
            "strengths": [],
            "areas_for_improvement": []
        }
        
        if profile:
            insights["learning_patterns"].append(f"Preferred learning style: {profile.learning_style}")
            insights["learning_patterns"].append(f"Optimal attention span: {profile.attention_span} minutes")
            
            if profile.learning_style == "visual":
                insights["recommendations"].append("Continue using visual aids and diagrams")
                insights["strengths"].append("Strong visual processing")
            elif profile.learning_style == "auditory":
                insights["recommendations"].append("Incorporate more audio content and discussions")
                insights["strengths"].append("Strong auditory processing")
        
        if results:
            latest_result = results[-1]
            if latest_result.confidence_level > 0.7:
                insights["recommendations"].extend(latest_result.recommendations)
                insights["areas_for_improvement"].extend(latest_result.indicators)
        
        return [types.TextContent(
            type="text",
            text=json.dumps(insights, indent=2)
        )]
        
    except Exception as e:
        logger.error(f"Error getting progress insights: {e}")
        return [types.TextContent(type="text", text=f"Error getting progress insights: {str(e)}")]

async def main():
    """Main server function"""
    # Import here to avoid circular imports
    from mcp.server.stdio import stdio_server
    
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="dawn-ai-study",
                server_version="1.0.0",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                ),
            ),
        )

if __name__ == "__main__":
    asyncio.run(main()) 