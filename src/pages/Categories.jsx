import { Box, Typography, Grid, Card, CardContent, LinearProgress, Chip, Stack } from '@mui/material';
import { useGoals } from '../context/GoalsContext';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORY_CONFIG, getProgressPercent } from '../utils/categoryConfig';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Categories() {
  const { goals } = useGoals();
  const { t } = useLanguage();

  const categories = Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
    const catGoals = goals.filter(g => g.category === key);
    const active = catGoals.filter(g => g.status === 'active').length;
    const completed = catGoals.filter(g => g.status === 'completed').length;
    const avgProgress = catGoals.length > 0
      ? Math.round(catGoals.reduce((acc, g) => acc + getProgressPercent(g), 0) / catGoals.length)
      : 0;
    return { key, ...config, goals: catGoals, active, completed, total: catGoals.length, avgProgress };
  }).filter(c => c.total > 0 || true); // show all categories

  const chartData = categories.map(c => ({
    name: t.categories_list[c.key] || c.key,
    active: c.active,
    completed: c.completed,
    color: c.color,
  }));

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, mb: 0.5 }}>
          {t.categories.title}
        </Typography>
        <Typography color="text.secondary">{t.categories.subtitle}</Typography>
      </Box>

      {/* Bar Chart */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, mb: 3 }}>
            Goals by Category
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9B9BC0' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9B9BC0' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#1A1A2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                labelStyle={{ color: '#F1F0FF', fontWeight: 700 }}
              />
              <Bar dataKey="active" name={t.categories.active} radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
              <Bar dataKey="completed" name={t.categories.completed} radius={[6, 6, 0, 0]} fill="rgba(16,185,129,0.6)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Cards */}
      <Grid container spacing={2}>
        {categories.map(cat => (
          <Grid item xs={12} sm={6} md={4} key={cat.key}>
            <Card sx={{
              height: '100%',
              borderTop: `4px solid ${cat.color}`,
              opacity: cat.total === 0 ? 0.5 : 1,
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{ fontSize: '2rem' }}>{cat.emoji}</Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, lineHeight: 1.2 }}>
                      {t.categories_list[cat.key] || cat.key}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {cat.total} {t.categories.total}
                    </Typography>
                  </Box>
                </Box>

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label={`${t.categories.active}: ${cat.active}`}
                    size="small"
                    sx={{ bgcolor: `${cat.color}20`, color: cat.color, fontWeight: 700 }}
                  />
                  <Chip
                    label={`✅ ${cat.completed}`}
                    size="small"
                    sx={{ bgcolor: 'rgba(16,185,129,0.15)', color: '#10B981', fontWeight: 700 }}
                  />
                </Stack>

                {cat.total > 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t.categories.progress}
                      </Typography>
                      <Typography variant="caption" fontWeight={700} color={cat.color}>
                        {cat.avgProgress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={cat.avgProgress}
                      sx={{
                        height: 8, borderRadius: 4,
                        bgcolor: `${cat.color}20`,
                        '& .MuiLinearProgress-bar': { bgcolor: cat.color, borderRadius: 4 },
                      }}
                    />
                  </Box>
                )}

                {cat.total === 0 && (
                  <Typography variant="caption" color="text.secondary">
                    {t.categories.noGoals}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
