'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";

const courses = [
  { title: 'Principles of Ecology', lessons: 15, hours: 15, price: '15,000 NGN', image: '/images/student.jpg' },
  { title: 'Photosynthesis', lessons: 15, hours: 15, price: '15,000 NGN', image: '/images/student.jpg' },
  { title: 'Principles of Economics', lessons: 15, hours: 15, price: '15,000 NGN', image: '/images/student.jpg' },
  { title: 'Physics Laws', lessons: 15, hours: 15, price: '15,000 NGN', image: '/images/student.jpg' },
];

export function TrendingCourses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trending Courses</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {courses.map((course, index) => (
          <div key={index} className="space-y-2">
            <Image src={course.image} alt={course.title} width={200} height={120} className="rounded-lg object-cover" />
            <h3 className="font-semibold">{course.title}</h3>
            <div className="text-sm text-gray-500 flex space-x-2">
              <span>{course.lessons} Lessons</span>
              <span>&bull;</span>
              <span>{course.hours} Hours</span>
            </div>
            <p className="font-bold">{course.price}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 