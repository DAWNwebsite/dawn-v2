"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAccessibility } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'
import { Volume2, VolumeX, Pause, Play } from 'lucide-react'

interface DyslexiaTextProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'base' | 'lg' | 'xl'
  enableReadAloud?: boolean
  highlightOnRead?: boolean
  lineHeight?: 'normal' | 'relaxed' | 'loose'
  letterSpacing?: 'normal' | 'wide' | 'wider'
}

export default function DyslexiaText({
  children,
  className,
  size = 'base',
  enableReadAloud = true,
  highlightOnRead = true,
  lineHeight = 'relaxed',
  letterSpacing = 'normal'
}: DyslexiaTextProps) {
  const { accessibility } = useAccessibility()
  const [isReading, setIsReading] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const lineHeightClasses = {
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose'
  }

  const letterSpacingClasses = {
    normal: 'tracking-normal',
    wide: 'tracking-wide',
    wider: 'tracking-wider'
  }

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      if (isReading && !isPaused) {
        window.speechSynthesis.pause()
        setIsPaused(true)
      } else if (isReading && isPaused) {
        window.speechSynthesis.resume()
        setIsPaused(false)
      } else {
        const text = typeof children === 'string' ? children : ''
        const utterance = new SpeechSynthesisUtterance(text)
        
        utterance.rate = 0.8 // Slightly slower for better comprehension
        utterance.pitch = 1
        utterance.volume = 1
        
        utterance.onstart = () => {
          setIsReading(true)
          setIsPaused(false)
        }
        
        utterance.onend = () => {
          setIsReading(false)
          setIsPaused(false)
        }
        
        utterance.onerror = () => {
          setIsReading(false)
          setIsPaused(false)
        }
        
        window.speechSynthesis.speak(utterance)
      }
    }
  }

  const stopReading = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsReading(false)
      setIsPaused(false)
    }
  }

  return (
    <div className="relative group">
      {enableReadAloud && (
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-1">
            {isReading && (
              <Button
                variant="outline"
                size="sm"
                onClick={isPaused ? handleReadAloud : () => setIsPaused(true)}
                className="h-6 w-6 p-0"
                aria-label={isPaused ? "Resume reading" : "Pause reading"}
              >
                {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={isReading ? stopReading : handleReadAloud}
              className="h-6 w-6 p-0"
              aria-label={isReading ? "Stop reading" : "Read aloud"}
            >
              {isReading ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      )}
      
      <div
        className={cn(
          // Base styles
          "text-gray-900 transition-colors",
          
          // Size
          sizeClasses[size],
          
          // Accessibility overrides
          accessibility.fontSize === 'large' && "text-lg",
          accessibility.fontSize === 'extra-large' && "text-xl",
          
          // Line height
          lineHeightClasses[lineHeight],
          
          // Letter spacing
          letterSpacingClasses[letterSpacing],
          
          // Dyslexia-friendly font
          accessibility.dyslexiaFriendlyFont && "font-mono",
          
          // High contrast
          accessibility.highContrast && "text-black",
          
          // Reading highlight
          highlightOnRead && isReading && "bg-yellow-100 rounded px-1",
          
          // ADHD-friendly (reduced visual noise)
          accessibility.adhdFriendly && "leading-loose tracking-wide",
          
          className
        )}
        style={{
          // Additional dyslexia-friendly styles
          wordSpacing: accessibility.dyslexiaFriendlyFont ? '0.2em' : 'normal',
          textAlign: 'left', // Avoid justified text which can create rivers
        }}
      >
        {children}
      </div>
    </div>
  )
} 