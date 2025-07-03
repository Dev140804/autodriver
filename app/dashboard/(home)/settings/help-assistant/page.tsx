'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function HelpAssistantPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const router = useRouter();

  const handleAsk = () => {
    if (query.trim()) {
      setResponse('🤖: This app helps you manage rides, earnings, and more. Ask anything about your dashboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white flex justify-center items-center px-4">
      <div className="max-w-md w-full bg-[#1f2937] p-6 rounded-xl shadow-xl border border-gray-700 space-y-4 relative">
        
        {/* Back Arrow */}
        <button
          onClick={() => router.push('/dashboard/settings')}
          title="Back to Settings"
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Title */}
        <h1 className="text-xl font-semibold text-center text-indigo-400">AI Help Assistant</h1>

        {/* Input */}
        <input
          placeholder="Ask your question..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white"
        />

        {/* Ask Button */}
        <button
          onClick={handleAsk}
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-md font-medium cursor-pointer"
        >
          Ask
        </button>

        {/* Response */}
        {response && (
          <div className="text-sm text-green-400 border-t pt-3">{response}</div>
        )}
      </div>
    </div>
  );
}