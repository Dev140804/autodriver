'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function HelpAssistantPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [theme, setTheme] = useState('simple');
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('driver-theme') || 'simple';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleAsk = () => {
    if (query.trim()) {
      setResponse('🤖: This app helps you manage rides, earnings, and more. Ask anything about your dashboard!');
    }
  };

  const isInvalid = query.trim().length === 0;

  // 🔥 Box Arrow Button Style (conditional)
  const askButtonClasses = isInvalid
    ? theme === 'dark'
      ? 'bg-black text-white/50 cursor-not-allowed'
      : theme === 'bright'
      ? 'bg-white text-black/50 cursor-not-allowed'
      : 'bg-[var(--button-disabled-bg)] text-[var(--button-disabled-text)] cursor-not-allowed'
    : theme === 'dark'
    ? 'bg-black text-white hover:bg-white hover:text-black cursor-pointer'
    : theme === 'bright'
    ? 'bg-white text-black hover:bg-black hover:text-white cursor-pointer'
    : 'bg-[var(--primary-color)] text-[var(--button-text)] hover:bg-[var(--primary-hover)] cursor-pointer';

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] flex justify-center items-start pt-24 px-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-[var(--card-bg)] p-6 rounded-xl shadow-xl border border-[var(--border-color)] space-y-4 relative">
        
        {/* Back Arrow */}
        <button
          onClick={() => router.push('/dashboard/settings')}
          title="Back to Settings"
          className="absolute top-4 left-4 text-[var(--text-muted)] hover:text-[var(--primary-color)] transition cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Title */}
        <h1 className="text-xl font-semibold text-center text-[var(--primary-color)]">AI Help Assistant</h1>

        {/* Input */}
        <input
          placeholder="Ask your question..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-color)] placeholder-[var(--placeholder-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-colors duration-300"
        />

        {/* Ask Button */}
        <button
          onClick={isInvalid ? undefined : handleAsk}
          disabled={isInvalid}
          className={`w-full py-2 rounded-md font-medium border border-[var(--border-color)] transition-colors duration-300 ${askButtonClasses}`}
        >
          Ask
        </button>

        {/* Response */}
        {response && (
          <div className="text-sm text-[var(--success-color)] border-t border-[var(--border-color)] pt-3 transition-colors duration-300">
            {response}
          </div>
        )}
      </div>
    </div>
  );
}
