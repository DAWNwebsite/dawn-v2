'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Accessibility, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface AccessibilityFormData {
  fontSize: string;
  theme: string;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicator: boolean;
  textToSpeech: boolean;
  closedCaptions: boolean;
}

interface AccessibilityFormProps {
  initialData?: any;
  onSave: (data: AccessibilityFormData) => Promise<void>;
  onCancel: () => void;
}

const FONT_SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'extra-large', label: 'Extra Large' }
];

const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto (System)' }
];

const ACCESSIBILITY_FEATURES = [
  {
    key: 'highContrast',
    label: 'High Contrast',
    description: 'Increase contrast for better visibility'
  },
  {
    key: 'reducedMotion',
    label: 'Reduced Motion',
    description: 'Minimize animations and transitions'
  },
  {
    key: 'screenReader',
    label: 'Screen Reader Support',
    description: 'Enhanced compatibility with screen readers'
  },
  {
    key: 'keyboardNavigation',
    label: 'Keyboard Navigation',
    description: 'Navigate using keyboard shortcuts'
  },
  {
    key: 'focusIndicator',
    label: 'Enhanced Focus Indicators',
    description: 'Clear visual focus indicators for navigation'
  },
  {
    key: 'textToSpeech',
    label: 'Text to Speech',
    description: 'Audio narration of text content'
  },
  {
    key: 'closedCaptions',
    label: 'Closed Captions',
    description: 'Text captions for audio content'
  }
];

export function AccessibilityForm({ initialData, onSave, onCancel }: AccessibilityFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AccessibilityFormData>({
    defaultValues: {
      fontSize: initialData?.fontSize || 'medium',
      theme: initialData?.theme || 'auto',
      highContrast: initialData?.highContrast || false,
      reducedMotion: initialData?.reducedMotion || false,
      screenReader: initialData?.screenReader || false,
      keyboardNavigation: initialData?.keyboardNavigation || false,
      focusIndicator: initialData?.focusIndicator || false,
      textToSpeech: initialData?.textToSpeech || false,
      closedCaptions: initialData?.closedCaptions || false
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: AccessibilityFormData) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      await onSave(data);
      setSuccess('Accessibility preferences updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update accessibility preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Accessibility className="h-5 w-5 text-blue-600" />
          <span>Edit Accessibility Preferences</span>
        </CardTitle>
        <CardDescription>
          Customize your accessibility settings for a better learning experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Display Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Display Settings</h3>
            
            {/* Font Size */}
            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size</Label>
              <Select
                value={watchedValues.fontSize}
                onValueChange={(value) => setValue('fontSize', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Theme */}
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={watchedValues.theme}
                onValueChange={(value) => setValue('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {THEMES.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Accessibility Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Accessibility Features</h3>
            <div className="space-y-4">
              {ACCESSIBILITY_FEATURES.map((feature) => (
                <div key={feature.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Label htmlFor={feature.key} className="font-medium">
                        {feature.label}
                      </Label>
                      <Switch
                        id={feature.key}
                        checked={watchedValues[feature.key as keyof AccessibilityFormData] as boolean}
                        onCheckedChange={(checked) => setValue(feature.key as keyof AccessibilityFormData, checked)}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
              <CheckCircle className="h-4 w-4" />
              <span>{success}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
