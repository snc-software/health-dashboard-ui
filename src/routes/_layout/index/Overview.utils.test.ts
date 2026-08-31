import { describe, expect, it } from 'vitest';
import type { DailyHealthStat } from '@/types/HealthStats';
import {
  buildSnapshotGroups,
  buildSparklineTrend,
  formatDateYmd,
  formatStatusWord,
  getDefaultDateRange,
  gramsToKg,
  mapStatusWordToVariant,
  toCardStatus,
  toPillVariant,
  withWeightKg,
} from './Overview.utils';

function makeRow(overrides: Partial<DailyHealthStat> = {}): DailyHealthStat {
  return {
    date: '2026-08-01',
    steps: null,
    restingHeartRate: null,
    sleepSeconds: null,
    sleepScore: null,
    peakBodyBattery: null,
    hrvLastNightAverage: null,
    hrvStatus: null,
    trainingReadinessScore: null,
    trainingStatus: null,
    vo2Max: null,
    fitnessAge: null,
    weightGrams: null,
    intensityMinutes: null,
    updatedTimestamp: '2026-08-01T06:00:00Z',
    ...overrides,
  };
}

describe('getDefaultDateRange', () => {
  it('resolves to a 90-day span ending on the reference date', () => {
    const range = getDefaultDateRange(new Date('2026-08-31T12:00:00'));

    expect(range).toEqual({ start: '2026-06-02', end: '2026-08-31' });
  });
});

describe('formatDateYmd', () => {
  it('pads single-digit months and days', () => {
    expect(formatDateYmd(new Date('2026-01-05T00:00:00'))).toBe('2026-01-05');
  });
});

describe('gramsToKg / withWeightKg', () => {
  it('converts grams to kg to 1 decimal place', () => {
    expect(gramsToKg(72350)).toBe(72.4);
  });

  it('returns null for a null weight', () => {
    expect(gramsToKg(null)).toBeNull();
  });

  it('adds a weightKg field derived from weightGrams for every row', () => {
    const rows = [makeRow({ weightGrams: 70000 }), makeRow({ weightGrams: null })];

    expect(withWeightKg(rows).map((row) => row.weightKg)).toEqual([70, null]);
  });
});

describe('buildSparklineTrend', () => {
  it('skips null entries when building the sparkline data', () => {
    const rows = [
      makeRow({ date: '2026-08-01', vo2Max: 45 }),
      makeRow({ date: '2026-08-02', vo2Max: null }),
      makeRow({ date: '2026-08-03', vo2Max: 47 }),
    ];

    const result = buildSparklineTrend(rows, (row) => row.vo2Max);

    expect(result.sparklineData).toEqual([45, 47]);
  });

  it('omits trendValue when fewer than 2 non-null points exist', () => {
    const rows = [
      makeRow({ date: '2026-08-01', vo2Max: null }),
      makeRow({ date: '2026-08-02', vo2Max: 47 }),
    ];

    const result = buildSparklineTrend(rows, (row) => row.vo2Max);

    expect(result.sparklineData).toEqual([47]);
    expect(result.trendValue).toBeUndefined();
  });

  it('computes a "vs {N}d ago" trendValue spanning the earliest and latest non-null points', () => {
    const rows = [
      makeRow({ date: '2026-06-01', vo2Max: 45 }),
      makeRow({ date: '2026-08-30', vo2Max: 47.5 }),
    ];

    const result = buildSparklineTrend(rows, (row) => row.vo2Max);

    expect(result.trendValue).toBe('+2.5 vs 90d ago');
  });

  it('formats a negative delta with a leading minus sign', () => {
    const rows = [
      makeRow({ date: '2026-08-01', vo2Max: 47 }),
      makeRow({ date: '2026-08-11', vo2Max: 45 }),
    ];

    const result = buildSparklineTrend(rows, (row) => row.vo2Max);

    expect(result.trendValue).toBe('-2.0 vs 10d ago');
  });
});

