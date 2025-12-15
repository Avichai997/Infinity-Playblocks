import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ProtectedRoute, RouteErrorElement } from '@/components';
import { AuthPage, DashboardPage, SimulatePage } from '@/pages';

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />,
    errorElement: <RouteErrorElement />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Navigate to='/dashboard' replace />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorElement />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorElement />,
  },
  {
    path: '/dashboard/:playbookId',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorElement />,
  },
  {
    path: '/simulate',
    element: (
      <ProtectedRoute>
        <SimulatePage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorElement />,
  },
  {
    path: '*',
    element: <Navigate to='/dashboard' replace />,
    errorElement: <RouteErrorElement />,
  },
]);
