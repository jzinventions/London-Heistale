import React, { useState, useEffect } from 'react';
import { audio } from '../services/audio';

interface BootSequenceProps {
  onBootComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onBootComplete }) => {
  // Stages: 0: CRT flash, 1: EA Parody, 2: PS1 Logo Boot, 3: Warning Screen
  const [stage, setStage] = useState<number>(0);
  const [memoryCardStatus, setMemoryCardStatus] = useState<string>('CHECKING MEMORY CARD (8MB)...');

  useEffect(() => {
    // Stage 0 -> Stage 1: CRT Power-on
    const t0 = setTimeout(() => {
      setStage(1);
      audio.playEAParody();
    }, 600);

    // Stage 1 -> Stage 2: PS1 Boot Logo
    const t1 = setTimeout(() => {
      setStage(2);
      audio.playPs1Boot();
      setTimeout(() => setMemoryCardStatus('MEMORY CARD (PS1) SLOT 1 : OK'), 2000);
    }, 3200);

    // Stage 2 -> Stage 3: Warning Screen
    const t2 = setTimeout(() => {
      setStage(3);
      audio.playSelect();
    }, 7800);

    // Stage 3 -> Game Title
    const t3 = setTimeout(() => {
      onBootComplete();
    }, 12500);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onBootComplete]);

  // Allow user to skip anytime with key or click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'z' || e.key === 'Escape') {
        audio.playConfirm();
        onBootComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBootComplete]);

  return (
    <div
      onClick={() => {
        audio.playConfirm();
        onBootComplete();
      }}
      className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center p-6 select-none cursor-pointer overflow-hidden font-pixel"
    >
      {/* ======================================================== */}
      {/* STAGE 1: EA GAMES PARODY LOGO                            */}
      {/* ======================================================== */}
      {stage === 1 && (
        <div className="flex flex-col items-center animate-fadeIn gap-6 text-center max-w-lg">
          <div className="w-28 h-28 border-4 border-yellow-400 bg-neutral-950 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.4)]">
            <span className="text-4xl font-extrabold tracking-tighter text-yellow-400">
              MG
            </span>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-widest text-white">
              METROPOLITAN GAMES
            </h1>
            <p className="text-xs md:text-sm text-yellow-300 font-pixel tracking-wider animate-pulse">
              &quot;IT&apos;S IN THE VAULT.&quot;
            </p>
          </div>
          <p className="text-[10px] text-neutral-500 pt-4">
            LICENSED UNDER HER MAJESTY&apos;S SPECIAL COMMERCE BRANCH 1994
          </p>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 2: ICONIC SONY PS1 RETRO BOOT SEQUENCE             */}
      {/* ======================================================== */}
      {stage === 2 && (
        <div className="flex flex-col items-center animate-fadeIn gap-8 text-center max-w-xl">
          {/* PS1 Polygon Geometric Rhombus Emblem */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Ambient ethereal glow */}
            <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />
            <div className="w-28 h-28 border-4 border-white/90 bg-gradient-to-br from-amber-600 via-orange-500 to-purple-800 rotate-45 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.6)]">
              <span className="-rotate-45 text-2xl font-bold text-white tracking-tighter drop-shadow-md">
                PS1
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold tracking-widest text-white">
              POLYSTATION
            </h2>
            <p className="text-xs text-neutral-400 tracking-wider">
              COMPUTER ENTERTAINMENT EUROPE
            </p>
          </div>

          <div className="border-t border-neutral-800 pt-4 w-full flex flex-col items-center gap-1.5 text-[10px] text-neutral-400">
            <p className="text-yellow-400 animate-pulse">{memoryCardStatus}</p>
            <p>LICENSED BY METROPOLITAN POLICE SYNDICATE</p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 3: WARNING & CROWN ANTI-PIRACY SCREEN              */}
      {/* ======================================================== */}
      {stage === 3 && (
        <div className="flex flex-col items-center animate-fadeIn gap-6 text-center max-w-2xl border-4 border-red-600 bg-neutral-950 p-6 md:p-8 shadow-[0_0_30px_rgba(220,38,38,0.35)]">
          <div className="flex items-center gap-3 text-red-500">
            <span className="text-2xl">⚠️</span>
            <h2 className="text-sm md:text-base font-bold tracking-widest text-red-500">
              OFFICIAL WARNING // METROPOLITAN CRIME ACT 1994
            </h2>
            <span className="text-2xl">⚠️</span>
          </div>

          <div className="space-y-3 text-[11px] leading-relaxed text-neutral-300 text-left font-pixel">
            <p>
              * THE DRILLING OF REINFORCED CHUBB VAULTS AND UNLAWFUL APPROPRIATION OF DEPOSIT BOXES CARRIES A MAXIMUM SENTENCE OF 25 YEARS IMPRISONMENT IN H.M. PRISON BELMARSH.
            </p>
            <p>
              * THIS IS AN INTERACTIVE RETRO PS1 / UNDERTALE RPG RE-ENACTMENT. CHARACTERS AND CHOICES MAY CAUSE SEVERE EMOTIONAL NOSTALGIA AND A BITTERSWEET SAD CONCLUSION.
            </p>
            <p className="text-yellow-300">
              * A PERSISTENT CRIMINAL DOSSIER AND THREE 8MB MEMORY SLOTS ARE INITIALIZED. YOUR ACTIONS ARE PERMANENT.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs text-yellow-400 animate-bounce">
            <span className="text-red-500">❤️</span>
            <span>[PRESS ANY BUTTON / CLICK TO BEGIN]</span>
          </div>
        </div>
      )}

      {/* Persistent Skip hint */}
      <div className="absolute bottom-4 right-6 text-[9px] text-neutral-600 font-pixel">
        PRESS [ENTER] / [SPACE] OR CLICK TO SKIP
      </div>
    </div>
  );
};
