import { Box, Typography, Grid, Card, CardContent, Button, LinearProgress, Chip, Stack, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { useGoals } from '../context/GoalsContext';
import { useLanguage } from '../context/LanguageContext';
import GoalCard from '../components/GoalCard';
import { getLevel, getXpToNextLevel } from '../utils/categoryConfig';

function StatCard({ icon, value, label, color, sublabel }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ bgcolor: `${color}20`, p: 1.5, borderRadius: 2, color }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, color, lineHeight: 1 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {label}
            </Typography>
            {sublabel && (
              <Typography variant="caption" color="text.secondary">{sublabel}</Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { goals, stats, overallProgress } = useGoals();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const recentCompleted = completedGoals.slice(0, 3);
  const level = getLevel(stats.xpTotal);
  const xpToNext = getXpToNextLevel(stats.xpTotal);
  const xpProgress = ((500 - xpToNext) / 500) * 100;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, mb: 0.5 }}>
          {t.dashboard.title}
        </Typography>
        <Typography color="text.secondary">{t.dashboard.subtitle}</Typography>
      </Box>

      {/* Overall Progress Banner */}
      <Card sx={{
        mb: 4, background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
        color: 'white', overflow: 'hidden', position: 'relative',
      }}>
        <Box sx={{
          position: 'absolute', top: -40, right: -40, width: 160, height: 160,
          borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)',
        }} />
        <CardContent sx={{ p: 3, position: 'relative' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 2 }}>
                {t.dashboard.overallProgress}
              </Typography>
              <Typography variant="h2" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, my: 1 }}>
                {overallProgress}%
              </Typography>
              <Typography sx={{ opacity: 0.8 }}>{t.dashboard.complete}</Typography>
              <LinearProgress
                variant="determinate"
                value={overallProgress}
                sx={{
                  mt: 2, height: 10, borderRadius: 5,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': { bgcolor: 'white', borderRadius: 5 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 2 }}>
                  Level {level}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={xpProgress}
                  sx={{
                    height: 8, borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': { bgcolor: '#FDCB6E', borderRadius: 4 },
                  }}
                />
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {xpToNext} XP to Level {level + 1}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<CheckCircleIcon />}
            value={stats.completedCount}
            label={t.dashboard.totalCompleted}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<LocalFireDepartmentIcon />}
            value={stats.streak}
            label={t.dashboard.currentStreak}
            color="#EF4444"
            sublabel={t.common.days}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<BoltIcon />}
            value={stats.xpTotal}
            label={t.dashboard.xpPoints}
            color="#F59E0B"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            icon={<EmojiEventsIcon />}
            value={`Lv.${level}`}
            label={t.dashboard.level}
            color="#7C3AED"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/goals/new')}
          size="large"
          sx={{ fontWeight: 700, px: 3 }}
        >
          {t.dashboard.newGoal}
        </Button>
        <Button
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate('/goals')}
          size="large"
          sx={{ fontWeight: 700, px: 3 }}
        >
          {t.dashboard.viewAll}
        </Button>
      </Box>

      {/* Active Goals */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
            {t.dashboard.activeGoals}
          </Typography>
          <Chip label={activeGoals.length} color="primary" size="small" />
        </Box>
        {activeGoals.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography fontSize="3rem">🎯</Typography>
              <Typography color="text.secondary" mt={1}>{t.dashboard.noActiveGoals}</Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/goals/new')}>
                {t.dashboard.newGoal}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {activeGoals.map(goal => (
              <Grid item xs={12} sm={6} md={4} key={goal.id}>
                <GoalCard goal={goal} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Recently Completed */}
      {recentCompleted.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
              {t.dashboard.recentlyCompleted}
            </Typography>
            <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/goals?tab=completed')}>
              {t.dashboard.viewAllCompleted}
            </Button>
          </Box>
          <Grid container spacing={2}>
            {recentCompleted.map(goal => (
              <Grid item xs={12} sm={6} md={4} key={goal.id}>
                <GoalCard goal={goal} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
