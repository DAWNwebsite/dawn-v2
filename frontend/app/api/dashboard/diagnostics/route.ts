import { NextResponse } from "next/server";

export async function GET() {
  // In a real application, you would fetch this data from your database.
  const mockDiagnosticsData = {
    diagnostics: [
      { id: 1, type: 'Dyslexia Screening', status: 'Completed', date: '2023-10-15', result: 'Moderate risk' },
      { id: 2, type: 'ADHD Assessment', status: 'Pending', date: '2023-11-01', result: null },
    ],
  };

  return NextResponse.json({
    message: "Success",
    data: mockDiagnosticsData,
  }, { status: 200 });
}
