import { useSuspenseQuery } from '@tanstack/react-query';
import { Button, Heading } from '@snc-software/snc-ui';
import { apiConfig } from '@/queries/apiConfig';
import { stravaSessionQueryOptions } from '@/queries/strava';
import { StravaAuthenticatedStatus } from '../StravaAuthenticatedStatus';
import { classes } from './StravaSettingsPanel.styles';

export function StravaSettingsPanel() {
  const { data } = useSuspenseQuery(stravaSessionQueryOptions());

  function handleConnect() {
    window.location.href = `${apiConfig.baseUrl}${apiConfig.routes.strava.authorize}`;
  }

  return (
    <section className={classes.container}>
      <Heading level="h2">Strava</Heading>
      {data.connected ? (
        <StravaAuthenticatedStatus
          athleteId={data.athleteId}
          updatedTimestamp={data.updatedTimestamp}
          onRefresh={handleConnect}
        />
      ) : (
        <Button onClick={handleConnect}>Connect with Strava</Button>
      )}
    </section>
  );
}
