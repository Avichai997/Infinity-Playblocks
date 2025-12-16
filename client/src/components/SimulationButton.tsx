import { Button } from '@mui/material';

interface ISimulationButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const SimulationButton = ({ onClick, disabled }: ISimulationButtonProps) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    variant='contained'
    className='w-64 bg-indigo-600 hover:bg-indigo-700'
    sx={{ py: 1.5 }}
  >
    Run Simulation
  </Button>
);
