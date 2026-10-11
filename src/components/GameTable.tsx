import React, { useState } from 'react';
import type { ChessGame } from '../types/chess';
import { Search, ChevronDown, ChevronUp, Crown } from 'lucide-react';

interface GameTableProps {
  games: ChessGame[];
  focusPlayer: string;
}

export const GameTable: React.FC<GameTableProps> = ({ games, focusPlayer }) => {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredGames = games.filter((g) => {
    const q = search.toLowerCase();
    return (
      g.white.toLowerCase().includes(q) ||
      g.black.toLowerCase().includes(q) ||
      g.opening.toLowerCase().includes(q) ||
      g.eco.toLowerCase().includes(q) ||
      g.event.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
      <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Parsed Games Catalog</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed breakdown of individual games, move counts, and openings
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by player, opening or ECO..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/80 transition"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-5">Result</th>
              <th className="py-3 px-5">White</th>
              <th className="py-3 px-5">Black</th>
              <th className="py-3 px-5">Opening / ECO</th>
              <th className="py-3 px-5">Moves</th>
              <th className="py-3 px-5">Date</th>
              <th className="py-3 px-5 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredGames.map((game) => {
              const isExpanded = expandedId === game.id;
              const isFocusWhite = game.white.toLowerCase() === focusPlayer.toLowerCase();
              const isFocusBlack = game.black.toLowerCase() === focusPlayer.toLowerCase();

              return (
                <React.Fragment key={game.id}>
                  <tr
                    onClick={() => setExpandedId(isExpanded ? null : game.id)}
                    className={`hover:bg-slate-800/40 cursor-pointer transition ${
                      isExpanded ? 'bg-slate-800/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono ${
                          game.result === '1-0'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : game.result === '0-1'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {game.result}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5 font-medium text-slate-200">
                        {isFocusWhite && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
                        <span>{game.white}</span>
                        {game.whiteElo && (
                          <span className="text-xs text-slate-500">({game.whiteElo})</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5 font-medium text-slate-200">
                        {isFocusBlack && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
                        <span>{game.black}</span>
                        {game.blackElo && (
                          <span className="text-xs text-slate-500">({game.blackElo})</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex flex-col">
                        <span className="text-slate-300 font-medium text-xs">{game.opening}</span>
                        <span className="text-[11px] text-slate-500 font-mono">ECO: {game.eco}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-xs font-mono text-slate-400">
                      {game.moveCount} moves
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-400 font-mono">
                      {game.date}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button type="button" className="p-1 rounded text-slate-400 hover:text-white">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr>
                      <td colSpan={7} className="bg-slate-950/80 p-5 border-y border-slate-800">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                            <div>
                              Event: <span className="text-slate-200 font-medium">{game.event}</span> ({game.site})
                            </div>
                            <div>Round: {game.round}</div>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                            <h5 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                              PGN Notation Sequence:
                            </h5>
                            <div className="font-mono text-xs text-amber-200/90 leading-relaxed max-h-36 overflow-y-auto pr-2">
                              {game.moves.map((move, idx) => (
                                <span key={idx} className="mr-2">
                                  {idx % 2 === 0 ? (
                                    <span className="text-slate-500 font-normal">{Math.floor(idx / 2) + 1}. </span>
                                  ) : null}
                                  <span className="font-semibold text-slate-200 hover:text-amber-400 transition cursor-default">
                                    {move}
                                  </span>
                                </span>
                              ))}
                              <span className="font-bold text-amber-400 ml-1">{game.result}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {filteredGames.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-xs text-slate-500">
                  No chess games matched your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
