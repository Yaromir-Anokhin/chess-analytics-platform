export interface ChessGame {
  id: string;
  event: string;
  site: string;
  date: string;
  round: string;
  white: string;
  black: string;
  result: '1-0' | '0-1' | '1/2-1/2' | '*';
  whiteElo: number | null;
  blackElo: number | null;
  eco: string;
  opening: string;
  moveCount: number;
  moves: string[];
  termination?: string;
  timeControl?: string;
}

export interface PlayerStats {
  playerName: string;
  totalGames: number;
  whiteGames: number;
  blackGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  lossRate: number;
  drawRate: number;
}

export interface OpeningStats {
  name: string;
  eco: string;
  count: number;
  percentage: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface RatingProgressionPoint {
  gameIndex: number;
  date: string;
  opponent: string;
  rating: number;
  color: 'white' | 'black';
  result: 'win' | 'loss' | 'draw';
}

export interface ChessAnalysisSummary {
  totalGames: number;
  winsWhite: number;
  winsBlack: number;
  draws: number;
  openings: OpeningStats[];
  players: string[];
  topPlayer: string;
  playerStats: PlayerStats;
  ratingHistory: RatingProgressionPoint[];
  games: ChessGame[];
}
