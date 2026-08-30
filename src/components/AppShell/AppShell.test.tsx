import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { AppShell } from './AppShell';

function renderAppShell(initialPath = '/') {
  const rootRoute = createRootRoute({
    component: () => (
      <AppShell>
        <Outlet />
      </AppShell>
    ),
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <p>Routed content</p>,
  });

  const activitiesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/activities',
    component: () => <p>Activities content</p>,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, activitiesRoute]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  return render(<RouterProvider router={router} />);
}

describe('AppShell', () => {
  it('renders the navigation menu with Overview and Activities', async () => {
    renderAppShell();

    expect(await screen.findByRole('button', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Activities' })).toBeInTheDocument();
  });

  it('marks Overview as the active nav item for the index route', async () => {
    renderAppShell('/');

    expect(await screen.findByRole('button', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Overview' })).toHaveClass('snc:border-snc-primary');
    expect(screen.getByRole('button', { name: 'Activities' })).not.toHaveClass(
      'snc:border-snc-primary',
    );
  });

  it('navigates to Activities when the Activities nav item is clicked', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    renderAppShell('/');
    await screen.findByText('Routed content');

    await user.click(screen.getByRole('button', { name: 'Activities' }));

    expect(await screen.findByText('Activities content')).toBeInTheDocument();
  });

  it('renders its children inside the main content area', async () => {
    renderAppShell();

    expect(await screen.findByText('Routed content')).toBeInTheDocument();
  });

  it('toggles the document theme when the theme toggle is clicked', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    renderAppShell();
    await screen.findByText('Routed content');

    expect(document.documentElement.classList.contains('dark')).toBe(false);

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('opens the command palette, pre-populated with the searchable routes, when the search button is clicked', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    renderAppShell();
    await screen.findByText('Routed content');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /^Overview/ })).toBeInTheDocument();
  });

  it('opens the command palette with the Ctrl+K shortcut', async () => {
    renderAppShell();
    await screen.findByText('Routed content');

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('filters the results to routes matching the search query', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    renderAppShell();
    await screen.findByText('Routed content');

    await user.click(screen.getByRole('button', { name: 'Search' }));
    await user.type(screen.getByRole('combobox', { name: 'Command palette search' }), 'billing');

    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1), { timeout: 2000 });
    expect(screen.getByRole('option', { name: /^Billing/ })).toBeInTheDocument();
  });

  it('restores the full route list once the search query is cleared', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    renderAppShell();
    await screen.findByText('Routed content');

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

    renderAppShell();
    await screen.findByText('Routed content');

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
