import { Delete, Edit } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Layout } from '@/components';
import { usePlaybooks } from '@/hooks';
import {
  useCreatePlaybookMutation,
  useDeletePlaybookMutation,
  useUpdatePlaybookMutation,
} from '@/mutations';
import { Action, IPlaybook, Trigger } from '@/types';
import { toCamelCase } from '@/utils';

interface IFormValues {
  name: string;
  trigger: Trigger;
  actions: Action[];
}

export const DashboardPage = () => {
  const { playbookId } = useParams<{ playbookId?: string }>();
  const navigate = useNavigate();

  const { data: playbooks = [], isLoading } = usePlaybooks();
  const createMutation = useCreatePlaybookMutation();
  const updateMutation = useUpdatePlaybookMutation();
  const deleteMutation = useDeletePlaybookMutation();

  const editingPlaybook = useMemo(
    () => (playbookId ? playbooks.find((p) => p.id === playbookId) : null),
    [playbookId, playbooks],
  );

  const initialValues = useMemo(
    () => ({
      name: editingPlaybook?.name || '',
      trigger: editingPlaybook?.trigger || Trigger.MalwareDetected,
      actions: editingPlaybook?.actions || [],
    }),
    [editingPlaybook],
  );

  const formik = useFormik<IFormValues>({
    initialValues,
    validate: (values) => {
      const errors: Partial<Record<keyof IFormValues, string>> = {};
      if (!values.name) {
        errors.name = 'Name is required';
      }
      if (values.actions.length === 0) {
        errors.actions = 'At least one action is required';
      }
      return errors;
    },
    onSubmit: (values) => {
      if (editingPlaybook) {
        updateMutation.mutate({
          id: editingPlaybook.id,
          data: values,
        });
      } else {
        createMutation.mutate(values, {
          onSuccess: () => {
            formik.resetForm();
          },
        });
      }
    },
    enableReinitialize: true,
  });

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

  const handleEdit = (playbook: IPlaybook) => {
    navigate(`/dashboard/${playbook.id}`);
  };

  const handleCancelEdit = () => {
    navigate('/dashboard');
  };

  const isSaveDisabled =
    (editingPlaybook ? updateMutation.isPending : createMutation.isPending) ||
    !formik.isValid ||
    (editingPlaybook ? !formik.dirty : false);

  return (
    <Layout>
      <Typography variant='h4' component='h1' className='mb-6 font-bold'>
        {editingPlaybook ? 'Edit Playbook' : 'Create Playbook'}
      </Typography>

      <Box className='flex flex-col gap-6 md:flex-row'>
        {/* Create/Edit Playbook Form */}
        <Box className='flex-1'>
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
                              !formik.values.actions.includes(action) &&
                              formik.values.actions.length >= 3
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

                  {editingPlaybook && (
                    <Button
                      type='button'
                      onClick={handleCancelEdit}
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
        </Box>

        {/* Playbooks List */}
        <Box className='flex-1'>
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
                    <ListItem
                      key={playbook.id}
                      className='mb-2 rounded-md border border-gray-200'
                      secondaryAction={
                        <Box className='flex gap-1'>
                          <IconButton
                            edge='end'
                            onClick={() => handleEdit(playbook)}
                            disabled={deleteMutation.isPending || updateMutation.isPending}
                            className='text-indigo-600'
                            size='small'
                          >
                            <Edit fontSize='small' />
                          </IconButton>
                          <IconButton
                            edge='end'
                            onClick={() => deleteMutation.mutate(playbook.id)}
                            disabled={deleteMutation.isPending || updateMutation.isPending}
                            className='text-red-600'
                            size='small'
                          >
                            <Delete fontSize='small' />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={playbook.name}
                        secondary={`Trigger: ${toCamelCase(playbook.trigger)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Layout>
  );
};
