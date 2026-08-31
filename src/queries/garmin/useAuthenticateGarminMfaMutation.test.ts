import { act, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderHookWithQueryClient } from '../../../tests/utils';
import { apiRequest } from '../apiClient';
import { useAuthenticateGarminMfaMutation } from './useAuthenticateGarminMfaMutation';

vi.mock('../apiClient', () => ({
  apiRequest: vi.fn(),
}));

describe('useAuthenticateGarminMfaMutation', () => {
  it('POSTs the mfaSessionId and code to the authenticate-garmin-mfa route', async () => {
    vi.mocked(apiRequest).mockResolvedValue(undefined);

    const { result } = renderHookWithQueryClient(() => useAuthenticateGarminMfaMutation());

    await act(async () => {
      await result.current.mutateAsync({ mfaSessionId: 'session-id', code: '123456' });
    });

    expect(apiRequest).toHaveBeenCalledWith('/authenticate-garmin-mfa', {
      method: 'POST',
      body: { mfaSessionId: 'session-id', code: '123456' },
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
