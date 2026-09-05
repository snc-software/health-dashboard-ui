import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Settings } from './Settings';

vi.mock('@/components/GarminSettingsPanel', () => ({
  GarminSettingsPanel: () => <div>Garmin settings panel</div>,
}));

vi.mock('@/components/StravaSettingsPanel', () => ({
  StravaSettingsPanel: () => <div>Strava settings panel</div>,
}));

describe('Settings', () => {
  it('renders the Settings heading', () => {
    render(<Settings />);

    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument();
  });

  it('renders the GarminSettingsPanel', () => {
    render(<Settings />);

    expect(screen.getByText('Garmin settings panel')).toBeInTheDocument();
  });

  it('renders the StravaSettingsPanel', () => {
    render(<Settings />);

    expect(screen.getByText('Strava settings panel')).toBeInTheDocument();
  });
});
