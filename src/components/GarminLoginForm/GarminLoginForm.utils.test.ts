import { describe, expect, it } from 'vitest';
import { ApiError } from '@/queries/apiClient';
import { getGarminAuthErrorMessage } from './GarminLoginForm.utils';

describe('getGarminAuthErrorMessage', () => {
  it('returns a generic message for a non-ApiError value', () => {
    expect(getGarminAuthErrorMessage(new Error('boom'))).toBe(
      'Something went wrong. Please try again.',
    );
  });

  it('returns the detail for a 401, falling back to a default message', () => {
    expect(
      getGarminAuthErrorMessage(
        new ApiError({ title: 'Unauthorized', status: 401, detail: 'Bad creds' }),
      ),
    ).toBe('Bad creds');
    expect(getGarminAuthErrorMessage(new ApiError({ title: 'Unauthorized', status: 401 }))).toBe(
      'Invalid email or password.',
    );
  });

  it('returns the detail for a 409, falling back to a default message', () => {
    expect(getGarminAuthErrorMessage(new ApiError({ title: 'Conflict', status: 409 }))).toBe(
      'This verification code has expired or is unknown. Enter the latest code and try again.',
    );
  });

  it('returns the detail for a 502, falling back to a default message', () => {
    expect(getGarminAuthErrorMessage(new ApiError({ title: 'Bad Gateway', status: 502 }))).toBe(
      'Garmin is currently unreachable. Please try again shortly.',
    );
  });

  it('returns a network-specific message for status 0', () => {
    expect(getGarminAuthErrorMessage(new ApiError({ title: 'Network error', status: 0 }))).toBe(
      'Unable to reach the server. Check your connection and try again.',
    );
  });

  it('falls back to the detail, then the title, for any other status', () => {
    expect(
      getGarminAuthErrorMessage(
        new ApiError({ title: 'Server Error', status: 500, detail: 'Oops' }),
      ),
    ).toBe('Oops');
    expect(getGarminAuthErrorMessage(new ApiError({ title: 'Server Error', status: 500 }))).toBe(
      'Server Error',
    );
  });
});
