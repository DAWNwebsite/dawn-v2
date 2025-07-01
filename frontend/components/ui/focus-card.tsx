"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAccessibility } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'
import { Clock, Target, CheckCircle } from 'lucide-react'

interface FocusCardProps {
  title: string
  description?: string
  timeEstimate?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  completed?: boolean
  onClick?: () => void
  children?: React.ReactNode
  className?: string
  priority?: 'low' | 'medium' | 'high'
}

export default function FocusCard({
  title,
  description,
  timeEstimate,
  difficulty = 'medium',
  completed = false,
  onClick,
  children,
  className,
  priority = 'medium'
}: FocusCardProps) {
  const { accessibility } = useAccessibility()

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    hard: 'bg-red-100 text-red-800 border-red-200'
  }

  const priorityColors = {
    low: 'border-l-gray-400',
    medium: 'border-l-blue-400',
    high: 'border-l-red-400'
  }

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md cursor-pointer border-l-4",
        priorityColors[priority],
        accessibility.adhdFriendly && "shadow-sm border-2",
        accessibility.highContrast && "border-black",
        accessibility.reducedMotion && "transition-none",
        completed && "opacity-75 bg-green-50",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      aria-label={`${title}${completed ? ' - Completed' : ''}`}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              {completed && <CheckCircle className="w-4 h-4 text-green-600" />}
              <h3 className={cn(
                "font-semibold leading-tight",
                accessibility.dyslexiaFriendlyFont && "font-mono",
                accessibility.fontSize === 'large' && "text-lg",
                accessibility.fontSize === 'extra-large' && "text-xl",
                completed && "line-through text-gray-600"
              )}>
                {title}
              </h3>
            </div>
            
            {description && (
              <p className={cn(
                "text-gray-600 leading-relaxed",
                accessibility.fontSize === 'large' && "text-base",
                accessibility.fontSize === 'extra-large' && "text-lg",
                accessibility.highContrast && "text-black"
              )}>
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {timeEstimate && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{timeEstimate}</span>
              </div>
            )}
            
            {difficulty && (
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  difficultyColors[difficulty],
                  accessibility.highContrast && "border-black"
                )}
              >
                <Target className="w-3 h-3 mr-1" />
                {difficulty}
              </Badge>
            )}
          </div>

          {priority === 'high' && (
            <Badge variant="destructive" className="text-xs">
              High Priority
            </Badge>
          )}
        </div>

        {children && (
          <div className="pt-2 border-t border-gray-100">
            {children}
          </div>
        )}
      </div>
    </Card>
  )
} 