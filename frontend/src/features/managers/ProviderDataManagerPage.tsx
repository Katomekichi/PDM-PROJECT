import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavTileCard from '@/shared/ui/NavTileCard';

interface DataCard {
  id: number;
  title: string;
  route: string;
}

const cards: DataCard[] = [
  { id: 1, title: 'Practitioner', route: '/practitioners' },
  { id: 2, title: 'Organization', route: '/organizations' },
];

export default function ProviderDataManagerPage() {
  const navigate = useNavigate();

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>Provider Data Manager</Typography>
      <Box style={{ display: 'flex', gap: '5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {cards.map((card) => (
          <NavTileCard key={card.id} title={card.title} onClick={() => navigate(card.route)} />
        ))}
      </Box>
    </Box>
  );
}
