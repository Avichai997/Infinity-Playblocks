import { Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';

import { IPlaybook } from '@/types';
import { toCamelCase } from '@/utils';

interface IPlaybookCardProps {
  playbook: IPlaybook;
}

export const PlaybookCard = ({ playbook }: IPlaybookCardProps) => (
  <Card className='mb-4 border border-gray-200'>
    <CardContent className='p-4'>
      <Typography variant='subtitle1' className='mb-2 font-semibold'>
        Playbook: {playbook.name}
      </Typography>
      <List dense>
        {playbook.actions.map((action, index) => (
          <ListItem key={index} className='py-1'>
            <ListItemText primary={`→ ${toCamelCase(action)}`} className='text-sm' />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);
