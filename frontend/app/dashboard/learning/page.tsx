'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';

const inProgressCourses = [
  {
    id: 1,
    title: 'The Principles of Photosynthesis',
    author: 'David Hanson',
    progress: 35,
    image: '/images/student.jpg',
  },
  {
    id: 2,
    title: 'Ecology between plants and animals',
    author: 'David Hanson',
    progress: 35,
    image: '/images/student.jpg',
  },
];

const suggestedCourses = [
  { id: 1, title: 'Introduction to Nitrogen Cycle', lessons: 15, hours: 15, image: '/images/student.jpg' },
  { id: 2, title: 'Principles of UI/UX Design', lessons: 15, hours: 15, image: '/images/student.jpg' },
  { id: 3, title: 'Principles of Economics', lessons: 15, hours: 15, image: '/images/student.jpg' },
  { id: 4, title: 'Principles of Physics', lessons: 15, hours: 15, image: '/images/student.jpg' },
];

export default function LearningPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Button>Start New Course</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="in-progress">
            <TabsList>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <TabsContent value="in-progress" className="mt-4">
              <div className="space-y-4">
                {inProgressCourses.map((course) => (
                  <Card key={course.id}>
                    <CardContent className="flex items-center gap-6 p-4">
                      <Image src={course.image} alt={course.title} width={150} height={100} className="rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{course.author}</p>
                        <h3 className="text-lg font-semibold">{course.title}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <Progress value={course.progress} className="w-full" />
                          <span>{course.progress}%</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button>Continue</Button>
                        <Button variant="outline">Archive</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="completed">
              <p>Completed courses will be shown here.</p>
            </TabsContent>
            <TabsContent value="archived">
              <p>Archived courses will be shown here.</p>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">DAWN Suggestions</h2>
          <div className="space-y-4">
            {suggestedCourses.map((course) => (
              <Card key={course.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <Image src={course.image} alt={course.title} width={80} height={80} className="rounded-lg object-cover" />
                  <div>
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.lessons} Lessons &bull; {course.hours} Hours</p>
                    <Button variant="link" className="p-0 h-auto mt-1">Enroll Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
