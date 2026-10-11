import React from 'react';
import { Trophy, TrendingUp, MinusCircle, ShieldCheck } from 'lucide-react';
import type { PlayerStats } from '../types/chess';

interface SummaryCardsProps {
  stats: PlayerStats;
  totalGames: number;
  allPlayersCount: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ stats, totalGames }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Games */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>Analyzed Games</span>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white">{stats.totalGames || totalGames}</span>
          <span className="text-xs text-slate-400">matches</span>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          Player: <span className="text-amber-400 font-semibold truncate">{stats.playerName}</span>
        </div>
      </div>

      {/* Wins */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <span>Victories (Wins)</span>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-emerald-400">{stats.wins}</span>
          <span className="text-xs text-emerald-500/80 font-bold">({stats.winRate}%)</span>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          White: <span className="text-slate-200">{stats.whiteGames}</span> | Black: <span className="text-slate-200">{stats.blackGames}</span>
        </div>
      </div>

      {/* Losses */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-xs font-semibold text-rose-400 uppercase tracking-wider">
          <span>Defeats (Losses)</span>
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <TrendingUp className="w-4 h-4 rotate-180" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-rose-400">{stats.losses}</span>
          <span className="text-xs text-rose-500/80 font-bold">({stats.lossRate}%)</span>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          Loss rate across all matches
        </div>
      </div>

      {/* Draws */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <span>Draws</span>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <MinusCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-amber-400">{stats.draws}</span>
          <span className="text-xs text-amber-500/80 font-bold">({stats.drawRate}%)</span>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          Equally balanced games
        </div>
      </div>
    </div>
  );
};
