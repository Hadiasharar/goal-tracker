import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Grid,
  FormHelperText, ToggleButton, ToggleButtonGroup, Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { useGoals } from '../context/GoalsContext';
import { useLanguage } from '../context/LanguageContext';
import { GOAL_COLORS, CATEGORY_CONFIG } from '../utils/categoryConfig';

const INITIAL_FORM = {
  title: '', category: '', type: 'daily',
  target: 30, color: '#7C3AED',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '', notes: '',
};

export default function NewGoal() {
  const { t } = useLanguage();
  const { createGoal, updateGoal, getGoalById } = useGoals();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      const goal = getGoalById(id);
      if (goal) {
        setForm({
          title: goal.title,
          category: goal.category,
          type: goal.type,
          target: goal.target,
          color: goal.color || '#7C3AED',
          startDate: goal.startDate,
          endDate: goal.endDate || '',
          notes: goal.notes || '',
        });
      }
    }
  }, [id, isEdit, getGoalById]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = t.newGoal.validation.titleRequired;
    if (!form.category) errs.category = t.newGoal.validation.categoryRequired;
    if (!form.target || form.target <= 0) errs.target = t.newGoal.validation.targetRequired;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (isEdit) {
      updateGoal(id, { ...form, target: Number(form.target) });
    } else {
      createGoal({ ...form, target: Number(form.target) });
    }
    navigate('/goals');
  };

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const categories = Object.keys(CATEGORY_CONFIG);
  const targetLabel = form.type === 'daily' ? t.newGoal.targetDaily
    : form.type === 'time' ? t.newGoal.targetTime
    : t.newGoal.targetCount;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 700, mx: 'auto' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        {t.newGoal.cancel}
      </Button>

      <Typography variant="h3" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, mb: 4 }}>
        {isEdit ? t.newGoal.editTitle : t.newGoal.title}
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                label={t.newGoal.titleLabel}
                placeholder={t.newGoal.titlePlaceholder}
                value={form.title}
                onChange={e => set('title', e.target.value)}
                fullWidth
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>

            {}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.category} required>
                <InputLabel>{t.newGoal.category}</InputLabel>
                <Select value={form.category} onChange={e => set('category', e.target.value)} label={t.newGoal.category}>
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>
                      {CATEGORY_CONFIG[cat].emoji} {t.categories_list[cat] || cat}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>

            {}
            <Grid item xs={12} sm={6}>
              <TextField
                label={targetLabel}
                type="number"
                value={form.target}
                onChange={e => set('target', e.target.value)}
                fullWidth
                error={!!errors.target}
                helperText={errors.target}
                inputProps={{ min: 1 }}
                required
              />
            </Grid>

            {/* Goal Type */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                {t.newGoal.type}
              </Typography>
              <ToggleButtonGroup value={form.type} exclusive onChange={(_, v) => v && set('type', v)} fullWidth>
                <ToggleButton value="daily" sx={{ fontWeight: 600, textTransform: 'none' }}>
                  📅 {t.newGoal.typeDaily}
                </ToggleButton>
                <ToggleButton value="count" sx={{ fontWeight: 600, textTransform: 'none' }}>
                  🔢 {t.newGoal.typeCount}
                </ToggleButton>
                <ToggleButton value="time" sx={{ fontWeight: 600, textTransform: 'none' }}>
                  ⏱️ {t.newGoal.typeTime}
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            {}
            <Grid item xs={12} sm={6}>
              <TextField
                label={t.newGoal.startDate}
                type="date"
                value={form.startDate}
                onChange={e => set('startDate', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t.newGoal.endDate}
                type="date"
                value={form.endDate}
                onChange={e => set('endDate', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
                {t.newGoal.color}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {GOAL_COLORS.map(color => (
                  <Box
                    key={color}
                    onClick={() => set('color', color)}
                    sx={{
                      width: 32, height: 32, borderRadius: '50%', bgcolor: color,
                      cursor: 'pointer', transition: 'transform 0.15s',
                      border: form.color === color ? '3px solid white' : '3px solid transparent',
                      boxShadow: form.color === color ? `0 0 0 3px ${color}` : 'none',
                      '&:hover': { transform: 'scale(1.2)' },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {}
            <Grid item xs={12}>
              <TextField
                label={t.newGoal.notes}
                placeholder={t.newGoal.notesPlaceholder}
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>

            {}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  {t.newGoal.cancel}
                </Button>
                <Button variant="contained" onClick={handleSubmit} size="large" sx={{ fontWeight: 700, px: 4 }}>
                  {isEdit ? t.newGoal.update : t.newGoal.create}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
