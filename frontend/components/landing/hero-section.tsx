"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface HeroSectionProps {
  variant?: 'main' | 'students' | 'educators' | 'ai-learning' | 'ai-spaces'
  className?: string
}

interface HeroContent {
  badge: string
  title: string
  subtitle: string
  ctaText: string
  secondaryCtaText?: string
  image: string
}

const heroContent: Record<string, HeroContent> = {
  main: {
    badge: "Empowering Inclusive Learning for All",
    title: "Empowering Inclusive Learning for All",
    subtitle: "Dawn AI Study is designed to break down barriers to learning by providing personalized, accessible education for neurodivergent K-12 learners. Our platform combines cutting-edge AI with evidence-based learning strategies to create an inclusive environment where every student can thrive.",
    ctaText: "Get Started Now",
    secondaryCtaText: "Learn More",
    image: "/images/hero-main.jpg"
  },
  students: {
    badge: "AI Learning for Students with Special needs",
    title: "Empowering Students with Special needs",
    subtitle: "Our AI-powered learning tools help students and teachers engage in culturally relevant and locally adapted lessons. Learn languages in a way that's meaningful and accessible.",
    ctaText: "Get Started Now",
    image: "/images/student.jpg"
  },
  educators: {
    badge: "Revolutionizing Teaching",
    title: "Empower Educators with AI Tools",
    subtitle: "For educators, DAWN AI Study is a tool that simplifies the teaching process while enhancing the learning experience for all students—especially those with special needs.",
    ctaText: "Get Started Now",
    image: "/images/teacher.jpg"
  },
  'ai-learning': {
    badge: "Bridging Cultural Gaps",
    title: "AI Learning Tailored for Every Learner",
    subtitle: "Our AI-powered language learning tool helps students and teachers engage in culturally relevant and locally adapted lessons. Learn languages in a way that's meaningful and accessible.",
    ctaText: "Start Learning",
    image: "/images/ai-learning.jpg"
  },
  'ai-spaces': {
    badge: "Welcome to AIDA Spaces",
    title: "Spark Creativity, Build Knowledge.",
    subtitle: "Designed specifically for K-12 learners, AIDA Spaces combines interactive learning with fun exploration to create an immersive educational experience that feels like an adventure. Whether you're here to explore new topics or deepen your understanding of core subjects, AIDA Spaces makes every step engaging and memorable.",
    ctaText: "Explore AI Spaces",
    image: "/images/ai-spaces.jpg"
  }
}

export default function HeroSection({ variant = 'main', className }: HeroSectionProps) {
  const content = heroContent[variant]
  
  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600">
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-white">
            <div className="space-y-6">
              <Badge 
                variant="secondary" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                {content.badge}
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                {content.title}
              </h1>
              
              <p className="text-lg lg:text-xl text-purple-100 leading-relaxed max-w-xl">
                {content.subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-purple-900 hover:bg-purple-50 font-semibold px-8 py-3"
              >
                {content.ctaText}
              </Button>
              
              {content.secondaryCtaText && (
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-purple-900 font-semibold px-8 py-3"
                >
                  {content.secondaryCtaText}
                </Button>
              )}
            </div>

            {/* Trust indicators */}
            <div className="pt-8">
              <p className="text-purple-200 text-sm mb-4">Trusted by educators worldwide</p>
              <div className="flex items-center space-x-6 opacity-70">
                <div className="text-white font-semibold">10,000+ Students</div>
                <div className="text-white font-semibold">500+ Schools</div>
                <div className="text-white font-semibold">50+ Countries</div>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main hero image container */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl overflow-hidden">
                  {/* Placeholder for hero image */}
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                        </svg>
                      </div>
                      <p className="font-semibold">AI-Powered Learning</p>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                  <div className="flex items-center space-x-2 text-white text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>AI Assistant Active</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                  <div className="text-white text-sm">
                    <div className="font-semibold">Accessibility</div>
                    <div className="text-purple-200">WCAG 2.1 AA</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-8 left-8 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl" />
              <div className="absolute bottom-8 right-8 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 