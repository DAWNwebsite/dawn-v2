import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const mockRecommendationData = {
  parent: [
    {
      studentId: 'student-1',
      studentName: 'Emma Johnson',
      recommendations: [
        {
          id: 'rec-1',
          type: 'academic',
          priority: 'high',
          title: 'Implement Structured Reading Time',
          description: 'Based on Emma\'s ADHD assessment, establishing consistent 20-minute reading sessions will improve focus.',
          source: 'AIDA_agent',
          actionItems: [
            'Set up a quiet, distraction-free reading space',
            'Use a timer for 20-minute focused sessions',
            'Follow up with 5-minute movement breaks'
          ],
          implementationTimeframe: 'Start this week',
          expectedOutcome: 'Improved reading stamina within 1 month',
          createdAt: '2024-06-26T09:30:00Z',
          status: 'new'
        },
        {
          id: 'rec-2',
          type: 'accessibility',
          priority: 'medium',
          title: 'Explore Audio Book Options',
          description: 'Supplementing traditional reading with audio books can maintain comprehension.',
          source: 'diagnostic_result',
          actionItems: ['Sign up for library audio service', 'Download learning apps'],
          implementationTimeframe: 'Begin within 1 week',
          expectedOutcome: 'Maintained comprehension levels',
          createdAt: '2024-06-25T14:20:00Z',
          status: 'in_progress'
        }
      ],
      urgentAlerts: [
        {
          id: 'alert-1',
          message: 'Emma has missed 3 scheduled reading sessions this week.',
          severity: 'medium',
          createdAt: '2024-06-26T16:45:00Z'
        }
      ]
    }
  ],
  teacher: [
    {
      studentId: 'student-1',
      studentName: 'Emma Johnson',
      recommendations: [
        {
          id: 'rec-t1',
          type: 'intervention',
          priority: 'high',
          title: 'ADHD Classroom Accommodations',
          description: 'Implement evidence-based classroom strategies for Emma\'s ADHD.',
          source: 'AIDA_agent',
          actionItems: [
            'Seat Emma near teacher desk',
            'Provide written and verbal instructions',
            'Use timer for work periods'
          ],
          implementationTimeframe: 'Immediate implementation',
          expectedOutcome: 'Improved classroom focus within 2 weeks',
          createdAt: '2024-06-26T08:00:00Z',
          status: 'new'
        }
      ],
      urgentAlerts: [
        {
          id: 'alert-t1',
          message: 'Emma\'s attention span has decreased significantly this week.',
          severity: 'high',
          createdAt: '2024-06-26T14:30:00Z'
        }
      ]
    },
    {
      studentId: 'student-3',
      studentName: 'Sofia Rodriguez',
      recommendations: [
        {
          id: 'rec-t3',
          type: 'intervention',
          priority: 'high',
          title: 'Intensive Dyslexia Intervention',
          description: 'Sofia needs immediate, structured reading intervention.',
          source: 'diagnostic_result',
          actionItems: [
            'Refer to reading specialist',
            'Implement daily phonics sessions',
            'Use multisensory teaching techniques'
          ],
          implementationTimeframe: 'Begin immediately',
          expectedOutcome: 'Improvement in decoding skills within 2 months',
          createdAt: '2024-06-26T07:30:00Z',
          status: 'new'
        }
      ],
      urgentAlerts: [
        {
          id: 'alert-t3',
          message: 'Sofia is showing signs of reading frustration and avoidance.',
          severity: 'critical',
          createdAt: '2024-06-26T12:15:00Z'
        }
      ]
    }
  ],
  admin: [
    {
      studentId: 'platform-overview',
      studentName: 'Platform Recommendations',
      recommendations: [
        {
          id: 'rec-a1',
          type: 'academic',
          priority: 'high',
          title: 'Increase Reading Intervention Resources',
          description: '23% of students need additional reading support.',
          source: 'progress_analysis',
          actionItems: ['Hire additional specialists', 'Expand digital tools'],
          implementationTimeframe: 'Plan for next quarter',
          expectedOutcome: 'Reduced wait times for intervention',
          createdAt: '2024-06-26T06:00:00Z',
          status: 'new'
        }
      ],
      urgentAlerts: [
        {
          id: 'alert-a1',
          message: '3 students waiting for assessments beyond recommended timeframe.',
          severity: 'high',
          createdAt: '2024-06-26T08:45:00Z'
        }
      ]
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

    let recommendationData: any[] = [];
    let platformInsights = null;

    switch (userRole) {
      case 'parent':
        recommendationData = mockRecommendationData.parent;
        break;
      case 'teacher':
        recommendationData = mockRecommendationData.teacher;
        break;
      case 'admin':
        recommendationData = mockRecommendationData.admin;
        platformInsights = {
          totalRecommendations: 47,
          newThisWeek: 12,
          highPriorityCount: 8,
          interventionNeeded: 15,
          successRate: 0.78,
          mostCommonType: 'academic'
        };
        break;
      case 'student':
        return NextResponse.json({ error: 'Access through student dashboard' }, { status: 403 });
      default:
        return NextResponse.json({ error: 'Invalid user role' }, { status: 403 });
    }

    const allRecommendations = recommendationData.flatMap(student => student.recommendations);
    const allAlerts = recommendationData.flatMap(student => student.urgentAlerts);
    
    const summary = {
      totalRecommendations: allRecommendations.length,
      newRecommendations: allRecommendations.filter(r => r.status === 'new').length,
      highPriorityRecommendations: allRecommendations.filter(r => r.priority === 'high').length,
      urgentAlerts: allAlerts.filter(a => a.severity === 'high' || a.severity === 'critical').length,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: {
        userRole,
        userId,
        recommendations: recommendationData,
        summary,
        platformInsights,
        metadata: {
          lastUpdated: new Date().toISOString(),
          aiEngine: 'AIDA_v2.1',
          dataScope: userRole === 'admin' ? 'platform-wide' : 
                    userRole === 'teacher' ? 'assigned-students' : 'child-only'
        }
      }
    });

  } catch (error) {
    console.error('Error fetching recommendation data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
