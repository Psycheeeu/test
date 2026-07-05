import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { channels, Channel } from './data/channels';
import { loadEpgForChannels } from './data/epg';
import { StreamInfo, VideoSettings, defaultSettings, defaultStreamInfo } from './data/videoSettings';
import TVScreen from './components/TVScreen';
import { VideoPlayerHandle } from './components/VideoPlayer';
import ChannelInfo from './components/ChannelInfo';
import ChannelSidebar from './components/ChannelSidebar';
import VideoOptions from './components/VideoOptions';
import ProgrammeGuideModal from './components/ProgrammeGuideModal';

export default function App() {
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [showChannelSidebar, setShowChannelSidebar] = useState(false);
  const [channelSidebarMode, setChannelSidebarMode] = useState<'channels' | 'categories'>('channels');
  const [showVideoOptions, setShowVideoOptions] = useState(false);
  const [showChannelInfo, setShowChannelInfo] = useState(true);
  const [showProgrammeGuide, setShowProgrammeGuide] = useState(false);
  const [introLoading, setIntroLoading] = useState(true);
  const [showNsfw, setShowNsfw] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [streamStatus, setStreamStatus] = useState('idle');
  const [streamInfo, setStreamInfo] = useState<StreamInfo>(defaultStreamInfo);
  const [videoSettings, setVideoSettings] = useState<VideoSettings>(defaultSettings);
  const [lineup, setLineup] = useState<Channel[]>(channels);
  const visibleLineup = useMemo(() => lineup.filter(c => showNsfw || !c.isAdult), [lineup, showNsfw]);
  const [adultUnlocked, setAdultUnlocked] = useState(() => sessionStorage.getItem('adultUnlocked') === 'true');
  const [pendingAdultIndex, setPendingAdultIndex] = useState<number | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [rememberAdultPin, setRememberAdultPin] = useState(false);

  const infoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoPlayerRef = useRef<VideoPlayerHandle>(null);

  const currentChannel = visibleLineup[currentChannelIndex] ?? visibleLineup[0];

  useEffect(() => {
    let cancelled = false;
    loadEpgForChannels(channels).then((updatedLineup) => {
      if (!cancelled) setLineup(updatedLineup);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (introLoading || pendingAdultIndex !== null) return;
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || introLoading || pendingAdultIndex !== null) return;
    
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    const threshold = 50;
    
    if (Math.max(absDx, absDy) > threshold) {
      if (absDx > absDy) {
        // Horizontal swipe
        if (dx < 0) {
          // Left swipe -> Settings
          if (!showChannelSidebar) toggleVideoOptions();
          else setShowChannelSidebar(false);
        } else {
          // Right swipe -> Guide
          if (!showVideoOptions) toggleChannelSidebar();
          else setShowVideoOptions(false);
        }
      } else {
        // Vertical swipe - only if sidebars are closed
        if (!showChannelSidebar && !showVideoOptions) {
          if (dy < 0) {
            // Up swipe
            channelUp();
          } else {
            // Down swipe
            channelDown();
          }
        }
      }
    }
    
    touchStart.current = null;
  };

  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroReady(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const dismissIntro = useCallback(() => {
    if (!introReady) return;
    setIntroLoading(false);
    setShowChannelInfo(true);
  }, [introReady]);

  // Handle channel change
  const changeChannel = useCallback(
    (index: number) => {
      if (index < 0 || index >= visibleLineup.length) return;
      setIsTransitioning(true);
      setShowChannelInfo(true);
      setStreamInfo({ ...defaultStreamInfo, manifestUrl: visibleLineup[index].stream?.url ?? '' });
      setVideoSettings((prev) => ({
        ...prev,
        quality: 'auto',
        audioTrack: 'auto',
        subtitles: false,
        subtitleTrack: 'Default',
      }));

      setTimeout(() => {
        setCurrentChannelIndex(index);
        setIsTransitioning(false);
      }, 150);

      // Auto-hide channel info
      if (infoTimer.current) clearTimeout(infoTimer.current);
      infoTimer.current = setTimeout(() => {
        setShowChannelInfo(false);
      }, 4000);
    },
    [visibleLineup]
  );

  const requestChannelChange = useCallback((index: number) => {
    if (index < 0 || index >= visibleLineup.length) return;
    const targetChannel = visibleLineup[index];

    if (targetChannel.isAdult && !adultUnlocked) {
      setPendingAdultIndex(index);
      setPinInput('');
      setPinError('');
      setShowChannelSidebar(false);
      setShowVideoOptions(false);
      return;
    }

    changeChannel(index);
  }, [adultUnlocked, changeChannel, visibleLineup]);

  const submitAdultPin = useCallback(() => {
    if (pinInput === '670420' && pendingAdultIndex !== null) {
      if (rememberAdultPin) {
        setAdultUnlocked(true);
        sessionStorage.setItem('adultUnlocked', 'true');
      }
      setPendingAdultIndex(null);
      setPinInput('');
      setPinError('');
      changeChannel(pendingAdultIndex);
      return;
    }

    setPinError('Incorrect PIN');
    setPinInput('');
  }, [changeChannel, pendingAdultIndex, pinInput, rememberAdultPin]);

  // Channel up/down
  const channelUp = useCallback(() => {
    requestChannelChange((currentChannelIndex + 1) % visibleLineup.length);
  }, [currentChannelIndex, requestChannelChange, visibleLineup.length]);

  const channelDown = useCallback(() => {
    requestChannelChange(
      (currentChannelIndex - 1 + visibleLineup.length) % visibleLineup.length
    );
  }, [currentChannelIndex, requestChannelChange, visibleLineup.length]);

  // Toggle panels — left/right exclusive
  const toggleChannelSidebar = useCallback(() => {
    setShowChannelSidebar((isOpen) => {
      if (!isOpen) {
        setChannelSidebarMode('channels');
        return true;
      }

      if (channelSidebarMode === 'channels') {
        setChannelSidebarMode('categories');
        return true;
      }

      setChannelSidebarMode('channels');
      return false;
    });
    setShowVideoOptions(false);
  }, [channelSidebarMode]);

  const toggleVideoOptions = useCallback(() => {
    setShowVideoOptions((s) => !s);
    setShowChannelSidebar(false);
  }, []);

  // Video settings change
  const handleSettingsChange = useCallback((partial: Partial<VideoSettings>) => {
    setVideoSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const refreshStream = useCallback(() => {
    setVideoSettings((prev) => ({ ...prev, reloadToken: prev.reloadToken + 1 }));
  }, []);

  const toggleFavorite = useCallback((channelNumber?: number) => {
    const number = channelNumber ?? currentChannel.number;
    setFavorites((current) => current.includes(number)
      ? current.filter((item) => item !== number)
      : [...current, number]
    );
  }, [currentChannel.number]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Programme Guide modal has highest priority
      if (showProgrammeGuide) {
        if (e.key === 'Escape') {
          setShowProgrammeGuide(false);
        }
        return;
      }

      if (pendingAdultIndex !== null) {
        return;
      }

      // If sidebar or options panel is open, arrow keys navigate inside them
      // but ESC closes them
      if (showChannelSidebar || showVideoOptions) {
        if (e.key === 'Escape') {
          setShowChannelSidebar(false);
          setShowVideoOptions(false);
          setChannelSidebarMode('channels');
        }
        // Left arrow toggles sidebar, right arrow toggles options
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          toggleChannelSidebar();
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          toggleVideoOptions();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          channelUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          channelDown();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          toggleChannelSidebar();
          break;
        case 'ArrowRight':
          e.preventDefault();
          toggleVideoOptions();
          break;
        case 'Escape':
          setShowChannelInfo(false);
          break;
        case 'Enter':
          setShowChannelInfo(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showProgrammeGuide,
    showChannelSidebar,
    showVideoOptions,
    pendingAdultIndex,
    channelUp,
    channelDown,
    toggleChannelSidebar,
    toggleVideoOptions,
  ]);

  // Auto-hide channel info
  useEffect(() => {
    if (showChannelInfo && !showChannelSidebar && !showVideoOptions) {
      if (infoTimer.current) clearTimeout(infoTimer.current);
      infoTimer.current = setTimeout(() => {
        setShowChannelInfo(false);
      }, 4000);
    }
    return () => {
      if (infoTimer.current) clearTimeout(infoTimer.current);
    };
  }, [showChannelInfo, showChannelSidebar, showVideoOptions]);

  // Update time every minute
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative h-[100dvh] w-screen bg-black overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main TV Screen */}
      <div className="absolute inset-0">
        {!introLoading && (
          <TVScreen
            ref={videoPlayerRef}
            channel={currentChannel}
            isTransitioning={isTransitioning}
            settings={videoSettings}
            onStatusChange={setStreamStatus}
            onStreamInfoChange={setStreamInfo}
            onSettingsChange={handleSettingsChange}
          />
        )}
      </div>

      {/* Channel info overlay */}
      <ChannelInfo channel={currentChannel} visible={!introLoading && showChannelInfo} streamInfo={streamInfo} />

      {!introLoading && showChannelInfo && !showChannelSidebar && !showVideoOptions && (
        <div className="pointer-events-none absolute right-8 top-8 z-20 font-mono text-[48px] font-black leading-none tracking-[0.04em] text-white/45 drop-shadow-2xl sm:right-12 sm:top-10">
          {String(currentChannel.number).padStart(3, '0')}
        </div>
      )}

      {/* Channel Sidebar (left arrow) */}
      <ChannelSidebar
        channels={visibleLineup}
        visible={!introLoading && showChannelSidebar}
        mode={channelSidebarMode}
        onModeChange={setChannelSidebarMode}
        currentChannel={currentChannel}
        onSelectChannel={(ch) => {
          const idx = visibleLineup.findIndex((c) => c.number === ch.number);
          requestChannelChange(idx);
          setShowChannelSidebar(false);
        }}
        onClose={() => {
          setShowChannelSidebar(false);
          setChannelSidebarMode('channels');
        }}
        favorites={favorites}
      />

      {/* Video Options (right arrow) */}
      <VideoOptions
        visible={!introLoading && showVideoOptions}
        channel={currentChannel}
        settings={videoSettings}
        streamInfo={streamInfo}
        onSettingsChange={handleSettingsChange}
        onRefresh={refreshStream}
        isFavorite={favorites.includes(currentChannel.number)}
        onToggleFavorite={() => toggleFavorite()}
        onClose={() => setShowVideoOptions(false)}
        streamStatus={streamStatus}
        onOpenGuide={() => setShowProgrammeGuide(true)}
      />

      {/* Programme Guide Modal */}
      {showProgrammeGuide && (
        <ProgrammeGuideModal
          channel={currentChannel}
          onClose={() => setShowProgrammeGuide(false)}
        />
      )}

      {pendingAdultIndex !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-[340px] rounded-[24px] border border-white/10 bg-[#0b0b0d] p-6 shadow-2xl shadow-black">
            <div className="text-[11px] font-black uppercase tracking-[0.25em] text-red-400">Restricted Channel</div>
            <h2 className="mt-2 text-2xl font-black text-white">Enter PIN</h2>
            <p className="mt-2 text-sm font-medium leading-5 text-white/40">
              This channel is marked NSFW. Enter the parental PIN to continue.
            </p>
            <input
              value={pinInput}
              onChange={(event) => setPinInput(event.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submitAdultPin();
                if (event.key === 'Escape') setPendingAdultIndex(null);
              }}
              autoFocus
              inputMode="numeric"
              type="password"
              placeholder="PIN"
              className="mt-5 h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-center text-xl font-black tracking-[0.35em] text-white outline-none placeholder:tracking-normal placeholder:text-white/20 focus:border-white/30"
            />
            <label className="mt-4 flex items-center gap-3 text-xs font-bold text-white/45">
              <input
                type="checkbox"
                checked={rememberAdultPin}
                onChange={(event) => setRememberAdultPin(event.target.checked)}
                className="h-4 w-4 accent-white"
              />
              Do not ask for PIN again this session
            </label>
            {pinError && <div className="mt-3 text-center text-xs font-bold text-red-400">{pinError}</div>}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setPendingAdultIndex(null)}
                className="h-11 rounded-2xl bg-white/8 text-sm font-black text-white/55 hover:bg-white/12"
              >
                Cancel
              </button>
              <button
                onClick={submitAdultPin}
                className="h-11 rounded-2xl bg-white text-sm font-black text-black hover:bg-white/85"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Click area to show channel info */}
      <div
        className="absolute inset-0 z-[5] cursor-pointer"
        onClick={() => {
          if (!introLoading && !showChannelSidebar && !showVideoOptions) {
            setShowChannelInfo(true);
          }
        }}
        style={{ pointerEvents: introLoading || showChannelSidebar || showVideoOptions ? 'none' : 'auto' }}
      />

      {introLoading && (
        <div className="absolute inset-0 z-[80] flex flex-col items-center justify-center bg-black px-6">
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 text-white sm:h-[90px] sm:w-[90px]">
              <svg className="h-9 w-9 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 6l-2-3m10 3l2-3M5.5 8.5h13A1.5 1.5 0 0120 10v7a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 17v-7a1.5 1.5 0 011.5-1.5z" />
              </svg>
            </div>
            <div className="mt-6 text-2xl font-black tracking-tight text-white sm:mt-8 sm:text-[32px]">PsycheFlix</div>
            <div className="mt-1 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 sm:text-[11px]">Live TV</div>
            
            <div className="mt-8 h-[2px] w-[160px] overflow-hidden rounded-full bg-white/10 sm:mt-10 sm:h-[3px] sm:w-[200px]">
              <div className="h-full w-full origin-left animate-[loadingBar_5s_ease-in-out_forwards] bg-white" />
            </div>
            <div className="mt-4 text-[9px] font-black uppercase tracking-widest text-white/20">Loading</div>

            <div className="mt-8 flex h-12 items-center justify-center sm:mt-10">
              {introReady && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissIntro();
                  }}
                  className="rounded-full bg-white px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105 active:scale-95"
                >
                  Start Watching
                </button>
              )}
            </div>

            {introReady && (
              <div className="mt-4 flex items-center justify-center">
                <label className="flex cursor-pointer items-center gap-2.5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white/60">
                  <input
                    type="checkbox"
                    checked={showNsfw}
                    onChange={(e) => setShowNsfw(e.target.checked)}
                    className="h-4 w-4 rounded-sm accent-white"
                  />
                  Show NSFW Channels
                </label>
              </div>
            )}
          </div>
          <div className="pb-8 text-[10px] font-black uppercase tracking-widest text-white/10">Owned by Psycheee</div>
        </div>
      )}

    </div>
  );
}
