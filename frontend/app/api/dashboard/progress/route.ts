import { NextResponse } from "next/server";

export async function GET() {
  const mockProgressData = {
    parent: [
      {
        studentId: 'student-1',
        studentName: 'Emma Johnson',
        courseProgress: [
          {
            courseId: 'course-1',
            courseName: 'Introduction to Reading',
            completionPercentage: 75,
            timeSpent: 1800,
            lastAccessed: new Date().toISOString(),
            status: 'in-progress'
          }
        ],
        overallProgress: {
          totalCourses: 2,
          completedCourses: 0,
          averageScore: 67.5,
          totalTimeSpent: 3000
        }
      }
    ]
  };

  return NextResponse.json({
    message: "Success",
    data: {
      progress: mockProgressData.parent
    },
  }, { status: 200 });
}
