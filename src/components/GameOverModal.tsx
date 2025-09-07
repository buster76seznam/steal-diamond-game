import React from 'react';
import { X, RotateCcw, Trophy, Target } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  score: number;
  diamondsFound: number;
  level: number;
  diamondsRemaining: number;
  isWin: boolean;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onClose,
  onNewGame,
  score,
  diamondsFound,
  level,
  diamondsRemaining,
  isWin
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-2xl font-bold ${isWin ? 'text-green-600' : 'text-red-600'}`}>
            {isWin ? '🎉 Victory!' : '💥 Game Over!'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Trophy className="text-yellow-600" size={20} />
              <span className="font-medium">Final Score</span>
            </div>
            <span className="font-bold text-lg">{score.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-xl">💎</span>
              <span className="font-medium">Diamonds Found</span>
            </div>
            <span className="font-bold text-lg">{diamondsFound}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Target className="text-purple-600" size={20} />
              <span className="font-medium">Level Reached</span>
            </div>
            <span className="font-bold text-lg">{level}</span>
          </div>
          
          {!isWin && diamondsRemaining > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-center">
                <div className="text-yellow-800 font-medium">So close!</div>
                <div className="text-sm text-yellow-700">
                  Only {diamondsRemaining} diamond{diamondsRemaining !== 1 ? 's' : ''} left to find!
                </div>
                <div className="text-xs text-yellow-600 mt-1">
                  Try again - you've got this! 💪
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={onNewGame}
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <RotateCcw size={20} />
            <span>New Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;