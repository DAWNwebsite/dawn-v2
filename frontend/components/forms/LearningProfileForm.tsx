'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Brain, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface LearningProfileFormData {
  learningDisabilities: string[];
  learningStyle: string;
  difficultyLevel: string;
  preferredSubjects: string[];
  accommodations: string[];
}

interface LearningProfileFormProps {
  initialData?: any;
  onSave: (data: LearningProfileFormData) => Promise<void>;
  onCancel: () => void;
}

const LEARNING_DISABILITIES = [
  'ADHD',
  'Dyslexia', 
  'Autism Spectrum Disorder',
  'Dysgraphia',
  'Dyscalculia',
  'Processing Disorders',
  'Memory Disorders'
];

const LEARNING_STYLES = [
  { value: 'visual', label: 'Visual' },
  { value: 'auditory', label: 'Auditory' },
  { value: 'kinesthetic', label: 'Kinesthetic' },
  { value: 'reading/writing', label: 'Reading/Writing' }
];

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const SUBJECTS = [
  'Mathematics',
  'Reading',
  'Writing',
  'Science',
  'Social Studies',
  'Art',
  'Music',
  'Physical Education',
  'Technology',
  'Foreign Languages'
];

const ACCOMMODATIONS = [
  'Extended time on tests',
  'Quiet testing environment',
  'Frequent breaks',
  'Alternative assessment formats',
  'Use of assistive technology',
  'Preferential seating',
  'Modified assignments',
  'Audio instructions',
  'Visual aids',
  'Peer support'
];

export function LearningProfileForm({ initialData, onSave, onCancel }: LearningProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<LearningProfileFormData>({
    defaultValues: {
      learningDisabilities: initialData?.learningDisabilities || [],
      learningStyle: initialData?.learningStyle || 'visual',
      difficultyLevel: initialData?.difficultyLevel || 'beginner',
      preferredSubjects: initialData?.preferredSubjects || [],
      accommodations: initialData?.accommodations || []
    }
  });

  const watchedValues = watch();

  const handleArrayFieldChange = (fieldName: keyof LearningProfileFormData, value: string, checked: boolean) => {
    const currentValues = watchedValues[fieldName] as string[];
    if (checked) {
      setValue(fieldName, [...currentValues, value]);
    } else {
      setValue(fieldName, currentValues.filter(item => item !== value));
    }
  };

  const onSubmit = async (data: LearningProfileFormData) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      await onSave(data);
      setSuccess('Learning profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update learning profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>Edit Learning Profile</span>
        </CardTitle>
        <CardDescription>
          Customize your learning preferences and accommodations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Learning Style */}
          <div className="space-y-2">
            <Label htmlFor="learningStyle">Learning Style</Label>
            <Select
              value={watchedValues.learningStyle}
              onValueChange={(value) => setValue('learningStyle', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your learning style" />
              </SelectTrigger>
              <SelectContent>
                {LEARNING_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-2">
            <Label htmlFor="difficultyLevel">Difficulty Level</Label>
            <Select
              value={watchedValues.difficultyLevel}
              onValueChange={(value) => setValue('difficultyLevel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty level" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Learning Considerations */}
          <div className="space-y-3">
            <Label>Learning Considerations</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {LEARNING_DISABILITIES.map((disability) => (
                <div key={disability} className="flex items-center space-x-2">
                  <Checkbox
                    id={`disability-${disability}`}
                    checked={watchedValues.learningDisabilities.includes(disability)}
                    onCheckedChange={(checked) => 
                      handleArrayFieldChange('learningDisabilities', disability, checked as boolean)
                    }
                  />
                  <Label htmlFor={`disability-${disability}`} className="text-sm">
                    {disability}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Subjects */}
          <div className="space-y-3">
            <Label>Preferred Subjects</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUBJECTS.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject}`}
                    checked={watchedValues.preferredSubjects.includes(subject)}
                    onCheckedChange={(checked) => 
                      handleArrayFieldChange('preferredSubjects', subject, checked as boolean)
                    }
                  />
                  <Label htmlFor={`subject-${subject}`} className="text-sm">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Accommodations */}
          <div className="space-y-3">
            <Label>Recommended Accommodations</Label>
            <div className="grid grid-cols-1 gap-3">
              {ACCOMMODATIONS.map((accommodation) => (
                <div key={accommodation} className="flex items-center space-x-2">
                  <Checkbox
                    id={`accommodation-${accommodation}`}
                    checked={watchedValues.accommodations.includes(accommodation)}
                    onCheckedChange={(checked) => 
                      handleArrayFieldChange('accommodations', accommodation, checked as boolean)
                    }
                  />
                  <Label htmlFor={`accommodation-${accommodation}`} className="text-sm">
                    {accommodation}
                  </Label>
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
