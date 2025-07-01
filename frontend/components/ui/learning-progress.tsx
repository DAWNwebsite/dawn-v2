"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAccessibility } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'
import { 
  Brain, 
  Clock, 
  Target, 
  TrendingUp, 
  Award,
  Zap,
  CheckCircle,
  Circle,
  AlertCircle
} from 'lucide-react'

interface LearningProgressProps {
  title: string
  description?: string
  progress: number // 0-100
  cognitiveLoad: 'low' | 'medium' | 'high'
  timeSpent?: string
  estimatedTime?: string
  skillsLearned?: string[]
  nextMilestone?: string
  achievements?: Achievement[]
  className?: string
}

interface Achievement {
  id: string
  title: string
  description: string
  earnedAt: Date
  icon?: React.ReactNode
}

const cognitiveLoadConfig = {
  low: {
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: <Brain className="w-4 h-4 text-green-600" />,
    label: 'Low Cognitive Load',
    description: 'Easy to process, minimal mental effort required'
  },
  medium: {
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: <Brain className="w-4 h-4 text-orange-600" />,
    label: 'Medium Cognitive Load',
    description: 'Moderate mental effort, good for skill building'
  },
  high: {
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: <Brain className="w-4 h-4 text-red-600" />,
    label: 'High Cognitive Load',
    description: 'Challenging content, requires focused attention'
  }
}

export default function LearningProgress({
  title,
  description,
  progress,
  cognitiveLoad,
  timeSpent,
  estimatedTime,
  skillsLearned = [],
  nextMilestone,
  achievements = [],
  className
}: LearningProgressProps) {
  const { accessibility } = useAccessibility()
  const loadConfig = cognitiveLoadConfig[cognitiveLoad]

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return null
    return timeString.includes('min') ? timeString : `${timeString} min`
  }

  return (
    <Card className={cn(
      "p-6 space-y-6",
      accessibility.adhdFriendly && "border-2 shadow-md",
      accessibility.highContrast && "border-black",
      className
    )}>
      {/* Header Section */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={cn(
              "text-xl font-semibold text-gray-900",
              accessibility.dyslexiaFriendlyFont && "font-mono",
              accessibility.fontSize === 'large' && "text-2xl",
              accessibility.fontSize === 'extra-large' && "text-3xl"
            )}>
              {title}
            </h3>
            {description && (
              <p className={cn(
                "text-gray-600 mt-1",
                accessibility.fontSize === 'large' && "text-lg",
                accessibility.fontSize === 'extra-large' && "text-xl",
                accessibility.highContrast && "text-black"
              )}>
                {description}
              </p>
            )}
          </div>
          
          {/* Cognitive Load Indicator */}
          <div className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-lg border",
            loadConfig.bgColor,
            loadConfig.borderColor,
            accessibility.adhdFriendly && "border-2"
          )}>
            {loadConfig.icon}
            <div className="text-sm">
              <div className={cn("font-medium", loadConfig.color)}>
                {loadConfig.label}
              </div>
              {accessibility.screenReader && (
                <div className={cn("text-xs", loadConfig.color)}>
                  {loadConfig.description}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Progress</span>
            <span className={cn(
              "font-semibold",
              progress >= 80 ? "text-green-600" : 
              progress >= 50 ? "text-blue-600" : 
              progress >= 25 ? "text-yellow-600" : "text-gray-500"
            )}>
              {progress}%
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={progress} 
              className={cn(
                "h-3 bg-gray-200",
                accessibility.highContrast && "bg-gray-300 border border-black"
              )}
            />
            {accessibility.adhdFriendly && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white drop-shadow">
                  {progress}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {timeSpent && (
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-blue-700">Time Spent</div>
              <div className="text-lg font-semibold text-blue-800">
                {formatTime(timeSpent)}
              </div>
            </div>
          </div>
        )}

        {estimatedTime && (
          <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
            <Target className="w-5 h-5 text-purple-600" />
            <div>
              <div className="text-sm font-medium text-purple-700">Est. Completion</div>
              <div className="text-lg font-semibold text-purple-800">
                {formatTime(estimatedTime)}
              </div>
            </div>
          </div>
        )}

        {skillsLearned.length > 0 && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm font-medium text-green-700">Skills Learned</div>
              <div className="text-lg font-semibold text-green-800">
                {skillsLearned.length}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Skills Section */}
      {skillsLearned.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Skills Mastered</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {skillsLearned.map((skill, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className={cn(
                  "bg-green-100 text-green-800 border-green-200",
                  accessibility.highContrast && "border-black bg-white"
                )}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Next Milestone */}
      {nextMilestone && (
        <div className={cn(
          "p-4 rounded-lg border-l-4 border-blue-400",
          accessibility.adhdFriendly ? "bg-blue-50" : "bg-gray-50"
        )}>
          <div className="flex items-start space-x-3">
            <Circle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Next Milestone</h4>
              <p className={cn(
                "text-gray-700 mt-1",
                accessibility.fontSize === 'large' && "text-lg"
              )}>
                {nextMilestone}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center space-x-2">
            <Award className="w-4 h-4 text-yellow-500" />
            <span>Recent Achievements</span>
          </h4>
          <div className="space-y-2">
            {achievements.slice(0, 3).map((achievement) => (
              <div 
                key={achievement.id}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg",
                  accessibility.adhdFriendly ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50"
                )}
              >
                <div className="flex-shrink-0">
                  {achievement.icon || <Award className="w-5 h-5 text-yellow-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-gray-900 truncate">
                    {achievement.title}
                  </h5>
                  <p className="text-sm text-gray-600 truncate">
                    {achievement.description}
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {achievement.earnedAt.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADHD-Friendly Focus Indicator */}
      {accessibility.adhdFriendly && (
        <div className="flex items-center justify-center p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 text-sm text-blue-700">
            <AlertCircle className="w-4 h-4" />
            <span>Focus Mode: Minimal distractions, clear progress indicators</span>
          </div>
        </div>
      )}
    </Card>
  )
} 