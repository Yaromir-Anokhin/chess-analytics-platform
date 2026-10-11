import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Activity } from 'lucide-react';
import type { RatingProgressionPoint } from '../types/chess';

interface RatingChartProps {
  data: RatingProgressionPoint[];
  playerName: string;
}

export const RatingChart: React.FC<RatingChartProps> = ({ data, playerName }) => {
  if (data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-center items-center text-center h-80">
        <Activity className="w-8 h-8 text-slate-600 mb-2" />
        <h3 className="text-sm font-semibold text-slate-300">No Rating Progression Available</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          The uploaded PGN file does not contain [WhiteElo] or [BlackElo] headers for this player.
        </p>
      </div>
    );
  }

  const ratings = data.map((d) => d.rating);
  const minRating = Math.min(...ratings) - 20;
  const maxRating = Math.max(...ratings) + 20;
  const avgRating = Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length);

  const chartData = data.map((d) => ({
    match: `G${d.gameIndex}`,
    rating: d.rating,
    date: d.date,
    opponent: d.opponent,
    result: d.result,
    color: d.color,
  }));

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Rating Progression Timeline
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Elo performance fluctuations across chronologically ordered matches for {playerName}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
              Avg: <strong className="text-amber-400">{avgRating}</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
              Peak: <strong className="text-emerald-400">{Math.max(...ratings)}</strong>
            </span>
          </div>
        </div>

        <div className="h-64 w-full my-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="match" stroke="#64748b" fontSize={11} tickLine={false} axisLine={{ stroke: '#334155' }} />
              <YAxis
                domain={[minRating, maxRating]}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${val} Elo`, 'Rating']}
                labelFormatter={(label: any, items: any) => {
                  const item = items[0]?.payload;
                  if (!item) return label;
                  return `${label} (${item.date}) vs ${item.opponent} [${item.result.toUpperCase()}]`;
                }}
              />
              <ReferenceLine y={avgRating} stroke="#64748b" strokeDasharray="3 3" label={{ value: 'Avg', fill: '#94a3b8', fontSize: 10, position: 'right' }} />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 4, fill: '#06b6d4', stroke: '#0f172a', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#38bdf8', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
        <span>Timeline: {data.length} recorded matches</span>
        <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          Elo Trajectory
        </span>
      </div>
    </div>
  );
};
