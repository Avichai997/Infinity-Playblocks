import { Box, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Layout, PlaybookForm, PlaybookList } from '@/components';
import { APP_ROUTES } from '@/constants/routes';
import { usePlaybooks } from '@/hooks';
import {
  useCreatePlaybookMutation,
  useDeletePlaybookMutation,
  useUpdatePlaybookMutation,
} from '@/mutations';
import { Action, IPlaybook, Trigger } from '@/types';

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

  const editingPlaybook = useMemo<IPlaybook | null>(
    () => (playbookId ? (playbooks.find((p) => p.id === playbookId) ?? null) : null),
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

  const handleEdit = (playbook: { id: string }) => {
    navigate(APP_ROUTES.PLAYBOOKS_EDITOR_EDIT(playbook.id));
  };

  const handleCancelEdit = () => {
    navigate(APP_ROUTES.PLAYBOOKS_EDITOR);
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
        <Box className='flex-1'>
          <PlaybookForm
            formik={formik}
            editingPlaybook={editingPlaybook}
            onCancel={handleCancelEdit}
            isSaveDisabled={isSaveDisabled}
          />
        </Box>

        <Box className='flex-1'>
          <PlaybookList
            playbooks={playbooks}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={(playbookId) => deleteMutation.mutate(playbookId)}
            isDisabled={deleteMutation.isPending || updateMutation.isPending}
          />
        </Box>
      </Box>
    </Layout>
  );
};
