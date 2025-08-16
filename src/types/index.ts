export interface Player {
  id: string;
  name: string;
  country: string;
  joinedAt: Date;
  isAdmin?: boolean;
}

export interface Message {
  id: string;
  playerId: string;
  playerName: string;
  content: string;
  timestamp: Date;
}

export interface DailyHint {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface MysteryPerson {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  hints: string[];
}

export interface Vote {
  id: string;
  playerId: string;
  playerName: string;
  suspectedPersonName: string;
  timestamp: Date;
}

export interface GameState {
  isVotingOpen: boolean;
  gameStarted: boolean;
  mysteryPersonRevealed: boolean;
  mysteryPersonId?: string | null; // ID of the selected mystery person
}
