import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Drawer, List,
  ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme as useMuiTheme,
  Tooltip, Avatar, Divider
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FlagIcon from '@mui/icons-material/Flag';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import BoltIcon from '@mui/icons-material/Bolt';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useGoals } from '../context/GoalsContext';

const NAV_ITEMS = [
  { key: 'dashboard', path: '/', icon: <DashboardIcon /> },
  { key: 'goals', path: '/goals', icon: <FlagIcon /> },
  { key: 'categories', path: '/categories', icon: <CategoryIcon /> },
  { key: 'settings', path: '/settings', icon: <SettingsIcon /> },
];

export default function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useLanguage();
  const { mode, toggleTheme } = useTheme();
  const { stats } = useGoals();
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const navItems = NAV_ITEMS.map(item => ({ ...item, label: t.nav[item.key] }));

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(12px)',
      }}>
        <Toolbar sx={{ gap: 1 }}>
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)} edge="start">
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
              <BoltIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, color: 'primary.main' }}>
              GoalFlow
            </Typography>
          </Box>

          {/* Desktop Nav */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, ml: 3 }}>
              {navItems.map(item => (
                <Box
                  key={item.key}
                  onClick={() => handleNav(item.path)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 0.75,
                    px: 2, py: 1, borderRadius: 2, cursor: 'pointer',
                    bgcolor: isActive(item.path) ? 'primary.main' : 'transparent',
                    color: isActive(item.path) ? 'white' : 'text.secondary',
                    fontWeight: 600, fontSize: '0.875rem',
                    fontFamily: '"DM Sans", sans-serif',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: isActive(item.path) ? 'primary.main' : 'action.hover',
                      color: isActive(item.path) ? 'white' : 'text.primary',
                    },
                  }}
                >
                  {item.icon}
                  {item.label}
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* XP Badge */}
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 0.5,
              bgcolor: 'rgba(245,158,11,0.15)', color: '#F59E0B',
              px: 1.5, py: 0.5, borderRadius: 10,
              fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '0.8rem',
            }}>
              <BoltIcon sx={{ fontSize: 16 }} />
              {stats.xpTotal} {t.common.xp}
            </Box>

            {/* Streak */}
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 0.5,
              bgcolor: 'rgba(239,68,68,0.15)', color: '#EF4444',
              px: 1.5, py: 0.5, borderRadius: 10,
              fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '0.8rem',
            }}>
              🔥 {stats.streak}
            </Box>

            <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
              <IconButton onClick={toggleTheme} size="small">
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 280, bgcolor: 'background.paper' } }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, color: 'primary.main' }}>
            GoalFlow
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <Divider />
        <List sx={{ pt: 1 }}>
          {navItems.map(item => (
            <ListItem
              key={item.key}
              onClick={() => handleNav(item.path)}
              sx={{
                borderRadius: 2, mx: 1, mb: 0.5, cursor: 'pointer',
                bgcolor: isActive(item.path) ? 'primary.main' : 'transparent',
                color: isActive(item.path) ? 'white' : 'text.primary',
                '&:hover': { bgcolor: isActive(item.path) ? 'primary.main' : 'action.hover' },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ mt: 'auto' }} />
        <Box sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Box sx={{ bgcolor: 'rgba(245,158,11,0.15)', color: '#F59E0B', px: 1.5, py: 0.5, borderRadius: 10, fontWeight: 700, fontSize: '0.85rem' }}>
            ⚡ {stats.xpTotal} XP
          </Box>
          <Box sx={{ bgcolor: 'rgba(239,68,68,0.15)', color: '#EF4444', px: 1.5, py: 0.5, borderRadius: 10, fontWeight: 700, fontSize: '0.85rem' }}>
            🔥 {stats.streak} {t.common.days}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
