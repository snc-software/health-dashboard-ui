import type { OptionItem } from '@snc-software/snc-ui';

export const SEARCHABLE_ROUTES: OptionItem[] = [
  { id: 'overview', title: 'Overview', description: 'Workspace dashboard', href: '/' },
  { id: 'settings', title: 'Settings', description: 'Update your preferences', href: '#settings' },
  { id: 'team', title: 'Team members', description: 'Invite and manage teammates', href: '#team' },
  { id: 'billing', title: 'Billing', description: 'Manage your subscription', href: '#billing' },
  { id: 'api-keys', title: 'API keys', description: 'Create and revoke keys', href: '#api-keys' },
  {
    id: 'audit-log',
    title: 'Audit log',
    description: 'Review account activity',
    href: '#audit-log',
  },
];

export const SEARCH_DEBOUNCE_MS = 260;
