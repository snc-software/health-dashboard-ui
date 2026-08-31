import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { garminSessionQueryKey } from '@/queries/garmin';
import type { GarminSessionResponse } from '@/types/Garmin';
import { GarminSettingsPanel } from './GarminSettingsPanel';

vi.mock('@/queries/apiClient', () => ({
  apiRequest: vi.fn().mockResolvedValue({ status: 'unauthenticated' }),
}));

vi.mock('../GarminAuthenticatedStatus', () => ({
  GarminAuthenticatedStatus: ({
    authenticatedAt,
    onRefresh,
  }: {
    authenticatedAt?: string | null;
    onRefresh: () => void;
  }) => (
    <div>
      <p>Status view: {authenticatedAt}</p>
      <button onClick={onRefresh}>Mock refresh</button>
    </div>
  ),
}));

vi.mock('../GarminLoginForm', () => ({
  GarminLoginForm: ({ onAuthenticated }: { onAuthenticated: () => void }) => (
    <div>
      <p>Login view</p>
      <button onClick={onAuthenticated}>Mock authenticate</button>
    </div>
  ),
}));

function renderPanel(sessionData: GarminSessionResponse) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(garminSessionQueryKey, sessionData);

  const view = render(
    <QueryClientProvider client={queryClient}>
      <GarminSettingsPanel />
    </QueryClientProvider>,
  );

  return { queryClient, ...view };
}

describe('GarminSettingsPanel', () => {
  it('renders the authenticated status view when the session is authenticated', () => {
    renderPanel({ status: 'authenticated', authenticatedAt: '2026-08-01T00:00:00Z' });

    expect(screen.getByText(/Status view/)).toBeInTheDocument();
  });

  it('renders the login form by default when unauthenticated', () => {
    renderPanel({ status: 'unauthenticated' });

    expect(screen.getByText('Login view')).toBeInTheDocument();
  });

  it('swaps to the login form when Refresh is clicked', async () => {
    const user = userEvent.setup();
    renderPanel({ status: 'authenticated', authenticatedAt: '2026-08-01T00:00:00Z' });

    await user.click(screen.getByRole('button', { name: 'Mock refresh' }));

    expect(screen.getByText('Login view')).toBeInTheDocument();
  });

  it('invalidates the session query on successful authentication', async () => {
    const user = userEvent.setup();
    const { queryClient } = renderPanel({ status: 'unauthenticated' });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(screen.getByRole('button', { name: 'Mock authenticate' }));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: garminSessionQueryKey });
  });
});
