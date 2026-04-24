import { Box, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Box sx={{
      minHeight: '80vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 4,
    }}>
      <Typography sx={{ fontSize: '6rem', mb: 2 }}>🚀</Typography>
      <Typography variant="h1" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, color: 'primary.main', fontSize: '8rem', lineHeight: 1 }}>
        {t.notFound.title}
      </Typography>
      <Typography variant="h4" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, mt: 2, mb: 1 }}>
        {t.notFound.subtitle}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
        {t.notFound.desc}
      </Typography>
      <Button variant="contained" size="large" startIcon={<HomeIcon />}
        onClick={() => navigate('/')} sx={{ fontWeight: 700, px: 4 }}>
        {t.notFound.back}
      </Button>
    </Box>
  );
}
