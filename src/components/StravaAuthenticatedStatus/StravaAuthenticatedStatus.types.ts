export interface StravaAuthenticatedStatusProps {
  athleteId: number | null;
  updatedTimestamp?: string | null;
  onRefresh: () => void;
}
