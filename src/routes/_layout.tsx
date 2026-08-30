import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppShell } from '@/components/AppShell';

export const Route = createFileRoute('/_layout')({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
