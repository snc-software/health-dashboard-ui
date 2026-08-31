import { describe, expect, it, vi } from 'vitest';
import { apiRequest } from '../apiClient';
import {
  dailyHealthStatsQueryKey,
  dailyHealthStatsQueryOptions,
} from './dailyHealthStatsQueryOptions';

vi.mock('../apiClient', () => ({
  apiRequest: vi.fn(),
}));

describe('dailyHealthStatsQueryOptions', () => {
  it('uses the ["healthStats", "daily", startDate, endDate] query key', () => {
    const options = dailyHealthStatsQueryOptions('2026-06-01', '2026-08-30');

    expect(options.queryKey).toEqual(dailyHealthStatsQueryKey('2026-06-01', '2026-08-30'));
    expect(dailyHealthStatsQueryKey('2026-06-01', '2026-08-30')).toEqual([
      'healthStats',
      'daily',
      '2026-06-01',
      '2026-08-30',
    ]);
  });

  it('calls apiRequest against the built start/end health-stats path when invoked', async () => {
    vi.mocked(apiRequest).mockResolvedValue([]);

    const options = dailyHealthStatsQueryOptions('2026-06-01', '2026-08-30');
    // @ts-expect-error - queryFn's signature includes a QueryFunctionContext this test doesn't need
    const result = await options.queryFn();

    expect(apiRequest).toHaveBeenCalledWith('/start/2026-06-01/end/2026-08-30/health-stats');
    expect(result).toEqual([]);
  });
});
