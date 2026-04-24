import { useState, useRef, useEffect } from 'react';

export function VyniusAI({ role = 'admin' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hello! I am Vynius, your AI legal assistant. How can I help you manage your matters today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(userMsg, role);
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
      setIsTyping(false);
    }, 1200);
  };

  const getResponse = (text, role) => {
    const t = text.toLowerCase();
    const isClient = role === 'client';

    if (t.includes('summary')) {
      return isClient 
        ? "Your case is currently focused on document review and preparing for the upcoming court date. Everything is tracking correctly."
        : "Matter Summary: Case-2045 involves a commercial dispute with Jones Industrial Corp. Current focus is on discovery and witness affidavits.";
    }
    if (t.includes('status')) {
      return "Current Status: Active. We are awaiting secondary document verification and opposing counsel's response.";
    }
    if (t.includes('next')) {
      return isClient
        ? "The next step is for your lawyer to finalize the evidence review. You don't need to take any action right now."
        : "Recommended Actions:\n1. Finalize witness list\n2. Review pending discovery docs\n3. Schedule internal strategy session";
    }
    if (t.includes('billing') || t.includes('money')) {
      return isClient
        ? "You can view your latest invoice in the Billing tab. Total outstanding is $2,850."
        : "Billing Update: Total billed for this matter is $10,450. One invoice (INV-0043) is currently pending payment.";
    }
    if (t.includes('document') || t.includes('file')) {
      return "I can see 12 documents associated with this case. All critical files have been categorized under 'Pleadings' and 'Evidence'.";
    }
    
    return "I'm not quite sure about that. Try asking for a 'summary', 'status', or 'next steps' for more accurate insights.";
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[150] font-sans">
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gradient-to-r from-primary-600 to-accent-500 text-white animate-fade-in"
        >
          <span className="text-xl">🤖</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed sm:absolute bottom-4 left-4 right-4 sm:left-auto sm:right-0 sm:bottom-0 w-auto sm:w-[360px] max-w-none sm:max-w-[90vw] h-[75vh] sm:h-[500px] bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden animate-slide-up origin-bottom-right">
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-xl shadow-lg shadow-primary-500/20">🤖</div>
              <div>
                <h3 className="text-[14px] font-800 text-white">Vynius Intelligence</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-700 text-primary-100 uppercase tracking-widest">AI Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                }`}>
                  {m.text.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-fade-in text-slate-400">
                <div className="bg-white border border-slate-100 p-3.5 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
              {['Summary', 'Next Steps', 'Billing'].map(chip => (
                <button key={chip} onClick={() => { setInput(chip); }} className="whitespace-nowrap px-3 py-1.5 bg-slate-100 hover:bg-primary-50 hover:text-primary-600 text-slate-500 rounded-full text-[11px] font-700 transition-all border border-transparent hover:border-primary-100">
                  {chip}
                </button>
              ))}
            </div>
            <div className="relative">
              <input 
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask Vynius anything..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-3.5 text-[13px] focus:ring-2 focus:ring-primary-100 outline-none transition-all placeholder:text-slate-400"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 disabled:opacity-30 disabled:hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
