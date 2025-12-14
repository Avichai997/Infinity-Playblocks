import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { authApi } from '@/api';
import { useAuthStore } from '@/store';

export const useAuth = () => {
  const { user, setUser, isAuthenticated } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    enabled: !user,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  return {
    user,
    isAuthenticated: isAuthenticated || !!data,
    isLoading,
    error,
  };
};
