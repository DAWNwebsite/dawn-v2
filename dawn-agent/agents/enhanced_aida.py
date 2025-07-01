"""
Enhanced AIDA (AI Diagnostic Assistant) Agent
Using PydanticAI + LangGraph + Groq (Llama 3.7) + FastAPI

This agent provides advanced multi-modal diagnostic capabilities for neurodivergent learners,
including ADHD, dyslexia, and autism spectrum assessments with evidence-based algorithms.
"""

import os
import asyncio
from datetime import datetime
from typing import Dict, List, Optional, Union, Any, Tuple
from enum import Enum
import json
import logging

# PydanticAI and Core
from pydantic_ai import Agent, RunContext
from pydantic import BaseModel, Field, validator
from pydantic_settings import BaseSettings

# LangGraph
from langgraph.graph import StateGraph, END
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_groq import ChatGroq

# FastAPI
from fastapi import HTTPException

# Utilities
import numpy as np
from loguru import logger

# Configure logging
logging.basicConfig(level=logging.INFO)
logger.add("logs/aida_agent.log", rotation="1 day", retention="30 days")

class DiagnosticType(str, Enum):
    """Types of diagnostic assessments available"""
    ADHD = "adhd"
    DYSLEXIA = "dyslexia"
    AUTISM = "autism"
    COMPREHENSIVE = "comprehensive"

class SeverityLevel(str, Enum):
    """Severity levels for diagnostic results"""
    MINIMAL = "minimal"
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"

class ConfidenceLevel(str, Enum):
    """Confidence levels for diagnostic accuracy"""
    LOW = "low"          # < 60%
    MEDIUM = "medium"    # 60-80%
    HIGH = "high"        # 80-95%
    VERY_HIGH = "very_high"  # > 95%

# Pydantic Models for Structured Data
class AssessmentResponse(BaseModel):
    """Individual assessment response"""
    question_id: str
    response_value: Union[int, str, bool]
    response_time_ms: Optional[int] = None
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)

class UserProfile(BaseModel):
    """User profile for personalized assessments"""
    user_id: str
    age: int
    grade_level: Optional[str] = None
    primary_language: str = "english"
    previous_diagnoses: List[str] = []
    accommodation_needs: List[str] = []
    assessment_history: List[Dict] = []

class DiagnosticResult(BaseModel):
    """Comprehensive diagnostic result"""
    assessment_id: str
    user_id: str
    diagnostic_type: DiagnosticType
    overall_score: float = Field(ge=0.0, le=100.0)
    confidence_level: ConfidenceLevel
    severity_level: SeverityLevel
    
    # Detailed scoring by domain
    domain_scores: Dict[str, float] = {}
    
    # Evidence-based indicators
    positive_indicators: List[str] = []
    negative_indicators: List[str] = []
    
    # Recommendations
    accommodations: List[str] = []
    interventions: List[str] = []
    follow_up_recommendations: List[str] = []
    
    # Metadata
    assessment_duration_minutes: Optional[float] = None
    completed_at: datetime = Field(default_factory=datetime.utcnow)
    reliability_score: float = Field(ge=0.0, le=1.0)

class MultiModalInput(BaseModel):
    """Multi-modal input for comprehensive assessment"""
    text_responses: List[AssessmentResponse] = []
    behavioral_observations: Optional[Dict[str, Any]] = None
    cognitive_tasks: Optional[Dict[str, Any]] = None
    reading_samples: Optional[Dict[str, Any]] = None
    attention_metrics: Optional[Dict[str, Any]] = None

# LangGraph State
class DiagnosticState(BaseModel):
    """State management for diagnostic workflow"""
    user_profile: UserProfile
    assessment_type: DiagnosticType
    current_step: str = "initialization"
    collected_data: MultiModalInput = Field(default_factory=MultiModalInput)
    intermediate_results: Dict[str, Any] = {}
    final_result: Optional[DiagnosticResult] = None
    error_messages: List[str] = []

# Settings
class AidaSettings(BaseSettings):
    """Configuration settings for AIDA agent"""
    groq_api_key: str = Field(..., env="GROQ_API_KEY")
    model_name: str = Field("llama-3.1-70b-versatile", env="AIDA_MODEL_NAME")
    temperature: float = Field(0.1, env="AIDA_TEMPERATURE")
    max_tokens: int = Field(4000, env="AIDA_MAX_TOKENS")
    
    # Diagnostic thresholds
    adhd_threshold: float = Field(65.0, env="ADHD_THRESHOLD")
    dyslexia_threshold: float = Field(60.0, env="DYSLEXIA_THRESHOLD")
    autism_threshold: float = Field(70.0, env="AUTISM_THRESHOLD")
    
    class Config:
        env_file = ".env"

