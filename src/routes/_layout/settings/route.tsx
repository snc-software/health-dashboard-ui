import { createFileRoute } from '@tanstack/react-router';
import { Spinner } from '@snc-software/snc-ui';
import { garminSessionQueryOptions } from '@/queries/garmin';
import { stravaSessionQueryKey, stravaSessionQueryOptions } from '@/queries/strava';
import { Settings } from './Settings';
import { parseSettingsSearch } from './Settings.utils';

export const Route = createFileRoute('/_layout/settings')({
  component: Settings,
  validateSearch: parseSettingsSearch,
  loaderDeps: ({ search }) => ({ stravaConnected: search.stravaConnected }),
  loader: async ({ context: { queryClient }, deps: { stravaConnected } }) => {
    if (stravaConnected !== undefined) {
      await queryClient.invalidateQueries({ queryKey: stravaSessionQueryKey });
    }

    await Promise.all([
      queryClient.ensureQueryData(garminSessionQueryOptions()),
      queryClient.ensureQueryData(stravaSessionQueryOptions()),
    ]);
  },
  pendingComponent: SettingsPendingComponent,
});

function SettingsPendingComponent() {
  return (
    <div className="grid min-h-[340px] place-items-center">
      <Spinner label="Loading settings" />
    </div>
  );
}
