import { Button, Paragraph } from '@snc-software/snc-ui';
import { classes } from './StravaAuthenticatedStatus.styles';
import type { StravaAuthenticatedStatusProps } from './StravaAuthenticatedStatus.types';

export function StravaAuthenticatedStatus({
  athleteId,
  updatedTimestamp,
  onRefresh,
}: StravaAuthenticatedStatusProps) {
  const formattedTimestamp = updatedTimestamp
    ? new Date(updatedTimestamp).toLocaleString()
    : 'an unknown time';

  return (
    <div className={classes.container}>
      <Paragraph>Athlete ID: {athleteId ?? 'unknown'}</Paragraph>
      <Paragraph>Connected at {formattedTimestamp}</Paragraph>
      <Button variant="secondary" onClick={onRefresh}>
        Refresh
      </Button>
    </div>
  );
}
