import type { ReactNode } from 'react';
import type { ChartSeries } from '@snc-software/snc-ui';

export interface TrendChartCardProps<TRow extends object> {
  /**
   * Card heading. Also drives the underlying `LineChart`'s required `ariaLabel`
   * (`"{title} trend chart"`).
   */
  title: string;
  data: TRow[];
  xAxisKey: Extract<keyof TRow, string>;
  series: Array<ChartSeries<TRow>>;
  isLoading?: boolean;
  emptyMessage?: ReactNode;
  /**
   * Rendered alongside the title, e.g. a `StatusPill` for the metric's current status.
   */
  statusPill?: ReactNode;
}
