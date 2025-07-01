"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface RoleOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

interface RoleSelectionProps {
  onRoleSelect: (roleId: string) => void
  selectedRole?: string
  className?: string
}

const roleOptions: RoleOption[] = [
  {
    id: 'teacher',
    title: 'A Teacher',
    description: 'Empower your classroom with AI-driven tools',
    icon: (
      <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
          <path d="M19 15L20.09 17.26L23 18L20.09 18.74L19 21L17.91 18.74L15 18L17.91 17.26L19 15Z"/>
        </svg>
      </div>
    ),
    color: 'border-purple-200 hover:border-purple-300 hover:bg-purple-50'
  },
  {
    id: 'learner',
    title: 'A Learner',
    description: 'Discover personalized learning experiences',
    icon: (
      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
        </svg>
      </div>
    ),
    color: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50'
  },
  {
    id: 'creator',
    title: 'A Creator',
    description: 'Build engaging educational content',
    icon: (
      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.5 10.84L15.16 15.5L20.83 9.83L23.5 12.5L21 9Z"/>
        </svg>
      </div>
    ),
    color: 'border-green-200 hover:border-green-300 hover:bg-green-50'
  },
  {
    id: 'job_seeker',
    title: 'A Job Seeker',
    description: 'Enhance your skills for career growth',
    icon: (
      <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 2H14C15.1 2 16 2.9 16 4V6H20C21.1 6 22 6.9 22 8V19C22 20.1 21.1 21 20 21H4C2.9 21 2 20.1 2 19V8C2 6.9 2.9 6 4 6H8V4C8 2.9 8.9 2 10 2ZM14 6V4H10V6H14Z"/>
        </svg>
      </div>
    ),
    color: 'border-orange-200 hover:border-orange-300 hover:bg-orange-50'
  },
  {
    id: 'school',
    title: 'A School',
    description: 'Transform your institution with AI',
    icon: (
      <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3Z"/>
        </svg>
      </div>
    ),
    color: 'border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50'
  },
  {
    id: 'outsourcing_company',
    title: 'Outsourcing Company',
    description: 'Scale your services with AI solutions',
    icon: (
      <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 4C18.2 4 20 5.8 20 8C20 10.2 18.2 12 16 12C13.8 12 12 10.2 12 8C12 5.8 13.8 4 16 4ZM8 4C10.2 4 12 5.8 12 8C12 10.2 10.2 12 8 12C5.8 12 4 10.2 4 8C4 5.8 5.8 4 8 4ZM8 14C12.4 14 16 15.6 16 17.6V20H0V17.6C0 15.6 3.6 14 8 14ZM16 14C20.4 14 24 15.6 24 17.6V20H16V17.6C16 16.6 15.2 15.7 14 15.1C14.6 14.4 15.3 14 16 14Z"/>
        </svg>
      </div>
    ),
    color: 'border-pink-200 hover:border-pink-300 hover:bg-pink-50'
  },
  {
    id: 'parent',
    title: 'A Parent',
    description: 'Support your child\'s learning journey',
    icon: (
      <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12 12 10.2 12 8 13.8 4 16 4M16 14C18.2 14 20 15.8 20 18S18.2 22 16 22 12 20.2 12 18 13.8 14 16 14M8 4C10.2 4 12 5.8 12 8S10.2 12 8 12 4 10.2 4 8 5.8 4 8 4M8 14C10.2 14 12 15.8 12 18S10.2 22 8 22 4 20.2 4 18 5.8 14 8 14Z"/>
        </svg>
      </div>
    ),
    color: 'border-teal-200 hover:border-teal-300 hover:bg-teal-50'
  }
]

export default function RoleSelection({ onRoleSelect, selectedRole, className }: RoleSelectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Sign up for Dawn AI as a...</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {roleOptions.map((role) => (
          <Card
            key={role.id}
            className={cn(
              "p-6 cursor-pointer transition-all duration-200 text-center hover:shadow-md",
              role.color,
              selectedRole === role.id && "ring-2 ring-purple-500 border-purple-300 bg-purple-50"
            )}
            onClick={() => onRoleSelect(role.id)}
          >
            <div className="flex flex-col items-center">
              {role.icon}
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{role.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{role.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 