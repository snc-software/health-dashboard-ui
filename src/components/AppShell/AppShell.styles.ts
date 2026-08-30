import { cn } from '@/utils';

export const classes = {
  page: cn(
    'flex min-h-screen w-full flex-col items-stretch bg-snc-background text-snc-text-primary',
  ),
  actions: cn('flex flex-none items-center gap-1'),

  main: cn('mx-auto flex w-full max-w-[1360px] flex-1 flex-col gap-5 px-6 pt-7 pb-10'),
} as const;
