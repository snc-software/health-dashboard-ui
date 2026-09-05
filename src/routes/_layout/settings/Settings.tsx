import { Heading } from '@snc-software/snc-ui';
import { GarminSettingsPanel } from '@/components/GarminSettingsPanel';
import { StravaSettingsPanel } from '@/components/StravaSettingsPanel';
import { classes } from './Settings.styles';

export function Settings() {
  return (
    <div className={classes.page}>
      <Heading level="h1">Settings</Heading>
      <GarminSettingsPanel />
      <StravaSettingsPanel />
    </div>
  );
}
