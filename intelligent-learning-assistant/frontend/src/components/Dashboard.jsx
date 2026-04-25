import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Trophy, Clock, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = ({ user }) => {
  const activityData = [
    { name: 'Mon', hours: 2 },
    { name: 'Tue', hours: 4 },
    { name: 'Wed', hours: 3 },
    { name: 'Thu', hours: 5 },
    { name: 'Fri', hours: 2 },
    { name: 'Sat', hours: 6 },
    { name: 'Sun', hours: 4 },
  ];

  const skillData = [
    { subject: 'React', A: 80, fullMark: 150 },
    { subject: 'AI Basics', A: 65, fullMark: 150 },
    { subject: 'Data Struct', A: 45, fullMark: 150 },
    { subject: 'Security', A: 30, fullMark: 150 },
    { subject: 'DevOps', A: 20, fullMark: 150 },
  ];

  const stats = [
    { label: 'Weekly Study', value: '26.4h', icon: Clock, color: 'text-blue-400' },
    { label: 'Avg Accuracy', value: '88%', icon: Target, color: 'text-emerald-400' },
    { label: 'Current Streak', value: '12 days', icon: Zap, color: 'text-amber-400' },
    { label: 'Badges Earned', value: '8', icon: Trophy, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Welcome back, {user.name}!</h2>
          <p className="text-slate-400 mt-1">Here's your learning progress for this week.</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-primary-900/20">
          Continue Learning
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6"
          >
            <div className={`p-3 rounded-xl bg-slate-800 w-fit mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8">
          <h3 className="text-xl font-bold mb-6">Learning Activity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8">
          <h3 className="text-xl font-bold mb-6">Mastery Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" />
                <Radar
                  name={user.name}
                  dataKey="A"
                  stroke="#818cf8"
                  fill="#818cf8"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
