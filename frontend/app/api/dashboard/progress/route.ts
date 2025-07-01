import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Mock progress data
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
  ],
  teacher: [
    {
      studentId: 'student-1',
      studentName: 'Emma Johnson',
      courseProgress: [{
        courseId: 'course-1',
        courseName: 'Introduction to Reading',
        completionPercentage: 75,
        timeSpent: 1800,
        lastAccessed: new Date().toISOString(),
        status: 'in-progress'
      }],
      overallProgress: { totalCourses: 2, completedCourses: 0, averageScore: 67.5, totalTimeSpent: 3000 }
    },
    {
      studentId: 'student-2',
      studentName: 'Alex Chen',
      courseProgress: [{
        courseId: 'course-1',
        courseName: 'Introduction to Reading',
        completionPercentage: 90,
        timeSpent: 2100,
        lastAccessed: new Date().toISOString(),
        status: 'in-progress'
      }],
      overallProgress: { totalCourses: 2, completedCourses: 0, averageScore: 85.0, totalTimeSpent: 2100 }
    }
  ],
  admin: [
    {
      studentId: 'all-students',
      studentName: 'Platform Overview',
      courseProgress: [],
      overallProgress: { totalCourses: 10, completedCourses: 3, averageScore: 72.8, totalTimeSpent: 45600 }
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role || 'student';
    const userId = session.user.id;

    let progressData: any[] = [];

    switch (userRole) {
      case 'parent':
        progressData = mockProgressData.parent;
        break;
      case 'teacher':
        progressData = mockProgressData.teacher;
        break;
      case 'admin':
        progressData = mockProgressData.admin;
        break;
      case 'student':
        return NextResponse.json({ error: 'Access through student dashboard' }, { status: 403 });
      default:
        return NextResponse.json({ error: 'Invalid user role' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: {
        userRole,
        userId,
        progress: progressData,
        metadata: {
          lastUpdated: new Date().toISOString(),
          totalStudents: progressData.length,
          dataScope: userRole === 'admin' ? 'platform-wide' : 
                    userRole === 'teacher' ? 'assigned-students' : 'child-only'
        }
      }
    });

  } catch (error) {
    console.error('Error fetching progress data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
