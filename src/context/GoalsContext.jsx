import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GoalsContext = createContext();

const SAMPLE_GOALS = [
  {
    id: '1',
    title: 'Morning Run',
    category: 'fitness',
    type: 'daily',
    target: 30,
    progress: 18,
    status: 'active',
    color: '#FF6B6B',
    startDate: '2025-01-01',
    endDate: '',
    notes: 'Run at least 20 minutes each day',
    logs: [
      { date: '2025-01-10', amount: 1 },
      { date: '2025-01-11', amount: 1 },
      { date: '2025-01-12', amount: 1 },
    ],
    createdAt: '2025-01-01',
    updatedAt: '2025-01-12',
  },
  {
    id: '2',
    title: 'Read 24 Books',
    category: 'study',
    type: 'count',
    target: 24,
    progress: 7,
    status: 'active',
    color: '#4ECDC4',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    notes: 'At least 2 books per month',
    logs: [
      { date: '2025-01-15', amount: 3 },
      { date: '2025-02-10', amount: 2 },
      { date: '2025-03-05', amount: 2 },
    ],
    createdAt: '2025-01-01',
    updatedAt: '2025-03-05',
  },
  {
    id: '3',
    title: 'Meditate Daily',
    category: 'health',
    type: 'time',
    target: 600,
    progress: 420,
    status: 'active',
    color: '#A8E6CF',
    startDate: '2025-01-01',
    endDate: '',
    notes: '10 minutes per session',
    logs: [
      { date: '2025-01-05', amount: 60 },
      { date: '2025-01-06', amount: 60 },
      { date: '2025-01-07', amount: 60 },
    ],
    createdAt: '2025-01-01',
    updatedAt: '2025-01-07',
  },
  {
    id: '4',
    title: 'Learn German',
    category: 'study',
    type: 'daily',
    target: 90,
    progress: 90,
    status: 'completed',
    color: '#FFD93D',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    notes: '30 min per day on Duolingo',
    logs: [],
    createdAt: '2025-01-01',
    updatedAt: '2025-03-31',
  },
  {
    id: '5',
    title: 'Save Emergency Fund',
    category: 'finance',
    type: 'count',
    target: 10000,
    progress: 3200,
    status: 'paused',
    color: '#6C5CE7',
    startDate: '2025-01-01',
    endDate: '',
    notes: 'Target: €10,000',
    logs: [],
    createdAt: '2025-01-01',
    updatedAt: '2025-02-01',
  },
];

const DEFAULT_STATS = {
  xpTotal: 340,
  streak: 7,
  completedCount: 1,
  lastLogDate: null,
};

export const GoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('goals');
      return saved ? JSON.parse(saved) : SAMPLE_GOALS;
    } catch { return SAMPLE_GOALS; }
  });

  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('userStats');
      return saved ? JSON.parse(saved) : DEFAULT_STATS;
    } catch { return DEFAULT_STATS; }
  });

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(stats));
  }, [stats]);

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

  const createGoal = useCallback((goalData) => {
    const newGoal = {
      id: generateId(),
      ...goalData,
      progress: 0,
      status: 'active',
      logs: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setGoals(prev => [newGoal, ...prev]);
    return newGoal;
  }, []);

  const updateGoal = useCallback((id, updates) => {
    setGoals(prev => prev.map(g => g.id === id
      ? { ...g, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
      : g
    ));
  }, []);

  const deleteGoal = useCallback((id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  const logProgress = useCallback((id, amount = 1) => {
    const today = new Date().toISOString().split('T')[0];

    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const newProgress = Math.min(g.progress + amount, g.target);
      const newLog = { date: today, amount };
      const newStatus = newProgress >= g.target ? 'completed' : g.status;

      return {
        ...g,
        progress: newProgress,
        status: newStatus,
        logs: [...g.logs, newLog],
        updatedAt: today,
      };
    }));

    // Update XP and streak
    setStats(prev => {
      const lastLog = prev.lastLogDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = prev.streak;
      if (lastLog === yesterdayStr) {
        newStreak = prev.streak + 1;
      } else if (lastLog !== today) {
        newStreak = lastLog ? 1 : prev.streak + 1;
      }

      // Check if goal was completed
      const goal = goals.find(g => g.id === id);
      const newProgress = goal ? Math.min(goal.progress + amount, goal.target) : 0;
      const wasCompleted = goal && newProgress >= goal.target && goal.progress < goal.target;

      return {
        ...prev,
        xpTotal: prev.xpTotal + 20 + (wasCompleted ? 100 : 0),
        streak: newStreak,
        completedCount: wasCompleted ? prev.completedCount + 1 : prev.completedCount,
        lastLogDate: today,
      };
    });
  }, [goals]);

  const togglePause = useCallback((id) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      return { ...g, status: g.status === 'paused' ? 'active' : 'paused' };
    }));
  }, []);

  const markComplete = useCallback((id) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      return { ...g, status: 'completed', progress: g.target };
    }));
    setStats(prev => ({
      ...prev,
      xpTotal: prev.xpTotal + 100,
      completedCount: prev.completedCount + 1,
    }));
  }, []);

  const restoreGoal = useCallback((id) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      return { ...g, status: 'active', progress: Math.min(g.progress, g.target - 1) };
    }));
    setStats(prev => ({
      ...prev,
      completedCount: Math.max(0, prev.completedCount - 1),
    }));
  }, []);

  const getGoalById = useCallback((id) => goals.find(g => g.id === id), [goals]);

  const overallProgress = goals.length > 0
    ? Math.round(goals.filter(g => g.status !== 'paused').reduce((acc, g) => acc + (g.progress / g.target) * 100, 0) / Math.max(goals.filter(g => g.status !== 'paused').length, 1))
    : 0;

  const level = Math.floor(stats.xpTotal / 500) + 1;

  return (
    <GoalsContext.Provider value={{
      goals,
      stats: { ...stats, level },
      overallProgress,
      createGoal,
      updateGoal,
      deleteGoal,
      logProgress,
      togglePause,
      markComplete,
      restoreGoal,
      getGoalById,
    }}>
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => useContext(GoalsContext);
