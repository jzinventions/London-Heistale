import React from 'react';
import { ACHIEVEMENTS_LIST } from '../data/achievements';
import { audio } from '../services/audio';

interface AchievementsModalProps {
  unlockedIds: string[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ unlockedIds, onClose }) => {
  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS_LIST.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm select-none">
      <div className="ut-box w-full max-w-3xl bg-black p-6 flex flex-col gap-4 text-white max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-yellow-400">🏆</span>
            <div>
              <h2 className="font-pixel text-sm text-yellow-400">HEIST ACHIEVEMENTS & RECORDS</h2>
              <p className="font-pixel text-[9px] text-neutral-400">
                {unlockedCount} OF {totalCount} TROPHIES UNLOCKED ({Math.round((unlockedCount / totalCount) * 100)}%)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              audio.playSelect();
              onClose();
            }}
            className="font-pixel text-xs px-2 py-1 border border-neutral-600 hover:border-white cursor-pointer"
          >
            [X]
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-neutral-900 border border-neutral-700">
          <div
            className="h-full bg-yellow-400 transition-all duration-300"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>

        {/* Grid of Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1 max-h-[60vh]">
          {ACHIEVEMENTS_LIST.map(ach => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-3 border-2 flex items-start gap-3 transition-colors ${
                  isUnlocked
                    ? 'border-yellow-400/80 bg-neutral-950 shadow-[0_0_8px_rgba(234,179,8,0.2)]'
                    : 'border-neutral-800 bg-black opacity-50'
                }`}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center text-2xl border shrink-0 ${
                    isUnlocked ? 'border-yellow-400 bg-neutral-900' : 'border-neutral-800 bg-neutral-950 grayscale'
                  }`}
                >
                  {isUnlocked ? ach.icon : '🔒'}
                </div>
                <div className="flex-1 flex flex-col gap-1 font-pixel">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] ${isUnlocked ? 'text-yellow-300 font-bold' : 'text-neutral-500'}`}>
                      {ach.title}
                    </span>
                    {isUnlocked && <span className="text-[9px] text-emerald-400">UNLOCKED</span>}
                  </div>
                  <p className="text-[9px] text-neutral-300 leading-relaxed">
                    {ach.description}
                  </p>
                  {isUnlocked && ach.quote && (
                    <p className="text-[8px] text-neutral-400 italic pt-1 border-t border-neutral-900">
                      {ach.quote}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <div className="border-t border-neutral-800 pt-3 flex justify-end">
          <button
            onClick={() => {
              audio.playConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-yellow-400 text-black font-pixel text-xs font-bold border border-white hover:bg-yellow-300 cursor-pointer"
          >
            [CLOSE DOSSIER]
          </button>
        </div>
      </div>
    </div>
  );
};
