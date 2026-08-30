import { cn } from '@/utils';

export const classes = {
  row: cn(
    'flex items-center gap-2.5 overflow-hidden px-1 py-0.5 transition-all duration-200 ease-linear',
  ),
  rowCollapsed: cn('gap-0 px-0'),
  mark: cn(
    'grid size-[30px] shrink-0 place-items-center rounded-md bg-snc-primary font-snc-heading text-sm font-bold text-white',
  ),
  name: cn(
    'overflow-hidden text-ellipsis whitespace-nowrap font-snc-heading text-[15px] font-bold tracking-tight transition-all duration-200 ease-linear',
  ),
  nameCollapsed: cn('pointer-events-none max-w-0 opacity-0'),
} as const;
