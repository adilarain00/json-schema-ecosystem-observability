/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface ChartWrapperProps {
  type: 'line' | 'bar';
  data: any;
  options?: any;
  height?: number;
}

export default function ChartWrapper({
  type,
  data,
  options,
  height = 300,
}: ChartWrapperProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#a1a1aa',
        },
      },
    },
    scales: {
      y: {
        grid: { color: '#27272a' },
        ticks: { color: '#a1a1aa' },
      },
      x: {
        grid: { color: 'transparent' },
        ticks: { color: '#a1a1aa' },
      },
    },
    ...options,
  };

  return (
    <div style={{ height }}>
      {type === 'line' ? (
        <Line data={data} options={defaultOptions} />
      ) : (
        <Bar data={data} options={defaultOptions} />
      )}
    </div>
  );
}
