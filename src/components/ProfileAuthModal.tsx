import React, { useState } from 'react';
import { PlayerProfile } from '../types/game';
import { audio } from '../services/audio';

interface ProfileAuthModalProps {
  currentProfile: PlayerProfile | null;
  allProfiles: PlayerProfile[];
  onSelectProfile: (profile: PlayerProfile) => void;
  onCreateProfile: (profile: PlayerProfile) => void;
  onClose: () => void;
}

export const ProfileAuthModal: React.FC<ProfileAuthModalProps> = ({
  currentProfile,
  allProfiles,
  onSelectProfile,
  onCreateProfile,
  onClose
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGN_UP' | 'VIEW_DOSSIER'>(currentProfile ? 'VIEW_DOSSIER' : 'LOGIN');
  const [aliasInput, setAliasInput] = useState<string>('');
  const [pinInput, setPinInput] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<PlayerProfile['role']>('Mastermind');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🦊');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const AVATARS = ['🦊', '🦍', '🏎️', '💎', '🕵️', '🎩', '⚡', '☕'];
  const ROLES: PlayerProfile['role'][] = ['Mastermind', 'Safecracker', 'Getaway Driver', 'Inside Man'];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aliasInput.trim()) {
      setErrorMsg('Please enter a criminal alias/codename.');
      audio.playDamage();
      return;
    }

    if (allProfiles.some(p => p.alias.toLowerCase() === aliasInput.trim().toLowerCase())) {
      setErrorMsg('An operative with this codename is already on Scotland Yard\'s radar.');
      audio.playDamage();
      return;
    }

    const newProfile: PlayerProfile = {
      id: 'prof_' + Date.now(),
      alias: aliasInput.trim(),
      role: selectedRole,
      pinCode: pinInput.trim() || '0000',
      avatarIcon: selectedAvatar,
      createdAt: Date.now(),
      totalPlayTimeSeconds: 0,
      choicesMadeCount: 0,
      heistsCompleted: 0,
      unlockedAchievements: ['first_step']
    };

    onCreateProfile(newProfile);
    audio.playConfirm();
    setMode('VIEW_DOSSIER');
  };

  const handleLoginSubmit = (profile: PlayerProfile) => {
    if (profile.pinCode && profile.pinCode !== '0000') {
      const enteredPin = prompt(`Enter 4-digit security PIN for ${profile.alias}:`);
      if (enteredPin !== profile.pinCode) {
        audio.playDamage();
        alert('Incorrect PIN!');
        return;
      }
    }
    audio.playConfirm();
    onSelectProfile(profile);
    setMode('VIEW_DOSSIER');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm select-none">
      <div className="ut-box w-full max-w-xl bg-black p-6 flex flex-col gap-4 text-white relative">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h2 className="font-pixel text-sm text-yellow-400">SCOTLAND YARD CRIMINAL REGISTER</h2>
              <p className="font-pixel text-[9px] text-neutral-400">Metropolitan Police Special Branch Syndicate Dossier</p>
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

        {errorMsg && (
          <div className="p-2 bg-red-950 border border-red-500 font-pixel text-[10px] text-red-300">
            {errorMsg}
          </div>
        )}

        {/* View Active Profile */}
        {mode === 'VIEW_DOSSIER' && currentProfile && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4 p-4 border-2 border-yellow-400/80 bg-neutral-950">
              <div className="w-20 h-20 bg-neutral-900 border-2 border-white flex items-center justify-center text-4xl shrink-0">
                {currentProfile.avatarIcon}
              </div>
              <div className="flex-1 flex flex-col gap-1 font-pixel">
                <div className="flex items-center justify-between">
                  <span className="text-base text-yellow-300">{currentProfile.alias}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-yellow-400 text-black font-bold">
                    {currentProfile.role}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400">
                  Registered: {new Date(currentProfile.createdAt).toLocaleDateString()}
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] text-neutral-300">
                  <div>Choices Made: <span className="text-white font-bold">{currentProfile.choicesMadeCount}</span></div>
                  <div>Trophies: <span className="text-yellow-400 font-bold">{currentProfile.unlockedAchievements.length}</span></div>
                  <div>Heists Logged: <span className="text-white font-bold">{currentProfile.heistsCompleted}</span></div>
                  <div>PIN Security: <span className="text-emerald-400 font-bold">ENABLED</span></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  audio.playSelect();
                  setMode('LOGIN');
                }}
                className="px-3 py-2 border border-neutral-600 hover:border-white font-pixel text-xs cursor-pointer"
              >
                [SWITCH PROFILE / REGISTER NEW]
              </button>
              <button
                onClick={() => {
                  audio.playConfirm();
                  onClose();
                }}
                className="px-4 py-2 bg-yellow-400 text-black font-pixel text-xs font-bold border border-white hover:bg-yellow-300 cursor-pointer"
              >
                [CONFIRM OPERATIVE]
              </button>
            </div>
          </div>
        )}

        {/* Login Selection */}
        {mode === 'LOGIN' && (
          <div className="flex flex-col gap-4 font-pixel text-xs">
            <p className="text-yellow-400 text-[11px]">SELECT EXISTING OPERATIVE DOSSIER:</p>

            {allProfiles.length === 0 ? (
              <p className="text-neutral-500 text-[10px]">No criminal files registered yet.</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {allProfiles.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleLoginSubmit(p)}
                    className="p-3 border border-neutral-700 bg-neutral-950 hover:border-yellow-400 flex items-center justify-between cursor-pointer text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{p.avatarIcon}</span>
                      <div>
                        <p className="text-white font-bold">{p.alias}</p>
                        <p className="text-[9px] text-neutral-400">{p.role}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-yellow-300">[SELECT]</span>
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-neutral-800 pt-3 flex items-center justify-between">
              <button
                onClick={() => {
                  audio.playSelect();
                  setMode('SIGN_UP');
                  setErrorMsg('');
                }}
                className="px-4 py-2 bg-neutral-800 text-yellow-300 border border-neutral-600 hover:border-yellow-400 cursor-pointer text-xs"
              >
                + CREATE NEW DOSSIER (SIGN UP)
              </button>
              {currentProfile && (
                <button
                  onClick={() => setMode('VIEW_DOSSIER')}
                  className="px-3 py-1 border border-neutral-700 text-neutral-400 hover:text-white"
                >
                  Back
                </button>
              )}
            </div>
          </div>
        )}

        {/* Sign-Up / Register Form */}
        {mode === 'SIGN_UP' && (
          <form onSubmit={handleRegister} className="flex flex-col gap-3 font-pixel text-xs">
            <div>
              <label className="block text-yellow-400 mb-1 text-[10px]">OPERATIVE CODENAME / ALIAS:</label>
              <input
                type="text"
                value={aliasInput}
                onChange={e => setAliasInput(e.target.value)}
                placeholder="e.g. Tommy Fingers, Southwark Jack"
                maxLength={20}
                className="w-full bg-neutral-950 border border-neutral-700 p-2 text-white focus:outline-none focus:border-yellow-400 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-yellow-400 mb-1 text-[10px]">4-DIGIT SECURITY PIN (OPTIONAL):</label>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="0000"
                className="w-full bg-neutral-950 border border-neutral-700 p-2 text-white focus:outline-none focus:border-yellow-400 text-xs tracking-widest"
              />
            </div>

            <div>
              <label className="block text-yellow-400 mb-1 text-[10px]">CREW SPECIALTY / ROLE:</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(role => (
                  <button
                    type="button"
                    key={role}
                    onClick={() => {
                      audio.playSelect();
                      setSelectedRole(role);
                    }}
                    className={`p-2 border text-left cursor-pointer text-[10px] ${
                      selectedRole === role ? 'border-yellow-400 bg-neutral-900 text-yellow-300 font-bold' : 'border-neutral-800 text-neutral-400'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-yellow-400 mb-1 text-[10px]">8-BIT AVATAR ICON:</label>
              <div className="flex items-center gap-2">
                {AVATARS.map(icon => (
                  <button
                    type="button"
                    key={icon}
                    onClick={() => {
                      audio.playSelect();
                      setSelectedAvatar(icon);
                    }}
                    className={`w-10 h-10 border text-xl flex items-center justify-center cursor-pointer ${
                      selectedAvatar === icon ? 'border-yellow-400 bg-neutral-900' : 'border-neutral-800'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-800 pt-3 flex items-center justify-between mt-2">
              <button
                type="button"
                onClick={() => setMode('LOGIN')}
                className="px-3 py-1.5 border border-neutral-700 text-neutral-400 hover:text-white cursor-pointer text-[10px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 text-black font-bold border border-white hover:bg-yellow-300 cursor-pointer text-xs"
              >
                [REGISTER DOSSIER]
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
