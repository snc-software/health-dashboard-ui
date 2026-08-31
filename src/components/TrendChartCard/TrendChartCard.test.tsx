import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrendChartCard } from './TrendChartCard';

type Row = { date: string; value: number };

const data: Row[] = [
  { date: '2026-08-01', value: 10 },
  { date: '2026-08-02', value: 12 },
];

const series = [{ id: 'value', label: 'Value', accessor: (row: Row) => row.value }];

describe('TrendChartCard', () => {
  it('renders the supplied title and forwards data to the underlying LineChart', () => {
    render(
      <TrendChartCard title="Resting Heart Rate" data={data} xAxisKey="date" series={series} />,
    );

    expect(
      screen.getByRole('heading', { level: 3, name: 'Resting Heart Rate' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Resting Heart Rate trend chart' })).toBeInTheDocument();
  });

  it('forwards isLoading to the underlying LineChart', () => {
    render(
      <TrendChartCard
        title="Resting Heart Rate"
        data={data}
        xAxisKey="date"
        series={series}
        isLoading
      />,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('forwards emptyMessage to the underlying LineChart when there is no data', () => {
    render(
      <TrendChartCard
        title="Resting Heart Rate"
        data={[]}
        xAxisKey="date"
        series={series}
        emptyMessage="No data for this range"
      />,
    );

    expect(screen.getByText('No data for this range')).toBeInTheDocument();
  });

  it('renders the statusPill node when supplied', () => {
    render(
      <TrendChartCard
        title="HRV"
        data={data}
        xAxisKey="date"
        series={series}
        statusPill={<span>Balanced</span>}
      />,
    );

    expect(screen.getByText('Balanced')).toBeInTheDocument();
  });

  it('omits the statusPill when not supplied', () => {
    render(<TrendChartCard title="HRV" data={data} xAxisKey="date" series={series} />);

    expect(screen.queryByText('Balanced')).not.toBeInTheDocument();
  });
});
