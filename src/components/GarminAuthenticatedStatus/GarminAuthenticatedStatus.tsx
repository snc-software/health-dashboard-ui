import { Button, Paragraph } from '@snc-software/snc-ui';
import { classes } from './GarminAuthenticatedStatus.styles';
import type { GarminAuthenticatedStatusProps } from './GarminAuthenticatedStatus.types';

export function GarminAuthenticatedStatus({
  authenticatedAt,
  onRefresh,
}: GarminAuthenticatedStatusProps) {
  const formattedTimestamp = authenticatedAt
    ? new Date(authenticatedAt).toLocaleString()
    : 'an unknown time';

  return (
    <div className={classes.container}>
      <Paragraph>Authenticated at {formattedTimestamp}</Paragraph>
      <Button variant="secondary" onClick={onRefresh}>
        Refresh
      </Button>
    </div>
  );
}
