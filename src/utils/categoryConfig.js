export const CATEGORY_CONFIG = {
  health:   { color: '#FF6B6B', bg: 'rgba(255,107,107,0.15)', emoji: '❤️' },
  study:    { color: '#4ECDC4', bg: 'rgba(78,205,196,0.15)',  emoji: '📚' },
  work:     { color: '#45B7D1', bg: 'rgba(69,183,209,0.15)',  emoji: '💼' },
  personal: { color: '#96CEB4', bg: 'rgba(150,206,180,0.15)', emoji: '🌱' },
  fitness:  { color: '#FF6348', bg: 'rgba(255,99,72,0.15)',   emoji: '💪' },
  finance:  { color: '#6C5CE7', bg: 'rgba(108,92,231,0.15)',  emoji: '💰' },
  creative: { color: '#FDCB6E', bg: 'rgba(253,203,110,0.15)', emoji: '🎨' },
  social:   { color: '#FD79A8', bg: 'rgba(253,121,168,0.15)', emoji: '🤝' },
};

export const GOAL_COLORS = [
  '#FF6B6B','#4ECDC4','#45B7D1','#96CEB4',
  '#FF6348','#6C5CE7','#FDCB6E','#FD79A8',
  '#A8E6CF','#FFD93D','#7C3AED','#10B981',
];

export const getCategoryConfig = (category) =>
  CATEGORY_CONFIG[category] || { color: '#7C3AED', bg: 'rgba(124,58,237,0.15)', emoji: '🎯' };

export const getProgressPercent = (goal) =>
  goal.target > 0 ? Math.min(Math.round((goal.progress / goal.target) * 100), 100) : 0;

export const getTargetLabel = (goal, t) => {
  const unit = goal.type === 'daily' ? t.goalCard.days
    : goal.type === 'time' ? t.goalCard.minutes
    : t.goalCard.sessions;
  return `${goal.progress}/${goal.target} ${unit}`;
};

export const getLevel = (xp) => Math.floor(xp / 500) + 1;
export const getXpToNextLevel = (xp) => 500 - (xp % 500);
