export interface SettingsSearch {
  stravaConnected?: boolean;
}

export function parseSettingsSearch(search: Record<string, unknown>): SettingsSearch {
  if (search.stravaConnected === 'true' || search.stravaConnected === true) {
    return { stravaConnected: true };
  }

  if (search.stravaConnected === 'false' || search.stravaConnected === false) {
    return { stravaConnected: false };
  }

  return { stravaConnected: undefined };
}
