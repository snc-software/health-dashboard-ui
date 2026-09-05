import { describe, expect, it, vi } from 'vitest';
import { apiRequest } from '../apiClient';
import { stravaSessionQueryKey, stravaSessionQueryOptions } from './stravaSessionQueryOptions';

vi.mock('../apiClient', () => ({
  apiRequest: vi.fn(),
}));

describe('stravaSessionQueryOptions', () => {
  it('uses the ["strava", "session"] query key', () => {
    expect(stravaSessionQueryOptions().queryKey).toEqual(stravaSessionQueryKey);
    expect(stravaSessionQueryKey).toEqual(['strava', 'session']);
  });

  it('calls apiRequest against the strava session route when invoked', async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      connected: true,
      athleteId: 123,
      updatedTimestamp: '2026-08-01T00:00:00Z',
    });

    const options = stravaSessionQueryOptions();
    // @ts-expect-error - queryFn's signature includes a QueryFunctionContext this test doesn't need
    const result = await options.queryFn();

    expect(apiRequest).toHaveBeenCalledWith('/strava-session');
    expect(result).toEqual({
      connected: true,
      athleteId: 123,
      updatedTimestamp: '2026-08-01T00:00:00Z',
    });
  });
});
