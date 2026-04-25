import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, HelpCircle, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

const LearningModule = ({ user }) => {
  const [topic, setTopic] = useState('React Fundamentals');
  const [mode, setMode] = useState('explanation'); // 'explanation' or 'quiz'
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const mockQuestions = [
    {
      id: 1,
      question: "What is the primary purpose of React Hooks?",
      options: ["Manage state in class components", "Use state and other features in functional components", "Improve performance of CSS", "Handle database connections"],
      correct: 1
    },
    {
      id: 2,
      question: "Which hook is used for side effects?",
      options: ["useState", "useContext", "useEffect", "useReducer"],
      correct: 2
    }
  ];

  const handleAnswer = (index) => {
    if (index === mockQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary-600/20 text-primary-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{topic}</h2>
            <p className="text-sm text-slate-400">Status: In Progress • Level: {user.skillLevel}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setMode('explanation')}
            className={`px-4 py-2 rounded-lg transition-colors ${mode === 'explanation' ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Learn
          </button>
          <button 
            onClick={() => setMode('quiz')}
            className={`px-4 py-2 rounded-lg transition-colors ${mode === 'quiz' ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Quiz
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'explanation' ? (
          <motion.div 
            key="explanation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-10 prose prose-invert max-w-none"
          >
            <h1 className="text-3xl font-bold mb-6">Introduction to React</h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called “components”.
            </p>
            <div className="bg-slate-900 border-l-4 border-primary-500 p-6 rounded-r-xl mb-8">
              <h3 className="text-primary-400 font-bold mb-2">Key Concept: Components</h3>
              <p className="text-slate-400">Think of components like LEGO bricks. You can build individual parts (buttons, inputs, cards) and then combine them to create a full application.</p>
            </div>
            <h2 className="text-2xl font-bold mb-4">Why use React?</h2>
            <ul className="space-y-3 text-slate-300">
              <li>• Declarative UI makes code more predictable</li>
              <li>• Component-based architecture promotes reuse</li>
              <li>• Virtual DOM ensures efficient updates</li>
            </ul>
            <div className="mt-10 flex justify-end">
              <button 
                onClick={() => setMode('quiz')}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 px-8 py-3 rounded-xl font-bold transition-all"
              >
                Start Quiz <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-10"
          >
            {!showResult ? (
              <div className="space-y-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Question {currentQuestion + 1} of {mockQuestions.length}</span>
                  <div className="h-2 w-48 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 transition-all duration-300" 
                      style={{ width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-bold">{mockQuestions[currentQuestion].question}</h2>
                <div className="grid grid-cols-1 gap-4">
                  {mockQuestions[currentQuestion].options.map((option, i) => (
                    <button 
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="w-full text-left p-6 rounded-xl border border-slate-700 bg-slate-900 hover:border-primary-500 hover:bg-slate-800 transition-all text-slate-300"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-8 py-10">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-500/20 text-primary-400 mb-4">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-bold">Quiz Completed!</h2>
                <p className="text-2xl">You scored <span className="text-primary-400 font-bold">{score}/{mockQuestions.length}</span></p>
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => {
                      setCurrentQuestion(0);
                      setScore(0);
                      setShowResult(false);
                    }}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-8 py-3 rounded-xl font-bold transition-all"
                  >
                    <RotateCcw className="w-5 h-5" /> Retake
                  </button>
                  <button 
                    onClick={() => setMode('explanation')}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 px-8 py-3 rounded-xl font-bold transition-all"
                  >
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningModule;
