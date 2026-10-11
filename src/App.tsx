import { useState, useEffect } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  UserCheck 
} from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { SummaryCards } from './components/SummaryCards';
import { OpeningsChart } from './components/OpeningsChart';
import { RatingChart } from './components/RatingChart';
import { GameTable } from './components/GameTable';
import { splitPgnGames, parseSinglePgnGame, analyzeChessGames } from './utils/pgnParser';
import { SAMPLE_PGN } from './utils/samplePgn';
import type { ChessAnalysisSummary } from './types/chess';

export default function App() {
  const [analysis, setAnalysis] = useState<ChessAnalysisSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');

  const processPgnText = (text: string, customPlayer?: string) => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        const rawGames = splitPgnGames(text);
        const parsedGames = rawGames
          .map((g, idx) => parseSinglePgnGame(g, idx))
          .filter((g): g is NonNullable<typeof g> => g !== null);

        const result = analyzeChessGames(parsedGames, customPlayer);
        setAnalysis(result);
        setSelectedPlayer(result.topPlayer);
      } catch (err) {
        console.error('Error parsing games:', err);
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };

  useEffect(() => {
    // Initial load with Magnus Carlsen championship dataset
    processPgnText(SAMPLE_PGN);
  }, []);

  const handlePlayerChange = (player: string) => {
    if (!analysis) return;
    setSelectedPlayer(player);
    const updated = analyzeChessGames(analysis.games, player);
    setAnalysis(updated);
  };

  const handleResetToSample = () => {
    processPgnText(SAMPLE_PGN);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/20 text-slate-950">
              <Trophy className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-white flex items-center gap-2">
                Chess Analytics Platform
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  PGN Engine
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Professional PGN parser, opening repertoire analysis & rating progression
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {analysis && (
              <button
                onClick={handleResetToSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition"
                title="Reload Grandmaster Sample PGN"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Load Sample PGN</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Upload Hero Section */}
        <section className="space-y-4">
          <FileUpload
            onPgnLoaded={(content) => processPgnText(content)}
            isLoading={isLoading}
          />
        </section>

        {analysis && analysis.totalGames > 0 && (
          <>
            {/* Player Selection Toolbar */}
            <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                    Primary Focused Player:
                  </span>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {selectedPlayer}
                  </div>
                </div>
              </div>

              {analysis.players.length > 1 && (
                <div className="flex items-center gap-2">
                  <label htmlFor="player-select" className="text-xs text-slate-400">
                    Switch Perspective:
                  </label>
                  <select
                    id="player-select"
                    value={selectedPlayer}
                    onChange={(e) => handlePlayerChange(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 transition"
                  >
                    {analysis.players.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </section>

            {/* Performance KPI Cards */}
            <section>
              <SummaryCards
                stats={analysis.playerStats}
                totalGames={analysis.totalGames}
                allPlayersCount={analysis.players.length}
              />
            </section>

            {/* Visual Analytics: Openings Repertoire & Rating Timeline */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OpeningsChart openings={analysis.openings} />
              <RatingChart data={analysis.ratingHistory} playerName={selectedPlayer} />
            </section>

            {/* Detailed Games Table */}
            <section>
              <GameTable games={analysis.games} focusPlayer={selectedPlayer} />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Chess Analytics Platform • Client-side chess.js engine processing</span>
          <span>Fast, private, no external server transfers</span>
        </div>
      </footer>
    </div>
  );
}
