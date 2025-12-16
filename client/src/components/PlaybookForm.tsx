import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { FormikProps } from 'formik';

import { Action, IPlaybook, Trigger } from '@/types';
import { toCamelCase } from '@/utils';

interface IFormValues {
  name: string;
  trigger: Trigger;
  actions: Action[];
}

interface IPlaybookFormProps {
  formik: FormikProps<IFormValues>;
  editingPlaybook: IPlaybook | null;
  onCancel?: () => void;
  isSaveDisabled: boolean;
}

export const PlaybookForm = ({
  formik,
  editingPlaybook,
  onCancel,
  isSaveDisabled,
}: IPlaybookFormProps) => {
  const handleActionToggle = (action: Action) => {
    const currentActions = formik.values.actions;
    if (currentActions.includes(action)) {
      formik.setFieldValue(
        'actions',
        currentActions.filter((a) => a !== action),
      );
    } else if (currentActions.length < 3) {
      formik.setFieldValue('actions', [...currentActions, action]);
    }
  };

  return (
    <Card className='shadow-md'>
      <CardContent className='p-6'>
        <form onSubmit={formik.handleSubmit} className='space-y-4'>
          <TextField
            fullWidth
            label='Name'
            name='name'
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            required
            variant='outlined'
            className='mb-4'
          />

          <FormControl fullWidth className='mb-4'>
            <Typography variant='body2' className='mb-2 text-gray-700'>
              Trigger:
            </Typography>
            <Select
              name='trigger'
              value={formik.values.trigger}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              variant='outlined'
            >
              {Object.values(Trigger).map((t) => (
                <MenuItem key={t} value={t}>
                  {toCamelCase(t)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box className='mb-4'>
            <Typography variant='body2' className='mb-2 text-gray-700'>
              Actions: (Choose up to 3)
            </Typography>
            {formik.touched.actions && formik.errors.actions && (
              <Typography variant='caption' color='error' className='mb-2 block'>
                {formik.errors.actions}
              </Typography>
            )}
            <FormGroup>
              {Object.values(Action).map((action) => (
                <FormControlLabel
                  key={action}
                  control={
                    <Checkbox
                      checked={formik.values.actions.includes(action)}
                      onChange={() => handleActionToggle(action)}
                      disabled={
                        !formik.values.actions.includes(action) && formik.values.actions.length >= 3
                      }
                      className='text-indigo-600'
                    />
                  }
                  label={toCamelCase(action)}
                />
              ))}
            </FormGroup>
          </Box>

          <Box className='flex gap-2'>
            <Button
              type='submit'
              variant='contained'
              disabled={isSaveDisabled}
              className='flex-1 bg-indigo-600 hover:bg-indigo-700'
            >
              {editingPlaybook ? 'Update' : 'Create'}
            </Button>

            {editingPlaybook && onCancel && (
              <Button
                type='button'
                onClick={onCancel}
                variant='outlined'
                className='border-gray-300 text-gray-700 hover:bg-gray-50'
              >
                Cancel
              </Button>
            )}
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};
