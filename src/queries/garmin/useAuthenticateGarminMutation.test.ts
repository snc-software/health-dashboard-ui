import { act, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderHookWithQueryClient } from '../../../tests/utils';
import { apiRequest } from '../apiClient';
import { useAuthenticateGarminMutation } from './useAuthenticateGarminMutation';

vi.mock('../apiClient', () => ({
  apiRequest: vi.fn(),
}));

describe('useAuthenticateGarminMutation', () => {
  it('POSTs the credentials to the authenticate-garmin route', async () => {
    vi.mocked(apiRequest).mockResolvedValue({ status: 'authenticated' });

    const { result } = renderHookWithQueryClient(() => useAuthenticateGarminMutation());

    await act(async () => {
      await result.current.mutateAsync({ email: 'user@example.com', password: 'hunter2' });
    });

    expect(apiRequest).toHaveBeenCalledWith('/authenticate-garmin', {
      method: 'POST',
      body: { email: 'user@example.com', password: 'hunter2' },
    });
    await waitFor(() => expect(result.current.data).toEqual({ status: 'authenticated' }));
  });
});
