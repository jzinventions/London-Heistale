import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../services/audio';
import { PlayerProfile } from '../types/game';

interface OverworldWalkProps {
  playerProfile: PlayerProfile;
  onInteractNode: (nodeId: string) => void;
  onOpenSave: () => void;
  onOpenDossier: () => void;
}

interface WorldEntity {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  width: number;
  height: number;
  icon: string;
  targetNodeId: string;
  prompt: string;
  color: string;
}

export const OverworldWalk: React.FC<OverworldWalkProps> = ({
  playerProfile,
  onInteractNode,
  onOpenSave,
  onOpenDossier
}) => {
  // World bounds
  const WORLD_WIDTH = 760;
  const WORLD_HEIGHT = 440;

  // Player position & movement
  const [posX, setPosX] = useState<number>(360);
  const [posY, setPosY] = useState<number>(340);
  const [facing, setFacing] = useState<'down' | 'up' | 'left' | 'right'>('up');
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [walkFrame, setWalkFrame] = useState<number>(0);
  const [isSprinting, setIsSprinting] = useState<boolean>(false);
  const [activeNearbyEntity, setActiveNearbyEntity] = useState<WorldEntity | null>(null);

  // Controller / Gamepad Status
  const [gamepadConnected, setGamepadConnected] = useState<boolean>(false);
  const [gamepadName, setGamepadName] = useState<string>('');

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const animationFrameRef = useRef<number | null>(null);
  const footstepCooldown = useRef<number>(0);

  // World Interactive Objects & Characters
  const entities: WorldEntity[] = [
    {
      id: 'arthur',
      name: 'Arthur "The Fox"',
      role: 'Mastermind',
      x: 350,
      y: 110,
      width: 44,
      height: 44,
      icon: '🦊',
      targetNodeId: 'node_start',
      prompt: '[X] TALK TO ARTHUR',
      color: 'border-yellow-400 bg-amber-950/80'
    },
    {
      id: 'dave',
      name: 'Big Dave',
      role: 'Safecracker',
      x: 180,
      y: 200,
      width: 44,
      height: 44,
      icon: '🦍',
      targetNodeId: 'node_briefing_equipment',
      prompt: '[X] INSPECT DRILL GEAR',
      color: 'border-orange-400 bg-orange-950/80'
    },
    {
      id: 'dizzy',
      name: 'Dizzy & Getaway Van',
      role: 'Wheelman',
      x: 610,
      y: 290,
      width: 58,
      height: 48,
      icon: '🚐',
      targetNodeId: 'node_briefing_getaway',
      prompt: '[X] CHECK GETAWAY TRANSIT',
      color: 'border-cyan-400 bg-cyan-950/80'
    },
    {
      id: 'star',
      name: 'Save Star',
      role: 'Determination',
      x: 440,
      y: 130,
      width: 32,
      height: 32,
      icon: '⭐',
      targetNodeId: 'node_save_point_pub',
      prompt: '[X] TOUCH SAVE STAR',
      color: 'border-yellow-300 bg-yellow-950/80 animate-star'
    },
    {
      id: 'vault_entrance',
      name: 'Hatton Garden Vault Gates',
      role: 'Breach Point',
      x: 360,
      y: 35,
      width: 60,
      height: 35,
      icon: '🏛️',
      targetNodeId: 'node_act1_journey',
      prompt: '[X] ENTER HATTON GARDEN',
      color: 'border-emerald-400 bg-emerald-950/80'
    },
    {
      id: 'phonebox',
      name: 'Red London Phone Box',
      role: 'Telecom Wiretap',
      x: 100,
      y: 320,
      width: 38,
      height: 50,
      icon: '☎️',
      targetNodeId: 'node_act1_manhole',
      prompt: '[X] INSPECT TELECOM WIRES',
      color: 'border-red-500 bg-red-950/80'
    },
    {
      id: 'higgins',
      name: 'Constable Higgins',
      role: 'Met Patrol',
      x: 520,
      y: 80,
      width: 40,
      height: 40,
      icon: '👮',
      targetNodeId: 'node_act1_higgins_battle',
      prompt: '[X] OBSERVE NIGHT PATROL',
      color: 'border-blue-400 bg-blue-950/80'
    }
  ];

  // Rain particles simulation
  const rainDrops = useRef(
    Array.from({ length: 45 }).map(() => ({
      x: Math.random() * WORLD_WIDTH,
      y: Math.random() * WORLD_HEIGHT,
      speed: 4 + Math.random() * 5
    }))
  ).current;

  // Background music
  useEffect(() => {
    audio.playBGM('overworld_rain');
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Gamepad Connection Listeners
  useEffect(() => {
    const handleGamepadConnected = (e: GamepadEvent) => {
      setGamepadConnected(true);
      setGamepadName(e.gamepad.id);
      audio.playConfirm();
    };

    const handleGamepadDisconnected = () => {
      setGamepadConnected(false);
      setGamepadName('');
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    // Initial check
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    if (pads && pads[0]) {
      setGamepadConnected(true);
      setGamepadName(pads[0].id);
    }

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  // Keyboard Event Handlers
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      if (e.key === 'Shift') setIsSprinting(true);

      if (e.key === 'Enter' || e.key === ' ' || e.key === 'z' || e.key === 'Z') {
        if (activeNearbyEntity) {
          triggerInteraction(activeNearbyEntity);
        }
      } else if (e.key === 'c' || e.key === 'C') {
        audio.playSaveTwinkle();
        onOpenSave();
      } else if (e.key === 'v' || e.key === 'V') {
        audio.playSelect();
        onOpenDossier();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
      if (e.key === 'Shift') setIsSprinting(false);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [activeNearbyEntity]);

  const triggerHaptic = (duration: number = 100) => {
    try {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      if (pads && pads[0] && (pads[0] as unknown as { vibrationActuator?: { playEffect: (type: string, opts: object) => void } }).vibrationActuator) {
        (pads[0] as unknown as { vibrationActuator: { playEffect: (type: string, opts: object) => void } }).vibrationActuator.playEffect('dual-rumble', {
          startDelay: 0,
          duration,
          weakMagnitude: 0.5,
          strongMagnitude: 0.3
        });
      }
    } catch {}
  };

  const triggerInteraction = (ent: WorldEntity) => {
    audio.playConfirm();
    triggerHaptic(180);
    if (ent.id === 'star') {
      audio.playSaveTwinkle();
      onOpenSave();
    } else {
      onInteractNode(ent.targetNodeId);
    }
  };

  // Main 3rd-Person Movement & Gamepad Loop
  useEffect(() => {
    const loop = () => {
      let dx = 0;
      let dy = 0;

      // 1. Check Keyboard Inputs
      if (keysPressed.current['ArrowLeft'] || keysPressed.current['a'] || keysPressed.current['A']) dx -= 1;
      if (keysPressed.current['ArrowRight'] || keysPressed.current['d'] || keysPressed.current['D']) dx += 1;
      if (keysPressed.current['ArrowUp'] || keysPressed.current['w'] || keysPressed.current['W']) dy -= 1;
      if (keysPressed.current['ArrowDown'] || keysPressed.current['s'] || keysPressed.current['S']) dy += 1;

      // 2. Check Gamepad / Controller Inputs
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const pad = gamepads[0];
      if (pad) {
        // Analog Stick
        const deadzone = 0.2;
        if (Math.abs(pad.axes[0]) > deadzone) dx += pad.axes[0];
        if (Math.abs(pad.axes[1]) > deadzone) dy += pad.axes[1];

        // D-pad buttons
        if (pad.buttons[14]?.pressed) dx -= 1; // Left
        if (pad.buttons[15]?.pressed) dx += 1; // Right
        if (pad.buttons[12]?.pressed) dy -= 1; // Up
        if (pad.buttons[13]?.pressed) dy += 1; // Down

        // Sprint button (Square / Button 2)
        if (pad.buttons[2]?.pressed) setIsSprinting(true);

        // Action button (Cross / Button 0)
        if (pad.buttons[0]?.pressed && activeNearbyEntity) {
          triggerInteraction(activeNearbyEntity);
        }

        // Triangle / Dossier button (Button 3)
        if (pad.buttons[3]?.pressed) {
          audio.playSelect();
          onOpenDossier();
        }

        // Start / Save button (Button 9)
        if (pad.buttons[9]?.pressed) {
          audio.playSaveTwinkle();
          onOpenSave();
        }
      }

      const moving = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1;
      setIsMoving(moving);

      if (moving) {
        // Determine facing
        if (Math.abs(dx) > Math.abs(dy)) {
          setFacing(dx > 0 ? 'right' : 'left');
        } else {
          setFacing(dy > 0 ? 'down' : 'up');
        }

        // Step animation & footsteps
        setWalkFrame(f => (f + 1) % 20);

        footstepCooldown.current += 1;
        if (footstepCooldown.current > 16) {
          audio.playFootstep();
          footstepCooldown.current = 0;
        }

        const speed = isSprinting ? 4.2 : 2.5;
        const norm = Math.sqrt(dx * dx + dy * dy);
        const vx = (dx / (norm || 1)) * speed;
        const vy = (dy / (norm || 1)) * speed;

        setPosX(px => Math.max(25, Math.min(WORLD_WIDTH - 25, px + vx)));
        setPosY(py => Math.max(25, Math.min(WORLD_HEIGHT - 35, py + vy)));
      }

      // Check Nearby Entities for Interaction Proximity
      const playerCenter = { x: posX, y: posY };
      let found: WorldEntity | null = null;
      for (const ent of entities) {
        const entCenter = { x: ent.x + ent.width / 2, y: ent.y + ent.height / 2 };
        const dist = Math.hypot(playerCenter.x - entCenter.x, playerCenter.y - entCenter.y);
        if (dist < 55) {
          found = ent;
          break;
        }
      }
      setActiveNearbyEntity(found);

      // Rain animation tick
      rainDrops.forEach(drop => {
        drop.y += drop.speed;
        if (drop.y > WORLD_HEIGHT) {
          drop.y = -5;
          drop.x = Math.random() * WORLD_WIDTH;
        }
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [posX, posY, isSprinting, activeNearbyEntity]);

  return (
    <div className="w-full flex flex-col items-center select-none font-pixel animate-fadeIn">
      {/* Top Street Title & Controller Indicator */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-2 text-xs text-neutral-300">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">🌧️</span>
          <span>HATTON GARDEN BACKSTREET // 3RD-PERSON OVERWORLD</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className={gamepadConnected ? 'text-emerald-400' : 'text-neutral-500'}>
            🎮 {gamepadConnected ? `GAMEPAD: ${gamepadName.substring(0, 18)}` : 'KEYBOARD / TOUCH'}
          </span>
          <button
            onClick={onOpenSave}
            className="text-yellow-400 hover:underline cursor-pointer"
          >
            [C: SAVE]
          </button>
          <button
            onClick={onOpenDossier}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            [V: DOSSIER]
          </button>
        </div>
      </div>

      {/* PS1 3rd-Person Fixed-Perspective Map Canvas */}
      <div
        className="relative ut-box overflow-hidden bg-neutral-950 border-4 border-white shadow-[0_0_30px_rgba(0,0,0,0.95)]"
        style={{ width: `${WORLD_WIDTH}px`, height: `${WORLD_HEIGHT}px` }}
      >
        {/* Retro Cobblestone Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        {/* London Asphalt & Rain Puddle Shimmers */}
        <div className="absolute top-10 left-12 w-64 h-24 bg-cyan-950/20 rounded-full blur-md border border-cyan-800/20" />
        <div className="absolute bottom-16 right-20 w-80 h-32 bg-cyan-950/25 rounded-full blur-md border border-cyan-800/20" />

        {/* Rain Particles */}
        {rainDrops.map((d, i) => (
          <div
            key={i}
            className="absolute w-[1.5px] h-3 bg-cyan-300/40 pointer-events-none"
            style={{ left: `${d.x}px`, top: `${d.y}px` }}
          />
        ))}

        {/* Ambient Warm Amber Streetlamp Lighting */}
        <div className="absolute top-2 left-6 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute top-2 right-12 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

        {/* Interactive World Entities & NPCs */}
        {entities.map(ent => (
          <div
            key={ent.id}
            onClick={() => triggerInteraction(ent)}
            className={`absolute flex flex-col items-center justify-center p-1 border-2 cursor-pointer transition-all hover:scale-110 shadow-lg ${ent.color}`}
            style={{
              left: `${ent.x}px`,
              top: `${ent.y}px`,
              width: `${ent.width}px`,
              height: `${ent.height}px`
            }}
          >
            <span className="text-xl">{ent.icon}</span>
            <span className="text-[7px] text-white font-pixel text-center leading-none mt-0.5 truncate max-w-full">
              {ent.name.split(' ')[0]}
            </span>
          </div>
        ))}

        {/* ======================================================== */}
        {/* 3RD PERSON PLAYER SPRITE: Tommy Clarke in Trench Coat    */}
        {/* ======================================================== */}
        <div
          className="absolute pointer-events-none flex flex-col items-center transition-transform"
          style={{
            left: `${posX - 16}px`,
            top: `${posY - 24}px`,
            width: '32px',
            height: '42px',
            transform: isMoving && walkFrame > 10 ? 'scaleX(-1)' : 'scaleX(1)'
          }}
        >
          {/* Head & Tweed Flat Cap */}
          <div className="w-5 h-4 bg-neutral-700 border border-neutral-400 rounded-t-sm relative flex items-center justify-center">
            {/* Flat cap visor */}
            <div className="absolute -top-1 w-6 h-1.5 bg-neutral-900 border border-neutral-600 rounded" />
            <div className="w-1 h-1 bg-amber-300 rounded-full" />
          </div>

          {/* Trench Coat Body */}
          <div className="w-7 h-5 bg-neutral-800 border-2 border-neutral-500 relative flex items-center justify-center">
            {/* Red SOUL heartbeat badge */}
            <span className="text-[9px] text-red-500 animate-soul">❤️</span>
            {/* Belt */}
            <div className="absolute bottom-0 w-full h-1 bg-amber-800" />
          </div>

          {/* Stepping Legs Animation */}
          <div className="flex gap-2">
            <div
              className={`w-2 h-3 bg-neutral-900 border border-neutral-700 transition-all ${
                isMoving && walkFrame < 10 ? 'h-2 -translate-y-0.5' : 'h-3'
              }`}
            />
            <div
              className={`w-2 h-3 bg-neutral-900 border border-neutral-700 transition-all ${
                isMoving && walkFrame >= 10 ? 'h-2 -translate-y-0.5' : 'h-3'
              }`}
            />
          </div>

          {/* Directional Indicator */}
          <div className="text-[8px] text-yellow-300 font-pixel mt-0.5">
            {facing === 'up' && '▲'}
            {facing === 'down' && '▼'}
            {facing === 'left' && '◄'}
            {facing === 'right' && '►'}
          </div>
        </div>

        {/* Proximity Interaction Prompt Banner */}
        {activeNearbyEntity && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/95 border-2 border-yellow-400 p-2.5 px-5 flex items-center gap-3 shadow-[0_0_20px_rgba(234,179,8,0.6)] animate-bounce">
            <span className="text-red-500 text-sm animate-soul">❤️</span>
            <div className="flex flex-col text-left">
              <span className="text-yellow-300 font-bold text-xs">{activeNearbyEntity.prompt}</span>
              <span className="text-[9px] text-neutral-400">{activeNearbyEntity.role}</span>
            </div>
            <button
              onClick={() => triggerInteraction(activeNearbyEntity)}
              className="ml-2 px-3 py-1 bg-yellow-400 text-black font-bold text-[10px] border border-white hover:bg-yellow-300 cursor-pointer"
            >
              [PRESS X / ENTER]
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* VIRTUAL PS1 CONTROLLER BAR FOR TOUCH & GAMEPAD HUD       */}
      {/* ======================================================== */}
      <div className="w-full max-w-4xl mt-3 flex flex-wrap items-center justify-between p-3 ut-box bg-black/90 text-xs">
        {/* Direction Controls / Touch D-Pad */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-neutral-400 mr-2">D-PAD:</span>
          <div className="grid grid-cols-3 gap-1">
            <div />
            <button
              onMouseDown={() => (keysPressed.current['ArrowUp'] = true)}
              onMouseUp={() => (keysPressed.current['ArrowUp'] = false)}
              className="px-2 py-1 bg-neutral-900 border border-neutral-700 hover:border-yellow-400 text-[10px]"
            >
              ▲
            </button>
            <div />
            <button
              onMouseDown={() => (keysPressed.current['ArrowLeft'] = true)}
              onMouseUp={() => (keysPressed.current['ArrowLeft'] = false)}
              className="px-2 py-1 bg-neutral-900 border border-neutral-700 hover:border-yellow-400 text-[10px]"
            >
              ◄
            </button>
            <button
              onMouseDown={() => (keysPressed.current['ArrowDown'] = true)}
              onMouseUp={() => (keysPressed.current['ArrowDown'] = false)}
              className="px-2 py-1 bg-neutral-900 border border-neutral-700 hover:border-yellow-400 text-[10px]"
            >
              ▼
            </button>
            <button
              onMouseDown={() => (keysPressed.current['ArrowRight'] = true)}
              onMouseUp={() => (keysPressed.current['ArrowRight'] = false)}
              className="px-2 py-1 bg-neutral-900 border border-neutral-700 hover:border-yellow-400 text-[10px]"
            >
              ►
            </button>
          </div>
        </div>

        {/* Action PS1 Symbols */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (activeNearbyEntity) triggerInteraction(activeNearbyEntity);
            }}
            className="w-10 h-10 rounded-full border-2 border-cyan-400 bg-neutral-950 flex flex-col items-center justify-center font-bold text-cyan-400 hover:bg-neutral-900 cursor-pointer shadow-[0_0_8px_rgba(34,211,238,0.4)]"
            title="Interact (Cross X)"
          >
            ✕
            <span className="text-[7px] text-neutral-400">ACT</span>
          </button>

          <button
            onClick={() => setIsSprinting(s => !s)}
            className={`w-10 h-10 rounded-full border-2 border-pink-400 bg-neutral-950 flex flex-col items-center justify-center font-bold hover:bg-neutral-900 cursor-pointer ${
              isSprinting ? 'bg-pink-950 text-pink-300 shadow-[0_0_10px_#f472b6]' : 'text-pink-400'
            }`}
            title="Sprint Toggle (Square)"
          >
            □
            <span className="text-[7px] text-neutral-400">RUN</span>
          </button>

          <button
            onClick={onOpenDossier}
            className="w-10 h-10 rounded-full border-2 border-emerald-400 bg-neutral-950 flex flex-col items-center justify-center font-bold text-emerald-400 hover:bg-neutral-900 cursor-pointer"
            title="Dossier (Triangle)"
          >
            △
            <span className="text-[7px] text-neutral-400">DOS</span>
          </button>

          <button
            onClick={onOpenSave}
            className="w-10 h-10 rounded-full border-2 border-red-500 bg-neutral-950 flex flex-col items-center justify-center font-bold text-red-500 hover:bg-neutral-900 cursor-pointer"
            title="Save File (Circle)"
          >
            ○
            <span className="text-[7px] text-neutral-400">SAVE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
