import { ChatGroq } from '@langchain/groq';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const groq = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama3-8b-8192", 
  });

  const stream = await groq
    .stream(
      messages.map((m: any) =>
        m.role === 'user'
          ? new HumanMessage(m.content)
          : new AIMessage(m.content)
      )
    );

  return new Response(stream, {
    headers: { 'Content-Type': 'application/octet-stream' }
  });
} 