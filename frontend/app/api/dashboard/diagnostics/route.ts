import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const mockDiagnosticData = {
  parent: [
    {
      studentId: 'student-1',
      studentName: 'Emma Johnson',
      diagnosticResults: [
        {
          id: 'diag-1',
          type: 'adhd',
          completedAt: '2024-06-20T10:30:00Z',
          overallScore: 74,
          confidenceLevel: 'high',
          severityLevel: 'moderate',
          summary: 'Assessment indicates moderate attention challenges with hyperactivity components.',
          recommendations: [
            'Implement 25-minute focused work sessions with 5-minute breaks',
            'Use visual cues and checklists for task completion',
            'Consider fidget tools during reading activities'
          ],
          needsIntervention: true
        }
      ],
      accommodations: ['Extended time on tests', 'Frequent breaks', 'Preferential seating']
    }
  ],
  teacher: [
    {
      studentId: 'student-1',
      studentName: 'Emma Johnson',
      diagnosticResults: [
        {
          id: 'diag-1',
          type: 'adhd',
          completedAt: '2024-06-20T10:30:00Z',
          overallScore: 74,
          confidenceLevel: 'high',
          severityLevel: 'moderate',
          summary: 'Moderate attention challenges with hyperactivity.',
          recommendations: ['Implement 25-minute focused work sessions', 'Use visual cues'],
          needsIntervention: true
        }
      ],
      accommodations: ['Extended time on tests', 'Frequent breaks']
    },
    {
      studentId: 'student-3',
      studentName: 'Sofia Rodriguez',
      diagnosticResults: [
        {
          id: 'diag-4',
          type: 'dyslexia',
          completedAt: '2024-06-25T11:20:00Z',
          overallScore: 82,
          confidenceLevel: 'very_high',
          severityLevel: 'moderate',
          summary: 'Clear dyslexia indicators with significant reading and spelling challenges.',
          recommendations: ['Intensive phonics intervention', 'Text-to-speech for materials'],
          needsIntervention: true
        }
      ],
      accommodations: ['Audio books', 'Voice-to-text software']
    }
  ],
  admin: [
    {
      studentId: 'platform-stats',
      studentName: 'Platform Overview',
      diagnosticResults: [{
        id: 'platform-summary',
        type: 'comprehensive',
        completedAt: new Date().toISOString(),
        overallScore: 0,
        confidenceLevel: 'platform-data',
        severityLevel: 'summary',
        summary: 'Platform-wide diagnostic summary',
        recommendations: [],
        needsIntervention: false
      }],
      accommodations: []
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

    let diagnosticData: any[] = [];
    let platformStats = null;

    switch (userRole) {
      case 'parent':
        diagnosticData = mockDiagnosticData.parent;
        break;
      case 'teacher':
        diagnosticData = mockDiagnosticData.teacher;
        break;
      case 'admin':
        diagnosticData = mockDiagnosticData.admin;
        platformStats = {
          totalAssessments: 156,
          completedThisMonth: 23,
          adhdDiagnoses: 45,
          dyslexiaDiagnoses: 32,
          autismDiagnoses: 18,
          needingIntervention: 28,
          complianceRate: 0.94
        };
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
        diagnostics: diagnosticData,
        platformStats,
        metadata: {
          lastUpdated: new Date().toISOString(),
          totalStudents: diagnosticData.length,
          dataScope: userRole === 'admin' ? 'platform-wide' : 
                    userRole === 'teacher' ? 'assigned-students' : 'child-only'
        }
      }
    });

  } catch (error) {
    console.error('Error fetching diagnostic data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
