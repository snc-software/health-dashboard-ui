import { ApiError } from '@/queries/apiClient';

export function getGarminAuthErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return 'Something went wrong. Please try again.';
  }

  switch (error.status) {
    case 401:
      return error.detail ?? 'Invalid email or password.';
    case 409:
      return (
        error.detail ??
        'This verification code has expired or is unknown. Enter the latest code and try again.'
      );
    case 502:
      return error.detail ?? 'Garmin is currently unreachable. Please try again shortly.';
    case 0:
      return 'Unable to reach the server. Check your connection and try again.';
    default:
      return error.detail ?? error.title ?? 'Something went wrong. Please try again.';
  }
}
