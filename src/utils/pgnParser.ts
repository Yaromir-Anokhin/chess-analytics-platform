import { Chess } from 'chess.js';
import type { ChessGame, ChessAnalysisSummary, PlayerStats, OpeningStats, RatingProgressionPoint } from '../types/chess';
import { detectOpening } from './openings';

/**
 * Splits raw PGN content into individual game strings
 */
export function splitPgnGames(pgnContent: string): string[] {
  if (!pgnContent || typeof pgnContent !== 'string') return [];

  const rawGames: string[] = [];
  const lines = pgnContent.split(/\r?\n/);
  let currentGame: string[] = [];
  let inMoves = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('[')) {
      if (inMoves && currentGame.length > 0) {
        rawGames.push(currentGame.join('\n').trim());
        currentGame = [];
        inMoves = false;
      }
      currentGame.push(line);
    } else if (line.length > 0) {
      inMoves = true;
      currentGame.push(line);
    } else {
      if (currentGame.length > 0) {
        currentGame.push('');
      }
    }
  }

  if (currentGame.length > 0) {
    rawGames.push(currentGame.join('\n').trim());
  }

  return rawGames.filter((g) => g.length > 0 && g.includes('['));
}

/**
 * Parses an individual PGN game using chess.js
 */
export function parseSinglePgnGame(pgnText: string, index: number): ChessGame | null {
  try {
    const chess = new Chess();
    chess.loadPgn(pgnText);

    const header = chess.header();
    const white = (header['White'] || 'White Player').trim();
    const black = (header['Black'] || 'Black Player').trim();
    const result = (header['Result'] || '*') as ChessGame['result'];
    const whiteElo = header['WhiteElo'] && !isNaN(Number(header['WhiteElo'])) ? Number(header['WhiteElo']) : null;
    const blackElo = header['BlackElo'] && !isNaN(Number(header['BlackElo'])) ? Number(header['BlackElo']) : null;
    const date = header['Date'] || 'Unknown Date';
    const event = header['Event'] || 'Casual Game';
    const site = header['Site'] || 'Online';
    const round = header['Round'] || '?';

    const historyMoves = chess.history();
    const detected = detectOpening(historyMoves);
    const opening = header['Opening'] || detected.name;
    const eco = header['ECO'] || detected.eco;

    return {
      id: `game-${index + 1}-${Date.now()}`,
      event,
      site,
      date,
      round,
      white,
      black,
      result,
      whiteElo,
      blackElo,
      eco,
      opening,
      moveCount: Math.ceil(historyMoves.length / 2),
      moves: historyMoves,
      termination: header['Termination'] || undefined,
      timeControl: header['TimeControl'] || undefined,
    };
  } catch (err) {
    console.warn(`Failed parsing game ${index + 1}:`, err);
    return null;
  }
}

/**
 * Aggregates all parsed games into analytical dashboard metrics
 */
