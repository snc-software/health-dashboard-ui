import { cn } from '@/utils';

export const classes = {
  placeholder: cn(
    'grid min-h-[340px] flex-1 place-items-center rounded-lg border border-dashed border-snc-border bg-snc-surface',
  ),
  placeholderText: cn('px-6 py-6 text-center text-sm text-snc-text-secondary'),
} as const;
