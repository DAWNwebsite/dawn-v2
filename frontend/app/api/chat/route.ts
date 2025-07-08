import { StreamingTextResponse, LangChainAdapter } from 'ai';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // This is a placeholder for your actual AI agent service call.
  // We are using a simple LangChain model here for demonstration.
  // In a real implementation, you would replace this with a `fetch`
  // call to your AI agent's endpoint.
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

  return new StreamingTextResponse(LangChainAdapter.toAIStream(stream));
} 