import { cn } from '@/utils';

export const classes = {
  form: cn('flex flex-col items-start gap-4'),
  fieldError: cn('text-sm text-snc-error-text'),
} as const;
