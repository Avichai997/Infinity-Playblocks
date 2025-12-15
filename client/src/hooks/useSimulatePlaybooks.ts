import { useQuery } from '@tanstack/react-query';

import { playbooksApi } from '@/api';
import { Trigger } from '@/types';

export const useSimulatePlaybooks = (trigger: Trigger | '', enabled: boolean) =>
  useQuery({
    queryKey: ['playbooks', 'simulate', trigger],
    queryFn: () => playbooksApi.simulate(trigger as Trigger),
    enabled: enabled && !!trigger,
  });
