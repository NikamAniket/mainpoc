import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AITutor = ({ user }) => {
  const [messages, setMessages] = useState([
    { role: 'model', content: `Hello ${user.name}! I'm your Lumina AI Tutor. I know you're working on ${user.goal}. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Mock API call to backend
    setTimeout(() => {
      const botResponse = { 
        role: 'model', 
        content: `That's a great question about ${input}! Since you're focused on ${user.goal}, I recommend looking into how this integrates with your current learning path. Would you like a simplified explanation or a practice question?` 
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col glass overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-600">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold">Lumina Tutor</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-slate-400">AI Active • Context-Aware</span>
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-slate-800">
          <Sparkles className="w-4 h-4 text-amber-400" /> Simplify Topic
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-primary-600' : 'bg-slate-800'}`}>
                  {m.role === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-primary-400" />}
                </div>
                <div className={`p-4 rounded-2xl ${m.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-300 rounded-tl-none'}`}>
                  <p className="leading-relaxed">{m.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-400" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-800 rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-primary-400 animate-spin" />
                <span className="text-slate-400">Lumina is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-slate-900/50 border-t border-slate-800">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about your learning path..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-6 py-4 pr-16 focus:outline-none focus:border-primary-500 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-4 uppercase tracking-widest font-bold">
          Powered by Gemini 1.5 Flash
        </p>
      </div>
    </div>
  );
};

export default AITutor;
