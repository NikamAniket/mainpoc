import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');

  const goals = [
    "Master Full-Stack Development",
    "Understand AI & Machine Learning",
    "Improve Cloud Architecture Skills",
    "Learn Programming Fundamentals"
  ];

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete({
        name,
        goal,
        skillLevel: 'beginner',
        id: 'user_' + Math.random().toString(36).substr(2, 9)
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full glass p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
          <motion.div 
            className="h-full bg-primary-500" 
            initial={{ width: '0%' }}
            animate={{ width: `${(step + 1) * 33.33}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-primary-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-primary-400" />
              </div>
              <h1 className="text-3xl font-bold">Welcome to Lumina</h1>
              <p className="text-slate-400">Let's personalize your learning experience. What should we call you?</p>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <button 
                disabled={!name}
                onClick={handleNext}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                Next Step <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">What's your primary goal?</h2>
              <div className="space-y-3">
                {goals.map((g) => (
                  <button 
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`w-full text-left px-4 py-4 rounded-xl border transition-all flex items-center justify-between ${goal === g ? 'bg-primary-600/20 border-primary-500 text-primary-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                  >
                    {g}
                    {goal === g && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                ))}
              </div>
              <button 
                disabled={!goal}
                onClick={handleNext}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-emerald-500/20 w-20 h-20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
              </div>
              <h2 className="text-3xl font-bold">All Set!</h2>
              <p className="text-slate-400">We've tailored a custom learning path for you to {goal}. Ready to start?</p>
              <button 
                onClick={handleNext}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary-900/40"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
