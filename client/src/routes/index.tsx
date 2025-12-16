import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ProtectedRoute, RouteErrorElement } from '@/components';
import { APP_ROUTES } from '@/constants/routes';
import { AuthPage, DashboardPage, SimulatePage } from '@/pages';

export const router = createBrowserRouter([
  {
    path: APP_ROUTES.AUTH,
    element: <AuthPage />,
    errorElement: <RouteErrorElement />,
  },
  {
    path: APP_ROUTES.HOME,
    element: (
      <ProtectedRoute>
        <Navigate to={APP_ROUTES.PLAYBOOKS_EDITOR} replace />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorElement />,
  },
  {
    path: APP_ROUTES.PLAYBOOKS_EDITOR,
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorElement />,
  },
  {
    path: `${APP_ROUTES.PLAYBOOKS_EDITOR}/:playbookId`,
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorElement />,
  },
  {
    path: APP_ROUTES.SIMULATE,
    element: (
      <ProtectedRoute>
        <SimulatePage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorElement />,
  },
  {
    path: '*',
    element: <Navigate to={APP_ROUTES.PLAYBOOKS_EDITOR} replace />,
    errorElement: <RouteErrorElement />,
  },
]);
