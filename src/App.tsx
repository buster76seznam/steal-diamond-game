import React, { useState, useCallback, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import HighScores from './components/HighScores';
import DailyMissions from './components/DailyMissions';
import Achievements from './components/Achievements';
import SkinSelector from './components/SkinSelector';
import GameOverModal from './components/GameOverModal';
import { Cell, CellType, GameState, PlayerData, DailyMission, Achievement } from './types/game';
import { 
  createBoard, 
  calculateScore, 
  getBombCount, 
  getBoardSize, 
  calculateXP,
  getPlayerLevel,
  generateDailyMissions,
  generateAchievements,
  getAvailableSkins,
  playSound,
  getDailyBonus,
  isBossLevel
} from './utils/gameUtils';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Play, HandCoins, RotateCcw, Gift, Settings } from 'lucide-react';

function App() {
  const [playerData, setPlayerData] = useLocalStorage<PlayerData>('steal-diamond-player', {
    totalScore: 0,
    gamesPlayed: 0,
    diamondsCollected: 0,
    xp: 0,
    level: 1,
    unlockedSkins: ['default'],
    currentSkin: 'default',
    achievements: generateAchievements(),
    dailyMissions: generateDailyMissions(),
    diamondCollection: []
  });

  const [highScores, setHighScores] = useLocalStorage<number[]>('steal-diamond-scores', []);
  
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  const [level, setLevel] = useState(1);
  const [diamondsFound, setDiamondsFound] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consecutiveDiamonds, setConsecutiveDiamonds] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  
  const boardSize = getBoardSize(level);
  const bombCount = getBombCount(level, boardSize, isBossLevel(level));
  const [board, setBoard] = useState<Cell[][]>(() => createBoard(boardSize, bombCount, isBossLevel(level)));

  const multiplier = Math.pow(1.2, diamondsFound);
  const totalDiamonds = boardSize * boardSize - bombCount;
  const diamondsRemaining = totalDiamonds - diamondsFound;

  // Reset daily missions if it's a new day
  useEffect(() => {
    const today = new Date().toDateString();
    const lastMissionDate = localStorage.getItem('last-mission-date');
    
    if (lastMissionDate !== today) {
      setPlayerData(prev => ({
        ...prev,
        dailyMissions: generateDailyMissions()
      }));
      localStorage.setItem('last-mission-date', today);
    }
  }, []);

  const updateAchievements = useCallback((newAchievements: Achievement[]) => {
    setPlayerData(prev => ({
      ...prev,
      achievements: newAchievements
    }));
  }, [setPlayerData]);

  const updateDailyMissions = useCallback((newMissions: DailyMission[]) => {
    setPlayerData(prev => ({
      ...prev,
      dailyMissions: newMissions
    }));
  }, [setPlayerData]);

  const checkAchievements = useCallback((score: number, diamonds: number, consecutive: number) => {
    const newAchievements = [...playerData.achievements];
    let hasNewAchievement = false;

    newAchievements.forEach(achievement => {
      if (!achievement.unlocked) {
        let progress = achievement.progress;
        
        switch (achievement.id) {
          case 'first_diamond':
            progress = Math.max(progress, diamonds > 0 ? 1 : 0);
            break;
          case 'diamond_master':
            progress = Math.max(progress, diamonds);
            break;
          case 'high_scorer':
            progress = Math.max(progress, score);
            break;
          case 'lucky_streak':
            progress = Math.max(progress, consecutive);
            break;
          case 'collector':
            progress = Math.max(progress, playerData.diamondsCollected + diamonds);
            break;
        }
        
        achievement.progress = progress;
        
        if (progress >= achievement.target && !achievement.unlocked) {
          achievement.unlocked = true;
          hasNewAchievement = true;
          playSound('win');
        }
      }
    });

    if (hasNewAchievement) {
      updateAchievements(newAchievements);
    }
  }, [playerData.achievements, playerData.diamondsCollected, updateAchievements]);

  const checkDailyMissions = useCallback((score: number, diamonds: number, rareDiamonds: number) => {
    const newMissions = [...playerData.dailyMissions];
    let hasProgress = false;

    newMissions.forEach(mission => {
      if (!mission.completed) {
        switch (mission.id) {
          case 'diamonds_10':
            if (diamonds >= 10) {
              mission.progress = Math.max(mission.progress, 1);
            }
            break;
          case 'score_100k':
            mission.progress = Math.min(mission.progress + score, mission.target);
            break;
          case 'games_5':
            // This will be updated when starting a new game
            break;
          case 'rare_diamonds_3':
            mission.progress = Math.min(mission.progress + rareDiamonds, mission.target);
            break;
        }
        
        if (mission.progress >= mission.target) {
          mission.completed = true;
          hasProgress = true;
        }
      }
    });

    if (hasProgress) {
      updateDailyMissions(newMissions);
    }
  }, [playerData.dailyMissions, updateDailyMissions]);

  const initializeGame = useCallback(() => {
    const newBoardSize = getBoardSize(level);
    const newBombCount = getBombCount(level, newBoardSize, isBossLevel(level));
    const newBoard = createBoard(newBoardSize, newBombCount, isBossLevel(level));
    
    setBoard(newBoard);
    setGameState(GameState.PLAYING);
    setShowStartScreen(false);
    setGameStartTime(Date.now());
  }, [level]);

  const startNewGame = () => {
    setLevel(1);
    setDiamondsFound(0);
    setCurrentScore(0);
    setConsecutiveDiamonds(0);
    setGameState(GameState.PLAYING);
    
    const newBoard = createBoard(5, getBombCount(1, 5));
    setBoard(newBoard);
    setShowStartScreen(false);
    setShowGameOverModal(false);
    setGameStartTime(Date.now());

    // Update games played for daily mission
    const newMissions = [...playerData.dailyMissions];
    const gamesPlayedMission = newMissions.find(m => m.id === 'games_5');
    if (gamesPlayedMission && !gamesPlayedMission.completed) {
      gamesPlayedMission.progress = Math.min(gamesPlayedMission.progress + 1, gamesPlayedMission.target);
      if (gamesPlayedMission.progress >= gamesPlayedMission.target) {
        gamesPlayedMission.completed = true;
      }
      updateDailyMissions(newMissions);
    }

    setPlayerData(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1
    }));
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    setDiamondsFound(0);
    setConsecutiveDiamonds(0);
    
    const newLevel = level + 1;
    const newBoardSize = getBoardSize(newLevel);
    const newBombCount = getBombCount(newLevel, newBoardSize, isBossLevel(newLevel));
    const newBoard = createBoard(newBoardSize, newBombCount, isBossLevel(newLevel));
    
    setBoard(newBoard);
    setGameState(GameState.PLAYING);
    
    if (isBossLevel(newLevel)) {
      playSound('win');
    }
  };

  const cashOut = () => {
    const finalScore = currentScore;
    const earnedXP = calculateXP(finalScore, diamondsFound);
    
    // Add to high scores
    const newHighScores = [...highScores, finalScore]
      .sort((a, b) => b - a)
      .slice(0, 10);
    setHighScores(newHighScores);
    
    // Update player data
    setPlayerData(prev => {
      const newTotalScore = prev.totalScore + finalScore;
      const newXP = prev.xp + earnedXP;
      const newLevel = getPlayerLevel(newXP);
      
      // Check for skin unlocks
      const availableSkins = getAvailableSkins();
      const newUnlockedSkins = [...prev.unlockedSkins];
      availableSkins.forEach(skin => {
        if (newTotalScore >= skin.unlockScore && !newUnlockedSkins.includes(skin.id)) {
          newUnlockedSkins.push(skin.id);
        }
      });
      
      return {
        ...prev,
        totalScore: newTotalScore,
        diamondsCollected: prev.diamondsCollected + diamondsFound,
        xp: newXP,
        level: newLevel,
        unlockedSkins: newUnlockedSkins
      };
    });
    
    // Check achievements and missions
    checkAchievements(finalScore, diamondsFound, consecutiveDiamonds);
    checkDailyMissions(finalScore, diamondsFound, 0); // TODO: Track rare diamonds
    
    setGameState(GameState.WON);
    playSound('win');
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameState !== GameState.PLAYING || board[row][col].revealed) return;

    playSound('click');

    const newBoard = board.map(boardRow => 
      boardRow.map(cell => ({ ...cell }))
    );
    
    newBoard[row][col].revealed = true;
    setBoard(newBoard);

    if (newBoard[row][col].type === CellType.BOMB) {
      setGameState(GameState.LOST);
      setShowGameOverModal(true);
      setConsecutiveDiamonds(0);
      playSound('bomb');
      
      // Shake effect
      document.body.style.animation = 'shake 0.5s';
      setTimeout(() => {
        document.body.style.animation = '';
      }, 500);
    } else {
      const newDiamondsFound = diamondsFound + 1;
      const newConsecutive = consecutiveDiamonds + 1;
      setDiamondsFound(newDiamondsFound);
      setConsecutiveDiamonds(newConsecutive);
      
      const scoreIncrease = calculateScore(newDiamondsFound, level, newBoard[row][col].type);
      setCurrentScore(scoreIncrease);

      // Play appropriate sound
      if (newBoard[row][col].type === CellType.SUPER_DIAMOND || newBoard[row][col].type === CellType.RARE_DIAMOND) {
        playSound('rare');
      } else {
        playSound('diamond');
      }

      // Check if all diamonds found
      if (newDiamondsFound >= totalDiamonds) {
        setTimeout(() => {
          nextLevel();
        }, 1000);
      }
    }
  };

  const claimMissionReward = (missionId: string) => {
    const mission = playerData.dailyMissions.find(m => m.id === missionId);
    if (mission && mission.completed) {
      setPlayerData(prev => ({
        ...prev,
        totalScore: prev.totalScore + mission.reward,
        dailyMissions: prev.dailyMissions.map(m => 
          m.id === missionId ? { ...m, completed: false, progress: 0 } : m
        )
      }));
      playSound('win');
    }
  };

  const selectSkin = (skinId: string) => {
    setPlayerData(prev => ({
      ...prev,
      currentSkin: skinId
    }));
  };

  if (showStartScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">💎</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Steal Diamond</h1>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Uncover diamonds, avoid bombs, and build your score! The more diamonds you find, 
              the higher your multiplier grows. Complete daily missions, unlock achievements, 
              and collect rare diamond skins!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <button
                onClick={startNewGame}
                className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <Play size={20} />
                <span>Start Playing</span>
              </button>
              
              <button
                onClick={() => setShowSettings(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <Settings size={20} />
                <span>Customize</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-sm">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="font-bold text-purple-800">Player Level</div>
                <div className="text-2xl font-bold text-purple-600">{playerData.level}</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="font-bold text-yellow-800">Total Score</div>
                <div className="text-2xl font-bold text-yellow-600">{playerData.totalScore.toLocaleString()}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="font-bold text-green-800">Diamonds Found</div>
                <div className="text-2xl font-bold text-green-600">{playerData.diamondsCollected}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="font-bold text-blue-800">Games Played</div>
                <div className="text-2xl font-bold text-blue-600">{playerData.gamesPlayed}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <HighScores localScores={highScores} />
            <DailyMissions missions={playerData.dailyMissions} onClaimReward={claimMissionReward} />
            <Achievements achievements={playerData.achievements} />
          </div>
        </div>

        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Customize Your Game</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <SkinSelector
                skins={getAvailableSkins().map(skin => ({
                  ...skin,
                  unlocked: playerData.unlockedSkins.includes(skin.id)
                }))}
                currentSkin={playerData.currentSkin}
                totalScore={playerData.totalScore}
                onSkinSelect={selectSkin}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
            <span>💎</span>
            <span>Steal Diamond</span>
            {isBossLevel(level) && <span className="text-red-400 animate-pulse">👹</span>}
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Game Area */}
          <div className="lg:col-span-3 space-y-6">
            <ScoreBoard 
              currentScore={currentScore}
              diamondsFound={diamondsFound}
              level={level}
              multiplier={multiplier}
              xp={playerData.xp}
              playerLevel={playerData.level}
              isBossLevel={isBossLevel(level)}
            />
            
            <div className="flex justify-center">
              <GameBoard 
                board={board}
                onCellClick={handleCellClick}
                gameOver={gameState !== GameState.PLAYING}
                skin={playerData.currentSkin}
                multiplier={multiplier}
                isBossLevel={isBossLevel(level)}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {gameState === GameState.PLAYING && diamondsFound > 0 && (
                <button
                  onClick={cashOut}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <HandCoins size={20} />
                  <span>Cash Out ({currentScore.toLocaleString()})</span>
                </button>
              )}
              
              <button
                onClick={startNewGame}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <RotateCcw size={20} />
                <span>New Game</span>
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>
            </div>

            {gameState === GameState.WON && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl text-center">
                <p className="font-bold text-lg">🎉 Victory! Score Saved!</p>
                <p>Final Score: {currentScore.toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <HighScores localScores={highScores} />
            <DailyMissions missions={playerData.dailyMissions} onClaimReward={claimMissionReward} />
            <Achievements achievements={playerData.achievements} />
            
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-white">
              <h4 className="font-bold mb-2 flex items-center space-x-2">
                <span>ℹ️</span>
                <span>How to Play</span>
              </h4>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Click tiles to find diamonds</li>
                <li>• Avoid bombs at all costs!</li>
                <li>• More diamonds = higher multiplier</li>
                <li>• Cash out anytime to save score</li>
                <li>• Complete daily missions for bonuses</li>
                <li>• Every 5th level is a boss level!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <GameOverModal
        isOpen={showGameOverModal}
        onClose={() => setShowGameOverModal(false)}
        onNewGame={startNewGame}
        score={currentScore}
        diamondsFound={diamondsFound}
        level={level}
        diamondsRemaining={diamondsRemaining}
        isWin={gameState === GameState.WON}
      />

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Game Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <SkinSelector
              skins={getAvailableSkins().map(skin => ({
                ...skin,
                unlocked: playerData.unlockedSkins.includes(skin.id)
              }))}
              currentSkin={playerData.currentSkin}
              totalScore={playerData.totalScore}
              onSkinSelect={selectSkin}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;