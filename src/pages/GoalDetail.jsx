import { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Chip, LinearProgress,
  Grid, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Divider, Stack, IconButton, Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useParams } from 'react-router-dom';
import { useGoals } from '../context/GoalsContext';
import { useLanguage } from '../context/LanguageContext';
import { getCategoryConfig, getProgressPercent, getTargetLabel } from '../utils/categoryConfig';

export default function GoalDetail() {
  const { id } = useParams();
  const { getGoalById, logProgress, deleteGoal, togglePause, markComplete, restoreGoal } = useGoals();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [progressOpen, setProgressOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [amount, setAmount] = useState(1);

  const goal = getGoalById(id);

  if (!goal) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Goal not found</Typography>
        <Button onClick={() => navigate('/goals')} sx={{ mt: 2 }}>{t.goalDetail.backToGoals}</Button>
      </Box>
    );
  }

  const cat = getCategoryConfig(goal.category);
  const pct = getProgressPercent(goal);
  const isCompleted = goal.status === 'completed';
  const isPaused = goal.status === 'paused';

  const handleLogProgress = () => {
    logProgress(goal.id, Number(amount));
    setProgressOpen(false);
    setAmount(1);
  };

  const handleDelete = () => {
    deleteGoal(goal.id);
    navigate('/goals');
  };

  const typeLabel = goal.type === 'daily' ? t.newGoal.typeDaily
    : goal.type === 'count' ? t.newGoal.typeCount
    : t.newGoal.typeTime;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/goals')} sx={{ mb: 3 }}>
        {t.goalDetail.backToGoals}
      </Button>

      <Grid container spacing={3}>
        {/* Main Info */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderLeft: `6px solid ${goal.color || cat.color}`, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Chip
                    label={`${cat.emoji} ${t.categories_list[goal.category] || goal.category}`}
                    size="small"
                    sx={{ bgcolor: cat.bg, color: cat.color, fontWeight: 600, mb: 1 }}
                  />
                  <Typography variant="h4" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800 }}>
                    {goal.title}
                  </Typography>
                </Box>
                <Chip
                  label={t.goalCard.status[goal.status]}
                  sx={{
                    bgcolor: isCompleted ? 'rgba(16,185,129,0.15)' : isPaused ? 'rgba(245,158,11,0.15)' : 'rgba(124,58,237,0.15)',
                    color: isCompleted ? '#10B981' : isPaused ? '#F59E0B' : '#7C3AED',
                    fontWeight: 700,
                  }}
                />
              </Box>

              {/* Progress */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography fontWeight={700}>{t.goalDetail.progress}</Typography>
                  <Typography fontWeight={800} color={goal.color || cat.color} variant="h5">
                    {pct}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 14, borderRadius: 7,
                    bgcolor: 'rgba(255,255,255,0.08)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 7,
                      background: `linear-gradient(90deg, ${goal.color || cat.color}, ${goal.color || cat.color}aa)`,
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {getTargetLabel(goal, t)}
                </Typography>
              </Box>

              {/* Actions */}
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {!isCompleted && (
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => setProgressOpen(true)} sx={{ fontWeight: 700 }}>
                    {t.goalDetail.addProgress}
                  </Button>
                )}
                <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/goals/${goal.id}/edit`)}>
                  {t.goalDetail.editGoal}
                </Button>
                {!isCompleted && (
                  <>
                    <Button variant="outlined" color="warning"
                      startIcon={isPaused ? <PlayArrowIcon /> : <PauseIcon />}
                      onClick={() => togglePause(goal.id)}>
                      {isPaused ? t.goalDetail.resumeGoal : t.goalDetail.pauseGoal}
                    </Button>
                    <Button variant="outlined" color="success" startIcon={<CheckCircleIcon />}
                      onClick={() => markComplete(goal.id)}>
                      {t.goalDetail.markComplete}
                    </Button>
                  </>
                )}
                {isCompleted && (
                  <Button variant="outlined" onClick={() => restoreGoal(goal.id)}>
                    Restore to Active
                  </Button>
                )}
                <Button variant="outlined" color="error" startIcon={<DeleteIcon />}
                  onClick={() => setDeleteOpen(true)}>
                  {t.goalDetail.deleteGoal}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Progress History */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, mb: 2 }}>
                {t.goalDetail.progressHistory}
              </Typography>
              {goal.logs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography fontSize="2rem">📈</Typography>
                  <Typography color="text.secondary" mt={1}>{t.goalDetail.noHistory}</Typography>
                </Box>
              ) : (
                <Stack spacing={1}>
                  {[...goal.logs].reverse().map((log, i) => (
                    <Box key={i} sx={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      p: 1.5, bgcolor: 'action.hover', borderRadius: 2,
                    }}>
                      <Typography variant="body2" fontWeight={600}>
                        {t.goalDetail.loggedOn}: {log.date}
                      </Typography>
                      <Chip
                        label={`+${log.amount}`}
                        size="small"
                        sx={{ bgcolor: `${goal.color || cat.color}20`, color: goal.color || cat.color, fontWeight: 700 }}
                      />
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, mb: 2 }}>
                {t.goalDetail.summary}
              </Typography>
              <Stack spacing={2}>
                {[
                  { label: t.goalDetail.type, value: typeLabel },
                  { label: t.goalDetail.target, value: `${goal.target}` },
                  { label: t.goalDetail.progress, value: `${goal.progress}` },
                  { label: t.goalDetail.startDate, value: goal.startDate },
                  goal.endDate && { label: t.goalDetail.endDate, value: goal.endDate },
                  { label: t.goalDetail.created, value: goal.createdAt },
                ].filter(Boolean).map(item => (
                  <Box key={item.label}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                      {item.label}
                    </Typography>
                    <Typography fontWeight={600}>{item.value}</Typography>
                    <Divider sx={{ mt: 1 }} />
                  </Box>
                ))}
              </Stack>
              {goal.notes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    {t.goalDetail.notes}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
                    {goal.notes}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Log Progress Dialog */}
      <Dialog open={progressOpen} onClose={() => setProgressOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
          {t.goalDetail.addProgressTitle}
        </DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <TextField
            label={t.goalDetail.amount}
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            fullWidth
            inputProps={{ min: 1 }}
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setProgressOpen(false)}>{t.common.cancel}</Button>
          <Button variant="contained" onClick={handleLogProgress}>{t.common.save}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
          {t.goalCard.deleteTitle}
        </DialogTitle>
        <DialogContent>
          <Typography>{t.goalCard.confirmDelete}</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteOpen(false)}>{t.common.cancel}</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>{t.common.delete}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
