export const APP_ROUTES = {
  AUTH: '/auth',
  PLAYBOOKS_EDITOR: '/playbooks-editor',
  PLAYBOOKS_EDITOR_EDIT: (playbookId: string) => `/playbooks-editor/${playbookId}`,
  SIMULATE: '/simulate',
  HOME: '/',
} as const;
