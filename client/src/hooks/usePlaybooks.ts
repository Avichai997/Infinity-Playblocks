import { useQuery } from '@tanstack/react-query';

import { playbooksApi } from '@/api';

export const usePlaybooks = () =>
  useQuery({
    queryKey: ['playbooks'],
    queryFn: playbooksApi.getAll,
  });
