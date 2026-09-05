import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { apiRequest } from '@/queries/apiClient';
import { apiConfig } from '@/queries/apiConfig';
import { stravaSessionQueryKey } from '@/queries/strava';
import type { StravaSessionResponse } from '@/types/Strava';
import { StravaSettingsPanel } from './StravaSettingsPanel';

vi.mock('@/queries/apiClient', () => ({
  apiRequest: vi
    .fn()
    .mockResolvedValue({ connected: false, athleteId: null, updatedTimestamp: null }),
}));

vi.mock('../StravaAuthenticatedStatus', () => ({
  StravaAuthenticatedStatus: ({
    athleteId,
    updatedTimestamp,
    onRefresh,
  }: {
    athleteId: number | null;
    updatedTimestamp?: string | null;
    onRefresh: () => void;
  }) => (
    <div>
      <p>
        Status view: {athleteId} {updatedTimestamp}
      </p>
      <button onClick={onRefresh}>Mock refresh</button>
    </div>
  ),
}));

function renderPanel(sessionData: StravaSessionResponse) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(stravaSessionQueryKey, sessionData);

  return render(
    <QueryClientProvider client={queryClient}>
      <StravaSettingsPanel />
    </QueryClientProvider>,
  );
}

describe('StravaSettingsPanel', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation, href: '' },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('renders the Strava heading', () => {
    renderPanel({ connected: false, athleteId: null, updatedTimestamp: null });

    expect(screen.getByRole('heading', { level: 2, name: 'Strava' })).toBeInTheDocument();
  });

  it('renders the authenticated status view when connected', () => {
    renderPanel({ connected: true, athleteId: 123, updatedTimestamp: '2026-08-01T00:00:00Z' });

    expect(screen.getByText(/Status view/)).toBeInTheDocument();
  });

  it('renders a "Connect with Strava" action when not connected', () => {
    renderPanel({ connected: false, athleteId: null, updatedTimestamp: null });

    expect(screen.getByRole('button', { name: 'Connect with Strava' })).toBeInTheDocument();
  });

  it('navigates the browser to the authorize endpoint when connecting, without calling apiRequest', async () => {
    const user = userEvent.setup();
    renderPanel({ connected: false, athleteId: null, updatedTimestamp: null });
    vi.mocked(apiRequest).mockClear();

    await user.click(screen.getByRole('button', { name: 'Connect with Strava' }));

    expect(window.location.href).toBe(`${apiConfig.baseUrl}${apiConfig.routes.strava.authorize}`);
    expect(apiRequest).not.toHaveBeenCalledWith(apiConfig.routes.strava.authorize);
  });

  it('wires the re-authenticate action to the same navigation when connected', async () => {
    const user = userEvent.setup();
    renderPanel({ connected: true, athleteId: 123, updatedTimestamp: '2026-08-01T00:00:00Z' });

    await user.click(screen.getByRole('button', { name: 'Mock refresh' }));

    expect(window.location.href).toBe(`${apiConfig.baseUrl}${apiConfig.routes.strava.authorize}`);
  });
});
