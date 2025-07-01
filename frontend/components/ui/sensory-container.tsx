"use client"

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAccessibility } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'
import { Volume2, VolumeX, Palette, Eye, Zap } from 'lucide-react'

interface SensoryContainerProps {
  children: React.ReactNode
  className?: string
  enableSoundControl?: boolean
  enableVisualCalming?: boolean
  enableFocusMode?: boolean
  backgroundPattern?: 'none' | 'subtle' | 'waves' | 'dots'
  intensity?: 'low' | 'medium' | 'high'
}

export default function SensoryContainer({
  children,
  className,
  enableSoundControl = true,
  enableVisualCalming = true,
  enableFocusMode = true,
  backgroundPattern = 'subtle',
  intensity = 'low'
}: SensoryContainerProps) {
  const { accessibility } = useAccessibility()
  const [isMuted, setIsMuted] = useState(false)
  const [isCalming, setIsCalming] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [breathingAnimation, setBreathingAnimation] = useState(false)

  // Breathing animation for calming
  useEffect(() => {
    if (isCalming) {
      const interval = setInterval(() => {
        setBreathingAnimation(prev => !prev)
      }, 4000) // 4 second breathing cycle
      
      return () => clearInterval(interval)
    }
  }, [isCalming])

  const backgroundPatterns = {
    none: '',
    subtle: 'bg-gradient-to-br from-blue-50 to-purple-50',
    waves: 'bg-gradient-to-r from-blue-100 via-purple-50 to-pink-100',
    dots: 'bg-dots-pattern'
  }

  const intensityStyles = {
    low: {
      padding: 'p-6',
      shadow: 'shadow-sm',
      border: 'border'
    },
    medium: {
      padding: 'p-8',
      shadow: 'shadow-md',
      border: 'border-2'
    },
    high: {
      padding: 'p-10',
      shadow: 'shadow-lg',
      border: 'border-4'
    }
  }

  return (
    <Card
      className={cn(
        "relative transition-all duration-1000 ease-in-out",
        backgroundPatterns[backgroundPattern],
        intensityStyles[intensity].padding,
        intensityStyles[intensity].shadow,
        intensityStyles[intensity].border,
        
        // Accessibility overrides
        accessibility.reducedMotion && "transition-none",
        accessibility.highContrast && "bg-white border-black",
        
        // Focus mode - minimal distractions
        isFocusMode && "bg-white border-gray-200 shadow-none",
        
        // Calming mode
        isCalming && !accessibility.reducedMotion && "animate-pulse",
        breathingAnimation && !accessibility.reducedMotion && "scale-[1.02]",
        
        className
      )}
      style={{
        filter: isMuted ? 'grayscale(20%)' : 'none',
      }}
    >
      {/* Sensory Controls */}
      <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 hover:opacity-100 transition-opacity">
        {enableSoundControl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="h-6 w-6 p-0"
            aria-label={isMuted ? "Enable sounds" : "Mute sounds"}
            title="Sound Control"
          >
            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          </Button>
        )}
        
        {enableVisualCalming && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCalming(!isCalming)}
            className="h-6 w-6 p-0"
            aria-label={isCalming ? "Disable calming mode" : "Enable calming mode"}
            title="Visual Calming"
          >
            <Eye className="w-3 h-3" />
          </Button>
        )}
        
        {enableFocusMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFocusMode(!isFocusMode)}
            className="h-6 w-6 p-0"
            aria-label={isFocusMode ? "Disable focus mode" : "Enable focus mode"}
            title="Focus Mode"
          >
            <Zap className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Breathing Guide (for calming) */}
      {isCalming && !accessibility.reducedMotion && (
        <div className="absolute top-4 left-4">
          <div className={cn(
            "w-3 h-3 rounded-full transition-all duration-2000 ease-in-out",
            breathingAnimation ? "bg-blue-400 scale-150" : "bg-blue-300 scale-100"
          )} />
          <span className="sr-only">
            {breathingAnimation ? "Breathe in" : "Breathe out"}
          </span>
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          "relative z-10",
          // Reduce visual complexity in focus mode
          isFocusMode && "space-y-4",
          // Ensure adequate spacing for sensory processing
          "space-y-3"
        )}
      >
        {children}
      </div>

      {/* Subtle border indicator for active modes */}
      {(isCalming || isFocusMode) && (
        <div className={cn(
          "absolute inset-0 rounded-lg border-2 pointer-events-none",
          isCalming && "border-blue-200",
          isFocusMode && "border-purple-200",
          isCalming && isFocusMode && "border-gradient-to-r from-blue-200 to-purple-200"
        )} />
      )}
    </Card>
  )
} 