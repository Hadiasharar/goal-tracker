import { useState } from 'react';
import {
  Card, CardContent, Box, Typography, Chip, IconButton,
  LinearProgress, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { useGoals } from '../context/GoalsContext';
import { useLanguage } from '../context/LanguageContext';
import { getCategoryConfig, getProgressPercent, getTargetLabel } from '../utils/categoryConfig';

export default function GoalCard({ goal, showActions = true }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { logProgress, deleteGoal, togglePause } = useGoals();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const cat = getCategoryConfig(goal.category);
  const pct = getProgressPercent(goal);
  const isCompleted = goal.status === 'completed';
  const isPaused = goal.status === 'paused';

  const handleDelete = () => {
    deleteGoal(goal.id);
    setDeleteOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
          borderLeft: `4px solid ${goal.color || cat.color}`,
          opacity: isPaused ? 0.75 : 1,
        }}
        onClick={() => navigate(`/goals/${goal.id}`)}
      >
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.3, mb: 0.5 }} noWrap>
                {goal.title}
              </Typography>
              <Chip
                label={`${cat.emoji} ${t.categories_list[goal.category] || goal.category}`}
                size="small"
                sx={{ bgcolor: cat.bg, color: cat.color, fontWeight: 600, fontSize: '0.7rem' }}
              />
            </Box>
            <Chip
              label={t.goalCard.status[goal.status]}
              size="small"
              sx={{
                ml: 1,
                bgcolor: isCompleted ? 'rgba(16,185,129,0.15)' : isPaused ? 'rgba(245,158,11,0.15)' : 'rgba(124,58,237,0.15)',
                color: isCompleted ? '#10B981' : isPaused ? '#F59E0B' : '#7C3AED',
                fontWeight: 700,
                fontSize: '0.65rem',
              }}
            />
          </Box>

          {/* Progress */}
          <Box sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {t.goalCard.progress}
              </Typography>
              <Typography variant="caption" fontWeight={700} color={goal.color || cat.color}>
                {pct}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.08)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${goal.color || cat.color}, ${goal.color || cat.color}aa)`,
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {getTargetLabel(goal, t)}
            </Typography>
          </Box>

          {/* Actions */}
          {showActions && (
            <Stack direction="row" spacing={0.5} onClick={e => e.stopPropagation()}>
              {!isCompleted && (
                <Tooltip title={t.goalCard.markProgress}>
                  <IconButton
                    size="small"
                    onClick={() => logProgress(goal.id, 1)}
                    sx={{ color: '#10B981', bgcolor: 'rgba(16,185,129,0.1)', '&:hover': { bgcolor: 'rgba(16,185,129,0.2)' } }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={t.goalCard.edit}>
                <IconButton size="small" onClick={() => navigate(`/goals/${goal.id}/edit`)}
                  sx={{ color: '#45B7D1', bgcolor: 'rgba(69,183,209,0.1)', '&:hover': { bgcolor: 'rgba(69,183,209,0.2)' } }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {!isCompleted && (
                <Tooltip title={isPaused ? t.goalCard.resume : t.goalCard.pause}>
                  <IconButton size="small" onClick={() => togglePause(goal.id)}
                    sx={{ color: '#F59E0B', bgcolor: 'rgba(245,158,11,0.1)', '&:hover': { bgcolor: 'rgba(245,158,11,0.2)' } }}>
                    {isPaused ? <PlayArrowIcon fontSize="small" /> : <PauseIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={t.goalCard.delete}>
                <IconButton size="small" onClick={() => setDeleteOpen(true)}
                  sx={{ color: '#EF4444', bgcolor: 'rgba(239,68,68,0.1)', '&:hover': { bgcolor: 'rgba(239,68,68,0.2)' } }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {isCompleted && (
                <CheckCircleIcon sx={{ color: '#10B981', ml: 'auto', alignSelf: 'center' }} />
              )}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
          {t.goalCard.deleteTitle}
        </DialogTitle>
        <DialogContent>
          <Typography>{t.goalCard.confirmDelete}</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteOpen(false)} variant="outlined">{t.goalCard.cancel}</Button>
          <Button onClick={handleDelete} variant="contained" color="error">{t.goalCard.confirm}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
