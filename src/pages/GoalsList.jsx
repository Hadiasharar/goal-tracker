import { useState, useMemo } from 'react';
import {
  Box, Typography, Grid, TextField, InputAdornment,
  Tab, Tabs, Select, MenuItem, FormControl, InputLabel, Button, Card, CardContent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGoals } from '../context/GoalsContext';
import { useLanguage } from '../context/LanguageContext';
import GoalCard from '../components/GoalCard';

export default function GoalsList() {
  const { goals } = useGoals();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(searchParams.get('tab') || 'all');
  const [sort, setSort] = useState('newest');

  const filtered = useMemo(() => {
    let list = [...goals];

    if (tab !== 'all') list = list.filter(g => g.status === tab);
    if (search) list = list.filter(g => g.title.toLowerCase().includes(search.toLowerCase()));

    list.sort((a, b) => {
      if (sort === 'progress') return (b.progress / b.target) - (a.progress / a.target);
      if (sort === 'category') return a.category.localeCompare(b.category);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return list;
  }, [goals, tab, search, sort]);

  const tabs = [
    { value: 'all', label: t.goals.all },
    { value: 'active', label: t.goals.active },
    { value: 'completed', label: t.goals.completed },
    { value: 'paused', label: t.goals.paused },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, mb: 0.5 }}>
            {t.goals.title}
          </Typography>
          <Typography color="text.secondary">{goals.length} total goals</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/goals/new')}
          size="large" sx={{ fontWeight: 700, px: 3 }}>
          {t.dashboard.newGoal}
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder={t.goals.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 220 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>{t.goals.sortBy}</InputLabel>
          <Select value={sort} onChange={e => setSort(e.target.value)} label={t.goals.sortBy}>
            <MenuItem value="newest">{t.goals.sortNewest}</MenuItem>
            <MenuItem value="progress">{t.goals.sortProgress}</MenuItem>
            <MenuItem value="category">{t.goals.sortCategory}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        {tabs.map(tabItem => (
          <Tab key={tabItem.value} value={tabItem.value} label={tabItem.label}
            sx={{ fontWeight: 600, textTransform: 'none', fontFamily: '"DM Sans", sans-serif' }} />
        ))}
      </Tabs>

      {/* Goals Grid */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography fontSize="3rem">🔍</Typography>
            <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>{t.goals.noGoals}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>{t.goals.createFirst}</Typography>
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/goals/new')}>
              {t.dashboard.newGoal}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {filtered.map(goal => (
            <Grid item xs={12} sm={6} md={4} key={goal.id}>
              <GoalCard goal={goal} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
