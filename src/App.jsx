import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { GoalsProvider } from './context/GoalsContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import GoalsList from './pages/GoalsList';
import NewGoal from './pages/NewGoal';
import GoalDetail from './pages/GoalDetail';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function AppContent() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavBar />
      <Box component="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/goals" element={<GoalsList />} />
          <Route path="/goals/new" element={<NewGoal />} />
          <Route path="/goals/:id" element={<GoalDetail />} />
          <Route path="/goals/:id/edit" element={<NewGoal />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <GoalsProvider>
          <ThemeProvider>
            <CssBaseline />
            <AppContent />
          </ThemeProvider>
        </GoalsProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
