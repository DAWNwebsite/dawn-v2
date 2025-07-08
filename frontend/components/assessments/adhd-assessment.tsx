"use client"

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import FocusCard from '@/components/ui/focus-card'
import { useAPIClient, type ADHDAssessmentResponses, type DiagnosticResult } from '@/lib/api-client'
import { 
  Brain, 
  Clock, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react'

interface Question {
  id: string
  text: string
  category: 'attention' | 'hyperactivity' | 'impulsivity'
  description?: string
}

const adhdQuestions: Question[] = [
  // Attention Questions (1-5 scale: 1=Never, 5=Very Often)
  {
    id: 'att1',
    text: 'Has difficulty sustaining attention in tasks or play activities',
    category: 'attention',
    description: 'Struggles to stay focused on homework, games, or conversations'
  },
  {
    id: 'att2', 
    text: 'Does not seem to listen when spoken to directly',
    category: 'attention',
    description: 'Appears not to hear even when addressed directly'
  },
  {
    id: 'att3',
    text: 'Has difficulty organizing tasks and activities',
    category: 'attention',
    description: 'Struggles with time management and keeping materials organized'
  },
  {
    id: 'att4',
    text: 'Avoids or dislikes tasks requiring sustained mental effort',
    category: 'attention',
    description: 'Reluctant to engage in schoolwork or homework'
  },
  {
    id: 'att5',
    text: 'Loses things necessary for tasks or activities',
    category: 'attention',
    description: 'Frequently misplaces school materials, tools, or toys'
  },
  {
    id: 'att6',
    text: 'Is easily distracted by external stimuli',
    category: 'attention',
    description: 'Attention easily pulled away by sounds, movement, or thoughts'
  },
  
  // Hyperactivity Questions
  {
    id: 'hyp1',
    text: 'Fidgets with hands or feet or squirms in seat',
    category: 'hyperactivity',
    description: 'Shows restless behavior when expected to sit still'
  },
  {
    id: 'hyp2',
    text: 'Leaves seat when remaining seated is expected',
    category: 'hyperactivity',
    description: 'Gets up during class, meals, or other structured activities'
  },
  {
    id: 'hyp3',
    text: 'Runs about or climbs excessively in inappropriate situations',
    category: 'hyperactivity',
    description: 'Shows excessive physical activity in calm environments'
  },
  {
    id: 'hyp4',
    text: 'Has difficulty playing or engaging in leisure activities quietly',
    category: 'hyperactivity',
    description: 'Tends to be loud during quiet activities'
  },
  {
    id: 'hyp5',
    text: 'Acts as if "driven by a motor"',
    category: 'hyperactivity',
    description: 'Appears constantly active or "on the go"'
  },
  
  // Impulsivity Questions
  {
    id: 'imp1',
    text: 'Talks excessively',
    category: 'impulsivity',
    description: 'Speaks more than socially appropriate in most situations'
  },
  {
    id: 'imp2',
    text: 'Blurts out answers before questions are completed',
    category: 'impulsivity',
    description: 'Responds before thinking or before others finish speaking'
  },
  {
    id: 'imp3',
    text: 'Has difficulty waiting their turn',
    category: 'impulsivity',
    description: 'Struggles with patience in lines, games, or conversations'
  },
  {
    id: 'imp4',
    text: 'Interrupts or intrudes on others',
    category: 'impulsivity',
    description: 'Butts into conversations, games, or activities uninvited'
  },
  {
    id: 'imp5',
    text: 'Makes decisions quickly without considering consequences',
    category: 'impulsivity',
    description: 'Acts without thinking about potential outcomes'
  }
]

const scaleLabels = [
  { value: 1, label: 'Never', color: 'bg-green-100 text-green-800' },
  { value: 2, label: 'Rarely', color: 'bg-blue-100 text-blue-800' },
  { value: 3, label: 'Sometimes', color: 'bg-yellow-100 text-yellow-800' },
  { value: 4, label: 'Often', color: 'bg-orange-100 text-orange-800' },
  { value: 5, label: 'Very Often', color: 'bg-red-100 text-red-800' }
]

interface ADHDAssessmentProps {
  userId: string
  onComplete?: (result: DiagnosticResult) => void
}

export function AdhdAssessment({ userId, onComplete }: ADHDAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const apiClient = useAPIClient()
  const currentQuestion = adhdQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / adhdQuestions.length) * 100
  const isLastQuestion = currentQuestionIndex === adhdQuestions.length - 1
  const canProceed = responses[currentQuestion.id] !== undefined

  const handleResponse = (questionId: string, value: number) => {
    setResponses((prev: Record<string, number>) => ({ ...prev, [questionId]: value }))
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < adhdQuestions.length - 1) {
      setCurrentQuestionIndex((prev: number) => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev: number) => prev - 1)
    }
  }

  const submitAssessment = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Organize responses by category
      const attentionQuestions = adhdQuestions
        .filter(q => q.category === 'attention')
        .map(q => responses[q.id])
      
      const hyperactivityQuestions = adhdQuestions
        .filter(q => q.category === 'hyperactivity')
        .map(q => responses[q.id])
      
      const impulsivityQuestions = adhdQuestions
        .filter(q => q.category === 'impulsivity')
        .map(q => responses[q.id])

      const assessmentData: ADHDAssessmentResponses = {
        attention_questions: attentionQuestions,
        hyperactivity_questions: hyperactivityQuestions,
        impulsivity_questions: impulsivityQuestions,
        age: 12, // This would come from user profile
        duration_months: 6 // This would be collected separately
      }

      const assessmentResult = await apiClient.runADHDAssessment(userId, assessmentData)
      
      if (assessmentResult.error) {
        throw new Error(assessmentResult.error)
      }

      setResult(assessmentResult)
      onComplete?.(assessmentResult)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Assessment failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetAssessment = () => {
    setCurrentQuestionIndex(0)
    setResponses({})
    setResult(null)
    setError(null)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'attention': return <Brain className="w-5 h-5" />
      case 'hyperactivity': return <Zap className="w-5 h-5" />
      case 'impulsivity': return <Clock className="w-5 h-5" />
      default: return <Brain className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'attention': return 'bg-blue-500'
      case 'hyperactivity': return 'bg-orange-500'
      case 'impulsivity': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  if (result) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <FocusCard
          title="ADHD Assessment Results"
          className="mb-6"
          completed={true}
        >
          <div className="space-y-6">
            {/* Confidence Level */}
            <div className="text-center">
              <div className="mb-4">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-white ${
                  result.confidence_level >= 0.7 ? 'bg-red-500' :
                  result.confidence_level >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                }`}>
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Confidence Level: {Math.round(result.confidence_level * 100)}%
                </div>
              </div>
              
              <Progress 
                value={result.confidence_level * 100} 
                className="w-full max-w-md mx-auto"
              />
            </div>

            {/* Indicators */}
            {result.indicators && result.indicators.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                  Key Indicators
                </h3>
                <div className="grid gap-2">
                  {result.indicators.map((indicator, index) => (
                    <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                      <span>{indicator}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Recommendations
                </h3>
                <div className="grid gap-2">
                  {result.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span>{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            {result.next_steps && result.next_steps.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <ArrowRight className="w-5 h-5 mr-2 text-blue-500" />
                  Next Steps
                </h3>
                <div className="grid gap-2">
                  {result.next_steps.map((step, index) => (
                    <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button onClick={resetAssessment} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Assessment
              </Button>
              <Button onClick={() => window.print()} className="flex-1">
                Save Results
              </Button>
            </div>
          </div>
        </FocusCard>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">ADHD Assessment</h1>
        <p className="text-gray-600 mb-4">
          This assessment helps identify potential ADHD symptoms. Please answer based on behavior over the past 6 months.
        </p>
        <Progress value={progress} className="w-full max-w-md mx-auto" />
        <p className="text-sm text-gray-500 mt-2">
          Question {currentQuestionIndex + 1} of {adhdQuestions.length}
        </p>
      </div>

      {/* Question Card */}
      <FocusCard
        title={`Question ${currentQuestionIndex + 1}`}
        className="mb-6"
        priority={currentQuestion.category === 'attention' ? 'high' : 'medium'}
      >
        <div className="space-y-6">
          {/* Category Badge */}
          <div className="flex items-center justify-center">
            <Badge className={`${getCategoryColor(currentQuestion.category)} text-white px-4 py-2`}>
              {getCategoryIcon(currentQuestion.category)}
              <span className="ml-2 capitalize">{currentQuestion.category}</span>
            </Badge>
          </div>

          {/* Question */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-3">
              {currentQuestion.text}
            </h2>
            {currentQuestion.description && (
              <p className="text-gray-600 text-sm">
                {currentQuestion.description}
              </p>
            )}
          </div>

          {/* Response Scale */}
          <div className="space-y-3">
            <p className="text-center text-sm font-medium text-gray-700">
              How often does this occur?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {scaleLabels.map((scale) => (
                <button
                  key={scale.value}
                  onClick={() => handleResponse(currentQuestion.id, scale.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    responses[currentQuestion.id] === scale.value
                      ? 'border-blue-500 bg-blue-50 scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${scale.color}`}>
                    {scale.label}
                  </div>
                  <div className="text-2xl font-bold text-gray-700">
                    {scale.value}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6">
            <Button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="text-sm text-gray-500">
              {Object.keys(responses).length} of {adhdQuestions.length} answered
            </div>

            {isLastQuestion ? (
              <Button
                onClick={submitAssessment}
                disabled={!canProceed || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Processing...' : 'Complete Assessment'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                disabled={!canProceed}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </FocusCard>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}
    </div>
  )
} 