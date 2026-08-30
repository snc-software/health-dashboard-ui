import { Heading } from '@snc-software/snc-ui';
import { classes } from './Activities.styles';

export function Activities() {
  return (
    <>
      <Heading level="h1">Activities</Heading>
      <div className={classes.placeholder}>
        <div className={classes.placeholderText}>Page content goes here</div>
      </div>
    </>
  );
}
