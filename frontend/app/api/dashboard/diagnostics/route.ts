import { NextResponse } from "next/server";

export async function GET() {
  const mockDiagnosticsData = {
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
    ]
  };

  return NextResponse.json({
    message: "Success",
    data: {
      diagnostics: mockDiagnosticsData.parent
    },
  }, { status: 200 });
}
