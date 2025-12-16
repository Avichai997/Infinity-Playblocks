import { Delete, Edit } from '@mui/icons-material';
import { Box, IconButton, ListItem, ListItemText } from '@mui/material';

import { IPlaybook } from '@/types';
import { toCamelCase } from '@/utils';

interface IPlaybookListItemProps {
  playbook: IPlaybook;
  onEdit: (playbook: IPlaybook) => void;
  onDelete: (playbookId: string) => void;
  isDisabled: boolean;
}

export const PlaybookListItem = ({
  playbook,
  onEdit,
  onDelete,
  isDisabled,
}: IPlaybookListItemProps) => (
  <ListItem
    className='mb-2 rounded-md border border-gray-200'
    secondaryAction={
      <Box className='flex gap-1'>
        <IconButton
          edge='end'
          onClick={() => onEdit(playbook)}
          disabled={isDisabled}
          className='text-indigo-600'
          size='small'
        >
          <Edit fontSize='small' />
        </IconButton>
        <IconButton
          edge='end'
          onClick={() => onDelete(playbook.id)}
          disabled={isDisabled}
          className='text-red-600'
          size='small'
        >
          <Delete fontSize='small' />
        </IconButton>
      </Box>
    }
  >
    <ListItemText primary={playbook.name} secondary={`Trigger: ${toCamelCase(playbook.trigger)}`} />
  </ListItem>
);
