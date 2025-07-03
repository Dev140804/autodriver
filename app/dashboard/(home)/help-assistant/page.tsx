'use client';

import { useState } from 'react';

export default function HelpAssistantPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleAsk = () => {
    if (query.trim()) {
      setResponse('🤖: This app helps you manage rides, earnings, and more. Ask anything about your dashboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white flex justify-center items-start pt-24 px-4">
      <div className="max-w-md w-full bg-[#1f2937] p-6 rounded-xl shadow-xl border border-gray-700 space-y-4">
        <h1 className="text-xl font-semibold text-center text-indigo-400">AI Help Assistant</h1>
        <input
          placeholder="Ask your question..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white"
        />
        <button
          onClick={handleAsk}
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-md font-medium"
        >
          Ask
        </button>
        {response && <div className="text-sm text-green-400 border-t pt-3">{response}</div>}
      </div>
    </div>
  );
}