import { LangChainAdapter } from 'ai';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // TODO: Integrate with the actual AIDA chatbot logic here.
  // For now, using a placeholder OpenAI model.
  const model = new ChatOpenAI({
    temperature: 0.7,
    modelName: 'gpt-3.5-turbo',
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const stream = await model.stream(
    messages.map((message: any) =>
      message.role === 'user'
        ? new HumanMessage(message.content)
        : new AIMessage(message.content)
    )
  );

  const dataStream = LangChainAdapter.toDataStream(stream);

  return new Response(dataStream, {
    headers: { 'Content-Type': 'application/octet-stream' },
  });
}