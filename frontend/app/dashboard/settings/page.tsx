'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LearningProfileForm } from '@/components/forms/LearningProfileForm';
import { AccessibilityForm } from '@/components/forms/AccessibilityForm';
import { Loader2, Brain, Accessibility, Edit } from 'lucide-react';

// Simplified types for the page
type LearningProfile = any;
type AccessibilityPreferences = any;

export default function SettingsPage() {
  const { data: session } = useSession();
  const [learningProfile, setLearningProfile] = useState<LearningProfile | null>(null);
  const [accessibility, setAccessibility] = useState<AccessibilityPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setEditingProfile] = useState(false);
  const [isEditingAccessibility, setEditingAccessibility] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;
      setIsLoading(true);
      try {
        const [profileRes, accessibilityRes] = await Promise.all([
          fetch('/api/user/profile'),
          fetch('/api/user/accessibility'),
        ]);
        const profileData = await profileRes.json();
        const accessibilityData = await accessibilityRes.json();
        if (profileData.success) setLearningProfile(profileData.data);
        if (accessibilityData.success) setAccessibility(accessibilityData.data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [session]);

  const handleSave = async (type: 'profile' | 'accessibility', data: any) => {
    const url = type === 'profile' ? '/api/user/profile' : '/api/user/accessibility';
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to save');
      
      if (type === 'profile') {
        setLearningProfile(result.data);
        setEditingProfile(false);
      } else {
        setAccessibility(result.data);
        setEditingAccessibility(false);
      }
    } catch (error) {
      console.error(`Failed to save ${type}:`, error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and accessibility preferences.</p>
      </header>
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile"><Brain className="mr-2 h-4 w-4" />Learning Profile</TabsTrigger>
          <TabsTrigger value="accessibility"><Accessibility className="mr-2 h-4 w-4" />Accessibility</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Profile</CardTitle>
              <CardDescription>Your personalized learning settings.</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditingProfile ? (
                <LearningProfileForm initialData={learningProfile} onSave={(data) => handleSave('profile', data)} onCancel={() => setEditingProfile(false)} />
              ) : (
                <div className="space-y-4">
                  {/* Display Learning Profile Data */}
                  <p>Learning Style: {learningProfile?.learningStyle || 'Not set'}</p>
                  <Button onClick={() => setEditingProfile(true)}><Edit className="mr-2 h-4 w-4" />Edit</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="accessibility" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
              <CardDescription>Customize the interface for your needs.</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditingAccessibility ? (
                <AccessibilityForm initialData={accessibility} onSave={(data) => handleSave('accessibility', data)} onCancel={() => setEditingAccessibility(false)} />
              ) : (
                <div className="space-y-4">
                  {/* Display Accessibility Data */}
                  <p>Theme: {accessibility?.theme || 'Not set'}</p>
                  <Button onClick={() => setEditingAccessibility(true)}><Edit className="mr-2 h-4 w-4" />Edit</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
