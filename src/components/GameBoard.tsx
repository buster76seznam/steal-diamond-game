import React from 'react';
import { Cell } from '../types/game';
import GameCell from './GameCell';

interface GameBoardProps {
  board: Cell[][];
  onCellClick: (row: number, col: number) => void;
  gameOver: boolean;
  skin: string;
  multiplier: number;
  isBossLevel?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  onCellClick, 
  gameOver, 
  skin, 
  multiplier,
  isBossLevel = false 
}) => {
  const boardSize = board.length;
  const riskLevel = Math.min(multiplier / 10, 1); // Risk increases with multiplier
  
  const boardBg = isBossLevel ? 'from-red-900 to-purple-900' : 
                 riskLevel > 0.7 ? 'from-red-800 to-red-900' :
                 riskLevel > 0.4 ? 'from-orange-800 to-orange-900' :
                 'from-slate-800 to-slate-900';
  
  return (
    <div className="relative">
      {isBossLevel && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-red-400 font-bold text-lg animate-pulse">
          👹 BOSS LEVEL 👹
        </div>
      )}
      <div 
        className={`grid gap-1 p-4 bg-gradient-to-br ${boardBg} rounded-xl shadow-2xl transition-all duration-500`}
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
          maxWidth: '600px',
          filter: riskLevel > 0.5 ? `hue-rotate(${riskLevel * 60}deg)` : 'none'
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <GameCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              onClick={() => onCellClick(rowIndex, colIndex)}
              disabled={gameOver}
              skin={skin}
              riskLevel={riskLevel}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;