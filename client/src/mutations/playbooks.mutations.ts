import { useMutation, useQueryClient } from '@tanstack/react-query';

import { playbooksApi } from '@/api';
import { ICreatePlaybookDto, IUpdatePlaybookDto } from '@/types';

export const useCreatePlaybookMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreatePlaybookDto) => playbooksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbooks'] });
    },
  });
};

export const useUpdatePlaybookMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdatePlaybookDto }) =>
      playbooksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbooks'] });
      queryClient.invalidateQueries({ queryKey: ['playbooks', 'simulate'] });
    },
  });
};

export const useDeletePlaybookMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => playbooksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbooks'] });
      queryClient.invalidateQueries({ queryKey: ['playbooks', 'simulate'] });
    },
  });
};
