import { NextResponse } from "next/server";

export async function GET() {
  const mockRecommendationsData = {
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
    ]
  };

  return NextResponse.json({
    message: "Success",
    data: {
      recommendations: mockRecommendationsData.parent
    },
  }, { status: 200 });
}
