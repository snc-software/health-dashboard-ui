import { describe, expect, it } from 'vitest';
import { parseSettingsSearch } from './Settings.utils';

describe('parseSettingsSearch', () => {
  it('parses "true" as true', () => {
    expect(parseSettingsSearch({ stravaConnected: 'true' })).toEqual({ stravaConnected: true });
  });

  it('parses "false" as false', () => {
    expect(parseSettingsSearch({ stravaConnected: 'false' })).toEqual({ stravaConnected: false });
  });

  it('parses a missing value as undefined', () => {
    expect(parseSettingsSearch({})).toEqual({ stravaConnected: undefined });
  });

  it('parses an unrecognised value as undefined', () => {
    expect(parseSettingsSearch({ stravaConnected: 'yes' })).toEqual({ stravaConnected: undefined });
  });
});
