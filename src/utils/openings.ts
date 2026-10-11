/**
 * Common opening moves prefix lookup table (ECO standard)
 */
export const ECO_OPENINGS: Record<string, { name: string; eco: string }> = {
  'e4 e5 Nf3 Nc6 Bc4': { name: 'Italian Game', eco: 'C50' },
  'e4 e5 Nf3 Nc6 Bb5': { name: 'Ruy Lopez (Spanish Opening)', eco: 'C60' },
  'e4 e5 Nf3 Nf6': { name: 'Petrov Defense', eco: 'C42' },
  'e4 e5 Nf3 d6': { name: 'Philidor Defense', eco: 'C41' },
  'e4 e5 f4': { name: "King's Gambit", eco: 'C30' },
  'e4 c5 Nf3 d6': { name: 'Sicilian Defense: Open', eco: 'B50' },
  'e4 c5 Nf3 Nc6': { name: 'Sicilian Defense: Old', eco: 'B30' },
  'e4 c5': { name: 'Sicilian Defense', eco: 'B20' },
  'e4 e6': { name: 'French Defense', eco: 'C00' },
  'e4 c6': { name: 'Caro-Kann Defense', eco: 'B10' },
  'e4 d5': { name: 'Scandinavian Defense', eco: 'B01' },
  'e4 d6': { name: 'Pirc Defense', eco: 'B07' },
  'e4 g6': { name: 'Modern Defense', eco: 'B06' },
  'e4 Nf6': { name: 'Alekhine Defense', eco: 'B02' },
  'd4 d5 c4 e6': { name: "Queen's Gambit Declined", eco: 'D30' },
  'd4 d5 c4 c6': { name: 'Slav Defense', eco: 'D10' },
  'd4 d5 c4': { name: "Queen's Gambit", eco: 'D06' },
  'd4 Nf6 c4 e6': { name: "Nimzo-Indian / Queen's Indian", eco: 'E00' },
  'd4 Nf6 c4 g6': { name: "King's Indian / Grünfeld", eco: 'E60' },
  'd4 Nf6 c4 c5': { name: 'Benoni Defense', eco: 'A56' },
  'd4 Nf6 Nf3': { name: 'Indian Defense', eco: 'A46' },
  'd4 d5': { name: "Queen's Pawn Game", eco: 'D00' },
  'd4 f5': { name: 'Dutch Defense', eco: 'A80' },
  'c4': { name: 'English Opening', eco: 'A10' },
  'Nf3': { name: 'Réti Opening', eco: 'A04' },
  'b3': { name: 'Nimzo-Larsen Attack', eco: 'A01' },
  'f4': { name: "Bird's Opening", eco: 'A02' },
  'e4': { name: "King's Pawn Opening", eco: 'B00' },
  'd4': { name: "Queen's Pawn Opening", eco: 'A40' },
};

export function detectOpening(moves: string[]): { name: string; eco: string } {
  if (!moves || moves.length === 0) {
    return { name: 'Unknown Opening', eco: 'A00' };
  }

  // Check up to first 6 ply moves
  for (let len = Math.min(moves.length, 6); len >= 1; len--) {
    const key = moves.slice(0, len).join(' ');
    if (ECO_OPENINGS[key]) {
      return ECO_OPENINGS[key];
    }
  }

  const firstMove = moves[0];
  if (ECO_OPENINGS[firstMove]) {
    return ECO_OPENINGS[firstMove];
  }

  return { name: 'Unclassified Opening', eco: 'A00' };
}
