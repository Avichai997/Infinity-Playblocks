import { Alert, Box, Card, CardContent, CircularProgress, List, Typography } from '@mui/material';

import { IPlaybook } from '@/types';

import { PlaybookListItem } from './PlaybookListItem';

interface IPlaybookListProps {
  playbooks: IPlaybook[];
  isLoading: boolean;
  onEdit: (playbook: IPlaybook) => void;
  onDelete: (playbookId: string) => void;
  isDisabled: boolean;
}

export const PlaybookList = ({
  playbooks,
  isLoading,
  onEdit,
  onDelete,
  isDisabled,
}: IPlaybookListProps) => (
  <Card className='shadow-md'>
    <CardContent className='p-6'>
      <Typography variant='h6' className='mb-4 font-semibold'>
        Your Playbooks
      </Typography>
      {isLoading ? (
        <Box className='flex justify-center py-8'>
          <CircularProgress />
        </Box>
      ) : playbooks.length === 0 ? (
        <Alert severity='info' className='mt-4'>
          No playbooks yet. Create your first playbook!
        </Alert>
      ) : (
        <List>
          {playbooks.map((playbook) => (
            <PlaybookListItem
              key={playbook.id}
              playbook={playbook}
              onEdit={onEdit}
              onDelete={onDelete}
              isDisabled={isDisabled}
            />
          ))}
        </List>
      )}
    </CardContent>
  </Card>
);
