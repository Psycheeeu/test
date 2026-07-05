import { useEffect, useRef, useState, useMemo } from 'react';
import type { Channel } from '../data/channels';

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface ProgrammeGuideModalProps {
  channel: Channel;
  onClose: () => void;
}

export default function ProgrammeGuideModal({ channel, onClose }: ProgrammeGuideModalProps) {
  const programs = channel.programs;
  const [focusedIndex, setFocusedIndex] = useState(0);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Find the currently airing programme and start focus there
  const initialIndex = useMemo(() => {
    if (!programs || programs.length === 0) return 0;
    const now = Date.now();
    const idx = programs.findIndex(
      p => typeof p.startMs === 'number' && typeof p.endMs === 'number' && p.startMs <= now && p.endMs > now
    );
    return idx >= 0 ? idx : 0;
  }, [programs]);

  useEffect(() => {
    setFocusedIndex(initialIndex);
  }, [initialIndex]);

  // Scroll focused row into view
  useEffect(() => {
    rowRefs.current[focusedIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [focusedIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(i => Math.min(i + 1, (programs?.length ?? 1) - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(i => Math.max(i - 1, 0));
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, programs?.length]);

  if (!programs || programs.length === 0) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="w-full max-w-2xl mx-4 bg-[#060608]/98 border border-white/10 rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-black text-white">Programme Guide</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="p-6">
            <p className="text-white/50 text-sm">No programme information available for this channel.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-4 max-h-[85vh] flex flex-col bg-[#060608]/98 border border-white/10 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div>
            <h2 className="text-xl font-black text-white">Programme Guide</h2>
            <p className="text-sm text-white/50 mt-1">
              {channel.name} • {programs.length} programme{programs.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition-all hover:bg-white/8 hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-2">
            {programs.map((program, idx) => {
              const hasTimestamp = typeof program.startMs === 'number' && typeof program.endMs === 'number';
              const isCurrent = hasTimestamp && 
                program.startMs! <= Date.now() && 
                program.endMs! > Date.now();
              const isFocused = focusedIndex === idx;
              
              return (
                <div
                  key={idx}
                  ref={(el) => { rowRefs.current[idx] = el; }}
                  onMouseEnter={() => setFocusedIndex(idx)}
                  className={`p-4 rounded-[14px] border transition-all ${
                    isFocused
                      ? 'bg-white text-black border-white/35 shadow-[0_0_35px_rgba(255,255,255,0.12)]'
                      : isCurrent
                      ? 'bg-white/[0.06] border-white/15'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-1.5">
                    <h3 className={`font-bold text-sm sm:text-base leading-tight ${isFocused ? 'text-black' : 'text-white'}`}>
                      {program.title}
                    </h3>
                    {isCurrent && !isFocused && (
                      <span className="shrink-0 h-2 w-2 mt-1.5 rounded-full bg-red-500 live-pulse" />
                    )}
                    {isCurrent && isFocused && (
                      <span className="shrink-0 px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase tracking-wide rounded-full">
                        Now
                      </span>
                    )}
                  </div>
                  
                  <div className={`flex items-center gap-3 text-xs mb-1.5 ${isFocused ? 'text-black/55' : 'text-white/40'}`}>
                    {hasTimestamp && (
                      <span className={`font-mono text-[11px] ${isFocused ? 'text-black/65' : isCurrent ? 'text-sky-400/80' : 'text-white/35'}`}>
                        {new Date(program.startMs!).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false 
                        })}
                        {' – '}
                        {new Date(program.endMs!).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false 
                        })}
                      </span>
                    )}
                    {program.genre && (
                      <>
                        <span>•</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider">{program.genre}</span>
                      </>
                    )}
                  </div>
                  
                  {isFocused && program.description && (
                    <p className={`text-xs leading-relaxed mt-2 ${isFocused ? 'text-black/50' : 'text-white/40'}`}>
                      {program.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
