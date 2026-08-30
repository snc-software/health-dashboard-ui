import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Activities } from './Activities';

describe('Activities', () => {
  it('renders the Activities heading', () => {
    render(<Activities />);

    expect(screen.getByRole('heading', { level: 1, name: 'Activities' })).toBeInTheDocument();
  });

  it('renders the placeholder content area', () => {
    render(<Activities />);

    expect(screen.getByText('Page content goes here')).toBeInTheDocument();
  });
});
