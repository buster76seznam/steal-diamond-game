import React, { useState } from 'react';
import { Cell, CellType } from '../types/game';
import { Diamond, Bomb, Gem, Star } from 'lucide-react';

interface GameCellProps {
  cell: Cell;
  onClick: () => void;
  disabled: boolean;
  skin: string;
  riskLevel: number;
}

const GameCell: React.FC<GameCellProps> = ({ cell, onClick, disabled, skin, riskLevel }) => {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleClick = () => {
    if (disabled || cell.revealed || isFlipping) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      onClick();
      setIsFlipping(false);
    }, 150);
  };

  const getSkinIcon = (type: CellType) => {
    if (type === CellType.BOMB) {
      return <Bomb className="text-white" size={20} />;
    }

    switch (skin) {
      case 'ruby':
        return <div className="text-red-400 text-xl">♦️</div>;
      case 'emerald':
        return <div className="text-green-400 text-xl">💚</div>;
      case 'sapphire':
        return <div className="text-blue-400 text-xl">💙</div>;
      case 'rainbow':
        return <div className="text-xl animate-pulse">🌈</div>;
      case 'star':
        return <Star className="text-yellow-300" size={20} />;
      default:
        if (type === CellType.SUPER_DIAMOND) {
          return <Star className="text-purple-300 animate-spin" size={20} />;
        } else if (type === CellType.RARE_DIAMOND) {
          return <Gem className="text-pink-300 animate-pulse" size={20} />;
        }
        return <Diamond className="text-white" size={20} />;
    }
  };

  const getCellContent = () => {
    if (!cell.revealed && !isFlipping) {
      const riskColor = riskLevel > 0.7 ? 'from-red-400 to-red-600' : 
                       riskLevel > 0.4 ? 'from-orange-400 to-orange-600' : 
                       'from-blue-400 to-blue-600';
      
      return (
        <div className={`w-full h-full bg-gradient-to-br ${riskColor} rounded-lg shadow-lg flex items-center justify-center transform transition-all duration-200 hover:scale-105`}>
          <div className="text-white font-bold text-lg animate-pulse">?</div>
        </div>
      );
    }

    if (cell.type === CellType.BOMB) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg flex items-center justify-center animate-bounce">
          {getSkinIcon(cell.type)}
        </div>
      );
    } else {
      const bgColor = cell.type === CellType.SUPER_DIAMOND ? 'from-purple-400 to-purple-600' :
                     cell.type === CellType.RARE_DIAMOND ? 'from-pink-400 to-pink-600' :
                     'from-emerald-400 to-emerald-600';
      
      return (
        <div className={`w-full h-full bg-gradient-to-br ${bgColor} rounded-lg shadow-lg flex items-center justify-center animate-pulse`}>
          <div className="animate-bounce">
            {getSkinIcon(cell.type)}
          </div>
        </div>
      );
    }
  };

  return (
    <button
      className={`
        w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
        transition-all duration-200 
        ${!cell.revealed && !disabled ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
        ${isFlipping ? 'scale-95 rotate-12' : ''}
      `}
      onClick={handleClick}
      disabled={disabled || cell.revealed}
    >
      {getCellContent()}
    </button>
  );
};

export default GameCell;