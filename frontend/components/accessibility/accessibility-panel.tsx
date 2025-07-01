"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTheme, useAccessibility } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'
import { 
  Settings, 
  Eye, 
  Volume2, 
  Keyboard, 
  Palette, 
  Type, 
  MousePointer,
  Zap,
  RotateCcw,
  X
} from 'lucide-react'

interface AccessibilityPanelProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export default function AccessibilityPanel({ isOpen, onClose, className }: AccessibilityPanelProps) {
  const { theme, setTheme, resetToDefaults } = useTheme()
  const { accessibility, updateAccessibility } = useAccessibility()

  if (!isOpen) return null

  const handleToggle = (key: keyof typeof accessibility) => {
    updateAccessibility({ [key]: !accessibility[key] })
  }

  const handleSelectChange = (key: keyof typeof accessibility, value: string) => {
    updateAccessibility({ [key]: value })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className={cn("w-full max-w-2xl max-h-[90vh] overflow-y-auto", className)}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold">Accessibility Settings</h2>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <Label className="text-base font-semibold">Theme</Label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'high-contrast'] as const).map((themeOption) => (
                  <Button
                    key={themeOption}
                    variant={theme === themeOption ? 'default' : 'outline'}
                    onClick={() => setTheme(themeOption)}
                    className="capitalize"
                  >
                    {themeOption.replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Type className="w-4 h-4 text-purple-600" />
                <Label className="text-base font-semibold">Font Size</Label>
              </div>
              <Select 
                value={accessibility.fontSize} 
                onValueChange={(value) => handleSelectChange('fontSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium (Default)</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="extra-large">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Visual Accessibility */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-purple-600" />
                <Label className="text-base font-semibold">Visual Accessibility</Label>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast">High Contrast Mode</Label>
                  <Button
                    id="high-contrast"
                    variant={accessibility.highContrast ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggle('highContrast')}
                  >
                    {accessibility.highContrast ? 'On' : 'Off'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="dyslexia-font">Dyslexia-Friendly Font</Label>
                  <Button
                    id="dyslexia-font"
                    variant={accessibility.dyslexiaFriendlyFont ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggle('dyslexiaFriendlyFont')}
                  >
                    {accessibility.dyslexiaFriendlyFont ? 'On' : 'Off'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="reduced-motion">Reduce Motion</Label>
                  <Button
                    id="reduced-motion"
                    variant={accessibility.reducedMotion ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggle('reducedMotion')}
                  >
                    {accessibility.reducedMotion ? 'On' : 'Off'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Color Blindness Support */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <Label className="text-base font-semibold">Color Vision</Label>
              </div>
              <Select 
                value={accessibility.colorBlindness} 
                onValueChange={(value) => handleSelectChange('colorBlindness', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Normal Color Vision</SelectItem>
                  <SelectItem value="protanopia">Protanopia (Red-blind)</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia (Green-blind)</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia (Blue-blind)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Motor & Navigation */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MousePointer className="w-4 h-4 text-purple-600" />
                <Label className="text-base font-semibold">Navigation</Label>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="keyboard-nav">Enhanced Keyboard Navigation</Label>
                  <Button
                    id="keyboard-nav"
                    variant={accessibility.keyboardNavigation ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggle('keyboardNavigation')}
                  >
                    {accessibility.keyboardNavigation ? 'On' : 'Off'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="focus-indicators">Enhanced Focus Indicators</Label>
                  <Button
                    id="focus-indicators"
                    variant={accessibility.focusIndicators ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggle('focusIndicators')}
                  >
                    {accessibility.focusIndicators ? 'On' : 'Off'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Cognitive Support */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <Label className="text-base font-semibold">Cognitive Support</Label>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="adhd-friendly">ADHD-Friendly Mode</Label>
                  <Button
                    id="adhd-friendly"
                    variant={accessibility.adhdFriendly ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggle('adhdFriendly')}
                  >
                    {accessibility.adhdFriendly ? 'On' : 'Off'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Screen Reader */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-purple-600" />
                <Label className="text-base font-semibold">Screen Reader</Label>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="screen-reader">Screen Reader Optimizations</Label>
                <Button
                  id="screen-reader"
                  variant={accessibility.screenReader ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToggle('screenReader')}
                >
                  {accessibility.screenReader ? 'On' : 'Off'}
                </Button>
              </div>
            </div>

            {/* Current Settings Summary */}
            <div className="space-y-3 pt-4 border-t">
              <Label className="text-base font-semibold">Active Settings</Label>
              <div className="flex flex-wrap gap-2">
                {accessibility.highContrast && (
                  <Badge variant="purple">High Contrast</Badge>
                )}
                {accessibility.dyslexiaFriendlyFont && (
                  <Badge variant="purple">Dyslexia Font</Badge>
                )}
                {accessibility.reducedMotion && (
                  <Badge variant="purple">Reduced Motion</Badge>
                )}
                {accessibility.adhdFriendly && (
                  <Badge variant="purple">ADHD Friendly</Badge>
                )}
                {accessibility.screenReader && (
                  <Badge variant="purple">Screen Reader</Badge>
                )}
                {accessibility.keyboardNavigation && (
                  <Badge variant="purple">Keyboard Nav</Badge>
                )}
                {accessibility.colorBlindness !== 'none' && (
                  <Badge variant="purple">Color Vision Support</Badge>
                )}
                {accessibility.fontSize !== 'medium' && (
                  <Badge variant="purple">{accessibility.fontSize} Text</Badge>
                )}
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={resetToDefaults}
                className="w-full flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Defaults</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 