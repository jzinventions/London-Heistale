import React, { useState } from 'react';
import { SaveSlotData } from '../types/game';
import { audio } from '../services/audio';

interface SaveLoadModalProps {
  currentSaveState: Omit<SaveSlotData, 'slotId' | 'savedAt'>;
  slots: Record<string, SaveSlotData | null>;
  onSaveToSlot: (slotId: 'slot_0' | 'slot_1' | 'slot_2') => void;
  onLoadFromSlot: (slot: SaveSlotData) => void;
  onDeleteSlot: (slotId: 'slot_0' | 'slot_1' | 'slot_2') => void;
  onImportSave: (saveData: SaveSlotData) => void;
  onClose: () => void;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  currentSaveState,
  slots,
  onSaveToSlot,
  onLoadFromSlot,
  onDeleteSlot,
  onImportSave,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'SAVE' | 'LOAD' | 'TRANSFER'>('SAVE');
  const [importCode, setImportCode] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const slotKeys: ('slot_0' | 'slot_1' | 'slot_2')[] = ['slot_0', 'slot_1', 'slot_2'];

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleExport = (slot: SaveSlotData) => {
    try {
      const code = btoa(JSON.stringify(slot));
      navigator.clipboard.writeText(code);
      setFeedbackMsg('Save code copied to clipboard!');
      audio.playConfirm();
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch {
      setFeedbackMsg('Could not copy to clipboard.');
    }
  };

  const handleImportSubmit = () => {
    try {
      const parsed = JSON.parse(atob(importCode.trim())) as SaveSlotData;
      if (!parsed.currentNodeId || !parsed.profileAlias) {
        throw new Error('Invalid format');
      }
      onImportSave(parsed);
      audio.playSaveTwinkle();
      setFeedbackMsg('Save file successfully loaded!');
      setTimeout(() => onClose(), 1200);
    } catch {
      setFeedbackMsg('Invalid save code! Please check and retry.');
      audio.playDamage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm select-none">
      <div className="ut-box-accent w-full max-w-2xl bg-black p-6 flex flex-col gap-4 text-white relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-yellow-300 animate-star">⭐</span>
            <div>
              <h2 className="font-pixel text-sm text-yellow-400">UNDERTALE SAVE PROTOCOL</h2>
              <p className="font-pixel text-[9px] text-neutral-400">Hatton Garden Syndicate Files</p>
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 font-pixel text-xs border-b border-neutral-800 pb-2">
          <button
            onClick={() => {
              audio.playSelect();
              setActiveTab('SAVE');
            }}
            className={`px-3 py-1 cursor-pointer border ${
              activeTab === 'SAVE' ? 'bg-yellow-400 text-black border-yellow-400 font-bold' : 'border-neutral-700 text-neutral-300'
            }`}
          >
            SAVE GAME
          </button>
          <button
            onClick={() => {
              audio.playSelect();
              setActiveTab('LOAD');
            }}
            className={`px-3 py-1 cursor-pointer border ${
              activeTab === 'LOAD' ? 'bg-yellow-400 text-black border-yellow-400 font-bold' : 'border-neutral-700 text-neutral-300'
            }`}
          >
            LOAD GAME
          </button>
          <button
            onClick={() => {
              audio.playSelect();
              setActiveTab('TRANSFER');
            }}
            className={`px-3 py-1 cursor-pointer border ${
              activeTab === 'TRANSFER' ? 'bg-yellow-400 text-black border-yellow-400 font-bold' : 'border-neutral-700 text-neutral-300'
            }`}
          >
            EXPORT / IMPORT
          </button>
        </div>

        {feedbackMsg && (
          <div className="p-2 bg-neutral-900 border border-yellow-400 font-pixel text-[10px] text-yellow-300 text-center animate-pulse">
            {feedbackMsg}
          </div>
        )}

        {/* Slot Grid for Save & Load */}
        {(activeTab === 'SAVE' || activeTab === 'LOAD') && (
          <div className="flex flex-col gap-3">
            {slotKeys.map((slotKey, i) => {
              const slot = slots[slotKey];
              return (
                <div
                  key={slotKey}
                  className={`p-3 border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                    slot ? 'border-neutral-600 bg-neutral-950' : 'border-dashed border-neutral-800 bg-black'
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 font-pixel text-xs">
                      <span className="text-yellow-400 font-bold">FILE {i}</span>
                      {slot ? (
                        <>
                          <span className="text-white">{slot.profileAlias}</span>
                          <span className="text-neutral-400">LV {slot.lv}</span>
                          <span className="text-emerald-400 text-[10px]">£{slot.goldLootPounds.toLocaleString()}</span>
                        </>
                      ) : (
                        <span className="text-neutral-600">[EMPTY DOSSIER SLOT]</span>
                      )}
                    </div>
                    {slot && (
                      <div className="font-pixel text-[9px] text-neutral-400 flex items-center gap-4">
                        <span>📍 {slot.locationName}</span>
                        <span>⏱️ {formatTime(slot.playTimeSeconds)}</span>
                        <span>📅 {new Date(slot.savedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 font-pixel text-[10px]">
                    {activeTab === 'SAVE' && (
                      <button
                        onClick={() => {
                          audio.playSaveTwinkle();
                          onSaveToSlot(slotKey);
                          setFeedbackMsg(`FILE ${i} SAVED SUCCESSFULLY!`);
                          setTimeout(() => setFeedbackMsg(''), 2500);
                        }}
                        className="px-3 py-1.5 bg-yellow-400 text-black font-bold border border-white hover:bg-yellow-300 cursor-pointer"
                      >
                        [SAVE FILE {i}]
                      </button>
                    )}

                    {activeTab === 'LOAD' && slot && (
                      <button
                        onClick={() => {
                          audio.playConfirm();
                          onLoadFromSlot(slot);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-emerald-500 text-black font-bold border border-white hover:bg-emerald-400 cursor-pointer"
                      >
                        [LOAD FILE {i}]
                      </button>
                    )}

                    {slot && (
                      <>
                        <button
                          onClick={() => handleExport(slot)}
                          className="px-2 py-1.5 border border-neutral-600 hover:border-white text-neutral-300 cursor-pointer"
                          title="Export Save String"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => {
                            audio.playDamage();
                            onDeleteSlot(slotKey);
                          }}
                          className="px-2 py-1.5 border border-red-800 text-red-400 hover:bg-red-950 cursor-pointer"
                          title="Delete Save"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Current Session Summary */}
            <div className="mt-2 p-2.5 bg-neutral-900 border border-neutral-700 flex items-center justify-between font-pixel text-[10px] text-neutral-300">
              <span>CURRENT: {currentSaveState.profileAlias} (LV {currentSaveState.lv})</span>
              <span>LOCATION: {currentSaveState.locationName}</span>
              <span>PLAYTIME: {formatTime(currentSaveState.playTimeSeconds)}</span>
            </div>
          </div>
        )}

        {/* Transfer Tab (Export / Import) */}
        {activeTab === 'TRANSFER' && (
          <div className="flex flex-col gap-4 font-pixel text-xs">
            <div>
              <p className="text-yellow-400 mb-1 text-[11px]">IMPORT SAVED PROGRESS:</p>
              <p className="text-neutral-400 text-[9px] mb-2">
                Paste your encrypted save dossier code below to resume your game on any device.
              </p>
              <textarea
                value={importCode}
                onChange={e => setImportCode(e.target.value)}
                placeholder="Paste save code here..."
                rows={4}
                className="w-full bg-neutral-950 border border-neutral-700 p-2 text-[10px] font-mono text-white focus:outline-none focus:border-yellow-400"
              />
              <button
                onClick={handleImportSubmit}
                disabled={!importCode.trim()}
                className="mt-2 px-4 py-2 bg-yellow-400 text-black font-bold border border-white hover:bg-yellow-300 disabled:opacity-50 cursor-pointer text-xs"
              >
                [INJECT SAVE DOSSIER]
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
