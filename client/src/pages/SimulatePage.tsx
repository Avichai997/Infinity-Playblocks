import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi, playbooksApi } from '@/api';
import { useAuthStore } from '@/store';
import { Trigger } from '@/types';

export const SimulatePage = () => {
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | ''>('');
  const [runSimulation, setRunSimulation] = useState(false);
  const { user, logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();

  const { data: matchingPlaybooks = [], isLoading } = useQuery({
    queryKey: ['simulate', selectedTrigger],
    queryFn: () => playbooksApi.simulate(selectedTrigger as Trigger),
    enabled: runSimulation && !!selectedTrigger,
  });

  const handleRunSimulation = () => {
    if (selectedTrigger) {
      setRunSimulation(true);
    }
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
            <h1 className='text-2xl font-bold text-gray-900'>Simulate Event</h1>
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

      <div className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='space-y-6 rounded-lg bg-white p-6 shadow'>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>Select Trigger:</label>
            <select
              value={selectedTrigger}
              onChange={(e) => {
                setSelectedTrigger(e.target.value as Trigger);
                setRunSimulation(false);
              }}
              className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
            >
              <option value=''>Select Trigger</option>
              <option value={Trigger.MalwareDetected}>Malware Detected</option>
              <option value={Trigger.LoginAttempt}>Login Attempt</option>
              <option value={Trigger.PhishingAlert}>Phishing Alert</option>
            </select>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={!selectedTrigger || isLoading}
            className='w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50'
          >
            Run Simulation
          </button>

          {runSimulation && (
            <div className='border-t pt-6'>
              <h2 className='mb-4 text-center text-xl font-semibold'>Matching Playbooks</h2>
              {isLoading ? (
                <div className='py-4 text-center'>Loading...</div>
              ) : matchingPlaybooks.length === 0 ? (
                <div className='py-4 text-center text-gray-500'>No matching playbooks found</div>
              ) : (
                <div className='space-y-4'>
                  {matchingPlaybooks.map((playbook) => (
                    <div key={playbook.id} className='rounded-md border border-gray-200 p-4'>
                      <div className='mb-2 font-semibold'>Playbook: {playbook.name}</div>
                      <div className='space-y-1'>
                        {playbook.actions.map((action, index) => (
                          <div key={index} className='text-sm text-gray-700'>
                            → {action.replace(/_/g, ' ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
