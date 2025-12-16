import { Box, Card, CardContent, Typography } from '@mui/material';
import { useState } from 'react';

import { Layout, SimulationButton, SimulationResults, TriggerSelector } from '@/components';
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

  return (
    <Layout>
      <Typography variant='h4' component='h1' className='mb-6 font-bold'>
        Simulate Event
      </Typography>

      <Box>
        <Card className='shadow-md'>
          <CardContent className='p-6'>
            <Box className='mb-6 flex flex-col items-center gap-2'>
              <Typography variant='body2' className='mb-2 text-center text-gray-700'>
                Select Trigger:
              </Typography>

              <TriggerSelector
                selectedTrigger={selectedTrigger}
                onTriggerChange={handleTriggerChange}
              />

              <SimulationButton
                onClick={handleRunSimulation}
                disabled={!selectedTrigger || isLoading}
              />
            </Box>

            {runSimulation && (
              <SimulationResults isLoading={isLoading} matchingPlaybooks={matchingPlaybooks} />
            )}
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};
