import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Volume2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AITutor = ({ user }) => {
  const [messages, setMessages] = useState([
    { role: 'model', content: `Hello ${user.name}! I'm your Lumina AI Tutor. I know you're working on ${user.goal}. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const [playingAudioIndex, setPlayingAudioIndex] = useState(null);
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

    try {
      const languageInstruction = language !== 'English' ? `Please respond in ${language}. ` : '';
      const response = await axios.post(`${API_URL}/learning/tutor/chat`, {
        history: messages,
        message: languageInstruction + input
      });
      
      const botResponse = { 
        role: 'model', 
        content: response.data.response 
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error communicating with AI Tutor:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: "I'm having trouble connecting to my brain right now. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = async (text, index) => {
    if (playingAudioIndex !== null) return; // Prevent multiple streams
    setPlayingAudioIndex(index);
    try {
      // Strip markdown before sending to TTS
      const cleanText = text.replace(/[*_#]/g, '');
      const res = await axios.post(`${API_URL}/learning/tts`, { text: cleanText }, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const audio = new Audio(url);
      audio.onended = () => setPlayingAudioIndex(null);
      audio.play();
    } catch (error) {
      console.error("TTS Error:", error);
      setPlayingAudioIndex(null);
    }
  };

  const toggleLanguage = () => {
    const langs = ['English', 'Spanish', 'French', 'Hindi'];
    const nextIdx = (langs.indexOf(language) + 1) % langs.length;
    setLanguage(langs[nextIdx]);
  };

  return (
    <section className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col glass overflow-hidden" aria-label="AI Tutor Chat">
      {/* Header */}
      <header className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-600">
            <Bot className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-bold">Lumina Tutor</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
              <span className="text-xs text-slate-400">AI Active • Context-Aware</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage}
            aria-label={`Toggle language. Current language: ${language}`}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-slate-800"
          >
            <Globe className="w-4 h-4 text-blue-400" aria-hidden="true" /> {language}
          </button>
          <button 
            aria-label="Simplify the current topic"
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-slate-800"
          >
            <Sparkles className="w-4 h-4 text-amber-400" aria-hidden="true" /> Simplify Topic
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6" role="log" aria-live="polite">
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
                  {m.role === 'user' ? <User className="w-6 h-6 text-white" aria-hidden="true" /> : <Bot className="w-6 h-6 text-primary-400" aria-hidden="true" />}
                </div>
                <div className={`p-4 rounded-2xl relative group ${m.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-300 rounded-tl-none'}`}>
                  <div className="leading-relaxed" dangerouslySetInnerHTML={{__html: m.content}} />
                  {m.role === 'model' && (
                    <button 
                      onClick={() => playAudio(m.content, i)}
                      disabled={playingAudioIndex !== null && playingAudioIndex !== i}
                      aria-label="Read message aloud"
                      className="absolute -right-12 bottom-0 p-2 text-slate-400 hover:text-white disabled:opacity-30 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Volume2 className={`w-5 h-5 ${playingAudioIndex === i ? 'text-primary-400 animate-pulse' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start" aria-live="assertive">
            <div className="max-w-[80%] flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-400" aria-hidden="true" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-800 rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-primary-400 animate-spin" aria-hidden="true" />
                <span className="text-slate-400">Lumina is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <footer className="p-6 bg-slate-900/50 border-t border-slate-800">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask anything about your learning path in ${language}...`}
            aria-label="Chat input"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-white"
          >
            <Send className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </footer>
    </section>
  );
};

export default AITutor;
