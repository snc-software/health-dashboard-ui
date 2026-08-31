import { useState } from 'react';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Heading } from '@snc-software/snc-ui';
import { garminSessionQueryKey, garminSessionQueryOptions } from '@/queries/garmin';
import { GarminAuthenticatedStatus } from '../GarminAuthenticatedStatus';
import { GarminLoginForm } from '../GarminLoginForm';
import { classes } from './GarminSettingsPanel.styles';

type View = 'status' | 'login';

export function GarminSettingsPanel() {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(garminSessionQueryOptions());
  const [view, setView] = useState<View>(data.status === 'authenticated' ? 'status' : 'login');

  function handleRefresh() {
    setView('login');
  }

  function handleAuthenticated() {
    queryClient.invalidateQueries({ queryKey: garminSessionQueryKey });
    setView('status');
  }

  return (
    <section className={classes.container}>
      <Heading level="h2">Garmin</Heading>
      {view === 'status' && data.status === 'authenticated' ? (
        <GarminAuthenticatedStatus
          authenticatedAt={data.authenticatedAt}
          onRefresh={handleRefresh}
        />
      ) : (
        <GarminLoginForm onAuthenticated={handleAuthenticated} />
      )}
    </section>
  );
}
