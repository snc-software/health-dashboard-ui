import { createFileRoute } from '@tanstack/react-router';
import { Spinner } from '@snc-software/snc-ui';
import { garminSessionQueryOptions } from '@/queries/garmin';
import { Settings } from './Settings';

export const Route = createFileRoute('/_layout/settings')({
  component: Settings,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(garminSessionQueryOptions()),
  pendingComponent: SettingsPendingComponent,
});

function SettingsPendingComponent() {
  return (
    <div className="grid min-h-[340px] place-items-center">
      <Spinner label="Loading settings" />
    </div>
  );
}
