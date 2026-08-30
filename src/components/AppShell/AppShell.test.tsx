import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AppShell } from './AppShell';

describe('AppShell', () => {
  it('renders the brand mark and the Overview nav item', () => {
    render(
      <AppShell>
        <p>Routed content</p>
      </AppShell>,
    );

    expect(screen.getByText('SNC')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Overview' })).toBeInTheDocument();
  });

  it('renders its children inside the main content area', () => {
    render(
      <AppShell>
        <p>Routed content</p>
      </AppShell>,
    );

    expect(screen.getByText('Routed content')).toBeInTheDocument();
  });

  it('toggles the document theme when the theme toggle is clicked', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(
      <AppShell>
        <p>Routed content</p>
      </AppShell>,
    );

    expect(document.documentElement.classList.contains('dark')).toBe(false);

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('opens the command palette, pre-populated with the searchable routes, when the search button is clicked', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(
      <AppShell>
        <p>Routed content</p>
      </AppShell>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /^Overview/ })).toBeInTheDocument();
  });

  it('opens the command palette with the Ctrl+K shortcut', () => {
    render(
      <AppShell>
        <p>Routed content</p>
      </AppShell>,
    );

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('filters the results to routes matching the search query', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(
      <AppShell>
        <p>Routed content</p>
      </AppShell>,
    );

    await user.click(screen.getByRole('button', { name: 'Search' }));
    await user.type(screen.getByRole('combobox', { name: 'Command palette search' }), 'billing');

    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1), { timeout: 2000 });
    expect(screen.getByRole('option', { name: /^Billing/ })).toBeInTheDocument();
  });

  it('restores the full route list once the search query is cleared', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(
      <AppShell>
        <p>Routed content</p>
      </AppShell>,
    );

    await user.click(screen.getByRole('button', { name: 'Search' }));
    const search = screen.getByRole('combobox', { name: 'Command palette search' });
    await user.type(search, 'billing');
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1), { timeout: 2000 });

    await user.clear(search);

    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(6), { timeout: 2000 });
    expect(screen.getByRole('option', { name: /^Overview/ })).toBeInTheDocument();
  });

  it('resets any in-progress search once the command palette is closed and reopened', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(
      <AppShell>
        <p>Routed content</p>
      </AppShell>,
    );

    await user.click(screen.getByRole('button', { name: 'Search' }));
    await user.type(screen.getByRole('combobox', { name: 'Command palette search' }), 'billing');
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1), { timeout: 2000 });

    await user.click(screen.getByRole('button', { name: 'Close search' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.getAllByRole('option')).toHaveLength(6);
    expect(screen.getByRole('option', { name: /^Overview/ })).toBeInTheDocument();
  });
});
