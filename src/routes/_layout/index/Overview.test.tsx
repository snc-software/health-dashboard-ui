import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Overview } from './Overview';

describe('Overview', () => {
  it('renders the Overview heading', () => {
    render(<Overview />);

    expect(screen.getByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument();
  });

  it('renders the placeholder content area', () => {
    render(<Overview />);

    expect(screen.getByText('Page content goes here')).toBeInTheDocument();
  });
});
