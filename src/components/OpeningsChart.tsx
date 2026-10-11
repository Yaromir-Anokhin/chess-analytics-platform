import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { OpeningStats } from '../types/chess';
import { BookOpen } from 'lucide-react';

interface OpeningsChartProps {
  openings: OpeningStats[];
}

const PALETTE = [
  '#f59e0b', // Amber-500
  '#06b6d4', // Cyan-500
  '#3b82f6', // Blue-500
  '#10b981', // Emerald-500
  '#8b5cf6', // Violet-500
  '#ec4899', // Pink-500
  '#64748b', // Slate-500
];

export const OpeningsChart: React.FC<OpeningsChartProps> = ({ openings }) => {
  const topOpenings = openings.slice(0, 6);
  const otherCount = openings.slice(6).reduce((acc, curr) => acc + curr.count, 0);

  const data = [
    ...topOpenings.map((op, i) => ({
      name: op.name,
      value: op.count,
      eco: op.eco,
      percentage: op.percentage,
      color: PALETTE[i % PALETTE.length],
    })),
    ...(otherCount > 0
      ? [
          {
            name: 'Other Openings',
            value: otherCount,
            eco: 'Misc',
            percentage: Math.round((otherCount / openings.reduce((a, b) => a + b.count, 0)) * 100),
            color: '#475569',
          },
        ]
      : []),
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Most Popular Openings
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Opening repertoire and ECO classification breakdown
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {openings.length} distinct
          </span>
        </div>

        <div className="h-64 w-full relative flex items-center justify-center my-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell key={`opening-cell-${index}`} fill={entry.color} stroke="#020617" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(val: any, name: any, item: any) => [
                  `${val} games (${item.payload.percentage}%) [${item.payload.eco}]`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-1.5 border-t border-slate-800 pt-4">
        {data.slice(0, 4).map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-300 truncate font-medium">{entry.name}</span>
            </div>
            <span className="text-slate-400 shrink-0 font-mono">
              {entry.value} ({entry.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
