import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Earthquake } from '../types';

interface MagnitudeChartProps {
  data: Earthquake[];
}

export const MagnitudeChart: React.FC<MagnitudeChartProps> = ({ data }) => {
  // Sort data by date (oldest first) for the chart
  const chartData = [...data].reverse().map(item => ({
    name: item.time.split(' ')[0] || item.date, // Simple label
    magnitude: item.magnitude,
    location: item.location
  }));

  if (data.length === 0) return null;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            tick={{fontSize: 12}} 
            tickLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            tick={{fontSize: 12}} 
            tickLine={false} 
            domain={[0, 10]} 
            label={{ value: 'Magnitude', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            cursor={{fill: '#334155', opacity: 0.4}}
          />
          <Bar dataKey="magnitude" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.magnitude > 5 ? '#ef4444' : entry.magnitude > 4 ? '#f97316' : '#3b82f6'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};