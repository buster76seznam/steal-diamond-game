import React, { useState, useEffect } from 'react';
import { Trophy, Star, Target, Zap } from 'lucide-react';

interface ScoreBoardProps {
  currentScore: number;
  diamondsFound: number;
  level: number;
  multiplier: number;
  xp: number;
  playerLevel: number;
  isBossLevel?: boolean;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  currentScore, 
  diamondsFound, 
  level, 
  multiplier,
  xp,
  playerLevel,
  isBossLevel = false
}) => {
  const [animateScore, setAnimateScore] = useState(false);
  const [prevScore, setPrevScore] = useState(currentScore);

  useEffect(() => {
    if (currentScore > prevScore) {
      setAnimateScore(true);
      setTimeout(() => setAnimateScore(false), 500);
    }
    setPrevScore(currentScore);
  }, [currentScore, prevScore]);

  const riskLevel = Math.min(multiplier / 10, 1);
  const bgColor = isBossLevel ? 'from-red-600 to-purple-600' :
                 riskLevel > 0.7 ? 'from-red-500 to-orange-600' :
                 riskLevel > 0.4 ? 'from-orange-500 to-yellow-600' :
                 'from-purple-600 to-blue-600';

  return (
    <div className={`bg-gradient-to-r ${bgColor} rounded-xl p-6 text-white shadow-2xl transition-all duration-500`}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <Trophy className="mx-auto mb-2 text-yellow-300" size={24} />
          <div className={`text-2xl font-bold transition-all duration-300 ${animateScore ? 'scale-125 text-yellow-300' : ''}`}>
            {currentScore.toLocaleString()}
          </div>
          <div className="text-sm opacity-80">Score</div>
        </div>
        
        <div className="text-center">
          <Star className="mx-auto mb-2 text-emerald-300" size={24} />
          <div className="text-2xl font-bold">{diamondsFound}</div>
          <div className="text-sm opacity-80">Diamonds</div>
        </div>
        
        <div className="text-center">
          <Target className="mx-auto mb-2 text-pink-300" size={24} />
          <div className="text-2xl font-bold">{level}</div>
          <div className="text-sm opacity-80">Level</div>
        </div>
        
        <div className="text-center">
          <div className="text-yellow-300 text-2xl font-bold mx-auto mb-2">×</div>
          <div className={`text-2xl font-bold ${multiplier > 5 ? 'animate-pulse text-yellow-300' : ''}`}>
            {multiplier.toFixed(1)}
          </div>
          <div className="text-sm opacity-80">Multiplier</div>
        </div>

        <div className="text-center">
          <Zap className="mx-auto mb-2 text-cyan-300" size={24} />
          <div className="text-2xl font-bold">L{playerLevel}</div>
          <div className="text-sm opacity-80">Player</div>
        </div>
      </div>
      
      {riskLevel > 0.5 && (
        <div className="mt-4 text-center">
          <div className="text-sm opacity-90 animate-pulse">
            ⚠️ High Risk Zone - {Math.round(riskLevel * 100)}% danger level!
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;