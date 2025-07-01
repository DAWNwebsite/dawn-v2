"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import FocusCard from '@/components/ui/focus-card'
import DyslexiaText from '@/components/ui/dyslexia-text'
import SensoryContainer from '@/components/ui/sensory-container'
import LearningProgress from '@/components/ui/learning-progress'
import { useAccessibility } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'
import { 
  Palette, 
  Type, 
  Brain, 
  Eye, 
  Ear, 
  MousePointer,
  Award,
  BookOpen,
  Zap,
  Heart
} from 'lucide-react'

export default function DesignDemoPage() {
  const { accessibility } = useAccessibility()

  const sampleAchievements = [
    {
      id: '1',
      title: 'First Assessment Complete',
      description: 'Completed your first learning assessment',
      earnedAt: new Date('2024-01-15'),
      icon: <Award className="w-5 h-5 text-yellow-500" />
    },
    {
      id: '2',
      title: 'Reading Milestone',
      description: 'Read 100 words with 95% accuracy',
      earnedAt: new Date('2024-01-20'),
      icon: <BookOpen className="w-5 h-5 text-blue-500" />
    }
  ]

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6",
      accessibility.highContrast && "bg-white",
      accessibility.adhdFriendly && "bg-white"
    )}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className={cn(
            "text-4xl font-bold text-gray-900 clear-hierarchy",
            accessibility.dyslexiaFriendlyFont && "font-mono",
            accessibility.fontSize === 'large' && "text-5xl",
            accessibility.fontSize === 'extra-large' && "text-6xl"
          )}>
            DAWN AI Study Design System
          </h1>
          <p className={cn(
            "text-xl text-gray-600 max-w-3xl mx-auto",
            accessibility.fontSize === 'large' && "text-2xl",
            accessibility.fontSize === 'extra-large' && "text-3xl",
            accessibility.highContrast && "text-black"
          )}>
            A comprehensive, accessibility-first design system built for neurodivergent learners
          </p>
          
          {/* Active Accessibility Features */}
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-2 max-w-2xl">
              {accessibility.highContrast && (
                <Badge variant="outline" className="bg-black text-white">
                  <Eye className="w-3 h-3 mr-1" />
                  High Contrast
                </Badge>
              )}
              {accessibility.dyslexiaFriendlyFont && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  <Type className="w-3 h-3 mr-1" />
                  Dyslexia Font
                </Badge>
              )}
              {accessibility.adhdFriendly && (
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <Brain className="w-3 h-3 mr-1" />
                  ADHD Friendly
                </Badge>
              )}
              {accessibility.reducedMotion && (
                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                  <MousePointer className="w-3 h-3 mr-1" />
                  Reduced Motion
                </Badge>
              )}
              {accessibility.fontSize !== 'medium' && (
                <Badge variant="outline" className="bg-orange-100 text-orange-800">
                  <Type className="w-3 h-3 mr-1" />
                  {accessibility.fontSize} Text
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Cognitive Load Indicators */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 clear-hierarchy">
            Cognitive Load Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cognitive-low p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Low Cognitive Load</h3>
              </div>
              <p className="text-green-700">
                Simple, easy-to-process content that requires minimal mental effort. 
                Perfect for introducing new concepts or when energy is low.
              </p>
            </Card>

            <Card className="cognitive-medium p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-800">Medium Cognitive Load</h3>
              </div>
              <p className="text-orange-700">
                Moderate complexity that builds on existing knowledge. 
                Good for skill development and practice activities.
              </p>
            </Card>

            <Card className="cognitive-high p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-800">High Cognitive Load</h3>
              </div>
              <p className="text-red-700">
                Complex, challenging content that requires focused attention. 
                Best used when fully alert and in optimal learning conditions.
              </p>
            </Card>
          </div>
        </section>

        {/* Learning Progress Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 clear-hierarchy">
            Learning Progress Tracking
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LearningProgress
              title="Mathematics Fundamentals"
              description="Building strong foundation in basic arithmetic and problem-solving"
              progress={75}
              cognitiveLoad="medium"
              timeSpent="45 min"
              estimatedTime="60 min"
              skillsLearned={['Addition', 'Subtraction', 'Word Problems', 'Pattern Recognition']}
              nextMilestone="Complete multiplication tables assessment"
              achievements={sampleAchievements}
            />

            <LearningProgress
              title="Reading Comprehension"
              description="Developing reading skills with adaptive support for dyslexia"
              progress={92}
              cognitiveLoad="low"
              timeSpent="30 min"
              estimatedTime="35 min"
              skillsLearned={['Phonics', 'Sight Words', 'Context Clues']}
              nextMilestone="Advanced paragraph comprehension"
              achievements={sampleAchievements.slice(1)}
            />
          </div>
        </section>

        {/* Focus Cards for ADHD Support */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 clear-hierarchy">
            ADHD-Friendly Focus Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FocusCard
              title="Quick Math Practice"
              description="5-minute focused session on addition facts"
              timeEstimate="5 min"
              difficulty="easy"
              priority="high"
              onClick={() => console.log('Starting math practice')}
            />
            
            <FocusCard
              title="Reading Challenge"
              description="Read a short story and answer comprehension questions"
              timeEstimate="15 min"
              difficulty="medium"
              priority="medium"
              onClick={() => console.log('Starting reading challenge')}
            />
            
            <FocusCard
              title="Science Experiment"
              description="Virtual lab: Explore the water cycle"
              timeEstimate="20 min"
              difficulty="hard"
              priority="low"
              completed={true}
              onClick={() => console.log('Reviewing completed experiment')}
            />
          </div>
        </section>

        {/* Dyslexia Support Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 clear-hierarchy">
            Dyslexia-Friendly Text Components
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Type className="w-5 h-5 text-blue-600" />
                <span>Standard Text</span>
              </h3>
              <p className="text-gray-700 leading-relaxed">
                This is how regular text appears in the application. It uses standard fonts 
                and spacing that work well for most users. The text maintains good readability 
                while keeping a professional appearance.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Heart className="w-5 h-5 text-purple-600" />
                <span>Dyslexia-Optimized Text</span>
              </h3>
              <DyslexiaText className="text-gray-700">
                This text uses dyslexia-friendly formatting with increased letter spacing, 
                word spacing, and line height. The font choice and styling make it easier 
                for users with dyslexia to read and comprehend the content.
              </DyslexiaText>
            </Card>
          </div>
        </section>

        {/* Sensory Containers for Autism Support */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 clear-hierarchy">
            Sensory-Friendly Containers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SensoryContainer
              title="Calm Learning Space"
              description="A gentle, low-stimulation environment for focused learning"
              sensoryLevel="low"
              className="p-6"
            >
              <div className="space-y-4">
                <p className="text-gray-700">
                  This container provides a calm, minimal environment that reduces sensory 
                  overload. Perfect for users who are sensitive to visual stimulation.
                </p>
                <Button variant="outline" className="w-full">
                  Start Quiet Activity
                </Button>
              </div>
            </SensoryContainer>

            <SensoryContainer
              title="Interactive Learning Zone"
              description="Engaging environment with controlled stimulation"
              sensoryLevel="medium"
              className="p-6"
            >
              <div className="space-y-4">
                <p className="text-gray-700">
                  This container offers moderate visual interest while maintaining 
                  accessibility. Good for interactive activities and engagement.
                </p>
                <Button className="w-full">
                  Start Interactive Lesson
                </Button>
              </div>
            </SensoryContainer>
          </div>
        </section>

        {/* Design Tokens */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 clear-hierarchy">
            Design Tokens & Color System
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Brand Colors */}
            <div className="space-y-2">
              <div className="w-full h-16 bg-purple-600 rounded-lg border-2 border-gray-200"></div>
              <div className="text-sm">
                <div className="font-medium">Dawn Purple</div>
                <div className="text-gray-500">#8B5CF6</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="w-full h-16 bg-blue-500 rounded-lg border-2 border-gray-200"></div>
              <div className="text-sm">
                <div className="font-medium">Dawn Blue</div>
                <div className="text-gray-500">#3B82F6</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="w-full h-16 bg-green-600 rounded-lg border-2 border-gray-200"></div>
              <div className="text-sm">
                <div className="font-medium">Success Green</div>
                <div className="text-gray-500">#059669</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="w-full h-16 bg-orange-500 rounded-lg border-2 border-gray-200"></div>
              <div className="text-sm">
                <div className="font-medium">Warning Orange</div>
                <div className="text-gray-500">#F97316</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="w-full h-16 bg-blue-100 rounded-lg border-2 border-gray-200"></div>
              <div className="text-sm">
                <div className="font-medium">Calm Blue</div>
                <div className="text-gray-500">#DBEAFE</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="w-full h-16 bg-yellow-100 rounded-lg border-2 border-gray-200"></div>
              <div className="text-sm">
                <div className="font-medium">Focus Yellow</div>
                <div className="text-gray-500">#FEF3C7</div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Scale */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 clear-hierarchy">
            Typography Scale
          </h2>
          <Card className="p-6 space-y-4">
            <div className="font-small">Small Text (14px) - Used for captions and fine print</div>
            <div className="font-medium">Medium Text (16px) - Default body text size</div>
            <div className="font-large">Large Text (18px) - Enhanced readability option</div>
            <div className="font-extra-large">Extra Large Text (20px) - Maximum accessibility option</div>
          </Card>
        </section>

        {/* Accessibility Features Summary */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 clear-hierarchy">
            Accessibility Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Visual Accessibility</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>• High contrast mode</li>
                <li>• Customizable font sizes</li>
                <li>• Color blindness support</li>
                <li>• Focus indicators</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold">Cognitive Support</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>• ADHD-friendly layouts</li>
                <li>• Dyslexia-optimized text</li>
                <li>• Cognitive load indicators</li>
                <li>• Clear information hierarchy</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MousePointer className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold">Motor & Navigation</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>• Keyboard navigation</li>
                <li>• Reduced motion options</li>
                <li>• Large touch targets</li>
                <li>• Voice commands (planned)</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-600">
            DAWN AI Study Design System - Built with accessibility and inclusion at its core
          </p>
        </footer>
      </div>
    </div>
  )
} 