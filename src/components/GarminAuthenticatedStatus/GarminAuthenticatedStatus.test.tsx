import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GarminAuthenticatedStatus } from './GarminAuthenticatedStatus';

describe('GarminAuthenticatedStatus', () => {
  it('renders the formatted authenticated timestamp', () => {
    render(
      <GarminAuthenticatedStatus authenticatedAt="2026-08-01T12:00:00Z" onRefresh={vi.fn()} />,
    );

    expect(screen.getByText(/Authenticated at/)).toBeInTheDocument();
  });

  it('renders a fallback when authenticatedAt is missing', () => {
    render(<GarminAuthenticatedStatus authenticatedAt={null} onRefresh={vi.fn()} />);

    expect(screen.getByText('Authenticated at an unknown time')).toBeInTheDocument();
  });

  it('calls onRefresh when the Refresh button is clicked', async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    render(
      <GarminAuthenticatedStatus authenticatedAt="2026-08-01T12:00:00Z" onRefresh={onRefresh} />,
    );

    await user.click(screen.getByRole('button', { name: 'Refresh' }));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
