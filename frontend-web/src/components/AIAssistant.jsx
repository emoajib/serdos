import React, { useState, useEffect, useRef } from 'react';

/**
 * 🤖 SERDOS AI ASSISTANT v2.0 - SUPREME WHITE EDITION
 * FEATURES: Semantic Search, Typing Indicator, Light Theme.
 * INTEGRATION: AI Brain (Port 5000)
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Halo! Saya Serdos AI Assistant. Ada yang bisa saya bantu terkait regulasi Serdos 2026 atau fitur simulasi ini?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: data.answer || 'Maaf, saya tidak menemukan informasi tersebut.',
        sources: data.sources || []
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Maaf, sistem AI sedang offline. Silakan coba lagi nanti.' }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9999] font-['Inter']">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-3xl shadow-3xl shadow-slate-900/40 hover:scale-110 active:scale-95 transition-all animate-bounce-slow">
          🤖
        </button>
      ) : (
        <div className="w-[380px] h-[600px] bg-white border border-slate-100 rounded-[2.5rem] shadow-4xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="bg-slate-900 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-widest leading-none">Serdos AI</h4>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-[9px] text-white/60 font-bold uppercase tracking-widest">Active Assistant</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-all text-xl">✕</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[12px] leading-relaxed font-bold shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-900 border border-slate-100 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-50 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      Sources: {m.sources.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-50">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Tanyakan regulasi..."
                className="flex-1 bg-slate-50 border border-slate-100 px-5 py-3 rounded-full text-[11px] font-bold text-slate-900 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-300"
              />
              <button className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-all">
                ⚡
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}