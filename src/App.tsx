import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { channels, Channel } from './data/channels';
import { loadEpgForChannels } from './data/epg';
import { StreamInfo, VideoSettings, defaultSettings, defaultStreamInfo } from './data/videoSettings';
import TVScreen from './components/TVScreen';
import { VideoPlayerHandle } from './components/VideoPlayer';
import ChannelInfo from './components/ChannelInfo';
import ChannelSidebar from './components/ChannelSidebar';
import VideoOptions from './components/VideoOptions';

export default function App() {
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [showChannelSidebar, setShowChannelSidebar] = useState(false);
  const [channelSidebarMode, setChannelSidebarMode] = useState<'channels' | 'categories'>('channels');
  const [showVideoOptions, setShowVideoOptions] = useState(false);
  const [showChannelInfo, setShowChannelInfo] = useState(true);
  const [introLoading, setIntroLoading] = useState(true);
  const [showNsfw, setShowNsfw] = useState(false);
  const [showAndroidControls, setShowAndroidControls] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([1]);
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

  useEffect(() => {
    const updateAndroidControls = () => {
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isLandscape = window.matchMedia('(orientation: landscape)').matches || window.innerWidth > window.innerHeight;
      setShowAndroidControls(isAndroid && isLandscape);
    };

    updateAndroidControls();
    window.addEventListener('resize', updateAndroidControls);
    window.addEventListener('orientationchange', updateAndroidControls);

    return () => {
      window.removeEventListener('resize', updateAndroidControls);
      window.removeEventListener('orientationchange', updateAndroidControls);
    };
  }, []);

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
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none">
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
          />
        )}
      </div>

      {/* Channel info overlay */}
      <ChannelInfo channel={currentChannel} visible={!introLoading && showChannelInfo} streamInfo={streamInfo} />

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
        onToggleFavorite={toggleFavorite}
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
      />

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

      {showAndroidControls && !introLoading && pendingAdultIndex === null && (
        <div className="pointer-events-none absolute inset-0 z-40">
          <div className="pointer-events-auto absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/45 p-2 shadow-2xl backdrop-blur-md">
            <button
              onClick={toggleChannelSidebar}
              className="rounded-full bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/70 active:scale-95"
            >
              Guide
            </button>
            <button
              onClick={() => setShowChannelInfo(true)}
              className="rounded-full bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/70 active:scale-95"
            >
              Info
            </button>
            <button
              onClick={toggleVideoOptions}
              className="rounded-full bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/70 active:scale-95"
            >
              Settings
            </button>
          </div>

          <div className="pointer-events-auto absolute right-5 top-1/2 flex -translate-y-1/2 flex-col gap-3">
            <button
              onClick={channelUp}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/45 text-2xl font-black text-white/75 shadow-xl backdrop-blur-md active:scale-95"
              aria-label="Channel up"
            >
              ↑
            </button>
            <button
              onClick={channelDown}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/45 text-2xl font-black text-white/75 shadow-xl backdrop-blur-md active:scale-95"
              aria-label="Channel down"
            >
              ↓
            </button>
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
        <div
          className="absolute inset-0 z-[80] flex cursor-pointer items-center justify-center bg-black"
          onClick={dismissIntro}
          onTouchEnd={dismissIntro}
        >
          <div className="flex min-h-screen w-full flex-col items-center justify-center">
            <div className="flex h-[90px] w-[90px] items-center justify-center rounded-[26px] border border-white/10 text-white">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 6l-2-3m10 3l2-3M5.5 8.5h13A1.5 1.5 0 0120 10v7a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 17v-7a1.5 1.5 0 011.5-1.5z" />
              </svg>
            </div>
            <div className="mt-8 text-[32px] font-black tracking-[-0.08em] text-white">PsycheFlix</div>
            <div className="mt-1 text-[11px] font-black uppercase tracking-[0.45em] text-white/35">Live TV</div>
            <div className="mt-10 h-[3px] w-[200px] overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-full origin-left animate-[loadingBar_5s_ease-in-out_forwards] bg-white" />
            </div>
            <div className="mt-5 text-[10px] font-black uppercase tracking-[0.35em] text-white/25">Loading</div>

            <div className="mt-10 flex h-10 items-center justify-center">
              {introReady && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissIntro();
                  }}
                  className="rounded-full bg-white px-8 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105 active:scale-95"
                >
                  Start Watching
                </button>
              )}
            </div>
            {introReady && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <label className="flex cursor-pointer items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.15em] text-white/40 hover:text-white/60">
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
            <div className="absolute bottom-[70px] text-[11px] font-black text-white/10">Owned by Psycheee</div>
          </div>
        </div>
      )}

    </div>
  );
}
