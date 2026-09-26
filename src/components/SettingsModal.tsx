import React, { useState, useEffect } from 'react';
import { audio } from '../services/audio';

interface SettingsModalProps {
  crtEnabled: boolean;
  ditherEnabled: boolean;
  onToggleCrt: (val: boolean) => void;
  onToggleDither: (val: boolean) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  crtEnabled,
  ditherEnabled,
  onToggleCrt,
  onToggleDither,
  onClose
}) => {
  const currentVols = audio.getVolumes();
  const [bgmVol, setBgmVol] = useState<number>(currentVols.bgm * 100);
  const [sfxVol, setSfxVol] = useState<number>(currentVols.sfx * 100);
  const [voiceVol, setVoiceVol] = useState<number>(currentVols.voice * 100);
  const [realVoiceEnabled, setRealVoiceEnabled] = useState<boolean>(audio.getRealVoiceEnabled());
  const [isMuted, setIsMuted] = useState<boolean>(audio.getMuted());
  const [selectedJukeboxTrack, setSelectedJukeboxTrack] = useState<string>('menu');

  // Gamepad Detection State
  const [connectedGamepad, setConnectedGamepad] = useState<string>('No Gamepad Detected');
  const [vibrationSuccess, setVibrationSuccess] = useState<boolean>(false);

  useEffect(() => {
    const checkGamepads = () => {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      if (pads && pads[0]) {
        setConnectedGamepad(pads[0].id);
      } else {
        setConnectedGamepad('Keyboard / Mouse Active');
      }
    };
    checkGamepads();
    const interval = setInterval(checkGamepads, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBgmChange = (val: number) => {
    setBgmVol(val);
    audio.setVolumes(val / 100, sfxVol / 100, voiceVol / 100);
  };

  const handleSfxChange = (val: number) => {
    setSfxVol(val);
    audio.setVolumes(bgmVol / 100, val / 100, voiceVol / 100);
  };

  const handleVoiceChange = (val: number) => {
    setVoiceVol(val);
    audio.setVolumes(bgmVol / 100, sfxVol / 100, val / 100);
  };

  const handleRealVoiceToggle = () => {
    const next = !realVoiceEnabled;
    setRealVoiceEnabled(next);
    audio.setRealVoiceEnabled(next);
    if (next) {
      audio.speakDialogue("Real speech voice acting activated, mate.", 'arthur');
    }
  };

  const handleMuteToggle = () => {
    const next = !isMuted;
    setIsMuted(next);
    audio.setMute(next);
  };

  const handleTestVibration = () => {
    try {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      if (pads && pads[0] && (pads[0] as unknown as { vibrationActuator?: { playEffect: (type: string, opts: object) => void } }).vibrationActuator) {
        (pads[0] as unknown as { vibrationActuator: { playEffect: (type: string, opts: object) => void } }).vibrationActuator.playEffect('dual-rumble', {
          startDelay: 0,
          duration: 350,
          weakMagnitude: 0.8,
          strongMagnitude: 0.8
        });
        setVibrationSuccess(true);
        setTimeout(() => setVibrationSuccess(false), 2000);
      } else {
        audio.playDamage();
      }
    } catch {
      audio.playDamage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm select-none">
      <div className="ut-box w-full max-w-2xl bg-black p-6 flex flex-col gap-4 text-white max-h-[90vh] overflow-y-auto font-pixel">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚙️</span>
            <div>
              <h2 className="text-sm text-yellow-400">EXPANDED PS1 & AUDIO SETTINGS</h2>
              <p className="text-[9px] text-neutral-400">Real Voice Acting, Soundtrack Jukebox & Gamepad Config</p>
            </div>
          </div>
          <button
            onClick={() => {
              audio.playSelect();
              onClose();
            }}
            className="text-xs px-2 py-1 border border-neutral-600 hover:border-white cursor-pointer"
          >
            [X]
          </button>
        </div>

        {/* Section 1: Real Voice Acting & Character Speech */}
        <div className="p-3 border-2 border-yellow-400/60 bg-neutral-950 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-yellow-300 font-bold">REAL CHARACTER VOICE TALKING</p>
              <p className="text-[9px] text-neutral-400">British speech synthesis accents for Arthur, Dave, Dizzy & Vance.</p>
            </div>
            <button
              onClick={handleRealVoiceToggle}
              className={`px-3 py-1 border text-xs cursor-pointer ${
                realVoiceEnabled ? 'bg-yellow-400 text-black border-yellow-400 font-bold' : 'border-neutral-700 text-neutral-400'
              }`}
            >
              {realVoiceEnabled ? '[VOICE: ENABLED]' : '[VOICE: DISABLED]'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
            <button
              onClick={() => audio.speakDialogue("Rule number one, son: no shooters. We're craftsmen, not animals.", 'arthur')}
              className="p-1.5 border border-neutral-700 hover:border-yellow-400 text-[9px] text-left text-neutral-300 cursor-pointer"
            >
              🦊 Test Arthur &quot;The Fox&quot;
            </button>
            <button
              onClick={() => audio.speakDialogue("Nobody gets left for the Old Bailey. Not on my watch.", 'dave')}
              className="p-1.5 border border-neutral-700 hover:border-yellow-400 text-[9px] text-left text-neutral-300 cursor-pointer"
            >
              🦍 Test Big Dave
            </button>
            <button
              onClick={() => audio.speakDialogue("Hold onto your teeth! We are blowing through Blackfriars Bridge!", 'dizzy')}
              className="p-1.5 border border-neutral-700 hover:border-yellow-400 text-[9px] text-left text-neutral-300 cursor-pointer"
            >
              🏎️ Test Dizzy (Wheelman)
            </button>
            <button
              onClick={() => audio.speakDialogue("Oi! What you lot doing round the back of the deposit boxes at midnight?!", 'police')}
              className="p-1.5 border border-neutral-700 hover:border-yellow-400 text-[9px] text-left text-neutral-300 cursor-pointer"
            >
              👮 Test Constable Higgins
            </button>
          </div>
        </div>

        {/* Section 2: Soundtrack Jukebox (Different Themes) */}
        <div className="p-3 border border-neutral-800 bg-neutral-950 flex flex-col gap-2">
          <p className="text-yellow-400 text-[10px]">SOUNDTRACK JUKEBOX (PROCEDURAL COMPOSITIONS):</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[9px]">
            {[
              { id: 'menu', name: '🌧️ London Drizzle Noir' },
              { id: 'pub', name: '🍻 The Blind Beggar Folk' },
              { id: 'tension', name: '⚙️ Vault Infiltration' },
              { id: 'chase', name: '🚨 Siren Symphony Pursuit' },
              { id: 'overworld_rain', name: '🏙️ 3rd-Person Rain Walk' },
              { id: 'sad_ending', name: '💔 Heartbreaking Leitmotif' }
            ].map(trk => (
              <button
                key={trk.id}
                onClick={() => {
                  setSelectedJukeboxTrack(trk.id);
                  audio.playBGM(trk.id as 'menu' | 'tension' | 'chase' | 'sad_ending' | 'heist_quiet' | 'pub' | 'overworld_rain');
                }}
                className={`p-2 border text-left cursor-pointer transition-colors ${
                  selectedJukeboxTrack === trk.id ? 'border-yellow-400 bg-neutral-900 text-yellow-300 font-bold' : 'border-neutral-800 text-neutral-400'
                }`}
              >
                {trk.name}
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Audio Volumes */}
        <div className="flex flex-col gap-3 border-t border-neutral-800 pt-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-yellow-400 text-[10px]">VOLUME CONTROLS:</span>
            <button
              onClick={handleMuteToggle}
              className={`px-2 py-0.5 border text-[10px] cursor-pointer ${
                isMuted ? 'bg-red-600 text-white border-red-500' : 'border-neutral-700 text-neutral-300'
              }`}
            >
              {isMuted ? 'MUTED' : 'MUTE ALL'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] text-neutral-400">
                <span>MUSIC BGM:</span>
                <span>{Math.round(bgmVol)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bgmVol}
                onChange={e => handleBgmChange(Number(e.target.value))}
                className="accent-yellow-400 cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] text-neutral-400">
                <span>SFX & BLIPS:</span>
                <span>{Math.round(sfxVol)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sfxVol}
                onChange={e => handleSfxChange(Number(e.target.value))}
                className="accent-yellow-400 cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] text-neutral-400">
                <span>VOICE ACTING:</span>
                <span>{Math.round(voiceVol)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={voiceVol}
                onChange={e => handleVoiceChange(Number(e.target.value))}
                className="accent-yellow-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 4: PS1 Video Shaders */}
        <div className="flex flex-col gap-2 border-t border-neutral-800 pt-3 text-xs">
          <p className="text-yellow-400 text-[10px]">PS1 GRAPHICS & CRT SHADERS:</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 border border-neutral-800 bg-neutral-950 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white">CRT SCANLINES</p>
                <p className="text-[8px] text-neutral-500">1990s cathode ray lines</p>
              </div>
              <button
                onClick={() => onToggleCrt(!crtEnabled)}
                className={`px-2 py-0.5 border text-[10px] cursor-pointer ${
                  crtEnabled ? 'bg-yellow-400 text-black border-yellow-400 font-bold' : 'border-neutral-700 text-neutral-400'
                }`}
              >
                {crtEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="p-2 border border-neutral-800 bg-neutral-950 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white">16-BIT DITHERING</p>
                <p className="text-[8px] text-neutral-500">PS1 GPU color banding</p>
              </div>
              <button
                onClick={() => onToggleDither(!ditherEnabled)}
                className={`px-2 py-0.5 border text-[10px] cursor-pointer ${
                  ditherEnabled ? 'bg-yellow-400 text-black border-yellow-400 font-bold' : 'border-neutral-700 text-neutral-400'
                }`}
              >
                {ditherEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Section 5: Controller & Gamepad Diagnostics */}
        <div className="flex flex-col gap-2 border-t border-neutral-800 pt-3 text-xs">
          <p className="text-yellow-400 text-[10px]">CONTROLLER & GAMEPAD STATUS:</p>
          <div className="p-2.5 border border-neutral-800 bg-neutral-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🎮</span>
              <div>
                <p className="text-[10px] text-white truncate max-w-[280px]">{connectedGamepad}</p>
                <p className="text-[8px] text-neutral-500">Plug in USB/Bluetooth PS4, PS5, Xbox or Switch pad</p>
              </div>
            </div>
            <button
              onClick={handleTestVibration}
              className="px-2.5 py-1 border border-neutral-600 hover:border-yellow-400 text-[9px] cursor-pointer text-yellow-300"
            >
              {vibrationSuccess ? 'RUMBLE OK!' : 'TEST RUMBLE'}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="border-t border-neutral-800 pt-3 flex justify-end">
          <button
            onClick={() => {
              audio.playConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-yellow-400 text-black text-xs font-bold border border-white hover:bg-yellow-300 cursor-pointer"
          >
            [SAVE & CLOSE SETTINGS]
          </button>
        </div>
      </div>
    </div>
  );
};
