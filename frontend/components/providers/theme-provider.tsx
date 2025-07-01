"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'high-contrast'
type FontSize = 'small' | 'medium' | 'large' | 'extra-large'
type MotionPreference = 'no-preference' | 'reduce'
type ColorBlindnessType = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'

interface AccessibilityPreferences {
  fontSize: FontSize
  highContrast: boolean
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  colorBlindness: ColorBlindnessType
  dyslexiaFriendlyFont: boolean
  focusIndicators: boolean
  adhdFriendly: boolean
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  accessibility: AccessibilityPreferences
  updateAccessibility: (prefs: Partial<AccessibilityPreferences>) => void
  resetToDefaults: () => void
}

const defaultAccessibilityPreferences: AccessibilityPreferences = {
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: false,
  colorBlindness: 'none',
  dyslexiaFriendlyFont: false,
  focusIndicators: true,
  adhdFriendly: false
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'dawn-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [accessibility, setAccessibility] = useState<AccessibilityPreferences>(
    defaultAccessibilityPreferences
  )

  useEffect(() => {
    // Load theme from localStorage
    const storedTheme = localStorage.getItem(storageKey) as Theme
    if (storedTheme) {
      setTheme(storedTheme)
    }

    // Load accessibility preferences from localStorage
    const storedAccessibility = localStorage.getItem(`${storageKey}-accessibility`)
    if (storedAccessibility) {
      try {
        const parsed = JSON.parse(storedAccessibility)
        setAccessibility({ ...defaultAccessibilityPreferences, ...parsed })
      } catch (error) {
        console.warn('Failed to parse stored accessibility preferences')
      }
    }

    // Detect system preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      setAccessibility(prev => ({ ...prev, reducedMotion: true }))
    }

    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    if (contrastQuery.matches) {
      setAccessibility(prev => ({ ...prev, highContrast: true }))
    }
  }, [storageKey])

  useEffect(() => {
    // Apply theme to document
    const root = window.document.documentElement
    root.classList.remove('light', 'dark', 'high-contrast')
    root.classList.add(theme)

    // Apply accessibility classes
    root.classList.toggle('reduce-motion', accessibility.reducedMotion)
    root.classList.toggle('high-contrast', accessibility.highContrast)
    root.classList.toggle('dyslexia-friendly', accessibility.dyslexiaFriendlyFont)
    root.classList.toggle('adhd-friendly', accessibility.adhdFriendly)
    root.classList.toggle('screen-reader-mode', accessibility.screenReader)

    // Apply font size
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large')
    root.classList.add(`font-${accessibility.fontSize}`)

    // Apply color blindness filter
    root.classList.remove('protanopia', 'deuteranopia', 'tritanopia')
    if (accessibility.colorBlindness !== 'none') {
      root.classList.add(accessibility.colorBlindness)
    }

    // Store preferences
    localStorage.setItem(storageKey, theme)
    localStorage.setItem(`${storageKey}-accessibility`, JSON.stringify(accessibility))
  }, [theme, accessibility, storageKey])

  const updateAccessibility = (prefs: Partial<AccessibilityPreferences>) => {
    setAccessibility(prev => ({ ...prev, ...prefs }))
  }

  const resetToDefaults = () => {
    setTheme(defaultTheme)
    setAccessibility(defaultAccessibilityPreferences)
  }

  const value = {
    theme,
    setTheme,
    accessibility,
    updateAccessibility,
    resetToDefaults
  }

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

// Accessibility hook for easy access to accessibility preferences
export const useAccessibility = () => {
  const { accessibility, updateAccessibility } = useTheme()
  return { accessibility, updateAccessibility }
} 