export const APP_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  PLAYBOOKS_EDITOR: '/playbooks-editor',
  PLAYBOOKS_EDITOR_EDIT: (playbookId: string) => `/playbooks-editor/${playbookId}`,
  SIMULATE: '/simulate',
  HOME: '/',
} as const;
