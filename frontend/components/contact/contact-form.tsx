"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Mail, Phone, MapPin } from 'lucide-react'

interface ContactFormProps {
  className?: string
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  message: string
}

export default function ContactForm({ className }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Form submitted:', formData)
    setIsSubmitting(false)
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      message: ''
    })
  }

  return (
    <div className={cn("max-w-6xl mx-auto p-6", className)}>
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <Card className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
            <p className="text-purple-200 mb-8">
              Reach out to us for any enquiries or complaints
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">000000000000</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">info@dawnaistudy.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">lorem ipsum</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />
          <div className="absolute top-0 left-0 w-24 h-24 bg-pink-400/20 rounded-full blur-xl" />
        </Card>

        {/* Contact Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700 font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700 font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter a valid Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-gray-700 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter a Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-700 font-medium">
                Message
              </Label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg"
            >
              {isSubmitting ? 'Sending Message...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
} 