"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import FocusCard from '@/components/ui/focus-card'
import ADHDAssessment from '@/components/assessments/adhd-assessment'
import DyslexiaAssessment from '@/components/assessments/dyslexia-assessment'
import { type DiagnosticResult } from '@/lib/api-client'
import { 
  Brain, 
  BookOpen, 
  Users, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  FileText,
  AlertTriangle,
  Star
} from 'lucide-react'

type AssessmentType = 'none' | 'adhd' | 'dyslexia'

interface AssessmentInfo {
  id: string
  title: string
  description: string
  duration: string
  icon: React.ReactNode
  color: string
  features: string[]
  targetAudience: string
}

const assessmentInfo: Record<string, AssessmentInfo> = {
  adhd: {
    id: 'adhd',
    title: 'ADHD Assessment',
    description: 'Comprehensive evaluation for Attention Deficit Hyperactivity Disorder symptoms including attention, hyperactivity, and impulsivity patterns.',
    duration: '10-15 minutes',
    icon: <Brain className="w-6 h-6" />,
    color: 'bg-blue-500',
    features: [
      'Attention span evaluation',
      'Hyperactivity assessment', 
      'Impulsivity screening',
      'Age-appropriate questions',
      'Evidence-based scoring'
    ],
    targetAudience: 'Students, Parents, Educators'
  },
  dyslexia: {
    id: 'dyslexia',
    title: 'Dyslexia Assessment',
    description: 'Reading skills evaluation focusing on reading speed, comprehension, and phonological awareness to identify potential dyslexia indicators.',
    duration: '15-20 minutes',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'bg-green-500',
    features: [
      'Reading speed measurement',
      'Comprehension testing',
      'Phonological awareness',
      'Interactive reading tasks',
      'Accessibility-focused design'
    ],
    targetAudience: 'Students, Reading Specialists, Parents'
  }
}

export default function AssessmentsPage() {
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentType>('none')
  const [completedAssessments, setCompletedAssessments] = useState<Record<string, DiagnosticResult>>({})
  const [userId] = useState('demo-user-123')

  const handleAssessmentComplete = (type: string, result: DiagnosticResult) => {
    setCompletedAssessments(prev => ({ ...prev, [type]: result }))
    setCurrentAssessment('none')
  }

  const getConfidenceLevelColor = (level: number) => {
    if (level >= 0.7) return 'text-red-600 bg-red-50'
    if (level >= 0.4) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const getConfidenceLevelText = (level: number) => {
    if (level >= 0.7) return 'High Confidence'
    if (level >= 0.4) return 'Moderate Confidence'
    return 'Low Confidence'
  }

  if (currentAssessment === 'adhd') {
    return (
      <ADHDAssessment 
        userId={userId}
        onComplete={(result) => handleAssessmentComplete('adhd', result)}
      />
    )
  }

  if (currentAssessment === 'dyslexia') {
    return (
      <DyslexiaAssessment 
        userId={userId}
        onComplete={(result) => handleAssessmentComplete('dyslexia', result)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Learning Disability Assessments
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Evidence-based diagnostic tools to identify learning differences and provide personalized recommendations for academic success.
          </p>
        </div>

        {Object.keys(completedAssessments).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
              Your Assessment Results
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(completedAssessments).map(([type, result]) => (
                <FocusCard
                  key={type}
                  title={assessmentInfo[type]?.title || type}
                  className="border-l-4 border-l-green-500"
                  completed={true}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Confidence Level</span>
                      <Badge className={getConfidenceLevelColor(result.confidence_level)}>
                        {getConfidenceLevelText(result.confidence_level)} ({Math.round(result.confidence_level * 100)}%)
                      </Badge>
                    </div>
                    
                    {result.indicators && result.indicators.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Key Indicators:</h4>
                        <ul className="text-sm space-y-1">
                          {result.indicators.slice(0, 2).map((indicator, index) => (
                            <li key={index} className="flex items-center text-gray-600">
                              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2" />
                              {indicator}
                            </li>
                          ))}
                          {result.indicators.length > 2 && (
                            <li className="text-xs text-gray-500">
                              +{result.indicators.length - 2} more indicators
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setCurrentAssessment(type as AssessmentType)}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        View Full Report
                      </Button>
                    </div>
                  </div>
                </FocusCard>
              ))}
            </div>
          </div>
        )}

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-blue-500" />
            Available Assessments
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {Object.values(assessmentInfo).map((assessment) => (
              <FocusCard
                key={assessment.id}
                title={assessment.title}
                className="hover:shadow-lg transition-shadow duration-200"
                priority={assessment.id === 'adhd' ? 'high' : 'medium'}
              >
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${assessment.color} text-white`}>
                      {assessment.icon}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {assessment.duration}
                      </div>
                      {completedAssessments[assessment.id] && (
                        <Badge className="mt-1 bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {assessment.description}
                  </p>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Assessment Features:</h4>
                    <ul className="space-y-2">
                      {assessment.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Suitable for: {assessment.targetAudience}</span>
                  </div>

                  <Button 
                    onClick={() => setCurrentAssessment(assessment.id as AssessmentType)}
                    className={`w-full ${assessment.color} hover:opacity-90 text-white`}
                  >
                    {completedAssessments[assessment.id] ? 'Retake Assessment' : 'Start Assessment'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </FocusCard>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-8 mb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Important Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 text-blue-800">
              <div>
                <h3 className="font-medium mb-2">About These Assessments</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Screening tools, not diagnostic instruments</li>
                  <li>• Based on evidence-based research</li>
                  <li>• Designed for educational purposes</li>
                  <li>• Results should be discussed with professionals</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Privacy & Data</h3>
                <ul className="space-y-1 text-sm">
                  <li>• All responses are kept confidential</li>
                  <li>• No personal data is stored permanently</li>
                  <li>• Results can be saved locally</li>
                  <li>• COPPA compliant for student use</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Need help interpreting your results or have questions about learning differences?
          </p>
          <Button variant="outline" className="mr-4">
            <Users className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Learn More
          </Button>
        </div>
      </div>
    </div>
  )
}
