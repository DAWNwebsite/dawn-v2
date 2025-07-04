import { NextResponse } from "next/server";

export async function GET() {
  // In a real application, you would fetch this data from your database.
  const mockRecommendationsData = {
    recommendations: [
      { id: 1, title: 'Use Text-to-Speech', description: 'Enable text-to-speech for long reading passages to improve comprehension.', category: 'Dyslexia Support' },
      { id: 2, title: 'Structured Routine', description: 'Establish a consistent daily routine with visual aids to help with focus and task management.', category: 'ADHD Support' },
    ],
  };

  return NextResponse.json({
    message: "Success",
    data: mockRecommendationsData,
  }, { status: 200 });
}
