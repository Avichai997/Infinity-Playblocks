import { Alert, Box, CircularProgress, List, Typography } from '@mui/material';

import { IPlaybook } from '@/types';

import { PlaybookCard } from './PlaybookCard';

interface ISimulationResultsProps {
  isLoading: boolean;
  matchingPlaybooks: IPlaybook[];
}

export const SimulationResults = ({ isLoading, matchingPlaybooks }: ISimulationResultsProps) => (
  <Box className='border-t pt-6'>
    <Typography variant='h6' className='mb-4 text-center font-semibold'>
      Matching Playbooks
    </Typography>
    {isLoading ? (
      <Box className='flex justify-center py-8'>
        <CircularProgress />
      </Box>
    ) : matchingPlaybooks.length === 0 ? (
      <Alert severity='info'>No matching playbooks found</Alert>
    ) : (
      <List>
        {matchingPlaybooks.map((playbook) => (
          <PlaybookCard key={playbook.id} playbook={playbook} />
        ))}
      </List>
    )}
  </Box>
);
