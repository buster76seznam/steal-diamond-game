import React, { useState } from 'react';
import { Crown, Medal, Globe, User } from 'lucide-react';

interface HighScoresProps {
  localScores: number[];
  playerName?: string;
}

const HighScores: React.FC<HighScoresProps> = ({ localScores, playerName = "You" }) => {
  const [viewMode, setViewMode] = useState<'local' | 'global'>('local');
  
  // Simulate global leaderboard with cumulative scores
  const playerTotalScore = localScores.reduce((sum, score) => sum + score, 0);
  
  const globalScores = [
    { name: "DiamondKing", score: 5200000 },
    { name: "BombDodger", score: 4800000 },
    { name: "CrystalHunter", score: 4200000 },
    { name: "GemMaster", score: 3800000 },
    { name: "LuckyMiner", score: 3400000 },
    { name: "RiskTaker", score: 3000000 },
    { name: "DiamondHunter", score: 2800000 },
    { name: "SafePlayer", score: 2600000 },
    { name: "BoldGamer", score: 2400000 },
    { name: "CrystalSeeker", score: 2200000 },
    { name: "TreasureHunter", score: 2000000 },
    { name: "GemCollector", score: 1900000 },
    { name: "DiamondMiner", score: 1800000 },
    { name: "CrystalMaster", score: 1700000 },
    { name: "BombExpert", score: 1600000 },
    { name: "LuckyGamer", score: 1500000 },
    { name: "RiskMaster", score: 1400000 },
    { name: "DiamondPro", score: 1300000 },
    { name: "CrystalPro", score: 1200000 },
    { name: "GemHunter", score: 1100000 },
    { name: "TreasurePro", score: 1000000 },
    { name: "DiamondAce", score: 950000 },
    { name: "CrystalAce", score: 900000 },
    { name: "GemAce", score: 850000 },
    { name: "BombDodgerPro", score: 800000 },
    { name: "LuckyAce", score: 750000 },
    { name: "RiskAce", score: 700000 },
    { name: "DiamondStar", score: 650000 },
    { name: "CrystalStar", score: 600000 },
    { name: "GemStar", score: 550000 },
    { name: "TreasureStar", score: 500000 },
    { name: "DiamondRookie", score: 450000 },
    { name: "CrystalRookie", score: 400000 },
    { name: "GemRookie", score: 350000 },
    { name: "BombRookie", score: 300000 },
    { name: "LuckyRookie", score: 250000 },
    { name: "RiskRookie", score: 200000 },
    { name: "DiamondNewbie", score: 150000 },
    { name: "CrystalNewbie", score: 100000 },
    { name: "GemNewbie", score: 75000 },
    { name: "TreasureNewbie", score: 50000 },
    { name: "Beginner1", score: 40000 },
    { name: "Beginner2", score: 30000 },
    { name: "Beginner3", score: 20000 },
    { name: "Beginner4", score: 15000 },
    { name: "Beginner5", score: 10000 },
    { name: "Beginner6", score: 5000 },
    { name: "Beginner7", score: 2500 },
    { name: "Beginner8", score: 1000 },
    { name: "Beginner9", score: 500 },
    ...(playerTotalScore > 0 ? [{ name: playerName, score: playerTotalScore }] : [])
  ].sort((a, b) => b.score - a.score).slice(0, 50);

  const currentScores = viewMode === 'local' 
    ? localScores.map(score => ({ name: playerName, score }))
    : globalScores;

  if (viewMode === 'local' && localScores.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex justify-center space-x-2 mb-4">
          <button
            onClick={() => setViewMode('local')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'local' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <User size={16} className="inline mr-1" />
            Local
          </button>
          <button
            onClick={() => setViewMode('global')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'global' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Globe size={16} className="inline mr-1" />
            Global
          </button>
        </div>
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800">🏆 Leaderboard</h3>
        <p className="text-gray-600 text-center">No scores yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex justify-center space-x-2 mb-4">
        <button
          onClick={() => setViewMode('local')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'local' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <User size={16} className="inline mr-1" />
          Local
        </button>
        <button
          onClick={() => setViewMode('global')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === 'global' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          <Globe size={16} className="inline mr-1" />
          Global
        </button>
      </div>
      
      <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
        🏆 {viewMode === 'local' ? 'Your Best' : 'Global'} Scores
      </h3>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {currentScores.map((entry, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg ${
              index === 0 
                ? 'bg-gradient-to-r from-yellow-100 to-yellow-200' 
                : index === 1
                ? 'bg-gradient-to-r from-gray-100 to-gray-200'
                : index === 2
                ? 'bg-gradient-to-r from-orange-100 to-orange-200'
                : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              {index === 0 && <Crown className="text-yellow-600" size={20} />}
              {index === 1 && <Medal className="text-gray-600" size={20} />}
              {index === 2 && <Medal className="text-orange-600" size={20} />}
              {index > 2 && <span className="text-gray-500 font-bold w-5 text-center">{index + 1}</span>}
              <div>
                <span className="font-semibold text-gray-800">
                  {entry.name}
                </span>
                {viewMode === 'global' && entry.name === playerName && (
                  <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    YOU
                  </span>
                )}
              </div>
            </div>
            <span className="font-bold text-lg text-gray-800">{entry.score.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighScores;