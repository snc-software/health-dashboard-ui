import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StravaAuthenticatedStatus } from './StravaAuthenticatedStatus';

describe('StravaAuthenticatedStatus', () => {
  it('renders the athlete id and formatted updated timestamp', () => {
    render(
      <StravaAuthenticatedStatus
        athleteId={123}
        updatedTimestamp="2026-08-01T12:00:00Z"
        onRefresh={vi.fn()}
      />,
    );

    expect(screen.getByText('Athlete ID: 123')).toBeInTheDocument();
    expect(screen.getByText(/Connected at/)).toBeInTheDocument();
  });

  it('renders a fallback when updatedTimestamp is missing', () => {
    render(
      <StravaAuthenticatedStatus athleteId={123} updatedTimestamp={null} onRefresh={vi.fn()} />,
    );

    expect(screen.getByText('Connected at an unknown time')).toBeInTheDocument();
  });

  it('renders a fallback when athleteId is missing', () => {
    render(
      <StravaAuthenticatedStatus
        athleteId={null}
        updatedTimestamp="2026-08-01T12:00:00Z"
        onRefresh={vi.fn()}
      />,
    );

    expect(screen.getByText('Athlete ID: unknown')).toBeInTheDocument();
  });

  it('calls onRefresh when the Refresh button is clicked', async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    render(
      <StravaAuthenticatedStatus
        athleteId={123}
        updatedTimestamp="2026-08-01T12:00:00Z"
        onRefresh={onRefresh}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Refresh' }));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
