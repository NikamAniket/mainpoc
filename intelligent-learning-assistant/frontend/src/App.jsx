import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Layout, Brain, BarChart2, MessageSquare, BookOpen, User } from 'lucide-react';
import Onboarding from './components/Onboarding';

const Dashboard = lazy(() => import('./components/Dashboard'));
const LearningModule = lazy(() => import('./components/LearningModule'));
const AITutor = lazy(() => import('./components/AITutor'));

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for user profile
    const savedUser = localStorage.getItem('ila_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleOnboardingComplete = (profile) => {
    setUser(profile);
    localStorage.setItem('ila_user', JSON.stringify(profile));
    setActiveTab('dashboard');
  };

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;

  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col" aria-label="Sidebar Navigation">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary-600 p-2 rounded-lg">
            <Brain className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold gradient-text">Lumina AI</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2" aria-label="Main Menu">
          <button 
            onClick={() => setActiveTab('dashboard')}
            aria-pressed={activeTab === 'dashboard'}
            aria-label="Go to Dashboard"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <BarChart2 className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('learning')}
            aria-pressed={activeTab === 'learning'}
            aria-label="Go to Learning Modules"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'learning' ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <BookOpen className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">Learn</span>
          </button>
          <button 
            onClick={() => setActiveTab('tutor')}
            aria-pressed={activeTab === 'tutor'}
            aria-label="Go to AI Tutor"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'tutor' ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <MessageSquare className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">AI Tutor</span>
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <User className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.skillLevel} Learner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8" aria-label="Main Content Area">
        <Suspense fallback={<div className="flex h-full items-center justify-center text-slate-400" aria-live="polite">Loading module...</div>}>
          {activeTab === 'dashboard' && <Dashboard user={user} />}
          {activeTab === 'learning' && <LearningModule user={user} />}
          {activeTab === 'tutor' && <AITutor user={user} />}
        </Suspense>
      </main>
    </div>
  );
}

export default App;
