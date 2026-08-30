import { createFileRoute } from '@tanstack/react-router';
import { Activities } from './Activities';

export const Route = createFileRoute('/_layout/activities')({
  component: Activities,
});
