import React from 'react';
import { Achievement } from '../types/game';
import { Award, Lock } from 'lucide-react';

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-center text-gray-800 flex items-center justify-center space-x-2">
        <Award className="text-yellow-600" size={24} />
        <span>Achievements ({unlockedCount}/{achievements.length})</span>
      </h3>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              achievement.unlocked 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {achievement.unlocked ? achievement.icon : <Lock className="text-gray-400" size={20} />}
              </div>
              <div className="flex-1">
                <div className={`font-semibold ${achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'}`}>
                  {achievement.title}
                </div>
                <div className="text-sm text-gray-600">{achievement.description}</div>
                {!achievement.unlocked && (
                  <div className="mt-1">
                    <div className="text-xs text-gray-500">
                      Progress: {achievement.progress}/{achievement.target}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div 
                        className="bg-yellow-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;