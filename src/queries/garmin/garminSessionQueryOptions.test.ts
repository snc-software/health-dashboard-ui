import { describe, expect, it, vi } from 'vitest';
import { apiRequest } from '../apiClient';
import { garminSessionQueryKey, garminSessionQueryOptions } from './garminSessionQueryOptions';

vi.mock('../apiClient', () => ({
  apiRequest: vi.fn(),
}));

describe('garminSessionQueryOptions', () => {
  it('uses the ["garmin", "session"] query key', () => {
    expect(garminSessionQueryOptions().queryKey).toEqual(garminSessionQueryKey);
    expect(garminSessionQueryKey).toEqual(['garmin', 'session']);
  });

  it('calls apiRequest against the garmin session route when invoked', async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      status: 'authenticated',
      authenticatedAt: '2026-08-01T00:00:00Z',
    });

    const options = garminSessionQueryOptions();
    // @ts-expect-error - queryFn's signature includes a QueryFunctionContext this test doesn't need
    const result = await options.queryFn();

    expect(apiRequest).toHaveBeenCalledWith('/garmin-session');
    expect(result).toEqual({ status: 'authenticated', authenticatedAt: '2026-08-01T00:00:00Z' });
  });
});
