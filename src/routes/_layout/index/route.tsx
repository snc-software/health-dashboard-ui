import { createFileRoute } from '@tanstack/react-router';
import { Overview } from './Overview';

export const Route = createFileRoute('/_layout/')({
  component: Overview,
});
