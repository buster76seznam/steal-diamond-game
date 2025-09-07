import { Cell, CellType, Achievement, DailyMission, PlayerData } from '../types/game';

export function createBoard(size: number, bombCount: number, isBossLevel = false): Cell[][] {
  const board: Cell[][] = Array(size).fill(null).map(() =>
    Array(size).fill(null).map(() => ({
      type: CellType.DIAMOND,
      revealed: false,
      id: Math.random().toString(36).substr(2, 9)
    }))
  );

  // Place bombs randomly
  let bombsPlaced = 0;
  while (bombsPlaced < bombCount) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    
    if (board[row][col].type !== CellType.BOMB) {
      board[row][col].type = CellType.BOMB;
      bombsPlaced++;
    }
  }

  // Add rare diamonds (5% chance) and super diamonds (1% chance)
  if (!isBossLevel) {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col].type === CellType.DIAMOND) {
          const rand = Math.random();
          if (rand < 0.01) {
            board[row][col].type = CellType.SUPER_DIAMOND;
          } else if (rand < 0.06) {
            board[row][col].type = CellType.RARE_DIAMOND;
          }
        }
      }
    }
  } else {
    // Boss level: more rare diamonds but also more bombs
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col].type === CellType.DIAMOND) {
          const rand = Math.random();
          if (rand < 0.05) {
            board[row][col].type = CellType.SUPER_DIAMOND;
          } else if (rand < 0.2) {
            board[row][col].type = CellType.RARE_DIAMOND;
          }
        }
      }
    }
  }

  return board;
}

export function calculateScore(diamondsFound: number, level: number, diamondType: CellType = CellType.DIAMOND): number {
  let baseScore = 10;
  
  switch (diamondType) {
    case CellType.RARE_DIAMOND:
      baseScore = 25;
      break;
    case CellType.SUPER_DIAMOND:
      baseScore = 100;
      break;
    default:
      baseScore = 10;
  }
  
  const levelBonus = level * 5;
  const multiplier = Math.pow(1.2, diamondsFound - 1);
  
  return Math.round(baseScore * multiplier + levelBonus);
}

export function getBombCount(level: number, boardSize: number, isBossLevel = false): number {
  const totalCells = boardSize * boardSize;
  let baseBombRatio = 0.15;
  
  if (isBossLevel) {
    baseBombRatio = 0.25; // Boss levels have more bombs
  }
  
  const levelIncrease = (level - 1) * 0.02;
  const maxBombRatio = isBossLevel ? 0.45 : 0.35;
  
  const bombRatio = Math.min(baseBombRatio + levelIncrease, maxBombRatio);
  return Math.floor(totalCells * bombRatio);
}

export function getBoardSize(level: number): number {
  return Math.min(5 + Math.floor((level - 1) / 2), 12);
}

export function calculateXP(score: number, diamondsFound: number): number {
  return Math.floor(score / 10) + diamondsFound * 5;
}

export function getPlayerLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXPForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100;
}

export function generateDailyMissions(): DailyMission[] {
  const missions = [
    {
      id: 'diamonds_10',
      title: 'Diamond Hunter',
      description: 'Find 10 diamonds without hitting a bomb',
      target: 10,
      reward: 500
    },
    {
      id: 'score_100k',
      title: 'High Roller',
      description: 'Earn 100,000 points in total today',
      target: 100000,
      reward: 1000
    },
    {
      id: 'games_5',
      title: 'Persistent Player',
      description: 'Play 5 games today',
      target: 5,
      reward: 300
    },
    {
      id: 'rare_diamonds_3',
      title: 'Rare Collector',
      description: 'Find 3 rare or super diamonds',
      target: 3,
      reward: 750
    }
  ];

  return missions.map(mission => ({
    ...mission,
    progress: 0,
    completed: false
  }));
}

export function generateAchievements(): Achievement[] {
  return [
    {
      id: 'first_diamond',
      title: 'First Steps',
      description: 'Find your first diamond',
      icon: '💎',
      unlocked: false,
      progress: 0,
      target: 1
    },
    {
      id: 'diamond_master',
      title: 'Diamond Master',
      description: 'Find 15 diamonds in a single game',
      icon: '👑',
      unlocked: false,
      progress: 0,
      target: 15
    },
    {
      id: 'high_scorer',
      title: 'High Scorer',
      description: 'Reach 50,000 points in one game',
      icon: '🏆',
      unlocked: false,
      progress: 0,
      target: 50000
    },
    {
      id: 'lucky_streak',
      title: 'Lucky Streak',
      description: 'Find 5 diamonds in a row without bombs',
      icon: '🍀',
      unlocked: false,
      progress: 0,
      target: 5
    },
    {
      id: 'bomb_dodger',
      title: 'Bomb Dodger',
      description: 'Play 10 games without hitting a bomb',
      icon: '🛡️',
      unlocked: false,
      progress: 0,
      target: 10
    },
    {
      id: 'collector',
      title: 'Collector',
      description: 'Collect 100 diamonds total',
      icon: '💰',
      unlocked: false,
      progress: 0,
      target: 100
    }
  ];
}

export function getAvailableSkins() {
  return [
    { id: 'default', name: 'Classic Diamond', icon: '💎', unlockScore: 0, unlocked: true },
    { id: 'ruby', name: 'Ruby Red', icon: '♦️', unlockScore: 10000, unlocked: false },
    { id: 'emerald', name: 'Emerald Green', icon: '💚', unlockScore: 25000, unlocked: false },
    { id: 'sapphire', name: 'Sapphire Blue', icon: '💙', unlockScore: 50000, unlocked: false },
    { id: 'rainbow', name: 'Rainbow Crystal', icon: '🌈', unlockScore: 100000, unlocked: false },
    { id: 'star', name: 'Stellar Diamond', icon: '⭐', unlockScore: 250000, unlocked: false }
  ];
}

export function playSound(type: 'click' | 'diamond' | 'bomb' | 'win' | 'rare') {
  // Create audio context for sound effects
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const createTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  switch (type) {
    case 'click':
      createTone(800, 0.1);
      break;
    case 'diamond':
      createTone(1200, 0.2);
      setTimeout(() => createTone(1600, 0.1), 50);
      break;
    case 'rare':
      createTone(1500, 0.3);
      setTimeout(() => createTone(1800, 0.2), 100);
      setTimeout(() => createTone(2200, 0.1), 200);
      break;
    case 'bomb':
      createTone(200, 0.5, 'sawtooth');
      break;
    case 'win':
      [523, 659, 784, 1047].forEach((freq, i) => {
        setTimeout(() => createTone(freq, 0.3), i * 100);
      });
      break;
  }
}

export function isBossLevel(level: number): boolean {
  return level % 5 === 0 && level > 0; // Every 5th level is a boss level
}