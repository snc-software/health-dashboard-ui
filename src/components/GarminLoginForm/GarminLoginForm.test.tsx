import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiError } from '@/queries/apiClient';
import { GarminLoginForm } from './GarminLoginForm';

const mutateAsyncAuthenticate = vi.fn();
const mutateAsyncMfa = vi.fn();

vi.mock('@/queries/garmin', () => ({
  useAuthenticateGarminMutation: () => ({
    mutateAsync: mutateAsyncAuthenticate,
    isPending: false,
  }),
  useAuthenticateGarminMfaMutation: () => ({
    mutateAsync: mutateAsyncMfa,
    isPending: false,
  }),
}));

async function fillCredentials(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Email'), 'user@example.com');
  await user.type(screen.getByLabelText('Password'), 'hunter2');
  await user.click(screen.getByRole('button', { name: 'Log in' }));
}

describe('GarminLoginForm', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the email/password step by default', () => {
    render(<GarminLoginForm onAuthenticated={vi.fn()} />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('calls onAuthenticated when credentials succeed with no MFA challenge', async () => {
    const user = userEvent.setup();
    const onAuthenticated = vi.fn();
    mutateAsyncAuthenticate.mockResolvedValueOnce({ status: 'authenticated' });

    render(<GarminLoginForm onAuthenticated={onAuthenticated} />);
    await fillCredentials(user);

    await waitFor(() => expect(onAuthenticated).toHaveBeenCalledTimes(1));
  });

  it('reveals the MFA field when the API responds with mfa_required, and completes on a valid code', async () => {
    const user = userEvent.setup();
    const onAuthenticated = vi.fn();
    mutateAsyncAuthenticate.mockResolvedValueOnce({
      status: 'mfa_required',
      mfaSessionId: 'session-123',
    });
    mutateAsyncMfa.mockResolvedValueOnce(undefined);

    render(<GarminLoginForm onAuthenticated={onAuthenticated} />);
    await fillCredentials(user);

    expect(await screen.findByLabelText('Verification code')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Verification code'), '123456');
    await user.click(screen.getByRole('button', { name: 'Verify code' }));

    await waitFor(() =>
      expect(mutateAsyncMfa).toHaveBeenCalledWith({ mfaSessionId: 'session-123', code: '123456' }),
    );
    expect(onAuthenticated).toHaveBeenCalledTimes(1);
  });

  it('shows an inline error and keeps the form usable on invalid credentials (401)', async () => {
    const user = userEvent.setup();
    mutateAsyncAuthenticate.mockRejectedValueOnce(
      new ApiError({ title: 'Unauthorized', status: 401, detail: 'Invalid email or password.' }),
    );

    render(<GarminLoginForm onAuthenticated={vi.fn()} />);
    await fillCredentials(user);

    expect(await screen.findByText('Invalid email or password.')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeEnabled();
    expect(screen.getByLabelText('Password')).toBeEnabled();
  });

  it('shows an inline error on an invalid/expired MFA code (409)', async () => {
    const user = userEvent.setup();
    mutateAsyncAuthenticate.mockResolvedValueOnce({
      status: 'mfa_required',
      mfaSessionId: 'session-123',
    });
    mutateAsyncMfa.mockRejectedValueOnce(
      new ApiError({ title: 'Conflict', status: 409, detail: 'Code expired.' }),
    );

    render(<GarminLoginForm onAuthenticated={vi.fn()} />);
    await fillCredentials(user);
    await user.type(await screen.findByLabelText('Verification code'), '000000');
    await user.click(screen.getByRole('button', { name: 'Verify code' }));

    expect(await screen.findByText('Code expired.')).toBeInTheDocument();
  });

  it('shows inline validation errors instead of submitting when the credentials form is empty', async () => {
    const user = userEvent.setup();

    render(<GarminLoginForm onAuthenticated={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(mutateAsyncAuthenticate).not.toHaveBeenCalled();
  });

  it('shows an inline validation error instead of submitting when the MFA code is empty', async () => {
    const user = userEvent.setup();
    mutateAsyncAuthenticate.mockResolvedValueOnce({
      status: 'mfa_required',
      mfaSessionId: 'session-123',
    });

    render(<GarminLoginForm onAuthenticated={vi.fn()} />);
    await fillCredentials(user);
    await screen.findByLabelText('Verification code');
    await user.click(screen.getByRole('button', { name: 'Verify code' }));

    expect(await screen.findByText('Enter the verification code')).toBeInTheDocument();
    expect(mutateAsyncMfa).not.toHaveBeenCalled();
  });

  it('surfaces a readable message on a network/502 error', async () => {
    const user = userEvent.setup();
    mutateAsyncAuthenticate.mockRejectedValueOnce(
      new ApiError({ title: 'Bad Gateway', status: 502, detail: null }),
    );

    render(<GarminLoginForm onAuthenticated={vi.fn()} />);
    await fillCredentials(user);

    expect(
      await screen.findByText('Garmin is currently unreachable. Please try again shortly.'),
    ).toBeInTheDocument();
  });
});
