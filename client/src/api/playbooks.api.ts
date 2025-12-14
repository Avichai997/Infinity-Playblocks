import { IPlaybook, ICreatePlaybookDto, Trigger } from '@/types';

import api from './axios';

export const playbooksApi = {
  getAll: async (): Promise<IPlaybook[]> => {
    const response = await api.get('/playbooks');
    return response.data;
  },

  create: async (data: ICreatePlaybookDto): Promise<IPlaybook> => {
    const response = await api.post('/playbooks', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/playbooks/${id}`);
  },

  simulate: async (trigger: Trigger): Promise<IPlaybook[]> => {
    const response = await api.get(`/playbooks/simulate?trigger=${trigger}`);
    return response.data;
  },
};
