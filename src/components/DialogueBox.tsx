import React, { useState, useEffect, useRef } from 'react';
import { VoiceType, StoryChoice } from '../types/game';
import { audio } from '../services/audio';

interface DialogueBoxProps {
  speaker?: string;
  speakerRole?: string;
  speakerVoice?: VoiceType;
  speakerPortrait?: string;
  dialogueLines: string[];
  choices: StoryChoice[];
  onSelectChoice: (choice: StoryChoice) => void;
  onOpenSave?: () => void;
  hasSavePoint?: boolean;
  determinationQuote?: string;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  speakerRole,
  speakerVoice = 'narrator',
  speakerPortrait,
  dialogueLines,
  choices,
  onSelectChoice,
  onOpenSave,
  hasSavePoint,
  determinationQuote
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [mouthOpen, setMouthOpen] = useState<boolean>(false);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number>(0);

  const fullLine = dialogueLines[currentLineIndex] || '';
  const typewriterTimerRef = useRef<number | null>(null);

  // Typewriter effect & Real Voice Acting
  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');
    let charIdx = 0;

    // Trigger Real Talking Speech Acting
    if (fullLine) {
      audio.speakDialogue(fullLine, speakerVoice);
    }

    if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);

    typewriterTimerRef.current = window.setInterval(() => {
      if (charIdx < fullLine.length) {
        setDisplayedText(fullLine.substring(0, charIdx + 1));
        const char = fullLine[charIdx];

        // Play voice beep on alphanumeric characters
        if (char && /[a-zA-Z0-9]/.test(char) && charIdx % 2 === 0) {
          audio.playDialogueBeep(speakerVoice);
          setMouthOpen(prev => !prev);
        }

        charIdx++;
      } else {
        setIsTyping(false);
        setMouthOpen(false);
        if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
      }
    }, 28);

    return () => {
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
      audio.stopSpeaking();
    };
  }, [currentLineIndex, fullLine, speakerVoice]);

  // When dialogue finishes all lines, allow choice selection
  const isLastLine = currentLineIndex >= dialogueLines.length - 1;
  const canShowChoices = isLastLine && !isTyping && choices.length > 0;

  const handleAdvance = () => {
    if (isTyping) {
      // Instant reveal
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
      setDisplayedText(fullLine);
      setIsTyping(false);
      setMouthOpen(false);
      audio.playSelect();
    } else if (!isLastLine) {
      setCurrentLineIndex(prev => prev + 1);
      audio.playSelect();
    }
  };

  // Keyboard navigation for advancing and selecting choices
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (canShowChoices) {
        if (e.key === 'ArrowDown' || e.key === 's') {
          setSelectedChoiceIdx(prev => (prev + 1) % choices.length);
          audio.playSelect();
        } else if (e.key === 'ArrowUp' || e.key === 'w') {
          setSelectedChoiceIdx(prev => (prev - 1 + choices.length) % choices.length);
          audio.playSelect();
        } else if (e.key === 'Enter' || e.key === 'z' || e.key === ' ') {
          if (choices[selectedChoiceIdx]) {
            audio.playConfirm();
            onSelectChoice(choices[selectedChoiceIdx]);
          }
        }
      } else {
        if (e.key === 'Enter' || e.key === 'z' || e.key === ' ') {
          handleAdvance();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canShowChoices, isTyping, isLastLine, choices, selectedChoiceIdx]);

  return (
    <div className="w-full flex flex-col gap-3 max-w-4xl mx-auto select-none">
      {/* Save Star notification if present */}
      {hasSavePoint && (
        <div className="flex items-center justify-between ut-box-accent p-2.5 px-4 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-xl text-yellow-300 animate-star">⭐</span>
            <span className="font-pixel text-[11px] text-yellow-300">
              {determinationQuote || 'A strange yellow star glows in the rain. Your soul feels resolute.'}
            </span>
          </div>
          {onOpenSave && (
            <button
              onClick={() => {
                audio.playSaveTwinkle();
                onOpenSave();
              }}
              className="px-3 py-1 font-pixel text-xs bg-yellow-400 text-black font-bold border-2 border-white hover:bg-yellow-300 cursor-pointer shadow-[0_0_8px_#fef08a]"
            >
              [SAVE FILE]
            </button>
          )}
        </div>
      )}

      {/* Main Undertale Dialogue Window */}
      <div
        onClick={handleAdvance}
        className="ut-box p-4 md:p-6 cursor-pointer hover:border-yellow-200 transition-colors relative min-h-[170px] flex flex-col md:flex-row gap-4 items-start"
      >
        {/* Speaker Avatar & Talking Mouth Animation */}
        {speaker && (
          <div className="flex flex-col items-center shrink-0 w-24">
            <div className="w-20 h-20 bg-neutral-900 border-2 border-white flex items-center justify-center relative overflow-hidden">
              {speakerPortrait ? (
                <img
                  src={speakerPortrait}
                  alt={speaker}
                  className="w-full h-full object-cover pixelated"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-3xl">
                    {speakerVoice === 'arthur' && '🦊'}
                    {speakerVoice === 'dave' && '🦍'}
                    {speakerVoice === 'dizzy' && '🏎️'}
                    {speakerVoice === 'police' && '👮'}
                    {speakerVoice === 'star' && '⭐'}
                    {speakerVoice === 'narrator' && '📜'}
                  </span>
                  {/* Subtle 8-bit talking mouth toggle */}
                  <div
                    className={`w-4 h-1.5 bg-white mt-1.5 transition-all ${
                      mouthOpen ? 'h-3 scale-y-125' : 'h-1'
                    }`}
                  />
                </div>
              )}
            </div>
            <p className="font-pixel text-[10px] text-yellow-300 mt-1.5 text-center leading-tight">
              {speaker}
            </p>
            {speakerRole && (
              <span className="text-[8px] font-pixel text-neutral-400 text-center">
                {speakerRole}
              </span>
            )}
          </div>
        )}

        {/* Text Container */}
        <div className="flex-1 flex flex-col justify-between h-full min-h-[120px] w-full">
          <div className="font-dialogue text-2xl md:text-3xl text-white tracking-wide leading-relaxed">
            {displayedText}
            {isTyping && <span className="inline-block w-2.5 h-6 bg-yellow-400 ml-1 animate-pulse" />}
          </div>

          {/* Advance Prompt & Voice Replay */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[10px] font-pixel text-neutral-400">
            <div className="flex items-center gap-3">
              <span>
                {!isLastLine ? `[PRESS Z / CLICK TO CONTINUE (${currentLineIndex + 1}/${dialogueLines.length})]` : '[CHOICE READY]'}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  audio.speakDialogue(fullLine, speakerVoice);
                }}
                className="text-[9px] text-yellow-400 hover:text-white flex items-center gap-1 border border-neutral-800 px-1.5 py-0.5"
                title="Hear character voice again"
              >
                <span>🔊</span>
                <span>REPLAY VOICE</span>
              </button>
            </div>
            <span className="text-yellow-400">
              {!isTyping && !isLastLine && '▼'}
            </span>
          </div>
        </div>
      </div>

      {/* Choices Menu */}
      {canShowChoices && (
        <div className="ut-box p-4 flex flex-col gap-2.5 bg-neutral-950 animate-fadeIn">
          <p className="font-pixel text-[11px] text-yellow-400 mb-1 flex items-center gap-2">
            <span>DECIDE YOUR COURSE:</span>
            <span className="text-[9px] text-neutral-400">({choices.length} choices available)</span>
          </p>

          {choices.map((choice, idx) => {
            const isSelected = selectedChoiceIdx === idx;
            return (
              <button
                key={choice.id}
                onClick={() => {
                  audio.playConfirm();
                  onSelectChoice(choice);
                }}
                onMouseEnter={() => {
                  setSelectedChoiceIdx(idx);
                  audio.playSelect();
                }}
                className={`text-left p-3 border-2 transition-all flex flex-col gap-1 cursor-pointer ${
                  isSelected
                    ? 'border-yellow-400 bg-neutral-900 shadow-[0_0_10px_rgba(234,179,8,0.4)]'
                    : 'border-neutral-800 hover:border-neutral-600 bg-black'
                }`}
              >
                <div className="flex items-center gap-2 font-pixel text-xs text-white">
                  <span className={`text-sm ${isSelected ? 'text-red-500 animate-bounce' : 'text-transparent'}`}>
                    ❤️
                  </span>
                  <span className={isSelected ? 'text-yellow-300 font-bold' : 'text-neutral-200'}>
                    {choice.label}
                  </span>
                </div>
                {choice.subtext && (
                  <p className="font-pixel text-[9px] text-neutral-400 pl-6">
                    {choice.subtext}
                  </p>
                )}
                {choice.givesItem && (
                  <div className="pl-6 text-[9px] font-pixel text-emerald-400 flex items-center gap-1">
                    <span>+ Item:</span>
                    <span className="underline">{choice.givesItem.name}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
