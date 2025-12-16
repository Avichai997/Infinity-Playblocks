import { FormControl, MenuItem, Select } from '@mui/material';

import { Trigger } from '@/types';
import { toCamelCase } from '@/utils';

interface ITriggerSelectorProps {
  selectedTrigger: Trigger | '';
  onTriggerChange: (trigger: Trigger | '') => void;
}

export const TriggerSelector = ({ selectedTrigger, onTriggerChange }: ITriggerSelectorProps) => (
  <FormControl className='mb-4 w-64'>
    <Select
      value={selectedTrigger}
      onChange={(e) => onTriggerChange(e.target.value as Trigger | '')}
      variant='outlined'
    >
      <MenuItem value=''>Select Trigger</MenuItem>
      {Object.values(Trigger).map((trigger) => (
        <MenuItem key={trigger} value={trigger}>
          {toCamelCase(trigger)}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
