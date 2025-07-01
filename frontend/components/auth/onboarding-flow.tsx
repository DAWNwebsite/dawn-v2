"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  subtitle?: string
  questions: OnboardingQuestion[]
}

interface OnboardingQuestion {
  id: string
  question: string
  type: 'single-select' | 'multi-select'
  options: OnboardingOption[]
}

interface OnboardingOption {
  id: string
  label: string
  value: string
  selected?: boolean
}

interface OnboardingFlowProps {
  steps: OnboardingStep[]
  onComplete: (responses: Record<string, string[]>) => void
  userName?: string
  className?: string
}

const teacherSteps: OnboardingStep[] = [
  {
    id: 'step1',
    title: 'Welcome, Lawrence',
    subtitle: 'Let AIDA guide you step-by-step, so you can get started quickly and make the most of all our features.',
    questions: [
      {
        id: 'subjects',
        question: 'What subjects do you teach?',
        type: 'multi-select',
        options: [
          { id: 'english', label: 'English', value: 'english' },
          { id: 'accounting', label: 'Accounting', value: 'accounting' },
          { id: 'history', label: 'History', value: 'history' },
          { id: 'biology', label: 'Biology', value: 'biology' },
          { id: 'maths', label: 'Maths', value: 'maths' },
          { id: 'economics', label: 'Economics', value: 'economics' },
          { id: 'chemistry', label: 'Chemistry', value: 'chemistry' },
          { id: 'physics', label: 'Physics', value: 'physics' },
          { id: 'agriculture', label: 'Agriculture', value: 'agriculture' },
          { id: 'others', label: 'Others', value: 'others' }
        ]
      },
      {
        id: 'grade_levels',
        question: 'What grade levels would you prefer to teach?',
        type: 'single-select',
        options: [
          { id: 'grade1-6', label: 'Grade 1-6', value: 'grade1-6' },
          { id: 'grade7-9', label: 'Grade 7-9', value: 'grade7-9' },
          { id: 'grade10-12', label: 'Grade 10-12', value: 'grade10-12' }
        ]
      },
      {
        id: 'features',
        question: 'Which of these Dawn AI features interest you?',
        type: 'multi-select',
        options: [
          { id: 'lesson_plan', label: 'Lesson plan generator', value: 'lesson_plan' },
          { id: 'personalized_plans', label: 'Personalized learning plans', value: 'personalized_plans' },
          { id: 'assessment_grader', label: 'Assessment grader', value: 'assessment_grader' }
        ]
      }
    ]
  },
  {
    id: 'step2',
    title: 'Accessibility Needs & Key Feature Preview',
    questions: [
      {
        id: 'accessibility',
        question: 'Which of these accessibility features would you likely use for your students?',
        type: 'multi-select',
        options: [
          { id: 'adhd_friendly', label: 'ADHD Friendly', value: 'adhd_friendly' },
          { id: 'vision_impaired', label: 'Vision Impaired Profile', value: 'vision_impaired' },
          { id: 'screen_reader', label: 'Screen Reader for Blind Users', value: 'screen_reader' },
          { id: 'keyboard_nav', label: 'Keyboard Navigation', value: 'keyboard_nav' },
          { id: 'deaf_mute', label: 'Deaf-Mute Profile', value: 'deaf_mute' },
          { id: 'dyslexia_font', label: 'Dyslexia-friendly font', value: 'dyslexia_font' }
        ]
      },
      {
        id: 'workflow_features',
        question: 'Which of the key features do you think would help with your workflow?',
        type: 'multi-select',
        options: [
          { id: 'interactive_tools', label: 'Interactive teacher tools Eg. Student tracking', value: 'interactive_tools' },
          { id: 'ai_lms', label: 'AI LMS features for accessibility', value: 'ai_lms' },
          { id: 'quick_guides', label: 'Quick start guides on utilizing interactive elements', value: 'quick_guides' }
        ]
      }
    ]
  }
]

