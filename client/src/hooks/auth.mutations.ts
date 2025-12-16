import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { authApi } from '@/api';
import { APP_ROUTES } from '@/constants/routes';
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
      navigate(APP_ROUTES.PLAYBOOKS_EDITOR);
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
      try {
        const loginData = await authApi.login({
          email: variables.email,
          password: variables.password,
        });
        setUser(loginData.user);
        queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        navigate(APP_ROUTES.PLAYBOOKS_EDITOR);
      } catch (error) {
        // Registration succeeded but auto-login failed
        // Navigate to login page so user can log in manually
        navigate(APP_ROUTES.LOGIN);
        // Create a more descriptive error for the component to display
        const loginError =
          error instanceof Error
            ? new Error(`Registration successful, but automatic login failed: ${error.message}`)
            : new Error(
                'Registration successful, but automatic login failed. Please log in manually.',
              );
        // Re-throw to prevent unhandled promise rejection
        // Note: The mutation state remains "success" since registration succeeded,
        // but this error can be caught by error boundaries or logged
        throw loginError;
      }
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
      navigate(APP_ROUTES.LOGIN);
    },
  });
};
