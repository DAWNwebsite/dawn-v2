"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import DyslexiaText from '@/components/ui/dyslexia-text'
import FocusCard from '@/components/ui/focus-card'
import { useAPIClient, type DyslexiaAssessmentResponses, type DiagnosticResult } from '@/lib/api-client'
import { 
  BookOpen, 
  Volume2, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Timer
} from 'lucide-react'

interface Question {
  id: string
  text: string
  category: 'reading_speed' | 'comprehension' | 'phonological_awareness'
  description?: string
  type: 'scale' | 'reading_test' | 'comprehension_test'
  content?: string
  expectedAnswer?: string
}

const dyslexiaQuestions: Question[] = [
  {
    id: 'rs1',
    text: 'Read the following passage aloud',
    category: 'reading_speed',
    type: 'reading_test',
    description: 'Read this passage as naturally as possible. We will measure your reading speed.',
    content: 'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet. Reading fluency is important for comprehension. Students who read smoothly can focus on understanding the meaning rather than decoding individual words.'
  },
  {
    id: 'rs2',
    text: 'How often do you skip words or lines while reading?',
    category: 'reading_speed',
    type: 'scale',
    description: 'This helps us understand reading accuracy patterns'
  },
  {
    id: 'comp1',
    text: 'Read this passage and answer the question',
    category: 'comprehension',
    type: 'comprehension_test',
    description: 'Read carefully and select the best answer',
    content: 'Sarah walked to the library every Tuesday after school. She loved reading mystery books and would often stay until closing time. Her favorite author was Agatha Christie because the stories always kept her guessing until the end.',
    expectedAnswer: 'What day did Sarah go to the library?'
  },
  {
    id: 'phon1',
    text: 'How often do you confuse similar-sounding words when reading?',
    category: 'phonological_awareness',
    type: 'scale',
    description: 'Sound discrimination is important for reading accuracy'
  }
]

const scaleLabels = [
  { value: 1, label: 'Never', color: 'bg-green-100 text-green-800' },
  { value: 2, label: 'Rarely', color: 'bg-blue-100 text-blue-800' },
  { value: 3, label: 'Sometimes', color: 'bg-yellow-100 text-yellow-800' },
  { value: 4, label: 'Often', color: 'bg-orange-100 text-orange-800' },
  { value: 5, label: 'Very Often', color: 'bg-red-100 text-red-800' }
]

const comprehensionOptions = ['Tuesday', 'Monday', 'Wednesday', 'Friday']

interface DyslexiaAssessmentProps {
  userId: string
  onComplete?: (result: DiagnosticResult) => void
}

