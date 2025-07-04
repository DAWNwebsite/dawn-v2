import { NextResponse } from "next/server";

export async function GET() {
  // In a real application, you would fetch this data from your database
  // based on the logged-in user's session.
  const mockProgressData = {
    progress: [
      { id: 1, subject: 'Mathematics', progress: 75, grade: 'A-' },
      { id: 2, subject: 'Reading Comprehension', progress: 60, grade: 'B' },
      { id: 3, subject: 'Science', progress: 85, grade: 'A' },
    ],
  };

  return NextResponse.json({
    message: "Success",
    data: mockProgressData,
  }, { status: 200 });
}
