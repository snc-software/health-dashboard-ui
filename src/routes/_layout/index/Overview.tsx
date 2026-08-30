import { Heading } from '@snc-software/snc-ui';
import { classes } from './Overview.styles';

export function Overview() {
  return (
    <>
      <Heading level="h1">Overview</Heading>
      <div className={classes.placeholder}>
        <div className={classes.placeholderText}>Page content goes here</div>
      </div>
    </>
  );
}
