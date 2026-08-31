import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { DailyHealthStat } from '@/types/HealthStats';
import { apiRequest } from '@/queries/apiClient';
import { Overview } from './Overview';

vi.mock('@/queries/apiClient', () => ({
  apiRequest: vi.fn(),
}));

vi.mock('@snc-software/snc-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@snc-software/snc-ui')>();

  return {
    ...actual,
    DateRangePicker: ({
      onChange,
    }: {
      onChange?: (value: { start: string; end: string }) => void;
    }) => (
      <button onClick={() => onChange?.({ start: '2026-01-01', end: '2026-01-31' })}>
        Change range
      </button>
    ),
  };
});

function makeRow(overrides: Partial<DailyHealthStat> = {}): DailyHealthStat {
  return {
    date: '2026-08-01',
    steps: null,
    restingHeartRate: null,
    sleepSeconds: null,
    sleepScore: null,
    peakBodyBattery: null,
    hrvLastNightAverage: null,
    hrvStatus: null,
    trainingReadinessScore: null,
    trainingStatus: null,
    vo2Max: null,
    fitnessAge: null,
    weightGrams: null,
    intensityMinutes: null,
    updatedTimestamp: '2026-08-01T06:00:00Z',
    ...overrides,
  };
}

function renderOverview() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <Overview />
    </QueryClientProvider>,
  );
}

describe('Overview', () => {
  beforeEach(() => {
    vi.mocked(apiRequest).mockReset();
  });

  it('renders trend chart headings and snapshot stat labels/values from a populated range response', async () => {
    vi.mocked(apiRequest).mockResolvedValue([
      makeRow({
        date: '2026-08-29',
        trainingReadinessScore: 40,
        trainingStatus: 'RECOVERY',
        peakBodyBattery: 30,
        hrvStatus: 'BALANCED',
        steps: 4000,
        intensityMinutes: 10,
      }),
      makeRow({
        date: '2026-08-30',
        trainingReadinessScore: 82,
        trainingStatus: 'PRODUCTIVE',
        peakBodyBattery: 65,
        hrvStatus: 'BALANCED',
        steps: 9000,
        intensityMinutes: 40,
      }),
    ] satisfies DailyHealthStat[]);

    renderOverview();

    expect(await screen.findByText('Training Readiness Score')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 3, name: 'Resting Heart Rate' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'HRV' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Sleep Score' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Weight' })).toBeInTheDocument();

    expect(screen.getByText('VO2 Max')).toBeInTheDocument();
    expect(screen.getByText('Fitness Age')).toBeInTheDocument();

    expect(screen.getByText('Training Status')).toBeInTheDocument();
    expect(screen.getByText('Peak Body Battery')).toBeInTheDocument();
    expect(screen.getByText('HRV Status')).toBeInTheDocument();
    expect(screen.getByText('Steps')).toBeInTheDocument();
    expect(screen.getByText('Intensity Minutes')).toBeInTheDocument();
  });

  it('reflects the last (most recent) row in the fetched range for snapshot tiles', async () => {
    vi.mocked(apiRequest).mockResolvedValue([
      makeRow({ date: '2026-08-29', trainingReadinessScore: 40 }),
      makeRow({ date: '2026-08-30', trainingReadinessScore: 82 }),
    ] satisfies DailyHealthStat[]);

    renderOverview();

    await screen.findByText('Training Readiness Score');

    expect(screen.getByRole('heading', { level: 3, name: '82' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3, name: '40' })).not.toBeInTheDocument();
  });

  it('changing the date range triggers a new fetch and updates the rendered data', async () => {
    const user = userEvent.setup();
    vi.mocked(apiRequest).mockResolvedValueOnce([
      makeRow({ date: '2026-08-30', trainingReadinessScore: 40 }),
    ] satisfies DailyHealthStat[]);

    renderOverview();

    expect(await screen.findByRole('heading', { level: 3, name: '40' })).toBeInTheDocument();

    vi.mocked(apiRequest).mockResolvedValueOnce([
      makeRow({ date: '2026-01-15', trainingReadinessScore: 99 }),
    ] satisfies DailyHealthStat[]);

    await user.click(screen.getByRole('button', { name: 'Change range' }));

    expect(await screen.findByRole('heading', { level: 3, name: '99' })).toBeInTheDocument();
    expect(apiRequest).toHaveBeenCalledWith('/start/2026-01-01/end/2026-01-31/health-stats');
  });

  it('shows empty states (not an error) for an empty range response', async () => {
    vi.mocked(apiRequest).mockResolvedValue([]);

    renderOverview();

    expect((await screen.findAllByText('No data found')).length).toBeGreaterThan(0);
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('shows an error state with a working retry when the request fails', async () => {
    const user = userEvent.setup();
    vi.mocked(apiRequest).mockRejectedValueOnce(new Error('boom'));

    renderOverview();

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument();

    vi.mocked(apiRequest).mockResolvedValueOnce([]);
    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Trends')).toBeInTheDocument();
    expect(apiRequest).toHaveBeenCalledTimes(2);
  });

  it('does not crash and renders a neutral fallback for a row with null fields', async () => {
    vi.mocked(apiRequest).mockResolvedValue([
      makeRow({ date: '2026-08-30', hrvLastNightAverage: null, trainingReadinessScore: null }),
    ] satisfies DailyHealthStat[]);

    renderOverview();

    expect(await screen.findByText('Training Readiness Score')).toBeInTheDocument();
    expect(screen.getAllByText('No data found').length).toBeGreaterThan(0);
  });
});
