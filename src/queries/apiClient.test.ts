import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiRequest, ApiError } from './apiClient';

function mockFetchOnce(response: Partial<Response> & { json?: () => Promise<unknown> }) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({}),
      ...response,
    }),
  );
}

describe('apiRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses a successful JSON response', async () => {
    mockFetchOnce({ ok: true, status: 200, json: async () => ({ status: 'authenticated' }) });

    await expect(apiRequest('/garmin-session')).resolves.toEqual({ status: 'authenticated' });
  });

  it('resolves to undefined for a 204 No Content response', async () => {
    mockFetchOnce({ ok: true, status: 204 });

    await expect(
      apiRequest('/authenticate-garmin-mfa', { method: 'POST' }),
    ).resolves.toBeUndefined();
  });

  it('throws an ApiError when a successful response body is not valid JSON', async () => {
    mockFetchOnce({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('Unexpected token');
      },
    });

    const error = await apiRequest('/garmin-session').catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 200, title: 'Unexpected response from server' });
  });

  it('sends a JSON body and Content-Type header when a request body is provided', async () => {
    mockFetchOnce({ ok: true, status: 200, json: async () => ({ status: 'authenticated' }) });

    await apiRequest('/authenticate-garmin', {
      method: 'POST',
      body: { email: 'user@example.com', password: 'hunter2' },
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/authenticate-garmin'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@example.com', password: 'hunter2' }),
      }),
    );
  });

  it('falls back to statusText/response.status when the error body cannot be parsed', async () => {
    mockFetchOnce({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
      json: async () => {
        throw new SyntaxError('Unexpected end of JSON input');
      },
    });

    const error = await apiRequest('/authenticate-garmin', { method: 'POST' }).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 502, title: 'Bad Gateway' });
  });

  it('throws an ApiError built from the ProblemDetails body for a non-2xx response', async () => {
    mockFetchOnce({
      ok: false,
      status: 401,
      json: async () => ({ title: 'Invalid credentials', status: 401, detail: 'Bad password' }),
    });

    const error = await apiRequest('/authenticate-garmin', { method: 'POST' }).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 401,
      title: 'Invalid credentials',
      detail: 'Bad password',
    });
  });

  it('throws an ApiError with status 0 when the network request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    const error = await apiRequest('/garmin-session').catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 0 });
  });
});
