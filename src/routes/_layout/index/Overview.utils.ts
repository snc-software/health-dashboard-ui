import type { StatsItem } from '@snc-software/snc-ui';
import type { DailyHealthStat } from '@/types/HealthStats';

export const DEFAULT_RANGE_DAYS = 90;

export function formatDateYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDefaultDateRange(referenceDate: Date = new Date()): {
  start: string;
  end: string;
} {
  const start = new Date(referenceDate);
  start.setDate(start.getDate() - DEFAULT_RANGE_DAYS);

  return { start: formatDateYmd(start), end: formatDateYmd(referenceDate) };
}

function daysBetween(startDateYmd: string, endDateYmd: string): number {
  const start = new Date(`${startDateYmd}T00:00:00`);
  const end = new Date(`${endDateYmd}T00:00:00`);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function gramsToKg(grams: number | null): number | null {
  if (grams === null) {
    return null;
  }

  return Math.round((grams / 1000) * 10) / 10;
}

export function withWeightKg(
  rows: DailyHealthStat[],
): Array<DailyHealthStat & { weightKg: number | null }> {
  return rows.map((row) => ({ ...row, weightKg: gramsToKg(row.weightGrams) }));
}

export interface SparklineTrend {
  sparklineData: number[];
  trendValue?: string;
}

/**
 * Skips null entries; omits `trendValue` when fewer than 2 non-null points remain, since a delta
 * needs two points. The "vs {N}d ago" wording reflects the actual span between the earliest and
 * latest non-null point, not the requested range, since the range can contain gaps at either end.
 */
export function buildSparklineTrend(
  rows: DailyHealthStat[],
  accessor: (row: DailyHealthStat) => number | null,
): SparklineTrend {
  const points = rows
    .map((row) => ({ date: row.date, value: accessor(row) }))
    .filter((point): point is { date: string; value: number } => point.value !== null);

  const sparklineData = points.map((point) => point.value);

  if (points.length < 2) {
    return { sparklineData };
  }

  const first = points[0];
  const last = points[points.length - 1];
  const delta = last.value - first.value;
  const days = daysBetween(first.date, last.date);
  const sign = delta >= 0 ? '+' : '-';

  return {
    sparklineData,
    trendValue: `${sign}${Math.abs(delta).toFixed(1)} vs ${days}d ago`,
  };
}

export type SemanticVariant = 'success' | 'warning' | 'error' | 'neutral';

/**
 * Shared by both the Training Status/HRV Status snapshot tiles and the HRV trend chart's
 * StatusPill, since both are ultimately tinting the same kind of raw Garmin status word. Degrades
 * to `'neutral'` for any value outside the confirmed set in the plan's Contracts section (only
 * `trainingStatus`'s values are backend-confirmed; `hrvStatus` is marked "NEEDS CONFIRMING"
 * upstream with only `"BALANCED"` verified).
 */
export function mapStatusWordToVariant(status: string | null): SemanticVariant {
  if (!status) {
    return 'neutral';
  }

  switch (status.toUpperCase()) {
    case 'PRODUCTIVE':
    case 'PEAKING':
    case 'MAINTAINING':
    case 'BALANCED':
      return 'success';
    case 'OVERREACHING':
    case 'STRAINED':
    case 'UNBALANCED':
    case 'LOW':
      return 'warning';
    case 'UNPRODUCTIVE':
    case 'DETRAINING':
      return 'error';
    default:
      return 'neutral';
  }
}

export function toCardStatus(
  variant: SemanticVariant,
): 'success' | 'warning' | 'error' | undefined {
  return variant === 'neutral' ? undefined : variant;
}

export function toPillVariant(variant: SemanticVariant): 'info' | 'warning' | 'error' | 'success' {
  return variant === 'neutral' ? 'info' : variant;
}

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatStatusWord(status: string | null): string | undefined {
  return status ? toTitleCase(status) : undefined;
}

interface DayOverDayTrend {
  trendValue?: string;
  trendDirection?: 'up' | 'down';
}

function buildDayOverDayTrend(current: number | null, previous: number | null): DayOverDayTrend {
  if (current === null || previous === null || previous === 0) {
    return {};
  }

  const percentChange = ((current - previous) / previous) * 100;

  if (percentChange === 0) {
    return {};
  }

  const trendDirection = percentChange > 0 ? 'up' : 'down';
  const sign = percentChange > 0 ? '+' : '-';

  return {
    trendValue: `${sign}${Math.abs(percentChange).toFixed(0)}% vs yesterday`,
    trendDirection,
  };
}

export interface SnapshotGroups {
  primary: StatsItem[];
  secondary: StatsItem[];
}

/**
 * Reflects the most recent date in the (ascending-ordered) range, per the issue's acceptance
 * criteria. A `null` field is left as `value: undefined` so the card's own `emptyMessage` handles
 * it, rather than rendering "NaN" or a custom fallback.
 */
export function buildSnapshotGroups(rows: DailyHealthStat[]): SnapshotGroups {
  const latest = rows.at(-1);
  const previous = rows.at(-2);

  const trainingStatusVariant = mapStatusWordToVariant(latest?.trainingStatus ?? null);
  const hrvStatusVariant = mapStatusWordToVariant(latest?.hrvStatus ?? null);

  const primary: StatsItem[] = [
    {
      id: 'training-readiness',
      variant: 'donut',
      label: 'Training Readiness Score',
      value: latest?.trainingReadinessScore ?? undefined,
      donutValue: latest?.trainingReadinessScore ?? undefined,
    },
    {
      id: 'training-status',
      variant: 'basic',
      label: 'Training Status',
      value: formatStatusWord(latest?.trainingStatus ?? null),
      status: toCardStatus(trainingStatusVariant),
    },
    {
      id: 'peak-body-battery',
      variant: 'donut',
      label: 'Peak Body Battery',
      value: latest?.peakBodyBattery ?? undefined,
      donutValue: latest?.peakBodyBattery ?? undefined,
    },
    {
      id: 'hrv-status',
      variant: 'basic',
      label: 'HRV Status',
      value: formatStatusWord(latest?.hrvStatus ?? null),
      status: toCardStatus(hrvStatusVariant),
    },
  ];

  const secondary: StatsItem[] = [
    {
      id: 'steps',
      variant: 'trend',
      label: 'Steps',
      value: latest?.steps ?? undefined,
      ...buildDayOverDayTrend(latest?.steps ?? null, previous?.steps ?? null),
    },
    {
      id: 'intensity-minutes',
      variant: 'basic',
      label: 'Intensity Minutes',
      value: latest?.intensityMinutes ?? undefined,
    },
  ];

  return { primary, secondary };
}
