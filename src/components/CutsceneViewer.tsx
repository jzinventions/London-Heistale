import React, { useEffect, useState } from 'react';
import { audio } from '../services/audio';

interface CutsceneViewerProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  storyLines: string[];
  isEnding?: boolean;
  endingKey?: 'sad_prison' | 'sad_waterloo_sacrifice' | 'sad_fugitive_exile' | 'sad_solitary_rain';
  onContinue: () => void;
  onRestartGame?: () => void;
}

export const CutsceneViewer: React.FC<CutsceneViewerProps> = ({
  imageSrc,
  title,
  subtitle,
  storyLines,
  isEnding = false,
  endingKey,
  onContinue,
  onRestartGame
}) => {
  const [lineIdx, setLineIdx] = useState<number>(0);
  const [charIdx, setCharIdx] = useState<number>(0);

  const currentLine = storyLines[lineIdx] || '';

  useEffect(() => {
    if (isEnding) {
      audio.playBGM('sad_ending');
    } else {
      audio.playBGM('tension');
    }
  }, [isEnding]);

  // Typewriter effect & Real Narration for cutscene lines
  useEffect(() => {
    setCharIdx(0);
    if (currentLine) {
      audio.speakDialogue(currentLine, isEnding ? 'star' : 'narrator');
    }

    const timer = window.setInterval(() => {
      setCharIdx(prev => {
        if (prev < currentLine.length) {
          if (prev % 2 === 0) audio.playDialogueBeep(isEnding ? 'star' : 'narrator');
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 32);

    return () => {
      clearInterval(timer);
      audio.stopSpeaking();
    };
  }, [lineIdx, currentLine, isEnding]);

  const handleNext = () => {
    if (charIdx < currentLine.length) {
      // Instant display
      setCharIdx(currentLine.length);
      audio.playSelect();
    } else if (lineIdx < storyLines.length - 1) {
      setLineIdx(prev => prev + 1);
      audio.playSelect();
    } else {
      audio.playConfirm();
      onContinue();
    }
  };

  const getEndingTitle = () => {
    switch (endingKey) {
      case 'sad_waterloo_sacrifice':
        return 'ENDING 1: THE WATERLOO SACRIFICE';
      case 'sad_prison':
        return 'ENDING 2: HER MAJESTY\'S PLEASURE (20 YEARS)';
      case 'sad_fugitive_exile':
        return 'ENDING 3: THE HOLLOW EXILE IN THE RAIN';
      case 'sad_solitary_rain':
        return 'ENDING 4: THE THAMES SWALLOWS ALL';
      default:
        return title;
    }
  };

  return (
    <div
      onClick={handleNext}
      className="w-full max-w-4xl mx-auto flex flex-col items-center select-none cursor-pointer relative"
    >
      {/* Cinematic PS1 4:3 / 16:9 Frame */}
      <div className="w-full relative ut-box overflow-hidden bg-black aspect-[16/9] max-h-[460px] shadow-[0_0_30px_rgba(0,0,0,0.9)] flex items-center justify-center">
        {/* Cutscene Image */}
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover pixelated opacity-90 transition-transform duration-10000 hover:scale-105"
        />

        {/* Rain Filter Overlay for sad ending */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

        {/* Film Letterbox bars */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-black/80 border-b border-neutral-900 flex items-center px-4 justify-between font-pixel text-[9px] text-neutral-400">
          <span>LONDON 1994 // HATTON GARDEN INCIDENT</span>
          <span>{subtitle}</span>
        </div>

        {/* Ending Watermark / Header */}
        <div className="absolute top-12 left-6 right-6 font-pixel text-center">
          <h2 className="text-sm md:text-base text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {getEndingTitle()}
          </h2>
        </div>

        {/* Subtitle Box inside Frame */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/90 border-2 border-white p-4 min-h-[90px] flex flex-col justify-between">
          <p className="font-dialogue text-2xl md:text-3xl text-white tracking-wide leading-relaxed">
            {currentLine.substring(0, charIdx)}
            {charIdx < currentLine.length && (
              <span className="inline-block w-2.5 h-6 bg-yellow-400 ml-1 animate-pulse" />
            )}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[10px] font-pixel text-neutral-400">
            <span>
              {lineIdx < storyLines.length - 1
                ? `[CLICK / SPACE TO ADVANCE (${lineIdx + 1}/${storyLines.length})]`
                : isEnding
                ? '[TRAGIC CONCLUSION]'
                : '[CUTSCENE END]'}
            </span>
            <span className="text-yellow-400">▼</span>
          </div>
        </div>
      </div>

      {/* Post-Ending Actions */}
      {isEnding && lineIdx >= storyLines.length - 1 && charIdx >= currentLine.length && (
        <div className="mt-4 flex items-center gap-4 animate-fadeIn">
          {onRestartGame && (
            <button
              onClick={e => {
                e.stopPropagation();
                audio.playConfirm();
                onRestartGame();
              }}
              className="px-6 py-2.5 bg-yellow-400 text-black font-pixel text-xs font-bold border-2 border-white hover:bg-yellow-300 cursor-pointer shadow-[0_0_12px_#fef08a]"
            >
              [RESTART FROM TITLE / NEW PLAYTHROUGH]
            </button>
          )}
        </div>
      )}
    </div>
  );
};
