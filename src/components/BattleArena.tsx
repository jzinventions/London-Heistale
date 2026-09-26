import React, { useState, useEffect, useRef } from 'react';
import { BattleEnemy, InventoryItem } from '../types/game';
import { audio } from '../services/audio';

interface BattleArenaProps {
  enemy: BattleEnemy;
  playerHp: number;
  playerMaxHp: number;
  playerLv: number;
  playerName: string;
  inventory: InventoryItem[];
  onBattleEnd: (result: 'spared' | 'defeated' | 'fled', remainingHp: number) => void;
  onUseItem: (item: InventoryItem) => void;
}

type BattleMenuMode = 'MAIN' | 'FIGHT_TARGET' | 'ACT_SELECT' | 'ITEM_SELECT' | 'MERCY_SELECT' | 'ENEMY_ATTACKING' | 'DIALOGUE';

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'truncheon' | 'siren' | 'handcuff' | 'rain';
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  enemy: initialEnemy,
  playerHp: initialHp,
  playerMaxHp,
  playerLv,
  playerName,
  inventory,
  onBattleEnd,
  onUseItem
}) => {
  const [enemy, setEnemy] = useState<BattleEnemy>(initialEnemy);
  const [hp, setHp] = useState<number>(initialHp);
  const [menuMode, setMenuMode] = useState<BattleMenuMode>('MAIN');
  const [activeBtnIndex, setActiveBtnIndex] = useState<number>(0);
  const [subIndex, setSubIndex] = useState<number>(0);

  // Box dimensions
  const BOX_WIDTH = 340;
  const BOX_HEIGHT = 160;

  // Soul position inside box
  const [soulPos, setSoulPos] = useState<{ x: number; y: number }>({ x: BOX_WIDTH / 2 - 8, y: BOX_HEIGHT / 2 - 8 });
  const [isInvincible, setIsInvincible] = useState<boolean>(false);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [battleMessage, setBattleMessage] = useState<string>(`* ${enemy.name} approaches in the cold London drizzle.`);
  const [enemyDialogue, setEnemyDialogue] = useState<string>('');
  const [isEnemyTalking, setIsEnemyTalking] = useState<boolean>(false);
  const [attackBarPos, setAttackBarPos] = useState<number>(0);
  const [attackBarMoving, setAttackBarMoving] = useState<boolean>(false);
  const [screenShaking, setScreenShaking] = useState<boolean>(false);

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const animationFrameRef = useRef<number | null>(null);
  const attackTimerRef = useRef<number | null>(null);

  // Play battle music on mount
  useEffect(() => {
    audio.playBattleEncounter();
    audio.playBGM('chase');
    return () => {
      if (attackTimerRef.current) clearInterval(attackTimerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Keyboard navigation for main menu & soul movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;

      if (menuMode === 'MAIN') {
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          setActiveBtnIndex(prev => (prev + 1) % 4);
          audio.playSelect();
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          setActiveBtnIndex(prev => (prev - 1 + 4) % 4);
          audio.playSelect();
        } else if (e.key === 'Enter' || e.key === ' ' || e.key === 'z' || e.key === 'Z') {
          handleMainMenuSelect(activeBtnIndex);
        }
      } else if (menuMode === 'ACT_SELECT') {
        if (e.key === 'ArrowDown' || e.key === 's') {
          setSubIndex(prev => (prev + 1) % enemy.actOptions.length);
          audio.playSelect();
        } else if (e.key === 'ArrowUp' || e.key === 'w') {
          setSubIndex(prev => (prev - 1 + enemy.actOptions.length) % enemy.actOptions.length);
          audio.playSelect();
        } else if (e.key === 'Enter' || e.key === 'z') {
          handleActConfirm(subIndex);
        } else if (e.key === 'x' || e.key === 'Escape') {
          setMenuMode('MAIN');
          audio.playSelect();
        }
      } else if (menuMode === 'ITEM_SELECT') {
        if (e.key === 'ArrowDown' || e.key === 's') {
          setSubIndex(prev => (inventory.length ? (prev + 1) % inventory.length : 0));
          audio.playSelect();
        } else if (e.key === 'ArrowUp' || e.key === 'w') {
          setSubIndex(prev => (inventory.length ? (prev - 1 + inventory.length) % inventory.length : 0));
          audio.playSelect();
        } else if (e.key === 'Enter' || e.key === 'z') {
          if (inventory[subIndex]) handleItemUse(inventory[subIndex]);
        } else if (e.key === 'x' || e.key === 'Escape') {
          setMenuMode('MAIN');
          audio.playSelect();
        }
      } else if (menuMode === 'MERCY_SELECT') {
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'ArrowUp' || e.key === 'w') {
          setSubIndex(prev => (prev === 0 ? 1 : 0));
          audio.playSelect();
        } else if (e.key === 'Enter' || e.key === 'z') {
          handleMercyConfirm(subIndex);
        } else if (e.key === 'x' || e.key === 'Escape') {
          setMenuMode('MAIN');
          audio.playSelect();
        }
      } else if (menuMode === 'FIGHT_TARGET') {
        if (e.key === 'Enter' || e.key === 'z' || e.key === ' ') {
          triggerPlayerAttack();
        }
      } else if (menuMode === 'DIALOGUE') {
        if (e.key === 'Enter' || e.key === 'z' || e.key === ' ') {
          startEnemyAttackPhase();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [menuMode, activeBtnIndex, subIndex, enemy, inventory, hp]);

  const handleMainMenuSelect = (index: number) => {
    audio.playConfirm();
    setSubIndex(0);
    if (index === 0) {
      // FIGHT
      setMenuMode('FIGHT_TARGET');
      setAttackBarPos(0);
      setAttackBarMoving(true);
    } else if (index === 1) {
      // ACT
      setMenuMode('ACT_SELECT');
    } else if (index === 2) {
      // ITEM
      setMenuMode('ITEM_SELECT');
    } else if (index === 3) {
      // MERCY
      setMenuMode('MERCY_SELECT');
    }
  };

  // Fight timing bar animation
  useEffect(() => {
    let animId: number;
    if (menuMode === 'FIGHT_TARGET' && attackBarMoving) {
      const loop = () => {
        setAttackBarPos(prev => {
          if (prev >= 100) return 0;
          return prev + 3;
        });
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [menuMode, attackBarMoving]);

  const triggerPlayerAttack = () => {
    setAttackBarMoving(false);
    audio.playDamage();
    // Distance from center 50% determines damage
    const accuracy = 1 - Math.abs(50 - attackBarPos) / 50;
    const damage = Math.max(12, Math.round(28 * accuracy) + playerLv * 4);

    const nextEnemyHp = Math.max(0, enemy.currentHp - damage);
    setEnemy(prev => ({ ...prev, currentHp: nextEnemyHp }));

    setBattleMessage(`* You struck with the iron crowbar! Dealt ${damage} damage to ${enemy.name}!`);

    if (nextEnemyHp <= 0) {
      setTimeout(() => {
        audio.playConfirm();
        onBattleEnd('defeated', hp);
      }, 1200);
    } else {
      setTimeout(() => {
        startEnemyAttackPhase();
      }, 1000);
    }
  };

  const handleActConfirm = (actIdx: number) => {
    audio.playConfirm();
    const act = enemy.actOptions[actIdx];
    const newMercy = Math.min(100, enemy.mercyProgress + act.mercyBonus);
    setEnemy(prev => ({ ...prev, mercyProgress: newMercy }));

    setBattleMessage(`* ${act.response}`);
    setEnemyDialogue(newMercy >= enemy.spareThreshold ? '"...Alright mate, put the weapons away."' : enemy.dialoguePool[Math.floor(Math.random() * enemy.dialoguePool.length)]);
    setIsEnemyTalking(true);
    setMenuMode('DIALOGUE');
    audio.playDialogueBeep('police');
  };

  const handleItemUse = (item: InventoryItem) => {
    audio.playConfirm();
    onUseItem(item);
    if (item.heal) {
      const restored = Math.min(playerMaxHp, hp + item.heal);
      setHp(restored);
      audio.playSelect();
      setBattleMessage(`* You used the ${item.name}! Recovered ${item.heal} HP!`);
    } else {
      setBattleMessage(`* You examined the ${item.name}. It doesn't seem directly useful in combat.`);
    }
    setTimeout(() => {
      startEnemyAttackPhase();
    }, 1200);
  };

  const handleMercyConfirm = (idx: number) => {
    audio.playConfirm();
    if (idx === 0) {
      // Spare
      if (enemy.mercyProgress >= enemy.spareThreshold) {
        audio.playSaveTwinkle();
        setBattleMessage(`* You and ${enemy.name} came to an understanding. YOU WON!`);
        setTimeout(() => {
          onBattleEnd('spared', hp);
        }, 1200);
      } else {
        setBattleMessage(`* ${enemy.name}'s name is not yellow yet. They refuse your mercy!`);
        setTimeout(() => {
          startEnemyAttackPhase();
        }, 1200);
      }
    } else {
      // Flee
      audio.playSelect();
      setBattleMessage(`* You dashed into the London fog! Got away safely!`);
      setTimeout(() => {
        onBattleEnd('fled', hp);
      }, 1200);
    }
  };

  // Start bullet hell attack phase
  const startEnemyAttackPhase = () => {
    setMenuMode('ENEMY_ATTACKING');
    setIsEnemyTalking(false);
    setSoulPos({ x: BOX_WIDTH / 2 - 8, y: BOX_HEIGHT / 2 - 8 });
    setBullets([]);

    // Spawn bullets over 6 seconds
    const interval = window.setInterval(() => {
      const side = Math.floor(Math.random() * 3);
      let newB: Bullet;
      if (side === 0) {
        // From top (falling truncheon or rain)
        newB = {
          x: 20 + Math.random() * (BOX_WIDTH - 40),
          y: -15,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 2.5 + Math.random() * 1.5,
          size: 14,
          type: enemy.patternType === 'siren_beams' ? 'siren' : 'truncheon'
        };
      } else if (side === 1) {
        // From left (handcuffs or siren beam)
        newB = {
          x: -15,
          y: 20 + Math.random() * (BOX_HEIGHT - 40),
          vx: 3 + Math.random() * 2,
          vy: (Math.random() - 0.5) * 1.5,
          size: 12,
          type: 'handcuff'
        };
      } else {
        // From right
        newB = {
          x: BOX_WIDTH + 15,
          y: 20 + Math.random() * (BOX_HEIGHT - 40),
          vx: -(3 + Math.random() * 2),
          vy: (Math.random() - 0.5) * 1.5,
          size: 12,
          type: 'rain'
        };
      }
      setBullets(prev => [...prev, newB]);
    }, 280);

    // End attack after 5.5s
    setTimeout(() => {
      clearInterval(interval);
      setBullets([]);
      setMenuMode('MAIN');
      setBattleMessage(`* ${enemy.name} catches his breath in the rain.`);
    }, 5500);
  };

  // Soul movement & Bullet collision loop during ENEMY_ATTACKING
  useEffect(() => {
    if (menuMode !== 'ENEMY_ATTACKING') return;

    let animId: number;
    const speed = 3.2;

    const gameLoop = () => {
      // Move soul
      setSoulPos(prev => {
        let nx = prev.x;
        let ny = prev.y;

        if (keysPressed.current['ArrowLeft'] || keysPressed.current['a'] || keysPressed.current['A']) nx -= speed;
        if (keysPressed.current['ArrowRight'] || keysPressed.current['d'] || keysPressed.current['D']) nx += speed;
        if (keysPressed.current['ArrowUp'] || keysPressed.current['w'] || keysPressed.current['W']) ny -= speed;
        if (keysPressed.current['ArrowDown'] || keysPressed.current['s'] || keysPressed.current['S']) ny += speed;

        // Boundaries
        nx = Math.max(4, Math.min(BOX_WIDTH - 20, nx));
        ny = Math.max(4, Math.min(BOX_HEIGHT - 20, ny));

        return { x: nx, y: ny };
      });

      // Move bullets & test collision
      setBullets(prevBullets => {
        const nextBullets: Bullet[] = [];
        const soulBox = { x: soulPos.x + 3, y: soulPos.y + 3, w: 10, h: 10 };

        for (const b of prevBullets) {
          const nx = b.x + b.vx;
          const ny = b.y + b.vy;

          // AABB collision
          if (!isInvincible) {
            const bBox = { x: nx, y: ny, w: b.size, h: b.size };
            const collided = !(
              soulBox.x + soulBox.w < bBox.x ||
              soulBox.x > bBox.x + bBox.w ||
              soulBox.y + soulBox.h < bBox.y ||
              soulBox.y > bBox.y + bBox.h
            );

            if (collided) {
              audio.playDamage();
              setScreenShaking(true);
              setTimeout(() => setScreenShaking(false), 300);

              const dmg = Math.max(3, Math.round(enemy.atk * 0.45));
              setHp(currHp => {
                const nextHp = Math.max(1, currHp - dmg);
                return nextHp;
              });

              setIsInvincible(true);
              setTimeout(() => setIsInvincible(false), 800);
            }
          }

          // Keep in bounds
          if (nx > -30 && nx < BOX_WIDTH + 30 && ny > -30 && ny < BOX_HEIGHT + 30) {
            nextBullets.push({ ...b, x: nx, y: ny });
          }
        }
        return nextBullets;
      });

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [menuMode, soulPos, isInvincible, enemy.atk]);

  const isSparable = enemy.mercyProgress >= enemy.spareThreshold;

  return (
    <div className={`w-full max-w-3xl mx-auto flex flex-col items-center p-4 bg-black select-none ${screenShaking ? 'shake-active' : ''}`}>
      {/* Top: Enemy Stage & Speech */}
      <div className="w-full flex items-center justify-between mb-4 px-6 min-h-[140px]">
        {/* Enemy Pixel Sprite */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-neutral-900 border-2 border-white rounded flex items-center justify-center p-2 relative shadow-[0_0_12px_rgba(255,255,255,0.15)]">
            <span className="text-4xl">
              {enemy.id === 'enemy_higgins' ? '👮' : '🕵️‍♂️'}
            </span>
            {isSparable && (
              <span className="absolute -top-3 -right-2 text-xs font-pixel text-yellow-300 animate-bounce bg-black px-1 border border-yellow-400">
                SPARE!
              </span>
            )}
          </div>
          <p className={`font-pixel text-xs mt-2 text-center ${isSparable ? 'text-yellow-400' : 'text-white'}`}>
            {enemy.name}
          </p>
        </div>

        {/* Speech Bubble / Status */}
        <div className="flex-1 ml-6 ut-box p-3 min-h-[85px] relative">
          <div className="absolute -left-3 top-6 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white"></div>
          {isEnemyTalking ? (
            <p className="font-dialogue text-xl text-yellow-300 leading-tight">
              {enemyDialogue}
            </p>
          ) : (
            <div>
              <p className="font-pixel text-[11px] text-neutral-300 leading-relaxed mb-2">
                {enemy.title}
              </p>
              {/* Mercy progress bar */}
              <div className="flex items-center gap-2 text-[10px] font-pixel text-neutral-400">
                <span>MERCY:</span>
                <div className="w-32 h-2.5 bg-neutral-800 border border-neutral-600 rounded-none overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${isSparable ? 'bg-yellow-400' : 'bg-emerald-500'}`}
                    style={{ width: `${enemy.mercyProgress}%` }}
                  />
                </div>
                <span className={isSparable ? 'text-yellow-400 font-bold' : ''}>
                  {enemy.mercyProgress}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle: The Undertale Bullet Box */}
      <div
        className="ut-box relative overflow-hidden flex items-center justify-center my-2 shadow-[0_0_24px_rgba(0,0,0,0.9)]"
        style={{ width: `${BOX_WIDTH}px`, height: `${BOX_HEIGHT}px` }}
      >
        {menuMode === 'MAIN' && (
          <div className="p-4 text-left w-full h-full font-pixel text-xs text-white leading-relaxed overflow-y-auto">
            <p>{battleMessage}</p>
          </div>
        )}

        {menuMode === 'ACT_SELECT' && (
          <div className="p-4 w-full h-full font-pixel text-xs text-white flex flex-col justify-start gap-2">
            <p className="text-yellow-400 mb-1 text-[10px]">SELECT ACTION:</p>
            {enemy.actOptions.map((act, i) => (
              <button
                key={act.label}
                onClick={() => handleActConfirm(i)}
                className={`text-left px-2 py-1 flex items-center gap-2 cursor-pointer transition-colors ${
                  subIndex === i ? 'text-yellow-300 bg-neutral-900' : 'text-white hover:text-yellow-200'
                }`}
              >
                {subIndex === i && <span className="text-red-500 text-xs">❤️</span>}
                <span>* {act.label}</span>
              </button>
            ))}
          </div>
        )}

        {menuMode === 'ITEM_SELECT' && (
          <div className="p-4 w-full h-full font-pixel text-xs text-white flex flex-col justify-start gap-2 overflow-y-auto">
            <p className="text-yellow-400 mb-1 text-[10px]">POCKET ITEMS:</p>
            {inventory.length === 0 ? (
              <p className="text-neutral-500">* Pockets are empty!</p>
            ) : (
              inventory.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => handleItemUse(item)}
                  className={`text-left px-2 py-1 flex items-center justify-between cursor-pointer ${
                    subIndex === i ? 'text-yellow-300 bg-neutral-900' : 'text-white hover:text-yellow-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {subIndex === i && <span className="text-red-500 text-xs">❤️</span>}
                    <span>* {item.name}</span>
                  </span>
                  {item.heal && <span className="text-emerald-400 text-[10px]">+{item.heal} HP</span>}
                </button>
              ))
            )}
          </div>
        )}

        {menuMode === 'MERCY_SELECT' && (
          <div className="p-4 w-full h-full font-pixel text-xs text-white flex flex-col justify-start gap-3">
            <p className="text-yellow-400 text-[10px]">MERCY:</p>
            <button
              onClick={() => handleMercyConfirm(0)}
              className={`text-left px-2 py-1 flex items-center gap-2 cursor-pointer ${
                subIndex === 0 ? 'bg-neutral-900' : ''
              } ${isSparable ? 'text-yellow-400 font-bold animate-pulse' : 'text-neutral-300'}`}
            >
              {subIndex === 0 && <span className="text-red-500 text-xs">❤️</span>}
              <span>* Spare {isSparable && '✨'}</span>
            </button>
            <button
              onClick={() => handleMercyConfirm(1)}
              className={`text-left px-2 py-1 flex items-center gap-2 cursor-pointer ${
                subIndex === 1 ? 'text-yellow-300 bg-neutral-900' : 'text-neutral-300'
              }`}
            >
              {subIndex === 1 && <span className="text-red-500 text-xs">❤️</span>}
              <span>* Flee into Fog</span>
            </button>
          </div>
        )}

        {menuMode === 'FIGHT_TARGET' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <p className="font-pixel text-[10px] text-yellow-300 mb-2">HIT SPACE/ENTER AT THE CENTER!</p>
            <div className="w-full h-8 bg-neutral-950 border-2 border-white relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-[48%] right-[48%] bg-cyan-400/40 border-x border-cyan-400" />
              <div
                className="absolute top-0 bottom-0 w-3 bg-white shadow-[0_0_8px_#ffffff]"
                style={{ left: `${attackBarPos}%` }}
              />
            </div>
          </div>
        )}

        {/* Active Bullet Hell Dodge Area */}
        {menuMode === 'ENEMY_ATTACKING' && (
          <div className="w-full h-full relative">
            {/* The Player's Red SOUL */}
            <div
              className={`absolute flex items-center justify-center transition-opacity ${
                isInvincible ? 'opacity-40 animate-pulse' : 'opacity-100'
              }`}
              style={{
                left: `${soulPos.x}px`,
                top: `${soulPos.y}px`,
                width: '16px',
                height: '16px'
              }}
            >
              <span className="text-red-500 text-base leading-none drop-shadow-[0_0_4px_#ef4444]">❤️</span>
            </div>

            {/* Flying Bullets */}
            {bullets.map((b, i) => (
              <div
                key={i}
                className="absolute flex items-center justify-center text-xs pointer-events-none"
                style={{
                  left: `${b.x}px`,
                  top: `${b.y}px`,
                  width: `${b.size}px`,
                  height: `${b.size}px`
                }}
              >
                {b.type === 'truncheon' && <span className="text-amber-200">🏏</span>}
                {b.type === 'siren' && <span className="text-blue-400 animate-spin">🚨</span>}
                {b.type === 'handcuff' && <span className="text-slate-300">⛓️</span>}
                {b.type === 'rain' && <span className="text-cyan-300">💧</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* On-screen Mobile / Click D-Pad for dodging */}
      {menuMode === 'ENEMY_ATTACKING' && (
        <div className="flex flex-col items-center gap-1 my-2">
          <span className="text-[10px] font-pixel text-neutral-400">TOUCH OR USE ARROW KEYS TO DODGE:</span>
          <div className="grid grid-cols-3 gap-1 w-32">
            <div></div>
            <button
              onMouseDown={() => (keysPressed.current['ArrowUp'] = true)}
              onMouseUp={() => (keysPressed.current['ArrowUp'] = false)}
              className="ut-box py-1 text-center font-pixel text-xs active:bg-neutral-800"
            >
              ▲
            </button>
            <div></div>
            <button
              onMouseDown={() => (keysPressed.current['ArrowLeft'] = true)}
              onMouseUp={() => (keysPressed.current['ArrowLeft'] = false)}
              className="ut-box py-1 text-center font-pixel text-xs active:bg-neutral-800"
            >
              ◄
            </button>
            <button
              onMouseDown={() => (keysPressed.current['ArrowDown'] = true)}
              onMouseUp={() => (keysPressed.current['ArrowDown'] = false)}
              className="ut-box py-1 text-center font-pixel text-xs active:bg-neutral-800"
            >
              ▼
            </button>
            <button
              onMouseDown={() => (keysPressed.current['ArrowRight'] = true)}
              onMouseUp={() => (keysPressed.current['ArrowRight'] = false)}
              className="ut-box py-1 text-center font-pixel text-xs active:bg-neutral-800"
            >
              ►
            </button>
          </div>
        </div>
      )}

      {/* HUD: Player Name, LV, HP bar */}
      <div className="w-full flex items-center justify-between px-6 py-2 font-pixel text-xs text-white max-w-lg">
        <span className="tracking-widest">{playerName}</span>
        <span>LV {playerLv}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-amber-400">HP</span>
          <div className="w-28 h-4 bg-red-800 border border-black relative">
            <div
              className="h-full bg-yellow-400 transition-all duration-200"
              style={{ width: `${(hp / playerMaxHp) * 100}%` }}
            />
          </div>
          <span className="text-[10px] tabular-nums">
            {hp} / {playerMaxHp}
          </span>
        </div>
      </div>

      {/* Bottom Undertale Action Buttons: [FIGHT], [ACT], [ITEM], [MERCY] */}
      <div className="w-full grid grid-cols-4 gap-3 px-4 max-w-xl mt-2">
        {[
          { label: 'FIGHT', icon: '⚔️', color: 'border-orange-500' },
          { label: 'ACT', icon: '💬', color: 'border-cyan-500' },
          { label: 'ITEM', icon: '🎒', color: 'border-yellow-500' },
          { label: 'MERCY', icon: '🤝', color: isSparable ? 'border-yellow-300' : 'border-emerald-500' }
        ].map((btn, idx) => {
          const isSelected = activeBtnIndex === idx && menuMode === 'MAIN';
          return (
            <button
              key={btn.label}
              onClick={() => {
                setActiveBtnIndex(idx);
                handleMainMenuSelect(idx);
              }}
              className={`ut-box py-2 px-2 flex items-center justify-center gap-1.5 font-pixel text-[11px] cursor-pointer transition-all duration-150 ${
                isSelected ? 'border-yellow-400 bg-neutral-900 shadow-[0_0_12px_rgba(250,204,21,0.5)]' : 'border-neutral-500'
              } ${btn.label === 'MERCY' && isSparable ? 'text-yellow-400' : 'text-white'}`}
            >
              {isSelected && <span className="text-red-500 text-xs animate-bounce">❤️</span>}
              <span className="text-xs">{btn.icon}</span>
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
