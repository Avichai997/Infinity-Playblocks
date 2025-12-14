import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi, playbooksApi } from '@/api';
import { useAuthStore } from '@/store';
import { ICreatePlaybookDto, Trigger, Action } from '@/types';

export const DashboardPage = () => {
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState<Trigger>(Trigger.MalwareDetected);
  const [actions, setActions] = useState<Action[]>([]);
  const { user, logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: playbooks = [], isLoading } = useQuery({
    queryKey: ['playbooks'],
    queryFn: playbooksApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: ICreatePlaybookDto) => playbooksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbooks'] });
      setName('');
      setActions([]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => playbooksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbooks'] });
    },
  });

  const handleActionToggle = (action: Action) => {
    if (actions.includes(action)) {
      setActions(actions.filter((a) => a !== action));
    } else if (actions.length < 3) {
      setActions([...actions, action]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || actions.length === 0) {
      return;
    }
    createMutation.mutate({ name, trigger, actions });
  };

  const handleLogout = async () => {
    await authApi.logout();
    logoutStore();
    navigate('/auth');
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='bg-white shadow'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-4'>
            <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
            <div className='flex items-center gap-4'>
              <span className='text-sm text-gray-600'>{user?.email}</span>
              <button
                onClick={handleLogout}
                className='text-sm text-indigo-600 hover:text-indigo-500'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Create Playbook Form */}
          <div className='rounded-lg bg-white p-6 shadow'>
            <h2 className='mb-4 text-xl font-semibold'>Create Playbook</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Name:</label>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
                  required
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Trigger:</label>
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value as Trigger)}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
                >
                  <option value={Trigger.MalwareDetected}>Malware Detected</option>
                  <option value={Trigger.LoginAttempt}>Login Attempt</option>
                  <option value={Trigger.PhishingAlert}>Phishing Alert</option>
                </select>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  Actions: (Choose up to 3)
                </label>
                <div className='space-y-2'>
                  {Object.values(Action).map((action) => (
                    <label key={action} className='flex cursor-pointer items-center space-x-2'>
                      <input
                        type='checkbox'
                        checked={actions.includes(action)}
                        onChange={() => handleActionToggle(action)}
                        disabled={!actions.includes(action) && actions.length >= 3}
                        className='rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                      />
                      <span className='text-sm text-gray-700'>{action.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type='submit'
                disabled={createMutation.isPending || !name || actions.length === 0}
                className='w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50'
              >
                Create
              </button>
            </form>
          </div>

          {/* Playbooks List */}
          <div className='rounded-lg bg-white p-6 shadow'>
            <h2 className='mb-4 text-xl font-semibold'>Your Playbooks</h2>
            {isLoading ? (
              <div className='py-4 text-center'>Loading...</div>
            ) : playbooks.length === 0 ? (
              <div className='py-4 text-center text-gray-500'>No playbooks yet</div>
            ) : (
              <ul className='space-y-2'>
                {playbooks.map((playbook) => (
                  <li
                    key={playbook.id}
                    className='flex items-center justify-between rounded-md border border-gray-200 p-3'
                  >
                    <div>
                      <div className='font-medium'>{playbook.name}</div>
                      <div className='text-sm text-gray-500'>
                        Trigger: {playbook.trigger.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMutation.mutate(playbook.id)}
                      disabled={deleteMutation.isPending}
                      className='text-sm text-red-600 hover:text-red-700 disabled:opacity-50'
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