describe('mapStatusWordToVariant', () => {
  it.each([
    ['PRODUCTIVE', 'success'],
    ['PEAKING', 'success'],
    ['MAINTAINING', 'success'],
    ['BALANCED', 'success'],
    ['OVERREACHING', 'warning'],
    ['STRAINED', 'warning'],
    ['UNBALANCED', 'warning'],
    ['LOW', 'warning'],
    ['UNPRODUCTIVE', 'error'],
    ['DETRAINING', 'error'],
  ] as const)('maps %s to %s', (status, expected) => {
    expect(mapStatusWordToVariant(status)).toBe(expected);
  });

  it('falls back to neutral for an unrecognised status', () => {
    expect(mapStatusWordToVariant('SOMETHING_UNKNOWN')).toBe('neutral');
  });

  it('falls back to neutral for null', () => {
    expect(mapStatusWordToVariant(null)).toBe('neutral');
  });
});

describe('toCardStatus / toPillVariant', () => {
  it('maps neutral to undefined for card status and info for pill variant', () => {
    expect(toCardStatus('neutral')).toBeUndefined();
    expect(toPillVariant('neutral')).toBe('info');
  });

  it('passes success/warning/error straight through for both', () => {
    expect(toCardStatus('success')).toBe('success');
    expect(toPillVariant('success')).toBe('success');
  });
});

describe('formatStatusWord', () => {
  it('title-cases a snake_case status word', () => {
    expect(formatStatusWord('NO_STATUS')).toBe('No Status');
  });

  it('returns undefined for null', () => {
    expect(formatStatusWord(null)).toBeUndefined();
  });
});

describe('buildSnapshotGroups', () => {
  it('reflects the latest (last) row in the primary and secondary groups', () => {
    const rows = [
      makeRow({
        date: '2026-08-29',
        trainingReadinessScore: 10,
        trainingStatus: 'RECOVERY',
        peakBodyBattery: 20,
        hrvStatus: 'BALANCED',
        steps: 1000,
        intensityMinutes: 5,
      }),
      makeRow({
        date: '2026-08-30',
        trainingReadinessScore: 82,
        trainingStatus: 'PRODUCTIVE',
        peakBodyBattery: 65,
        hrvStatus: 'BALANCED',
        steps: 9000,
        intensityMinutes: 40,
      }),
    ];

    const { primary, secondary } = buildSnapshotGroups(rows);

    expect(primary).toEqual([
      {
        id: 'training-readiness',
        variant: 'donut',
        label: 'Training Readiness Score',
        value: 82,
        donutValue: 82,
      },
      {
        id: 'training-status',
        variant: 'basic',
        label: 'Training Status',
        value: 'Productive',
        status: 'success',
      },
      {
        id: 'peak-body-battery',
        variant: 'donut',
        label: 'Peak Body Battery',
        value: 65,
        donutValue: 65,
      },
      {
        id: 'hrv-status',
        variant: 'basic',
        label: 'HRV Status',
        value: 'Balanced',
        status: 'success',
      },
    ]);
    expect(secondary).toEqual([
      {
        id: 'steps',
        variant: 'trend',
        label: 'Steps',
        value: 9000,
        trendValue: '+800% vs yesterday',
        trendDirection: 'up',
      },
      {
        id: 'intensity-minutes',
        variant: 'basic',
        label: 'Intensity Minutes',
        value: 40,
      },
    ]);
  });

  it('falls back to an undefined value (not NaN/a crash) when the latest row has null fields', () => {
    const rows = [makeRow({ date: '2026-08-30' })];

    const { primary, secondary } = buildSnapshotGroups(rows);

    expect(primary.every((item) => item.value === undefined)).toBe(true);
    expect(secondary.every((item) => item.value === undefined)).toBe(true);
    expect(secondary[0].trendValue).toBeUndefined();
  });

  it('does not throw and returns undefined values for an empty range', () => {
    expect(() => buildSnapshotGroups([])).not.toThrow();

    const { primary, secondary } = buildSnapshotGroups([]);

    expect(primary.every((item) => item.value === undefined)).toBe(true);
    expect(secondary.every((item) => item.value === undefined)).toBe(true);
  });
});