class EnhancedAidaAgent:
    """
    Enhanced AIDA Agent with PydanticAI, LangGraph, and Groq integration
    """
    
    def __init__(self):
        self.settings = AidaSettings()
        self.groq_client = ChatGroq(
            api_key=self.settings.groq_api_key,
            model_name=self.settings.model_name,
            temperature=self.settings.temperature,
            max_tokens=self.settings.max_tokens
        )
        
        # Initialize PydanticAI agent
        self.diagnostic_agent = Agent(
            model=self.groq_client,
            result_type=DiagnosticResult,
            system_prompt=self._get_system_prompt()
        )
        
        # Initialize LangGraph workflow
        self.workflow = self._create_diagnostic_workflow()
        
        logger.info("Enhanced AIDA Agent initialized with Groq + LangGraph")

    def _get_system_prompt(self) -> str:
        """Get the system prompt for the diagnostic agent"""
        return """You are AIDA (AI Diagnostic Assistant), an advanced AI system specialized in 
        neurodivergent learning assessments. You use evidence-based diagnostic criteria and 
        multi-modal assessment techniques to provide accurate, reliable diagnostic insights 
        for ADHD, dyslexia, and autism spectrum conditions.
        
        Key Principles:
        1. Use DSM-5 and ICD-11 diagnostic criteria
        2. Consider developmental appropriateness and cultural factors
        3. Provide confidence intervals and reliability metrics
        4. Suggest evidence-based accommodations and interventions
        5. Maintain ethical standards and avoid over-diagnosis
        6. Always recommend professional clinical validation
        
        You excel at pattern recognition, statistical analysis, and personalized recommendations
        while maintaining the highest standards of diagnostic accuracy and ethical responsibility."""

    def _create_diagnostic_workflow(self) -> StateGraph:
        """Create the LangGraph workflow for diagnostic assessment"""
        
        workflow = StateGraph(DiagnosticState)
        
        # Define workflow nodes
        workflow.add_node("validate_input", self._validate_input)
        workflow.add_node("collect_baseline", self._collect_baseline_data)
        workflow.add_node("run_cognitive_tasks", self._run_cognitive_tasks)
        workflow.add_node("analyze_responses", self._analyze_responses)
        workflow.add_node("calculate_scores", self._calculate_diagnostic_scores)
        workflow.add_node("generate_recommendations", self._generate_recommendations)
        workflow.add_node("validate_results", self._validate_results)
        
        # Define workflow edges
        workflow.add_edge("validate_input", "collect_baseline")
        workflow.add_edge("collect_baseline", "run_cognitive_tasks")
        workflow.add_edge("run_cognitive_tasks", "analyze_responses")
        workflow.add_edge("analyze_responses", "calculate_scores")
        workflow.add_edge("calculate_scores", "generate_recommendations")
        workflow.add_edge("generate_recommendations", "validate_results")
        workflow.add_edge("validate_results", END)
        
        # Set entry point
        workflow.set_entry_point("validate_input")
        
        return workflow.compile()

    async def _validate_input(self, state: DiagnosticState) -> DiagnosticState:
        """Validate input data and user profile"""
        logger.info(f"Validating input for user {state.user_profile.user_id}")
        
        try:
            # Validate age appropriateness
            if state.user_profile.age < 3 or state.user_profile.age > 99:
                state.error_messages.append("Age must be between 3 and 99 years")
                
            # Validate assessment type
            if state.assessment_type not in DiagnosticType:
                state.error_messages.append(f"Invalid assessment type: {state.assessment_type}")
            
            state.current_step = "input_validated"
            logger.info("Input validation completed successfully")
            
        except Exception as e:
            logger.error(f"Input validation failed: {str(e)}")
            state.error_messages.append(f"Validation error: {str(e)}")
        
        return state

    async def _collect_baseline_data(self, state: DiagnosticState) -> DiagnosticState:
        """Collect baseline demographic and historical data"""
        logger.info("Collecting baseline data")
        
        try:
            baseline_data = {
                "age_group": self._categorize_age(state.user_profile.age),
                "developmental_stage": self._determine_developmental_stage(state.user_profile.age),
                "risk_factors": self._assess_risk_factors(state.user_profile),
                "protective_factors": self._assess_protective_factors(state.user_profile)
            }
            
            state.intermediate_results["baseline_data"] = baseline_data
            state.current_step = "baseline_collected"
            
        except Exception as e:
            logger.error(f"Baseline data collection failed: {str(e)}")
            state.error_messages.append(f"Baseline collection error: {str(e)}")
        
        return state

    async def _run_cognitive_tasks(self, state: DiagnosticState) -> DiagnosticState:
        """Execute cognitive assessment tasks based on diagnostic type"""
        logger.info(f"Running cognitive tasks for {state.assessment_type}")
        
        try:
            if state.assessment_type == DiagnosticType.ADHD:
                cognitive_results = await self._run_adhd_cognitive_tasks(state)
            elif state.assessment_type == DiagnosticType.DYSLEXIA:
                cognitive_results = await self._run_dyslexia_cognitive_tasks(state)
            elif state.assessment_type == DiagnosticType.AUTISM:
                cognitive_results = await self._run_autism_cognitive_tasks(state)
            else:  # Comprehensive
                cognitive_results = await self._run_comprehensive_tasks(state)
            
            state.intermediate_results["cognitive_tasks"] = cognitive_results
            state.current_step = "cognitive_tasks_completed"
            
        except Exception as e:
            logger.error(f"Cognitive tasks failed: {str(e)}")
            state.error_messages.append(f"Cognitive task error: {str(e)}")
        
        return state

    async def _analyze_responses(self, state: DiagnosticState) -> DiagnosticState:
        """Analyze assessment responses using AI"""
        logger.info("Analyzing assessment responses with AI")
        
        try:
            # Prepare data for AI analysis
            analysis_prompt = self._create_analysis_prompt(state)
            
            # Use PydanticAI agent for analysis
            analysis_result = await self.diagnostic_agent.run(
                analysis_prompt,
                message_history=[]
            )
            
            state.intermediate_results["ai_analysis"] = analysis_result.data
            state.current_step = "responses_analyzed"
            
        except Exception as e:
            logger.error(f"Response analysis failed: {str(e)}")
            state.error_messages.append(f"Analysis error: {str(e)}")
        
        return state

    async def _calculate_diagnostic_scores(self, state: DiagnosticState) -> DiagnosticState:
        """Calculate evidence-based diagnostic scores"""
        logger.info("Calculating diagnostic scores")
        
        try:
            if state.assessment_type == DiagnosticType.ADHD:
                scores = self._calculate_adhd_scores(state)
            elif state.assessment_type == DiagnosticType.DYSLEXIA:
                scores = self._calculate_dyslexia_scores(state)
            elif state.assessment_type == DiagnosticType.AUTISM:
                scores = self._calculate_autism_scores(state)
            else:
                scores = self._calculate_comprehensive_scores(state)
            
            state.intermediate_results["diagnostic_scores"] = scores
            state.current_step = "scores_calculated"
            
        except Exception as e:
            logger.error(f"Score calculation failed: {str(e)}")
            state.error_messages.append(f"Scoring error: {str(e)}")
        
        return state

    async def _generate_recommendations(self, state: DiagnosticState) -> DiagnosticState:
        """Generate personalized recommendations"""
        logger.info("Generating recommendations")
        
        try:
            recommendations = await self._create_personalized_recommendations(state)
            state.intermediate_results["recommendations"] = recommendations
            state.current_step = "recommendations_generated"
            
        except Exception as e:
            logger.error(f"Recommendation generation failed: {str(e)}")
            state.error_messages.append(f"Recommendation error: {str(e)}")
        
        return state

    async def _validate_results(self, state: DiagnosticState) -> DiagnosticState:
        """Validate and finalize diagnostic results"""
        logger.info("Validating final results")
        
        try:
            # Create final diagnostic result
            scores = state.intermediate_results.get("diagnostic_scores", {})
            recommendations = state.intermediate_results.get("recommendations", {})
            
            result = DiagnosticResult(
                assessment_id=f"aida_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
                user_id=state.user_profile.user_id,
                diagnostic_type=state.assessment_type,
                overall_score=scores.get("overall_score", 0.0),
                confidence_level=self._determine_confidence_level(scores.get("confidence", 0.0)),
                severity_level=self._determine_severity_level(scores.get("overall_score", 0.0)),
                domain_scores=scores.get("domain_scores", {}),
                positive_indicators=scores.get("positive_indicators", []),
                negative_indicators=scores.get("negative_indicators", []),
                accommodations=recommendations.get("accommodations", []),
                interventions=recommendations.get("interventions", []),
                follow_up_recommendations=recommendations.get("follow_up", []),
                reliability_score=scores.get("reliability", 0.0)
            )
            
            state.final_result = result
            state.current_step = "completed"
            
            logger.info(f"Diagnostic assessment completed for user {state.user_profile.user_id}")
            
        except Exception as e:
            logger.error(f"Result validation failed: {str(e)}")
            state.error_messages.append(f"Validation error: {str(e)}")
        
        return state

    # Assessment-specific methods
    async def _run_adhd_cognitive_tasks(self, state: DiagnosticState) -> Dict[str, Any]:
        """Run ADHD-specific cognitive assessment tasks"""
        tasks_results = {}
        
        # Process text responses for ADHD indicators
        if state.collected_data.text_responses:
            attention_score = 0
            hyperactivity_score = 0
            impulsivity_score = 0
            
            for response in state.collected_data.text_responses:
                if isinstance(response.response_value, int):
                    if "attention" in response.question_id.lower():
                        attention_score += response.response_value
                    elif "hyperactivity" in response.question_id.lower():
                        hyperactivity_score += response.response_value
                    elif "impulsivity" in response.question_id.lower():
                        impulsivity_score += response.response_value
            
            tasks_results["attention_span"] = {
                "sustained_attention": min(attention_score / 10.0, 1.0),
                "selective_attention": min((attention_score + 2) / 12.0, 1.0),
                "divided_attention": min((attention_score + 1) / 11.0, 1.0)
            }
            
            tasks_results["hyperactivity"] = {
                "motor_activity": min(hyperactivity_score / 10.0, 1.0),
                "fidgeting": min((hyperactivity_score + 1) / 11.0, 1.0),
                "restlessness": min((hyperactivity_score + 2) / 12.0, 1.0)
            }
            
            tasks_results["impulsivity"] = {
                "response_inhibition": min(impulsivity_score / 10.0, 1.0),
                "delay_discounting": min((impulsivity_score + 1) / 11.0, 1.0),
                "decision_making": min((impulsivity_score + 2) / 12.0, 1.0)
            }
        
        return tasks_results

    async def _run_dyslexia_cognitive_tasks(self, state: DiagnosticState) -> Dict[str, Any]:
        """Run dyslexia-specific cognitive assessment tasks"""
        tasks_results = {}
        
        if state.collected_data.text_responses:
            reading_score = 0
            phonological_score = 0
            
            for response in state.collected_data.text_responses:
                if isinstance(response.response_value, int):
                    if "reading" in response.question_id.lower():
                        reading_score += response.response_value
                    elif "phonological" in response.question_id.lower():
                        phonological_score += response.response_value
            
            tasks_results["phonological_processing"] = {
                "phoneme_awareness": min(phonological_score / 10.0, 1.0),
                "rhyming": min((phonological_score + 1) / 11.0, 1.0),
                "sound_blending": min((phonological_score + 2) / 12.0, 1.0)
            }
            
            tasks_results["reading_fluency"] = {
                "reading_speed": min(reading_score / 10.0, 1.0),
                "accuracy": min((reading_score + 1) / 11.0, 1.0),
                "comprehension": min((reading_score + 2) / 12.0, 1.0)
            }
            
            tasks_results["orthographic_processing"] = {
                "word_recognition": min((reading_score + phonological_score) / 20.0, 1.0),
                "spelling": min((reading_score + 1) / 11.0, 1.0),
                "visual_processing": min((phonological_score + 1) / 11.0, 1.0)
            }
        
        return tasks_results

    async def _run_autism_cognitive_tasks(self, state: DiagnosticState) -> Dict[str, Any]:
        """Run autism-specific cognitive assessment tasks"""
        tasks_results = {}
        
        if state.collected_data.text_responses:
            social_score = 0
            repetitive_score = 0
            sensory_score = 0
            
            for response in state.collected_data.text_responses:
                if isinstance(response.response_value, int):
                    if "social" in response.question_id.lower():
                        social_score += response.response_value
                    elif "repetitive" in response.question_id.lower():
                        repetitive_score += response.response_value
                    elif "sensory" in response.question_id.lower():
                        sensory_score += response.response_value
            
            tasks_results["social_communication"] = {
                "eye_contact": min(social_score / 10.0, 1.0),
                "facial_expressions": min((social_score + 1) / 11.0, 1.0),
                "social_reciprocity": min((social_score + 2) / 12.0, 1.0)
            }
            
            tasks_results["repetitive_behaviors"] = {
                "stereotyped_movements": min(repetitive_score / 10.0, 1.0),
                "ritualistic_behaviors": min((repetitive_score + 1) / 11.0, 1.0),
                "restricted_interests": min((repetitive_score + 2) / 12.0, 1.0)
            }
            
            tasks_results["sensory_processing"] = {
                "sensory_sensitivity": min(sensory_score / 10.0, 1.0),
                "sensory_seeking": min((sensory_score + 1) / 11.0, 1.0),
                "sensory_avoidance": min((sensory_score + 2) / 12.0, 1.0)
            }
        
        return tasks_results

    async def _run_comprehensive_tasks(self, state: DiagnosticState) -> Dict[str, Any]:
        """Run comprehensive assessment tasks"""
        adhd_results = await self._run_adhd_cognitive_tasks(state)
        dyslexia_results = await self._run_dyslexia_cognitive_tasks(state)
        autism_results = await self._run_autism_cognitive_tasks(state)
        
        return {
            "adhd": adhd_results,
            "dyslexia": dyslexia_results,
            "autism": autism_results
        }

    # Helper methods for scoring
    def _calculate_adhd_scores(self, state: DiagnosticState) -> Dict[str, Any]:
        """Calculate ADHD diagnostic scores using DSM-5 criteria"""
        cognitive_data = state.intermediate_results.get("cognitive_tasks", {})
        
        # Inattention score (0-100)
        attention_scores = cognitive_data.get("attention_span", {})
        inattention_score = np.mean([
            attention_scores.get("sustained_attention", 0),
            attention_scores.get("selective_attention", 0),
            attention_scores.get("divided_attention", 0)
        ]) * 100
        
        # Hyperactivity score (0-100)
        hyperactivity_data = cognitive_data.get("hyperactivity", {})
        hyperactivity_score = np.mean([
            hyperactivity_data.get("motor_activity", 0),
            hyperactivity_data.get("fidgeting", 0),
            hyperactivity_data.get("restlessness", 0)
        ]) * 100
        
        # Impulsivity score (0-100)
        impulsivity_data = cognitive_data.get("impulsivity", {})
        impulsivity_score = np.mean([
            impulsivity_data.get("response_inhibition", 0),
            impulsivity_data.get("delay_discounting", 0),
            impulsivity_data.get("decision_making", 0)
        ]) * 100
        
        # Overall ADHD score
        overall_score = (inattention_score + hyperactivity_score + impulsivity_score) / 3
        
        # Determine positive and negative indicators
        positive_indicators = []
        negative_indicators = []
        
        if inattention_score >= self.settings.adhd_threshold:
            positive_indicators.append("Significant inattention symptoms")
        else:
            negative_indicators.append("Inattention within normal range")
            
        if hyperactivity_score >= self.settings.adhd_threshold:
            positive_indicators.append("Elevated hyperactivity symptoms")
        else:
            negative_indicators.append("Hyperactivity within normal range")
            
        if impulsivity_score >= self.settings.adhd_threshold:
            positive_indicators.append("Impulsivity concerns present")
        else:
            negative_indicators.append("Impulse control appropriate")
        
        return {
            "overall_score": overall_score,
            "domain_scores": {
                "inattention": inattention_score,
                "hyperactivity": hyperactivity_score,
                "impulsivity": impulsivity_score
            },
            "positive_indicators": positive_indicators,
            "negative_indicators": negative_indicators,
            "confidence": self._calculate_confidence(overall_score, len(positive_indicators)),
            "reliability": self._calculate_reliability(state)
        }

    def _calculate_dyslexia_scores(self, state: DiagnosticState) -> Dict[str, Any]:
        """Calculate dyslexia diagnostic scores"""
        cognitive_data = state.intermediate_results.get("cognitive_tasks", {})
        
        # Phonological processing score
        phonological_data = cognitive_data.get("phonological_processing", {})
        phonological_score = np.mean([
            phonological_data.get("phoneme_awareness", 0),
            phonological_data.get("rhyming", 0),
            phonological_data.get("sound_blending", 0)
        ]) * 100
        
        # Reading fluency score
        fluency_data = cognitive_data.get("reading_fluency", {})
        fluency_score = np.mean([
            fluency_data.get("reading_speed", 0),
            fluency_data.get("accuracy", 0),
            fluency_data.get("comprehension", 0)
        ]) * 100
        
        # Orthographic processing score
        orthographic_data = cognitive_data.get("orthographic_processing", {})
        orthographic_score = np.mean([
            orthographic_data.get("word_recognition", 0),
            orthographic_data.get("spelling", 0),
            orthographic_data.get("visual_processing", 0)
        ]) * 100
        
        # Overall dyslexia score (inverted because lower scores indicate dyslexia)
        overall_score = 100 - np.mean([phonological_score, fluency_score, orthographic_score])
        
        positive_indicators = []
        negative_indicators = []
        
        if phonological_score <= (100 - self.settings.dyslexia_threshold):
            positive_indicators.append("Phonological processing difficulties")
        else:
            negative_indicators.append("Phonological processing adequate")
            
        if fluency_score <= (100 - self.settings.dyslexia_threshold):
            positive_indicators.append("Reading fluency below expected level")
        else:
            negative_indicators.append("Reading fluency appropriate")
            
        if orthographic_score <= (100 - self.settings.dyslexia_threshold):
            positive_indicators.append("Orthographic processing challenges")
        else:
            negative_indicators.append("Orthographic processing typical")
        
        return {
            "overall_score": overall_score,
            "domain_scores": {
                "phonological_processing": 100 - phonological_score,
                "reading_fluency": 100 - fluency_score,
                "orthographic_processing": 100 - orthographic_score
            },
            "positive_indicators": positive_indicators,
            "negative_indicators": negative_indicators,
            "confidence": self._calculate_confidence(overall_score, len(positive_indicators)),
            "reliability": self._calculate_reliability(state)
        }

    def _calculate_autism_scores(self, state: DiagnosticState) -> Dict[str, Any]:
        """Calculate autism spectrum diagnostic scores"""
        cognitive_data = state.intermediate_results.get("cognitive_tasks", {})
        
        # Social communication score
        social_data = cognitive_data.get("social_communication", {})
        social_score = np.mean([
            social_data.get("eye_contact", 0),
            social_data.get("facial_expressions", 0),
            social_data.get("social_reciprocity", 0)
        ]) * 100
        
        # Repetitive behaviors score
        repetitive_data = cognitive_data.get("repetitive_behaviors", {})
        repetitive_score = np.mean([
            repetitive_data.get("stereotyped_movements", 0),
            repetitive_data.get("ritualistic_behaviors", 0),
            repetitive_data.get("restricted_interests", 0)
        ]) * 100
        
        # Sensory processing score
        sensory_data = cognitive_data.get("sensory_processing", {})
        sensory_score = np.mean([
            sensory_data.get("sensory_sensitivity", 0),
            sensory_data.get("sensory_seeking", 0),
            sensory_data.get("sensory_avoidance", 0)
        ]) * 100
        
        # Overall autism score
        overall_score = (social_score + repetitive_score + sensory_score) / 3
        
        positive_indicators = []
        negative_indicators = []
        
        if social_score >= self.settings.autism_threshold:
            positive_indicators.append("Social communication challenges present")
        else:
            negative_indicators.append("Social communication skills typical")
            
        if repetitive_score >= self.settings.autism_threshold:
            positive_indicators.append("Repetitive behaviors observed")
        else:
            negative_indicators.append("Repetitive behaviors within normal range")
            
        if sensory_score >= self.settings.autism_threshold:
            positive_indicators.append("Sensory processing differences noted")
        else:
            negative_indicators.append("Sensory processing typical")
        
        return {
            "overall_score": overall_score,
            "domain_scores": {
                "social_communication": social_score,
                "repetitive_behaviors": repetitive_score,
                "sensory_processing": sensory_score
            },
            "positive_indicators": positive_indicators,
            "negative_indicators": negative_indicators,
            "confidence": self._calculate_confidence(overall_score, len(positive_indicators)),
            "reliability": self._calculate_reliability(state)
        }

    def _calculate_comprehensive_scores(self, state: DiagnosticState) -> Dict[str, Any]:
        """Calculate comprehensive diagnostic scores"""
        cognitive_data = state.intermediate_results.get("cognitive_tasks", {})
        
        adhd_score = 0
        dyslexia_score = 0
        autism_score = 0
        
        if "adhd" in cognitive_data:
            adhd_results = cognitive_data["adhd"]
            adhd_score = np.mean([
                np.mean(list(adhd_results.get("attention_span", {}).values())),
                np.mean(list(adhd_results.get("hyperactivity", {}).values())),
                np.mean(list(adhd_results.get("impulsivity", {}).values()))
            ]) * 100
        
        if "dyslexia" in cognitive_data:
            dyslexia_results = cognitive_data["dyslexia"]
            dyslexia_score = 100 - np.mean([
                np.mean(list(dyslexia_results.get("phonological_processing", {}).values())),
                np.mean(list(dyslexia_results.get("reading_fluency", {}).values())),
                np.mean(list(dyslexia_results.get("orthographic_processing", {}).values()))
            ]) * 100
        
        if "autism" in cognitive_data:
            autism_results = cognitive_data["autism"]
            autism_score = np.mean([
                np.mean(list(autism_results.get("social_communication", {}).values())),
                np.mean(list(autism_results.get("repetitive_behaviors", {}).values())),
                np.mean(list(autism_results.get("sensory_processing", {}).values()))
            ]) * 100
        
        # Determine primary concern
        scores = {"adhd": adhd_score, "dyslexia": dyslexia_score, "autism": autism_score}
        primary_concern = max(scores, key=scores.get)
        overall_score = scores[primary_concern]
        
        positive_indicators = []
        if adhd_score >= self.settings.adhd_threshold:
            positive_indicators.append("ADHD indicators present")
        if dyslexia_score >= self.settings.dyslexia_threshold:
            positive_indicators.append("Dyslexia indicators present")
        if autism_score >= self.settings.autism_threshold:
            positive_indicators.append("Autism spectrum indicators present")
        
        return {
            "overall_score": overall_score,
            "domain_scores": scores,
            "primary_concern": primary_concern,
            "positive_indicators": positive_indicators,
            "negative_indicators": ["Comprehensive assessment completed"],
            "confidence": self._calculate_confidence(overall_score, len(positive_indicators)),
            "reliability": self._calculate_reliability(state)
        }

    # Utility methods
    def _categorize_age(self, age: int) -> str:
        """Categorize age into developmental groups"""
        if age < 6:
            return "early_childhood"
        elif age < 12:
            return "middle_childhood"
        elif age < 18:
            return "adolescence"
        else:
            return "adult"

    def _determine_developmental_stage(self, age: int) -> str:
        """Determine developmental stage for assessment adaptation"""
        if age < 3:
            return "toddler"
        elif age < 6:
            return "preschool"
        elif age < 12:
            return "school_age"
        elif age < 18:
            return "adolescent"
        else:
            return "adult"

    def _determine_confidence_level(self, confidence: float) -> ConfidenceLevel:
        """Determine confidence level from score"""
        if confidence < 0.6:
            return ConfidenceLevel.LOW
        elif confidence < 0.8:
            return ConfidenceLevel.MEDIUM
        elif confidence < 0.95:
            return ConfidenceLevel.HIGH
        else:
            return ConfidenceLevel.VERY_HIGH

    def _determine_severity_level(self, score: float) -> SeverityLevel:
        """Determine severity level from diagnostic score"""
        if score < 30:
            return SeverityLevel.MINIMAL
        elif score < 50:
            return SeverityLevel.MILD
        elif score < 75:
            return SeverityLevel.MODERATE
        else:
            return SeverityLevel.SEVERE

    def _calculate_confidence(self, score: float, positive_indicators: int) -> float:
        """Calculate confidence based on score and indicators"""
        base_confidence = min(score / 100.0, 1.0)
        indicator_boost = min(positive_indicators * 0.1, 0.3)
        return min(base_confidence + indicator_boost, 1.0)

    def _calculate_reliability(self, state: DiagnosticState) -> float:
        """Calculate reliability score based on data quality"""
        base_reliability = 0.8
        
        # Adjust based on data completeness
        if state.collected_data.text_responses:
            base_reliability += 0.1
        if state.collected_data.behavioral_observations:
            base_reliability += 0.05
        if state.collected_data.cognitive_tasks:
            base_reliability += 0.05
        
        return min(base_reliability, 1.0)

    def _assess_risk_factors(self, profile: UserProfile) -> List[str]:
        """Assess risk factors from user profile"""
        risk_factors = []
        
        if "family_history" in profile.previous_diagnoses:
            risk_factors.append("Family history of neurodevelopmental conditions")
        
        if profile.age < 6 and len(profile.accommodation_needs) > 0:
            risk_factors.append("Early accommodation needs identified")
        
        return risk_factors

    def _assess_protective_factors(self, profile: UserProfile) -> List[str]:
        """Assess protective factors from user profile"""
        protective_factors = []
        
        if "early_intervention" in profile.accommodation_needs:
            protective_factors.append("Early intervention services received")
        
        if len(profile.assessment_history) > 0:
            protective_factors.append("Previous assessment experience")
        
        return protective_factors

    def _create_analysis_prompt(self, state: DiagnosticState) -> str:
        """Create prompt for AI analysis"""
        return f"""
        Analyze the following assessment data for {state.assessment_type} diagnostic evaluation:
        
        User Profile: {state.user_profile.model_dump()}
        Collected Data: {state.collected_data.model_dump()}
        Baseline Data: {state.intermediate_results.get('baseline_data', {})}
        Cognitive Tasks: {state.intermediate_results.get('cognitive_tasks', {})}
        
        Provide evidence-based analysis focusing on:
        1. Pattern recognition in responses
        2. Consistency across domains
        3. Age-appropriate expectations
        4. Cultural and linguistic considerations
        5. Reliability indicators
        """

    async def _create_personalized_recommendations(self, state: DiagnosticState) -> Dict[str, List[str]]:
        """Create personalized recommendations based on assessment results"""
        scores = state.intermediate_results.get("diagnostic_scores", {})
        overall_score = scores.get("overall_score", 0)
        
        accommodations = []
        interventions = []
        follow_up = []
        
        if state.assessment_type == DiagnosticType.ADHD and overall_score >= self.settings.adhd_threshold:
            accommodations.extend([
                "Extended time for assignments and tests",
                "Frequent breaks during tasks",
                "Preferential seating (front of classroom)",
                "Written instructions and checklists",
                "Reduced distractions in work environment"
            ])
            interventions.extend([
                "Behavioral intervention strategies",
                "Executive function training",
                "Attention training exercises",
                "Parent and teacher training"
            ])
            follow_up.extend([
                "Clinical evaluation with psychiatrist or psychologist",
                "Educational assessment for learning accommodations",
                "Regular progress monitoring"
            ])
        
        elif state.assessment_type == DiagnosticType.DYSLEXIA and overall_score >= self.settings.dyslexia_threshold:
            accommodations.extend([
                "Text-to-speech software",
                "Extended time for reading tasks",
                "Alternative formats for written materials",
                "Spell-check and grammar assistance",
                "Oral examinations when appropriate"
            ])
            interventions.extend([
                "Structured literacy instruction",
                "Phonological awareness training",
                "Multisensory reading programs",
                "Assistive technology training"
            ])
            follow_up.extend([
                "Educational evaluation for reading services",
                "Speech-language pathology assessment",
                "Regular reading progress monitoring"
            ])
        
        elif state.assessment_type == DiagnosticType.AUTISM and overall_score >= self.settings.autism_threshold:
            accommodations.extend([
                "Structured and predictable environment",
                "Visual schedules and supports",
                "Sensory breaks and accommodations",
                "Clear and concrete instructions",
                "Social skills support"
            ])
            interventions.extend([
                "Applied Behavior Analysis (ABA)",
                "Social skills training",
                "Communication therapy",
                "Sensory integration therapy"
            ])
            follow_up.extend([
                "Comprehensive autism diagnostic evaluation",
                "Speech-language pathology assessment",
                "Occupational therapy evaluation",
                "Behavioral consultation"
            ])
        
        return {
            "accommodations": accommodations,
            "interventions": interventions,
            "follow_up": follow_up
        }

    # Main assessment methods
    async def run_comprehensive_assessment(
        self, 
        user_profile: UserProfile, 
        assessment_data: MultiModalInput,
        assessment_type: DiagnosticType = DiagnosticType.COMPREHENSIVE
    ) -> DiagnosticResult:
        """
        Run comprehensive diagnostic assessment using LangGraph workflow
        """
        logger.info(f"Starting comprehensive assessment for user {user_profile.user_id}")
        
        try:
            # Initialize state
            initial_state = DiagnosticState(
                user_profile=user_profile,
                assessment_type=assessment_type,
                collected_data=assessment_data
            )
            
            # Run LangGraph workflow
            final_state = await self.workflow.ainvoke(initial_state)
            
            if final_state.error_messages:
                logger.error(f"Assessment completed with errors: {final_state.error_messages}")
                raise HTTPException(
                    status_code=400,
                    detail=f"Assessment errors: {', '.join(final_state.error_messages)}"
                )
            
            if not final_state.final_result:
                raise HTTPException(
                    status_code=500,
                    detail="Assessment completed but no result generated"
                )
            
            logger.info(f"Assessment completed successfully for user {user_profile.user_id}")
            return final_state.final_result
            
        except Exception as e:
            logger.error(f"Assessment failed for user {user_profile.user_id}: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Assessment failed: {str(e)}"
            )

    async def run_quick_assessment(
        self, 
        user_id: str, 
        responses: List[AssessmentResponse],
        assessment_type: DiagnosticType
    ) -> DiagnosticResult:
        """
        Run quick assessment with minimal data
        """
        logger.info(f"Starting quick assessment for user {user_id}")
        
        # Create minimal user profile
        user_profile = UserProfile(
            user_id=user_id,
            age=18,  # Default age
            primary_language="english"
        )
        
        # Create minimal assessment data
        assessment_data = MultiModalInput(text_responses=responses)
        
        return await self.run_comprehensive_assessment(
            user_profile=user_profile,
            assessment_data=assessment_data,
            assessment_type=assessment_type
        )

# Global instance
enhanced_aida = EnhancedAidaAgent() 