const studentSteps: OnboardingStep[] = [
  {
    id: 'step1',
    title: 'Welcome, Josephine',
    subtitle: 'Let AIDA guide you step-by-step, so you can get started quickly and make the most of all our features.',
    questions: [
      {
        id: 'accessibility_needs',
        question: 'Please answer the following questions to customize your learning preference',
        type: 'multi-select',
        options: [
          { id: 'adhd', label: 'ADHD', value: 'adhd' },
          { id: 'vision_impaired', label: 'Vision Impaired', value: 'vision_impaired' },
          { id: 'blindness', label: 'Blindness', value: 'blindness' },
          { id: 'deaf_mute', label: 'Deaf-Mute', value: 'deaf_mute' },
          { id: 'dyslexia', label: 'Dyslexia', value: 'dyslexia' }
        ]
      },
      {
        id: 'languages',
        question: 'What of these languages do you speak?',
        type: 'multi-select',
        options: [
          { id: 'english', label: 'English', value: 'english' },
          { id: 'spanish', label: 'Spanish', value: 'spanish' },
          { id: 'yoruba', label: 'Yoruba', value: 'yoruba' },
          { id: 'igbo', label: 'Igbo', value: 'igbo' }
        ]
      },
      {
        id: 'interests',
        question: 'Which of these topics interest you?',
        type: 'multi-select',
        options: [
          { id: 'biology', label: 'Biology', value: 'biology' },
          { id: 'geography', label: 'Geography', value: 'geography' },
          { id: 'history', label: 'History', value: 'history' },
          { id: 'physics', label: 'Physics', value: 'physics' },
          { id: 'mathematics', label: 'Mathematics', value: 'mathematics' }
        ]
      }
    ]
  },
  {
    id: 'step2',
    title: 'Product Access',
    questions: [
      {
        id: 'ai_features',
        question: 'Which of these AI features would you be interested in using first?',
        type: 'multi-select',
        options: [
          { id: 'self_paced_lms', label: 'Self-paced LMS', value: 'self_paced_lms' },
          { id: 'aida_spaces', label: 'AIDA Spaces', value: 'aida_spaces' },
          { id: 'interactive_modules', label: 'Interactive and gamified modules', value: 'interactive_modules' },
          { id: 'self_paced_simulation', label: 'Self-paced simulation', value: 'self_paced_simulation' },
          { id: 'customizable_content', label: 'Customizable course content', value: 'customizable_content' }
        ]
      }
    ]
  }
]

export default function OnboardingFlow({ 
  steps = teacherSteps, 
  onComplete, 
  userName = "User",
  className 
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, string[]>>({})

  const handleOptionSelect = (questionId: string, optionValue: string, isMultiSelect: boolean) => {
    setResponses(prev => {
      const current = prev[questionId] || []
      
      if (isMultiSelect) {
        if (current.includes(optionValue)) {
          return { ...prev, [questionId]: current.filter(v => v !== optionValue) }
        } else {
          return { ...prev, [questionId]: [...current, optionValue] }
        }
      } else {
        return { ...prev, [questionId]: [optionValue] }
      }
    })
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(responses)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100
  const step = steps[currentStep]

  return (
    <div className={cn("max-w-4xl mx-auto p-6", className)}>
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                index <= currentStep
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-16 h-0.5 mx-2",
                  index < currentStep ? "bg-purple-600" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Card className="p-8">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{step.title}</h1>
            {step.subtitle && (
              <p className="text-gray-600 max-w-2xl mx-auto">{step.subtitle}</p>
            )}
          </div>

          {step.questions.map((question) => (
            <div key={question.id} className="space-y-4">
              <h2 className="text-lg font-semibold text-purple-600 mb-4">
                {question.question}
              </h2>
              
              <div className="flex flex-wrap gap-3">
                {question.options.map((option) => {
                  const isSelected = responses[question.id]?.includes(option.value) || false
                  
                  return (
                    <Badge
                      key={option.id}
                      variant={isSelected ? "purple" : "outline"}
                      className={cn(
                        "px-4 py-2 cursor-pointer text-sm font-medium transition-all",
                        "hover:shadow-sm",
                        isSelected 
                          ? "bg-purple-100 text-purple-800 border-purple-300" 
                          : "hover:bg-gray-50"
                      )}
                      onClick={() => handleOptionSelect(question.id, option.value, question.type === 'multi-select')}
                    >
                      {option.label}
                    </Badge>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            {currentStep > 0 ? (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            <Button
              onClick={handleNext}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            >
              {currentStep === steps.length - 1 ? 'Continue to DAWN AI' : 'Continue'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export { teacherSteps, studentSteps } 