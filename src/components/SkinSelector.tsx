import React from 'react';
import { Skin } from '../types/game';
import { Palette, Lock } from 'lucide-react';

interface SkinSelectorProps {
  skins: Skin[];
  currentSkin: string;
  totalScore: number;
  onSkinSelect: (skinId: string) => void;
}

const SkinSelector: React.FC<SkinSelectorProps> = ({ 
  skins, 
  currentSkin, 
  totalScore, 
  onSkinSelect 
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-center text-gray-800 flex items-center justify-center space-x-2">
        <Palette className="text-purple-600" size={24} />
        <span>Diamond Skins</span>
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {skins.map((skin) => {
          const isUnlocked = totalScore >= skin.unlockScore;
          const isSelected = currentSkin === skin.id;
          
          return (
            <button
              key={skin.id}
              onClick={() => isUnlocked && onSkinSelect(skin.id)}
              disabled={!isUnlocked}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                isSelected 
                  ? 'border-purple-500 bg-purple-50' 
                  : isUnlocked
                  ? 'border-gray-200 hover:border-purple-300 bg-gray-50'
                  : 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {isUnlocked ? skin.icon : <Lock className="mx-auto text-gray-400" size={20} />}
                </div>
                <div className={`text-sm font-medium ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                  {skin.name}
                </div>
                {!isUnlocked && (
                  <div className="text-xs text-gray-500 mt-1">
                    Unlock at {skin.unlockScore.toLocaleString()} points
                  </div>
                )}
                {isSelected && (
                  <div className="text-xs text-purple-600 font-bold mt-1">
                    EQUIPPED
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SkinSelector;