import { cn } from '@/utils';

export const classes = {
  page: cn('flex min-h-screen w-full items-stretch bg-snc-background text-snc-text-primary'),
  provider: cn('flex min-h-screen w-full items-stretch'),

  header: cn(
    'sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-snc-border bg-snc-surface px-5',
  ),
  headerStart: cn('flex min-w-0 flex-1 items-center gap-2'),
  headerActions: cn('flex flex-none items-center gap-1'),

  main: cn('flex w-full max-w-[1360px] flex-1 flex-col gap-5 px-6 pt-7 pb-10'),
} as const;
