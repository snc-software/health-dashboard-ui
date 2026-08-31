import { cn } from '@/utils';

export const classes = {
  page: cn('flex flex-col gap-6'),
  header: cn('flex flex-wrap items-end justify-between gap-4'),
  section: cn('flex flex-col gap-4'),
  sparklineRow: cn('grid grid-cols-1 gap-4 sm:grid-cols-2'),
  chartGrid: cn('grid grid-cols-1 gap-4 lg:grid-cols-2'),
  placeholder: cn(
    'grid min-h-[340px] flex-1 place-items-center rounded-lg border border-dashed border-snc-border bg-snc-surface p-6',
  ),
  errorActions: cn('mt-4 flex justify-center'),
} as const;
