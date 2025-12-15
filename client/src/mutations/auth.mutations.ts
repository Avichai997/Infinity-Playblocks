import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { authApi } from '@/api';
import { useAuthStore } from '@/store';
import { ILoginDto, IRegisterDto } from '@/types';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ILoginDto) => authApi.login(data),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      navigate('/dashboard');
    },
  });
};

export const useRegisterMutation = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IRegisterDto) => authApi.register(data),
    onSuccess: async (_, variables) => {
      const loginData = await authApi.login({
        email: variables.email,
        password: variables.password,
      });
      setUser(loginData.user);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      navigate('/dashboard');
    },
  });
};

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const { logout: logoutStore } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      navigate('/auth');
    },
  });
};
