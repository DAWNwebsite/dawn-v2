'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

const myCoursesData = [
    { title: 'The Principles and Truth of Photography', progress: 35, image: '/images/book.png' },
    { title: 'Advanced Mathematics', progress: 75, image: '/images/circle.png' },
    { title: 'Introduction to AI', progress: 0, image: '/images/arr.png', recommended: true },
];

export function MyCourses() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {myCoursesData.map((course, index) => (
                        <li key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center space-x-4">
                                <Image src={course.image} alt={course.title} width={80} height={80} className="rounded-lg object-cover" />
                                <div>
                                    <h3 className="font-semibold">{course.title}</h3>
                                    {course.recommended && <p className="text-sm text-purple-600">Recommended by Dawn AI</p>}
                                    {course.progress > 0 && <Progress value={course.progress} className="w-32 mt-2" />}
                                </div>
                            </div>
                            {course.progress > 0 ? (
                                <Button>Continue</Button>
                            ) : (
                                <div className="flex space-x-2">
                                    <Button>Start Course</Button>
                                    <Button variant="outline">Details</Button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
} 