import AidaChat from '@/components/aida/AidaChat';

export default function AidaPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">AIDA Chatbot</h1>
      <AidaChat />
    </div>
  );
}