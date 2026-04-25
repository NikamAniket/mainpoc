import React, { useState, useEffect } from 'react';
import { Layout, Brain, BarChart2, MessageSquare, BookOpen, User } from 'lucide-react';
import Dashboard from './components/Dashboard';
import LearningModule from './components/LearningModule';
import AITutor from './components/AITutor';
import Onboarding from './components/Onboarding';

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
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary-600 p-2 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">Lumina AI</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <BarChart2 className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('learning')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'learning' ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Learn</span>
          </button>
          <button 
            onClick={() => setActiveTab('tutor')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'tutor' ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <MessageSquare className="w-5 h-5" />
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
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'dashboard' && <Dashboard user={user} />}
        {activeTab === 'learning' && <LearningModule user={user} />}
        {activeTab === 'tutor' && <AITutor user={user} />}
      </main>
    </div>
  );
}

export default App;
