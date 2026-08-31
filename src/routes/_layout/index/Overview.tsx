import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  DateRangePicker,
  Heading,
  InformationPanel,
  StatCard,
  StatsGroup,
  StatusPill,
} from '@snc-software/snc-ui';
import { TrendChartCard } from '@/components/TrendChartCard';
import { dailyHealthStatsQueryOptions } from '@/queries/healthStats';
import { classes } from './Overview.styles';
import type { DateRange } from './Overview.types';
import {
  buildSnapshotGroups,
  buildSparklineTrend,
  formatStatusWord,
  getDefaultDateRange,
  mapStatusWordToVariant,
  toPillVariant,
  withWeightKg,
} from './Overview.utils';

export function Overview() {
  const [range, setRange] = useState<DateRange>(() => getDefaultDateRange());
  const { data, isLoading, isError, refetch } = useQuery(
    dailyHealthStatsQueryOptions(range.start, range.end),
  );

  const rows = data ?? [];
  const latest = rows.at(-1);

  const vo2Max = buildSparklineTrend(rows, (row) => row.vo2Max);
  const fitnessAge = buildSparklineTrend(rows, (row) => row.fitnessAge);
  const { primary, secondary } = buildSnapshotGroups(rows);
  const weightRows = withWeightKg(rows);
  const hrvPillVariant = toPillVariant(mapStatusWordToVariant(latest?.hrvStatus ?? null));

  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <Heading level="h1">Overview</Heading>
        <DateRangePicker label="Date range" value={range} onChange={setRange} />
      </div>

      {isError ? (
        <div className={classes.placeholder}>
          <div>
            <InformationPanel
              variant="error"
              heading="Something went wrong"
              subtext="We couldn't load your health stats for this range."
            />
            <div className={classes.errorActions}>
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <section className={classes.section}>
            <StatsGroup items={primary} isLoading={isLoading} />
            <StatsGroup items={secondary} isLoading={isLoading} />
          </section>

          <section className={classes.section}>
            <Heading level="h2">Trends</Heading>
            <div className={classes.sparklineRow}>
              <StatCard
                variant="sparkline"
                label="VO2 Max"
                value={latest?.vo2Max ?? undefined}
                isLoading={isLoading}
                sparklineData={vo2Max.sparklineData}
                trendValue={vo2Max.trendValue}
              />
              <StatCard
                variant="sparkline"
                label="Fitness Age"
                value={latest?.fitnessAge ?? undefined}
                isLoading={isLoading}
                sparklineData={fitnessAge.sparklineData}
                trendValue={fitnessAge.trendValue}
              />
            </div>
            <div className={classes.chartGrid}>
              <TrendChartCard
                title="Resting Heart Rate"
                data={rows}
                xAxisKey="date"
                series={[
                  {
                    id: 'restingHeartRate',
                    label: 'Resting Heart Rate',
                    accessor: (row) => row.restingHeartRate ?? NaN,
                  },
                ]}
                isLoading={isLoading}
              />
              <TrendChartCard
                title="HRV"
                data={rows}
                xAxisKey="date"
                series={[
                  {
                    id: 'hrvLastNightAverage',
                    label: 'HRV',
                    accessor: (row) => row.hrvLastNightAverage ?? NaN,
                  },
                ]}
                isLoading={isLoading}
                statusPill={
                  latest?.hrvStatus ? (
                    <StatusPill variant={hrvPillVariant}>
                      {formatStatusWord(latest.hrvStatus)}
                    </StatusPill>
                  ) : undefined
                }
              />
              <TrendChartCard
                title="Sleep Score"
                data={rows}
                xAxisKey="date"
                series={[
                  {
                    id: 'sleepScore',
                    label: 'Sleep Score',
                    accessor: (row) => row.sleepScore ?? NaN,
                  },
                ]}
                isLoading={isLoading}
              />
              <TrendChartCard
                title="Weight"
                data={weightRows}
                xAxisKey="date"
                series={[
                  { id: 'weightKg', label: 'Weight (kg)', accessor: (row) => row.weightKg ?? NaN },
                ]}
                isLoading={isLoading}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