export function analyzeChessGames(games: ChessGame[], focusPlayer?: string): ChessAnalysisSummary {
  if (games.length === 0) {
    return {
      totalGames: 0,
      winsWhite: 0,
      winsBlack: 0,
      draws: 0,
      openings: [],
      players: [],
      topPlayer: '',
      playerStats: {
        playerName: '',
        totalGames: 0,
        whiteGames: 0,
        blackGames: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        lossRate: 0,
        drawRate: 0,
      },
      ratingHistory: [],
      games: [],
    };
  }

  // Count player frequency to determine primary analyzed player if none chosen
  const playerCounts = new Map<string, number>();
  for (const g of games) {
    playerCounts.set(g.white, (playerCounts.get(g.white) || 0) + 1);
    playerCounts.set(g.black, (playerCounts.get(g.black) || 0) + 1);
  }

  const sortedPlayers = Array.from(playerCounts.entries()).sort((a, b) => b[1] - a[1]);
  const primaryPlayer = focusPlayer || (sortedPlayers[0] ? sortedPlayers[0][0] : 'All Players');

  let winsWhite = 0;
  let winsBlack = 0;
  let draws = 0;

  // Track player specific stats
  let pTotal = 0;
  let pWhiteGames = 0;
  let pBlackGames = 0;
  let pWins = 0;
  let pLosses = 0;
  let pDraws = 0;

  // Opening distribution map
  const openingMap = new Map<string, { count: number; eco: string; wins: number; losses: number; draws: number }>();
  const ratingHistory: RatingProgressionPoint[] = [];

  games.forEach((game) => {
    if (game.result === '1-0') winsWhite++;
    else if (game.result === '0-1') winsBlack++;
    else if (game.result === '1/2-1/2') draws++;

    // Opening stats tracking
    const opKey = game.opening || 'Unknown Opening';
    const existingOp = openingMap.get(opKey) || {
      count: 0,
      eco: game.eco || 'A00',
      wins: 0,
      losses: 0,
      draws: 0,
    };
    existingOp.count++;

    const isPrimaryWhite = game.white.toLowerCase() === primaryPlayer.toLowerCase();
    const isPrimaryBlack = game.black.toLowerCase() === primaryPlayer.toLowerCase();

    if (isPrimaryWhite || isPrimaryBlack) {
      pTotal++;
      let resultStatus: 'win' | 'loss' | 'draw' = 'draw';

      if (isPrimaryWhite) {
        pWhiteGames++;
        if (game.result === '1-0') {
          pWins++;
          existingOp.wins++;
          resultStatus = 'win';
        } else if (game.result === '0-1') {
          pLosses++;
          existingOp.losses++;
          resultStatus = 'loss';
        } else {
          pDraws++;
          existingOp.draws++;
          resultStatus = 'draw';
        }

        if (game.whiteElo !== null) {
          ratingHistory.push({
            gameIndex: pTotal,
            date: game.date,
            opponent: game.black,
            rating: game.whiteElo,
            color: 'white',
            result: resultStatus,
          });
        }
      } else {
        pBlackGames++;
        if (game.result === '0-1') {
          pWins++;
          existingOp.wins++;
          resultStatus = 'win';
        } else if (game.result === '1-0') {
          pLosses++;
          existingOp.losses++;
          resultStatus = 'loss';
        } else {
          pDraws++;
          existingOp.draws++;
          resultStatus = 'draw';
        }

        if (game.blackElo !== null) {
          ratingHistory.push({
            gameIndex: pTotal,
            date: game.date,
            opponent: game.white,
            rating: game.blackElo,
            color: 'black',
            result: resultStatus,
          });
        }
      }
    } else {
      if (game.result === '1-0') existingOp.wins++;
      else if (game.result === '0-1') existingOp.losses++;
      else existingOp.draws++;
    }

    openingMap.set(opKey, existingOp);
  });

  const totalGames = games.length;

  // Sort and calculate percentages for openings
  const openings: OpeningStats[] = Array.from(openingMap.entries())
    .map(([name, data]) => ({
      name,
      eco: data.eco,
      count: data.count,
      percentage: Math.round((data.count / totalGames) * 100),
      wins: data.wins,
      losses: data.losses,
      draws: data.draws,
    }))
    .sort((a, b) => b.count - a.count);

  const playerStats: PlayerStats = {
    playerName: primaryPlayer,
    totalGames: pTotal,
    whiteGames: pWhiteGames,
    blackGames: pBlackGames,
    wins: pWins,
    losses: pLosses,
    draws: pDraws,
    winRate: pTotal > 0 ? Math.round((pWins / pTotal) * 100) : 0,
    lossRate: pTotal > 0 ? Math.round((pLosses / pTotal) * 100) : 0,
    drawRate: pTotal > 0 ? Math.round((pDraws / pTotal) * 100) : 0,
  };

  return {
    totalGames,
    winsWhite,
    winsBlack,
    draws,
    openings,
    players: sortedPlayers.map((p) => p[0]),
    topPlayer: primaryPlayer,
    playerStats,
    ratingHistory,
    games,
  };
}
