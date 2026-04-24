import {
  Box, Typography, Card, CardContent, Stack, Switch,
  FormControlLabel, Divider, ToggleButtonGroup, ToggleButton,
  Avatar, Chip
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import PaletteIcon from '@mui/icons-material/Palette';
import BoltIcon from '@mui/icons-material/Bolt';
import InfoIcon from '@mui/icons-material/Info';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useGoals } from '../context/GoalsContext';
import { getLevel, getXpToNextLevel } from '../utils/categoryConfig';

function SettingSection({ icon, title, children }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Box sx={{ color: 'primary.main' }}>{icon}</Box>
          <Typography variant="h6" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

const LANGUAGES = [
  { code: 'en', flag: 'EN', key: 'english' },
  { code: 'de', flag: 'DE', key: 'german' },
  { code: 'tr', flag: 'TR', key: 'turkish' },
];

export default function Settings() {
  const { t, language, changeLanguage } = useLanguage();
  const { mode, toggleTheme } = useTheme();
  const { stats } = useGoals();

  const level = getLevel(stats.xpTotal);
  const xpToNext = getXpToNextLevel(stats.xpTotal);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h3" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, mb: 1 }}>
        {t.settings.title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Customize your GoalFlow experience
      </Typography>

      {/* Language */}
      <SettingSection icon={<LanguageIcon />} title={t.settings.language}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t.settings.languageDesc}
        </Typography>
        <ToggleButtonGroup value={language} exclusive onChange={(_, v) => v && changeLanguage(v)} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {LANGUAGES.map(lang => (
            <ToggleButton key={lang.code} value={lang.code}
              sx={{ fontWeight: 700, textTransform: 'none', px: 3, py: 1, borderRadius: '12px !important', border: '1px solid !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: '1.3rem' }}>{lang.flag}</span>
                {t.settings[lang.key]}
              </Box>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Box sx={{ mt: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Direction: <strong>{t.dir.toUpperCase()}</strong> — All languages use Left-to-Right layout
          </Typography>
        </Box>
      </SettingSection>

      {/* Theme */}
      <SettingSection icon={<PaletteIcon />} title={t.settings.theme}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t.settings.themeDesc}
        </Typography>
        <ToggleButtonGroup value={mode} exclusive onChange={toggleTheme}>
          <ToggleButton value="light" sx={{ fontWeight: 700, textTransform: 'none', px: 3 }}>
            <Brightness7Icon sx={{ mr: 1, fontSize: 18 }} />
            {t.settings.light}
          </ToggleButton>
          <ToggleButton value="dark" sx={{ fontWeight: 700, textTransform: 'none', px: 3 }}>
            <Brightness4Icon sx={{ mr: 1, fontSize: 18 }} />
            {t.settings.dark}
          </ToggleButton>
        </ToggleButtonGroup>
      </SettingSection>

      {}
      <SettingSection icon={<BoltIcon />} title={t.settings.xpRules}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t.settings.xpRulesDesc}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          <Chip label={`Level ${level}`} color="primary" icon={<BoltIcon />} sx={{ fontWeight: 700 }} />
          <Chip label={`${stats.xpTotal} XP total`} sx={{ bgcolor: 'rgba(245,158,11,0.15)', color: '#F59E0B', fontWeight: 700 }} />
          <Chip label={`${xpToNext} XP to next level`} variant="outlined" sx={{ fontWeight: 600 }} />
          <Chip label={`🔥 ${stats.streak} day streak`} sx={{ bgcolor: 'rgba(239,68,68,0.15)', color: '#EF4444', fontWeight: 700 }} />
        </Stack>
        <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ display: 'flex', gap: 1 }}>
              <span>⚡</span> Each progress log earns <strong>+20 XP</strong>
            </Typography>
            <Typography variant="caption" sx={{ display: 'flex', gap: 1 }}>
              <span>🏆</span> Completing a goal earns <strong>+100 bonus XP</strong>
            </Typography>
            <Typography variant="caption" sx={{ display: 'flex', gap: 1 }}>
              <span>🔥</span> Streak resets if you miss a day on daily goals
            </Typography>
            <Typography variant="caption" sx={{ display: 'flex', gap: 1 }}>
              <span>⬆️</span> New level every <strong>500 XP</strong>
            </Typography>
          </Stack>
        </Box>
      </SettingSection>

      {}
      <SettingSection icon={<InfoIcon />} title={t.settings.about}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            <BoltIcon />
          </Avatar>
          <Box>
            <Typography fontWeight={800} sx={{ fontFamily: '"Syne", sans-serif' }}>GoalFlow v1.0</Typography>
            <Typography variant="caption" color="text.secondary">Goal Tracker App</Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {t.settings.aboutDesc}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">✅ React + Vite + MUI</Typography>
          <Typography variant="caption" color="text.secondary">✅ React Router (multi-page)</Typography>
          <Typography variant="caption" color="text.secondary">✅ English / German / Turkish</Typography>
          <Typography variant="caption" color="text.secondary">✅ LocalStorage persistence</Typography>
          <Typography variant="caption" color="text.secondary">✅ Dark / Light theme</Typography>
          <Typography variant="caption" color="text.secondary">✅ Recharts visualization</Typography>
        </Stack>
      </SettingSection>
    </Box>
  );
}
