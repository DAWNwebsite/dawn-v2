"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import FocusCard from '@/components/ui/focus-card'
import DyslexiaText from '@/components/ui/dyslexia-text'
import SensoryContainer from '@/components/ui/sensory-container'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Eye, 
  Ear, 
  Heart, 
  Zap, 
  BookOpen, 
  Users, 
  Star,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react'

export default function AccessibilityDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            DAWN AI Accessibility Features
          </h1>
          <DyslexiaText size="lg" className="text-gray-600 max-w-3xl mx-auto">
            Experience our comprehensive accessibility features designed specifically for 
            neurodivergent learners. Every component adapts to your individual needs.
          </DyslexiaText>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* ADHD-Friendly Focus Cards */}
          <SensoryContainer className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold">ADHD-Friendly Focus Cards</h2>
            </div>
            
            <FocusCard
              title="Complete Math Assignment"
              description="Solve 10 algebra problems with step-by-step guidance"
              timeEstimate="25 min"
              difficulty="medium"
              priority="high"
              onClick={() => console.log('Task clicked')}
            />
            
            <FocusCard
              title="Read Chapter 3"
              description="Science textbook - The Water Cycle"
              timeEstimate="15 min"
              difficulty="easy"
              completed={true}
            />
            
            <FocusCard
              title="Practice Spanish Vocabulary"
              description="Review 20 new words with audio pronunciation"
              timeEstimate="10 min"
              difficulty="easy"
              priority="medium"
            />
          </SensoryContainer>

          {/* Dyslexia-Friendly Text */}
          <SensoryContainer className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Dyslexia-Friendly Reading</h2>
            </div>
            
            <DyslexiaText size="lg" lineHeight="loose" letterSpacing="wide">
              The water cycle is a continuous process that involves the movement of water 
              throughout Earth and its atmosphere. Water evaporates from oceans, lakes, 
              and rivers, rises into the atmosphere as water vapor, condenses into clouds, 
              and falls back to Earth as precipitation.
            </DyslexiaText>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span>Hover over text to see read-aloud controls</span>
            </div>
          </SensoryContainer>

          {/* Sensory Processing Support */}
          <SensoryContainer 
            backgroundPattern="waves" 
            intensity="medium"
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-pink-600" />
              <h2 className="text-xl font-semibold">Sensory Processing Support</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Learning Progress</span>
                <Badge variant="secondary">78% Complete</Badge>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            
            <DyslexiaText>
              This container provides sensory controls in the top-right corner. 
              Try the visual calming mode, focus mode, or sound control to customize 
              your learning environment.
            </DyslexiaText>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Ear className="w-4 h-4" />
              <span>Hover over the top-right corner for sensory controls</span>
            </div>
          </SensoryContainer>

          {/* Multi-Modal Learning */}
          <SensoryContainer className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold">Multi-Modal Learning</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Visual</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Ear className="w-4 h-4" />
                <span>Auditory</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Kinesthetic</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Reading</span>
              </Button>
            </div>
            
            <DyslexiaText>
              Choose your preferred learning modality. Our AI adapts content 
              presentation to match your learning style and cognitive preferences.
            </DyslexiaText>
          </SensoryContainer>
        </div>

        {/* Accessibility Features Overview */}
        <SensoryContainer className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Comprehensive Accessibility Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Eye,
                title: "Visual Accessibility",
                features: ["High contrast mode", "Customizable font sizes", "Dyslexia-friendly fonts", "Color blindness support"]
              },
              {
                icon: Ear,
                title: "Auditory Support",
                features: ["Text-to-speech", "Audio descriptions", "Sound control", "Voice navigation"]
              },
              {
                icon: Zap,
                title: "Cognitive Support",
                features: ["ADHD-friendly design", "Focus mode", "Reduced distractions", "Clear visual hierarchy"]
              },
              {
                icon: Heart,
                title: "Sensory Processing",
                features: ["Calming animations", "Sensory controls", "Customizable backgrounds", "Breathing guides"]
              },
              {
                icon: Target,
                title: "Motor & Navigation",
                features: ["Keyboard navigation", "Enhanced focus indicators", "Large click targets", "Voice commands"]
              },
              {
                icon: Users,
                title: "Personalization",
                features: ["Learning profiles", "Adaptive interfaces", "Progress tracking", "Custom preferences"]
              }
            ].map((category, index) => (
              <Card key={index} className="p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <category.icon className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold">{category.title}</h3>
                </div>
                <ul className="space-y-1">
                  {category.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </SensoryContainer>

        {/* Call to Action */}
        <div className="text-center">
          <SensoryContainer className="inline-block">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Ready to Start Learning?</h3>
              <DyslexiaText>
                Experience personalized, accessible education designed for your unique needs.
              </DyslexiaText>
              <div className="flex items-center justify-center space-x-4">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600">
                  Start Your Journey
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </SensoryContainer>
        </div>
      </div>
    </div>
  )
} 