export enum CellType {
  DIAMOND = 'diamond',
  BOMB = 'bomb',
  RARE_DIAMOND = 'rare_diamond',
  SUPER_DIAMOND = 'super_diamond'
}

export interface Cell {
  type: CellType;
  revealed: boolean;
  id: string;
}

export enum GameState {
  PLAYING = 'playing',
  WON = 'won',
  LOST = 'lost',
  BOSS_LEVEL = 'boss_level'
}

export interface GameStats {
  score: number;
  diamondsFound: number;
  level: number;
  boardSize: number;
  xp: number;
  playerLevel: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  reward: number;
}

export interface PlayerData {
  totalScore: number;
  gamesPlayed: number;
  diamondsCollected: number;
  xp: number;
  level: number;
  unlockedSkins: string[];
  currentSkin: string;
  achievements: Achievement[];
  dailyMissions: DailyMission[];
  diamondCollection: string[];
}

export interface Skin {
  id: string;
  name: string;
  icon: string;
  unlockScore: number;
  unlocked: boolean;
}