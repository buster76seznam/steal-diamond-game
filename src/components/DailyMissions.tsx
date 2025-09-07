import React from 'react';
import { DailyMission } from '../types/game';
import { CheckCircle, Circle, Gift } from 'lucide-react';

interface DailyMissionsProps {
  missions: DailyMission[];
  onClaimReward: (missionId: string) => void;
}

const DailyMissions: React.FC<DailyMissionsProps> = ({ missions, onClaimReward }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-center text-gray-800 flex items-center justify-center space-x-2">
        <Gift className="text-purple-600" size={24} />
        <span>Daily Missions</span>
      </h3>
      
      <div className="space-y-3">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              mission.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {mission.completed ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <Circle className="text-gray-400" size={20} />
                )}
                <div>
                  <div className="font-semibold text-gray-800">{mission.title}</div>
                  <div className="text-sm text-gray-600">{mission.description}</div>
                  <div className="text-xs text-purple-600 font-medium">
                    Reward: {mission.reward} points
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">
                  {mission.progress}/{mission.target}
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((mission.progress / mission.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            
            {mission.completed && (
              <button
                onClick={() => onClaimReward(mission.id)}
                className="mt-2 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
              >
                Claim Reward
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyMissions;