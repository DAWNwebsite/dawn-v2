'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LearningProfileForm } from '@/components/forms/LearningProfileForm';
import { AccessibilityForm } from '@/components/forms/AccessibilityForm';
import { 
  User, 
  Settings, 
  Shield, 
  Brain, 
  Accessibility,
  Loader2,
  Edit,
  X
} from 'lucide-react';

interface LearningProfile {
  id: string;
  userId: string;
  learningDisabilities: string[];
  learningStyle: string;
  difficultyLevel: string;
  preferredSubjects: string[];
  accommodations: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    dateOfBirth?: string;
  };
}

interface AccessibilityPreferences {
  id: string;
  userId: string;
  fontSize: string;
  theme: string;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicator: boolean;
  textToSpeech: boolean;
  closedCaptions: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [learningProfile, setLearningProfile] = useState<LearningProfile | null>(null);
  const [accessibilityPreferences, setAccessibilityPreferences] = useState<AccessibilityPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Edit mode states
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAccessibility, setEditingAccessibility] = useState(false);

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch learning profile and accessibility preferences in parallel
      const [profileResponse, accessibilityResponse] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/user/accessibility')
      ]);

      if (!profileResponse.ok || !accessibilityResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const [profileData, accessibilityData] = await Promise.all([
        profileResponse.json(),
        accessibilityResponse.json()
      ]);

      if (profileData.success) {
        setLearningProfile(profileData.data);
      }

      if (accessibilityData.success) {
        setAccessibilityPreferences(accessibilityData.data);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLearningProfile = async (data: any) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update learning profile');
      }

      const result = await response.json();
      setLearningProfile(result.data);
      setEditingProfile(false);
      
      // Refresh data to ensure consistency
      await fetchUserData();
    } catch (error) {
      throw error; // Let the form component handle the error
    }
  };

  const handleSaveAccessibilityPreferences = async (data: any) => {
    try {
      const response = await fetch('/api/user/accessibility', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update accessibility preferences');
      }

      const result = await response.json();
      setAccessibilityPreferences(result.data);
      setEditingAccessibility(false);
      
      // Refresh data to ensure consistency
      await fetchUserData();
    } catch (error) {
      throw error; // Let the form component handle the error
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <Shield className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-medium">Error Loading Settings</h3>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchUserData} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-600">
              Manage your learning profile and accessibility preferences
            </p>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Learning Profile</span>
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center space-x-2">
            <Accessibility className="h-4 w-4" />
            <span>Accessibility</span>
          </TabsTrigger>
        </TabsList>

        {/* Learning Profile Tab */}
        <TabsContent value="profile">
          {editingProfile ? (
            <LearningProfileForm
              initialData={learningProfile}
              onSave={handleSaveLearningProfile}
              onCancel={() => setEditingProfile(false)}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span>Learning Profile</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingProfile(true)}
                    className="flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Your personalized learning preferences and accommodations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {learningProfile ? (
                  <>
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Learning Style</label>
                        <div className="mt-1">
                          <Badge variant="secondary" className="capitalize">
                            {learningProfile.learningStyle}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Difficulty Level</label>
                        <div className="mt-1">
                          <Badge variant="outline" className="capitalize">
                            {learningProfile.difficultyLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Learning Considerations */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Learning Considerations</label>
                      <div className="mt-2">
                        {learningProfile.learningDisabilities.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {learningProfile.learningDisabilities.map((disability, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {disability}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No learning considerations specified</p>
                        )}
                      </div>
                    </div>

                    {/* Preferred Subjects */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Preferred Subjects</label>
                      <div className="mt-2">
                        {learningProfile.preferredSubjects.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {learningProfile.preferredSubjects.map((subject, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No preferred subjects specified</p>
                        )}
                      </div>
                    </div>

                    {/* Accommodations */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Accommodations</label>
                      <div className="mt-2">
                        {learningProfile.accommodations.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {learningProfile.accommodations.map((accommodation, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {accommodation}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No accommodations specified</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No learning profile found</p>
                    <Button 
                      className="mt-4"
                      onClick={() => setEditingProfile(true)}
                    >
                      Create Learning Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Accessibility Tab */}
        <TabsContent value="accessibility">
          {editingAccessibility ? (
            <AccessibilityForm
              initialData={accessibilityPreferences}
              onSave={handleSaveAccessibilityPreferences}
              onCancel={() => setEditingAccessibility(false)}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Accessibility className="h-5 w-5 text-green-600" />
                    <span>Accessibility Preferences</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingAccessibility(true)}
                    className="flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Customize your interface for optimal accessibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {accessibilityPreferences ? (
                  <>
                    {/* Visual Preferences */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Visual Preferences</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Font Size</label>
                          <div className="mt-1">
                            <Badge variant="secondary" className="capitalize">
                              {accessibilityPreferences.fontSize}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Theme</label>
                          <div className="mt-1">
                            <Badge variant="secondary" className="capitalize">
                              {accessibilityPreferences.theme}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Accessibility Features */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Accessibility Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'highContrast', label: 'High Contrast' },
                          { key: 'reducedMotion', label: 'Reduced Motion' },
                          { key: 'screenReader', label: 'Screen Reader' },
                          { key: 'keyboardNavigation', label: 'Keyboard Navigation' },
                          { key: 'focusIndicator', label: 'Focus Indicator' },
                          { key: 'textToSpeech', label: 'Text to Speech' },
                          { key: 'closedCaptions', label: 'Closed Captions' }
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm font-medium">{label}</span>
                            <Badge 
                              variant={accessibilityPreferences[key as keyof AccessibilityPreferences] ? 'default' : 'outline'}
                            >
                              {accessibilityPreferences[key as keyof AccessibilityPreferences] ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Accessibility className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No accessibility preferences found</p>
                    <Button 
                      className="mt-4"
                      onClick={() => setEditingAccessibility(true)}
                    >
                      Configure Accessibility
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
