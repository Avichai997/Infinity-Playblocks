import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { Layout } from '@/components';
import { useSimulatePlaybooks } from '@/hooks';
import { Trigger } from '@/types';

export const SimulatePage = () => {
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | ''>('');
  const [runSimulation, setRunSimulation] = useState(false);

  const { data: matchingPlaybooks = [], isLoading } = useSimulatePlaybooks(
    selectedTrigger,
    runSimulation,
  );

  const handleRunSimulation = () => {
    if (selectedTrigger) {
      setRunSimulation(true);
    }
  };

  const handleTriggerChange = (trigger: Trigger | '') => {
    setSelectedTrigger(trigger);
    setRunSimulation(false);
  };

  const getTriggerLabel = (trigger: Trigger) =>
    trigger.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const getActionLabel = (action: string) =>
    action.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <Layout>
      <Typography variant='h4' component='h1' className='mb-6 font-bold'>
        Simulate Event
      </Typography>

      <Box>
        <Card className='shadow-md'>
          <CardContent className='p-6'>
            <Box className='mb-6'>
              <FormControl fullWidth className='mb-4'>
                <Typography variant='body2' className='mb-2 text-gray-700'>
                  Select Trigger:
                </Typography>
                <Select
                  value={selectedTrigger}
                  onChange={(e) => handleTriggerChange(e.target.value as Trigger | '')}
                  variant='outlined'
                >
                  <MenuItem value=''>Select Trigger</MenuItem>
                  {Object.values(Trigger).map((trigger) => (
                    <MenuItem key={trigger} value={trigger}>
                      {getTriggerLabel(trigger)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                onClick={handleRunSimulation}
                disabled={!selectedTrigger || isLoading}
                variant='contained'
                fullWidth
                className='bg-indigo-600 hover:bg-indigo-700'
                sx={{ py: 1.5 }}
              >
                Run Simulation
              </Button>
            </Box>

            {runSimulation && (
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
                      <Card key={playbook.id} className='mb-4 border border-gray-200'>
                        <CardContent className='p-4'>
                          <Typography variant='subtitle1' className='mb-2 font-semibold'>
                            Playbook: {playbook.name}
                          </Typography>
                          <List dense>
                            {playbook.actions.map((action, index) => (
                              <ListItem key={index} className='py-1'>
                                <ListItemText
                                  primary={`→ ${getActionLabel(action)}`}
                                  className='text-sm'
                                />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    ))}
                  </List>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};
