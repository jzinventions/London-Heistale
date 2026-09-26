/**
 * LONDON HEISTALE: The Hatton Garden Robbery
 * An Undertale-inspired PS1 retro interactive game with authentic 8-bit sounds,
 * real speech character voice acting, branching choices, bullet-dodge combat,
 * PS1 3rd-person walk-around overworld with controller/gamepad support,
 * and a heartbreaking sad ending in the London rain.
 */

import { useState, useEffect } from 'react';
import {
  GameScreen,
  PlayerProfile,
  SaveSlotData,
  InventoryItem,
  StoryChoice,
  BattleEnemy
} from './types/game';
import { STORY_NODES, STORY_IMAGES, STARTING_INVENTORY } from './data/storyTree';
import { BATTLE_ENEMIES } from './data/battleEnemies';
import { audio } from './services/audio';
import { BootSequence } from './components/BootSequence';
import { OverworldWalk } from './components/OverworldWalk';
import { DialogueBox } from './components/DialogueBox';
import { BattleArena } from './components/BattleArena';
import { SaveLoadModal } from './components/SaveLoadModal';
import { ProfileAuthModal } from './components/ProfileAuthModal';
import { AchievementsModal } from './components/AchievementsModal';
import { CutsceneViewer } from './components/CutsceneViewer';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  // Visual & Retro PS1 Display Toggles
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [ditherEnabled, setDitherEnabled] = useState<boolean>(true);

  // Screen state starts with authentic PS1 / EA boot sequence
  const [screen, setScreen] = useState<GameScreen>('BOOT_SEQUENCE');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Profile & Accounts Management
  const [profiles, setProfiles] = useState<PlayerProfile[]>(() => {
    try {
      const saved = localStorage.getItem('heist_profiles_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'prof_default',
        alias: "Tommy 'Fingers' Clarke",
        role: 'Mastermind',
        pinCode: '0000',
        avatarIcon: '🦊',
        createdAt: Date.now(),
        totalPlayTimeSeconds: 120,
        choicesMadeCount: 0,
        heistsCompleted: 0,
        unlockedAchievements: ['first_step']
      }
    ];
  });

  const [activeProfile, setActiveProfile] = useState<PlayerProfile>(() => {
    return profiles[0] || {
      id: 'prof_default',
      alias: "Tommy 'Fingers' Clarke",
      role: 'Mastermind',
      pinCode: '0000',
      avatarIcon: '🦊',
      createdAt: Date.now(),
      totalPlayTimeSeconds: 0,
      choicesMadeCount: 0,
      heistsCompleted: 0,
      unlockedAchievements: ['first_step']
    };
  });

  // Save Slots State
  const [saveSlots, setSaveSlots] = useState<Record<string, SaveSlotData | null>>(() => {
    try {
      const saved = localStorage.getItem('heist_save_slots_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      slot_0: null,
      slot_1: null,
      slot_2: null,
      auto: null
    };
  });

  // Game Gameplay State
  const [currentNodeId, setCurrentNodeId] = useState<string>('node_start');
  const [hp, setHp] = useState<number>(20);
  const [maxHp] = useState<number>(20);
  const [lv, setLv] = useState<number>(1);
  const [exp, setExp] = useState<number>(0);
  const [goldLoot, setGoldLoot] = useState<number>(0);
  const [suspicion, setSuspicion] = useState<number>(10);
  const [crewTrust, setCrewTrust] = useState<number>(85);
  const [karma, setKarma] = useState<number>(0);
  const [inventory, setInventory] = useState<InventoryItem[]>(STARTING_INVENTORY);
  const [choicesHistory, setChoicesHistory] = useState<string[]>([]);
  const [activeEnemy, setActiveEnemy] = useState<BattleEnemy | null>(null);

  // Real-time Play Session Timer
  const [playTimeSeconds, setPlayTimeSeconds] = useState<number>(0);

  // Sound Muted quick state
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Sync Profiles to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('heist_profiles_v1', JSON.stringify(profiles));
    } catch {}
  }, [profiles]);

  // Sync Save Slots to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('heist_save_slots_v1', JSON.stringify(saveSlots));
    } catch {}
  }, [saveSlots]);

  // Playtime tick loop
  useEffect(() => {
    const timer = setInterval(() => {
      if (screen === 'STORY' || screen === 'BATTLE' || screen === 'INTRO_CUTSCENE' || screen === 'OVERWORLD_WALK') {
        setPlayTimeSeconds(prev => prev + 1);
        setActiveProfile(prev => ({
          ...prev,
          totalPlayTimeSeconds: prev.totalPlayTimeSeconds + 1
        }));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [screen]);

  // Title Screen Music
  useEffect(() => {
    if (screen === 'TITLE') {
      audio.playBGM('menu');
    }
  }, [screen]);

  // Unlock Achievement helper
  const unlockAchievement = (achId: string) => {
    if (!activeProfile.unlockedAchievements.includes(achId)) {
      audio.playSaveTwinkle();
      const updated = [...activeProfile.unlockedAchievements, achId];
      setActiveProfile(prev => ({ ...prev, unlockedAchievements: updated }));
      setProfiles(prev =>
        prev.map(p => (p.id === activeProfile.id ? { ...p, unlockedAchievements: updated } : p))
      );
    }
  };

  // Node resolution
  const currentNode = STORY_NODES[currentNodeId] || STORY_NODES['node_start'];

  // Start New Game
  const handleStartNewGame = () => {
    audio.playConfirm();
    setCurrentNodeId('node_start');
    setHp(20);
    setLv(1);
    setExp(0);
    setGoldLoot(0);
    setSuspicion(10);
    setCrewTrust(85);
    setKarma(0);
    setInventory(STARTING_INVENTORY);
    setChoicesHistory([]);
    setScreen('INTRO_CUTSCENE');
  };

  // Handle Player Selecting a Story Choice
  const handleSelectChoice = (choice: StoryChoice) => {
    // Stat adjustments
    if (choice.karmaChange) setKarma(prev => prev + (choice.karmaChange || 0));
    if (choice.suspicionChange) setSuspicion(prev => Math.max(0, Math.min(100, prev + (choice.suspicionChange || 0))));
    if (choice.crewTrustChange) setCrewTrust(prev => Math.max(0, Math.min(100, prev + (choice.crewTrustChange || 0))));
    if (choice.lootChange) setGoldLoot(prev => prev + (choice.lootChange || 0));
    if (choice.givesItem) {
      setInventory(prev => [...prev, choice.givesItem!]);
    }
    if (choice.unlockAchievementId) {
      unlockAchievement(choice.unlockAchievementId);
    }

    // Choices tally
    setChoicesHistory(prev => [...prev, choice.id]);
    setActiveProfile(prev => ({
      ...prev,
      choicesMadeCount: prev.choicesMadeCount + 1
    }));

    if (activeProfile.choicesMadeCount >= 30) {
      unlockAchievement('centurion_choices');
    }

    handleAutoSave(choice.targetNodeId);

    const nextNode = STORY_NODES[choice.targetNodeId];
    if (nextNode) {
      if (nextNode.battleEncounterId && BATTLE_ENEMIES[nextNode.battleEncounterId]) {
        setActiveEnemy({ ...BATTLE_ENEMIES[nextNode.battleEncounterId] });
        setScreen('BATTLE');
        setCurrentNodeId(choice.targetNodeId);
      } else if (nextNode.isEnding) {
        unlockAchievement('sad_ending_reached');
        setCurrentNodeId(choice.targetNodeId);
        setScreen('SAD_ENDING');
      } else {
        setCurrentNodeId(choice.targetNodeId);
        if (nextNode.act >= 4) {
          audio.playBGM('chase');
        } else if (nextNode.act >= 2) {
          audio.playBGM('tension');
        } else {
          audio.playBGM('heist_quiet');
        }
      }
    }
  };

  const handleAutoSave = (targetNodeId: string) => {
    const node = STORY_NODES[targetNodeId];
    const autoSlot: SaveSlotData = {
      slotId: 'auto',
      profileId: activeProfile.id,
      profileAlias: activeProfile.alias,
      savedAt: Date.now(),
      currentNodeId: targetNodeId,
      locationName: node ? node.location : 'Hatton Garden',
      actNumber: node ? node.act : 0,
      playTimeSeconds,
      hp,
      maxHp,
      lv,
      exp,
      goldLootPounds: goldLoot,
      suspicionLevel: suspicion,
      crewTrust,
      karmaScore: karma,
      inventory,
      choicesHistory
    };
    setSaveSlots(prev => ({ ...prev, auto: autoSlot }));
  };

  const handleSaveToSlot = (slotId: 'slot_0' | 'slot_1' | 'slot_2') => {
    const saveData: SaveSlotData = {
      slotId,
      profileId: activeProfile.id,
      profileAlias: activeProfile.alias,
      savedAt: Date.now(),
      currentNodeId,
      locationName: currentNode.location,
      actNumber: currentNode.act,
      playTimeSeconds,
      hp,
      maxHp,
      lv,
      exp,
      goldLootPounds: goldLoot,
      suspicionLevel: suspicion,
      crewTrust,
      karmaScore: karma,
      inventory,
      choicesHistory
    };
    setSaveSlots(prev => ({ ...prev, [slotId]: saveData }));
    unlockAchievement('determination');
  };

  const handleLoadFromSlot = (slot: SaveSlotData) => {
    setCurrentNodeId(slot.currentNodeId);
    setHp(slot.hp);
    setLv(slot.lv);
    setExp(slot.exp);
    setGoldLoot(slot.goldLootPounds);
    setSuspicion(slot.suspicionLevel);
    setCrewTrust(slot.crewTrust);
    setKarma(slot.karmaScore);
    setInventory(slot.inventory);
    setChoicesHistory(slot.choicesHistory);
    setPlayTimeSeconds(slot.playTimeSeconds);

    const targetProfile = profiles.find(p => p.id === slot.profileId);
    if (targetProfile) setActiveProfile(targetProfile);

    setScreen('STORY');
    audio.playBGM(slot.actNumber >= 4 ? 'chase' : slot.actNumber >= 2 ? 'tension' : 'heist_quiet');
  };

  const handleDeleteSlot = (slotId: 'slot_0' | 'slot_1' | 'slot_2') => {
    setSaveSlots(prev => ({ ...prev, [slotId]: null }));
  };

  const handleBattleEnd = (result: 'spared' | 'defeated' | 'fled', remainingHp: number) => {
    setHp(remainingHp);
    if (result === 'spared') {
      setKarma(prev => prev + 25);
      unlockAchievement('pacifist_bobby');
    } else if (result === 'defeated') {
      setKarma(prev => prev - 25);
      setLv(prev => prev + 1);
      setExp(prev => prev + 50);
    }
    unlockAchievement('undertale_heart');

    setScreen('STORY');
    if (activeEnemy?.id === 'enemy_higgins') {
      setCurrentNodeId('node_act1_post_higgins');
    } else if (activeEnemy?.id === 'enemy_vance') {
      setCurrentNodeId('node_act6_post_battle');
    }
    setActiveEnemy(null);
  };

  const formatClock = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`min-h-screen w-full bg-black text-white relative font-pixel flex flex-col justify-between overflow-x-hidden ${
        crtEnabled ? 'crt-overlay crt-vignette' : ''
      } ${ditherEnabled ? 'ps1-dither' : ''}`}
    >
      {/* ======================================================== */}
      {/* 0. BOOT SEQUENCE SCREEN (EA PARODY + PS1 CHIME + WARNING) */}
      {/* ======================================================== */}
      {screen === 'BOOT_SEQUENCE' && (
        <BootSequence onBootComplete={() => setScreen('TITLE')} />
      )}

      {/* ======================================================== */}
      {/* TOP BAR CONTRACT: Exactly 3 Zones                        */}
      {/* ======================================================== */}
      {screen !== 'BOOT_SEQUENCE' && (
        <header className="w-full border-b border-neutral-800 bg-black/95 backdrop-blur z-30 px-4 md:px-8 py-3 flex items-center justify-between">
          {/* Zone 1: Wordmark display */}
          <button
            onClick={() => {
              audio.playSelect();
              setScreen('TITLE');
            }}
            className="text-sm md:text-base font-bold tracking-tight text-white hover:text-yellow-400 cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-red-500 animate-soul">❤️</span>
            <span>LONDON HEISTALE</span>
          </button>

          {/* Zone 2: Clean unboxed navigation links */}
          <nav className="hidden md:flex items-center gap-5 text-xs text-neutral-400 font-pixel">
            <button
              onClick={() => {
                audio.playSelect();
                setScreen('OVERWORLD_WALK');
              }}
              className={`hover:text-yellow-300 transition-colors cursor-pointer whitespace-nowrap ${
                screen === 'OVERWORLD_WALK' ? 'text-yellow-300 font-bold' : ''
              }`}
            >
              🎮 3D Street Walk
            </button>
            <button
              onClick={() => {
                audio.playSelect();
                if (screen === 'TITLE' || screen === 'OVERWORLD_WALK') setScreen('STORY');
              }}
              className={`hover:text-yellow-300 transition-colors cursor-pointer whitespace-nowrap ${
                screen === 'STORY' ? 'text-yellow-300 font-bold' : ''
              }`}
            >
              Story Mode
            </button>
            <button
              onClick={() => {
                audio.playSelect();
                setShowProfileModal(true);
              }}
              className="hover:text-yellow-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              Dossier ({activeProfile.alias.split(' ')[0]})
            </button>
            <button
              onClick={() => {
                audio.playSelect();
                setShowSaveModal(true);
              }}
              className="hover:text-yellow-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              Save Files
            </button>
            <button
              onClick={() => {
                audio.playSelect();
                setShowAchievementsModal(true);
              }}
              className="hover:text-yellow-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              Trophies ({activeProfile.unlockedAchievements.length})
            </button>
            <button
              onClick={() => {
                audio.playSelect();
                setShowSettingsModal(true);
              }}
              className="hover:text-yellow-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              Settings
            </button>
          </nav>

          {/* Zone 3: Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const next = !isAudioMuted;
                setIsAudioMuted(next);
                audio.setMute(next);
              }}
              className="px-2.5 py-1.5 border border-neutral-700 hover:border-white font-pixel text-[10px] text-neutral-300 cursor-pointer"
              title="Audio Mute Toggle"
            >
              {isAudioMuted ? '🔇 MUTED' : '🔊 SOUND'}
            </button>

            <button
              onClick={() => {
                audio.playSaveTwinkle();
                setShowSaveModal(true);
              }}
              className="px-3 py-1.5 bg-yellow-400 text-black font-bold border border-white hover:bg-yellow-300 font-pixel text-[10px] cursor-pointer shadow-[0_0_8px_rgba(234,179,8,0.5)]"
            >
              ⭐ SAVE
            </button>
          </div>
        </header>
      )}

      {/* ======================================================== */}
      {/* MAIN GAME VIEWPORT CONTAINER                             */}
      {/* ======================================================== */}
      {screen !== 'BOOT_SEQUENCE' && (
        <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col justify-center items-center p-3 md:p-6 z-20">
          {/* ==================== 1. TITLE SCREEN ==================== */}
          {screen === 'TITLE' && (
            <div className="w-full flex flex-col items-center gap-5 py-4 animate-fadeIn">
              {/* Title Pixel Banner */}
              <div className="w-full relative ut-box overflow-hidden max-h-[340px] flex items-center justify-center">
                <img
                  src={STORY_IMAGES.cover}
                  alt="London Heistale"
                  className="w-full h-full object-cover pixelated opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col items-center justify-end pb-6">
                  <span className="text-3xl text-red-500 animate-soul mb-1">❤️</span>
                  <h1 className="text-2xl md:text-4xl text-yellow-400 font-bold text-center tracking-widest drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
                    LONDON HEISTALE
                  </h1>
                  <p className="font-pixel text-xs text-neutral-300 mt-1 tracking-wider">
                    THE HATTON GARDEN ROBBERY // 1994
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-neutral-400 font-pixel">
                    <span>3rd-Person PS1 Walk</span>
                    <span>·</span>
                    <span>Gamepad Supported</span>
                    <span>·</span>
                    <span>Real Voice Acting</span>
                  </div>
                </div>
              </div>

              {/* Title Menu Actions */}
              <div className="w-full max-w-md flex flex-col gap-2.5 font-pixel text-xs">
                {/* 3rd-Person Walk Around Mode */}
                <button
                  onClick={() => {
                    audio.playConfirm();
                    setScreen('OVERWORLD_WALK');
                  }}
                  className="p-3 border-2 border-cyan-400 bg-neutral-950 flex items-center justify-center gap-3 hover:bg-neutral-900 cursor-pointer text-cyan-300 font-bold text-sm shadow-[0_0_14px_rgba(34,211,238,0.4)]"
                >
                  <span>🎮</span>
                  <span>[EXPLORE STREETS (3RD-PERSON WALK)]</span>
                </button>

                <button
                  onClick={handleStartNewGame}
                  className="ut-box-accent p-3.5 flex items-center justify-center gap-3 hover:bg-neutral-900 cursor-pointer text-yellow-300 font-bold text-sm transition-all"
                >
                  <span className="text-red-500">❤️</span>
                  <span>[START STORY MODE]</span>
                </button>

                <button
                  onClick={() => {
                    audio.playConfirm();
                    setShowSaveModal(true);
                  }}
                  className="ut-box p-2.5 flex items-center justify-center gap-2 hover:border-yellow-400 hover:text-yellow-300 cursor-pointer transition-colors"
                >
                  <span>[CONTINUE / LOAD FILE]</span>
                </button>

                <button
                  onClick={() => {
                    audio.playConfirm();
                    setShowProfileModal(true);
                  }}
                  className="ut-box p-2.5 flex items-center justify-center gap-2 hover:border-yellow-400 hover:text-yellow-300 cursor-pointer transition-colors"
                >
                  <span>[CRIMINAL DOSSIER / SIGN IN]</span>
                </button>

                <button
                  onClick={() => {
                    audio.playConfirm();
                    setShowAchievementsModal(true);
                  }}
                  className="ut-box p-2.5 flex items-center justify-center gap-2 hover:border-yellow-400 hover:text-yellow-300 cursor-pointer transition-colors"
                >
                  <span>[TROPHIES & ARCHIVES]</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      audio.playConfirm();
                      setShowSettingsModal(true);
                    }}
                    className="flex-1 ut-box p-2 flex items-center justify-center gap-1 hover:border-yellow-400 hover:text-yellow-300 cursor-pointer text-[10px]"
                  >
                    <span>⚙️ SETTINGS</span>
                  </button>
                  <button
                    onClick={() => {
                      audio.playSelect();
                      setScreen('BOOT_SEQUENCE');
                    }}
                    className="flex-1 ut-box p-2 flex items-center justify-center gap-1 hover:border-yellow-400 hover:text-yellow-300 cursor-pointer text-[10px]"
                  >
                    <span>📺 PS1 BOOT INTRO</span>
                  </button>
                </div>
              </div>

              {/* Quick Profile Stamp */}
              <div className="text-[10px] font-pixel text-neutral-500 flex items-center gap-2">
                <span>OPERATIVE:</span>
                <span className="text-neutral-300">{activeProfile.alias}</span>
                <span>·</span>
                <span>ROLE:</span>
                <span className="text-yellow-400">{activeProfile.role}</span>
              </div>
            </div>
          )}

          {/* ==================== 2. PS1 3RD PERSON OVERWORLD WALK ==================== */}
          {screen === 'OVERWORLD_WALK' && (
            <OverworldWalk
              playerProfile={activeProfile}
              onInteractNode={(nodeId) => {
                setCurrentNodeId(nodeId);
                setScreen('STORY');
              }}
              onOpenSave={() => setShowSaveModal(true)}
              onOpenDossier={() => setShowProfileModal(true)}
            />
          )}

          {/* ==================== 3. INTRO CUTSCENE ==================== */}
          {screen === 'INTRO_CUTSCENE' && (
            <CutsceneViewer
              imageSrc={STORY_IMAGES.cover}
              title="THE EASTER HEIST BEGINS"
              subtitle="GOOD FRIDAY // APRIL 1994"
              storyLines={[
                'London, April 1994. Under the smog and drizzle, a legend was plotted.',
                'While the city sleeps over the Easter bank holiday, the subterranean vaults of Hatton Garden stand alone.',
                'Two hundred security deposit boxes. Millions in uncut diamonds, gold sovereigns, and family heirlooms.',
                'Four men in flat caps and grease-stained trench coats step into the dark.',
                'Tonight, every choice you make will echo forever in the cold English rain.'
              ]}
              onContinue={() => {
                setScreen('STORY');
                audio.playBGM('heist_quiet');
              }}
            />
          )}

          {/* ==================== 4. STORY GAMEPLAY ==================== */}
          {screen === 'STORY' && (
            <div className="w-full flex flex-col gap-3">
              {/* Top HUD: Status Bar */}
              <div className="w-full ut-box p-2.5 px-4 flex flex-wrap items-center justify-between text-[11px] font-pixel bg-neutral-950">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">📍</span>
                  <span className="text-white truncate max-w-[200px] md:max-w-xs">{currentNode.location}</span>
                </div>

                <div className="flex items-center gap-4 text-neutral-400">
                  <span className="text-yellow-300">{currentNode.actTitle}</span>
                  <span>⏱️ {formatClock(playTimeSeconds)}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-emerald-400">£{goldLoot.toLocaleString()}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-red-500">❤️</span>
                    <span className="text-white">{hp}/{maxHp}</span>
                  </div>
                  <span className="text-neutral-400">LV {lv}</span>
                </div>
              </div>

              {/* Center Visual Art Frame */}
              <div className="w-full ut-box overflow-hidden bg-neutral-950 aspect-[21/9] max-h-[260px] relative flex items-center justify-center">
                <img
                  src={currentNode.cutsceneImage || STORY_IMAGES.vault}
                  alt={currentNode.actTitle}
                  className="w-full h-full object-cover pixelated opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-2 left-3 font-pixel text-[9px] text-neutral-300 bg-black/80 px-2 py-0.5 border border-neutral-700">
                  {currentNode.location}
                </div>

                <div className="absolute bottom-2 right-3 flex items-center gap-3 font-pixel text-[9px] bg-black/80 p-1 px-2 border border-neutral-700">
                  <span className="text-neutral-400">TRUST:</span>
                  <span className="text-emerald-400 font-bold">{crewTrust}%</span>
                  <span className="text-neutral-400">SUSPICION:</span>
                  <span className={suspicion > 50 ? 'text-red-400 font-bold' : 'text-yellow-400'}>
                    {suspicion}%
                  </span>
                </div>
              </div>

              {/* Undertale Dialogue & Choices Interface */}
              <DialogueBox
                speaker={currentNode.speaker}
                speakerRole={currentNode.speakerRole}
                speakerVoice={currentNode.speakerVoice}
                speakerPortrait={currentNode.speakerPortrait}
                dialogueLines={currentNode.dialogueLines}
                choices={currentNode.choices}
                onSelectChoice={handleSelectChoice}
                onOpenSave={() => setShowSaveModal(true)}
                hasSavePoint={currentNode.hasSavePoint}
                determinationQuote={currentNode.determinationQuote}
              />
            </div>
          )}

          {/* ==================== 5. BATTLE ARENA ==================== */}
          {screen === 'BATTLE' && activeEnemy && (
            <BattleArena
              enemy={activeEnemy}
              playerHp={hp}
              playerMaxHp={maxHp}
              playerLv={lv}
              playerName={activeProfile.alias.split(' ')[0] || 'TOMMY'}
              inventory={inventory}
              onBattleEnd={handleBattleEnd}
              onUseItem={item => {
                setInventory(prev => prev.filter(i => i.id !== item.id));
              }}
            />
          )}

          {/* ==================== 6. SAD ENDING EPILOGUE ==================== */}
          {screen === 'SAD_ENDING' && (
            <CutsceneViewer
              imageSrc={STORY_IMAGES.sadEnding}
              title="THE SAD ENDING"
              subtitle="HIS MAJESTY'S PLEASURE // LONDON IN THE RAIN"
              storyLines={currentNode.dialogueLines}
              isEnding={true}
              endingKey={currentNode.endingKey}
              onContinue={() => {
                audio.playBGM('sad_ending');
              }}
              onRestartGame={() => {
                setScreen('TITLE');
              }}
            />
          )}
        </main>
      )}

      {/* ======================================================== */}
      {/* QUIET FOOTER                                             */}
      {/* ======================================================== */}
      {screen !== 'BOOT_SEQUENCE' && (
        <footer className="w-full border-t border-neutral-800 bg-black/90 px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-between text-[10px] font-pixel text-neutral-500 z-30">
          <div>
            <span>LONDON HEISTALE © 1994-2026 · PS1 3D ENGINE & UNDERTALE SYSTEM</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-yellow-400">❤️ STAY DETERMINED</span>
            <span>·</span>
            <span>GAMEPAD READY</span>
          </div>
        </footer>
      )}

      {/* ======================================================== */}
      {/* MODAL DIALOGS                                            */}
      {/* ======================================================== */}
      {showSaveModal && (
        <SaveLoadModal
          currentSaveState={{
            profileId: activeProfile.id,
            profileAlias: activeProfile.alias,
            currentNodeId,
            locationName: currentNode.location,
            actNumber: currentNode.act,
            playTimeSeconds,
            hp,
            maxHp,
            lv,
            exp,
            goldLootPounds: goldLoot,
            suspicionLevel: suspicion,
            crewTrust,
            karmaScore: karma,
            inventory,
            choicesHistory
          }}
          slots={saveSlots}
          onSaveToSlot={handleSaveToSlot}
          onLoadFromSlot={handleLoadFromSlot}
          onDeleteSlot={handleDeleteSlot}
          onImportSave={handleLoadFromSlot}
          onClose={() => setShowSaveModal(false)}
        />
      )}

      {showProfileModal && (
        <ProfileAuthModal
          currentProfile={activeProfile}
          allProfiles={profiles}
          onSelectProfile={p => {
            setActiveProfile(p);
            setShowProfileModal(false);
          }}
          onCreateProfile={p => {
            setProfiles(prev => [...prev, p]);
            setActiveProfile(p);
            setShowProfileModal(false);
          }}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {showAchievementsModal && (
        <AchievementsModal
          unlockedIds={activeProfile.unlockedAchievements}
          onClose={() => setShowAchievementsModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          crtEnabled={crtEnabled}
          ditherEnabled={ditherEnabled}
          onToggleCrt={setCrtEnabled}
          onToggleDither={setDitherEnabled}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