export function DyslexiaAssessment({ userId, onComplete }: DyslexiaAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, number | string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null)
  const [readingCompleted, setReadingCompleted] = useState(false)
  
  const apiClient = useAPIClient()
  const currentQuestion = dyslexiaQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / dyslexiaQuestions.length) * 100
  const isLastQuestion = currentQuestionIndex === dyslexiaQuestions.length - 1
  const canProceed = responses[currentQuestion.id] !== undefined

  const handleResponse = (questionId: string, value: number | string) => {
    setResponses((prev: Record<string, number | string>) => ({ ...prev, [questionId]: value }))
  }

  const startReadingTest = () => {
    setReadingStartTime(Date.now())
  }

  const completeReadingTest = () => {
    if (readingStartTime) {
      const duration = (Date.now() - readingStartTime) / 1000
      const wordCount = currentQuestion.content?.split(' ').length || 0
      const wordsPerMinute = Math.round((wordCount / duration) * 60)
      
      setResponses((prev: Record<string, number | string>) => ({ ...prev, [currentQuestion.id]: wordsPerMinute }))
      setReadingCompleted(true)
      setReadingStartTime(null)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < dyslexiaQuestions.length - 1) {
      setCurrentQuestionIndex((prev: number) => prev + 1)
      setReadingCompleted(false)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev: number) => prev - 1)
      setReadingCompleted(false)
    }
  }

  const submitAssessment = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Get reading speed from reading test or default
      const readingSpeed = typeof responses['rs1'] === 'number' ? responses['rs1'] : 90
      
      // Calculate comprehension score (correct answer = 100, wrong = 50)
      const comprehensionScore = responses['comp1'] === 'Tuesday' ? 100 : 50
      
      // Get phonological awareness scores
      const phonologicalQuestions = dyslexiaQuestions
        .filter(q => q.category === 'phonological_awareness')
        .map(q => typeof responses[q.id] === 'number' ? responses[q.id] as number : 3)

      // Create assessment data matching the server's expected format
      const assessmentData = {
        reading_speed: readingSpeed,
        comprehension_score: comprehensionScore,
        phonological_awareness: phonologicalQuestions,
        spelling_accuracy: 75, // Default value
        word_recognition: [3, 3, 3] // Default values
      }

      const assessmentResult = await apiClient.runDyslexiaAssessment(userId, assessmentData)
      
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'reading_speed': return <Timer className="w-5 h-5" />
      case 'comprehension': return <BookOpen className="w-5 h-5" />
      case 'phonological_awareness': return <Volume2 className="w-5 h-5" />
      default: return <BookOpen className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reading_speed': return 'bg-blue-500'
      case 'comprehension': return 'bg-green-500'
      case 'phonological_awareness': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  if (result) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <FocusCard title="Dyslexia Assessment Results" className="mb-6" completed={true}>
          <div className="space-y-6">
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-white ${
                result.confidence_level >= 0.7 ? 'bg-red-500' :
                result.confidence_level >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'
              }`}>
                <AlertTriangle className="w-5 h-5 mr-2" />
                Confidence Level: {Math.round(result.confidence_level * 100)}%
              </div>
              <Progress value={result.confidence_level * 100} className="w-full max-w-md mx-auto mt-4" />
            </div>
            <div className="flex gap-4 pt-4">
              <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Assessment
              </Button>
            </div>
          </div>
        </FocusCard>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Dyslexia Assessment</h1>
        <DyslexiaText className="text-gray-600 mb-4">
          This assessment evaluates reading skills and identifies potential dyslexia indicators.
        </DyslexiaText>
        <Progress value={progress} className="w-full max-w-md mx-auto" />
        <p className="text-sm text-gray-500 mt-2">
          Question {currentQuestionIndex + 1} of {dyslexiaQuestions.length}
        </p>
      </div>

      <FocusCard title={`Question ${currentQuestionIndex + 1}`} className="mb-6">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <Badge className={`${getCategoryColor(currentQuestion.category)} text-white px-4 py-2`}>
              {getCategoryIcon(currentQuestion.category)}
              <span className="ml-2 capitalize">{currentQuestion.category.replace('_', ' ')}</span>
            </Badge>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold mb-3">
              <DyslexiaText>{currentQuestion.text}</DyslexiaText>
            </h2>
            {currentQuestion.description && (
              <p className="text-gray-600 text-sm">
                <DyslexiaText>{currentQuestion.description}</DyslexiaText>
              </p>
            )}
          </div>

          {currentQuestion.type === 'reading_test' && (
            <div className="space-y-4">
              <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <DyslexiaText className="text-lg leading-relaxed">
                  {currentQuestion.content}
                </DyslexiaText>
              </div>
              
              <div className="text-center">
                {!readingStartTime && !readingCompleted && (
                  <Button onClick={startReadingTest} className="bg-blue-600 hover:bg-blue-700">
                    <Timer className="w-4 h-4 mr-2" />
                    Start Reading
                  </Button>
                )}
                
                {readingStartTime && !readingCompleted && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">Reading in progress... Click when finished</div>
                    <Button onClick={completeReadingTest} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Finished Reading
                    </Button>
                  </div>
                )}
                
                {readingCompleted && (
                  <div className="text-green-600 font-medium">✓ Reading test completed</div>
                )}
              </div>
            </div>
          )}

          {currentQuestion.type === 'comprehension_test' && (
            <div className="space-y-4">
              <div className="p-6 bg-green-50 rounded-lg border-2 border-green-200">
                <DyslexiaText className="text-lg leading-relaxed mb-4">
                  {currentQuestion.content}
                </DyslexiaText>
                <div className="border-t pt-4">
                  <p className="font-medium mb-3">
                    <DyslexiaText>{currentQuestion.expectedAnswer}</DyslexiaText>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {comprehensionOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleResponse(currentQuestion.id, option)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          responses[currentQuestion.id] === option
                            ? 'border-green-500 bg-green-50 scale-105'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <DyslexiaText>{option}</DyslexiaText>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentQuestion.type === 'scale' && (
            <div className="space-y-3">
              <p className="text-center text-sm font-medium text-gray-700">
                <DyslexiaText>How often does this occur?</DyslexiaText>
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
                      <DyslexiaText>{scale.label}</DyslexiaText>
                    </div>
                    <div className="text-2xl font-bold text-gray-700">{scale.value}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-6">
            <Button onClick={previousQuestion} disabled={currentQuestionIndex === 0} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="text-sm text-gray-500">
              {Object.keys(responses).length} of {dyslexiaQuestions.length} answered
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
              <Button onClick={nextQuestion} disabled={!canProceed}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </FocusCard>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">
              <DyslexiaText>{error}</DyslexiaText>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
