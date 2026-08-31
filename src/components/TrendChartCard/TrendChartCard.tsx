import { Card, Heading, LineChart } from '@snc-software/snc-ui';
import { classes } from './TrendChartCard.styles';
import type { TrendChartCardProps } from './TrendChartCard.types';

export function TrendChartCard<TRow extends object>({
  title,
  data,
  xAxisKey,
  series,
  isLoading,
  emptyMessage,
  statusPill,
}: TrendChartCardProps<TRow>) {
  return (
    <Card
      header={
        <div className={classes.header}>
          <Heading level="h3">{title}</Heading>
          {statusPill}
        </div>
      }
      content={
        <LineChart
          ariaLabel={`${title} trend chart`}
          data={data}
          xAxisKey={xAxisKey}
          series={series}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
        />
      }
    />
  );
}
