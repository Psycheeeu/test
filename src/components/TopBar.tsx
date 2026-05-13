import { Channel } from '../data/channels';

interface TopBarProps {
  currentChannel: Channel;
  channelSidebarOpen: boolean;
  videoOptionsOpen: boolean;
  onToggleChannels: () => void;
  onToggleOptions: () => void;
  signalStrength: number;
}

export default function TopBar({
  currentChannel,
  channelSidebarOpen,
  videoOptionsOpen,
  onToggleChannels,
  onToggleOptions,
  signalStrength,
}: TopBarProps) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="absolute left-0 right-0 top-0 z-10 px-8 pt-7">
      <div className="flex items-center justify-between rounded-[2rem] border border-white/8 bg-black/35 px-5 py-3 shadow-2xl shadow-black/40 backdrop-blur-2xl">
        <div className="flex items-center gap-7">
          <button
            onClick={onToggleChannels}
            className={`group flex h-11 items-center gap-3 rounded-full px-4 transition-all ${
              channelSidebarOpen
                ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                : 'bg-white/8 text-white/78 hover:bg-white/14 hover:text-white'
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <span className="text-sm font-bold">Guide</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] bg-white text-base font-black text-black">
              TV+
            </div>
            <div>
              <div className="text-lg font-black tracking-[-0.03em] text-white">CableVision Plus</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/32">Live TV</div>
            </div>
          </div>

          <nav className="hidden items-center gap-5 lg:flex">
            {['Live', 'Guide', 'Movies', 'Sports', 'Kids'].map((item) => (
              <button
                key={item}
                className={`relative text-sm font-bold transition-colors ${
                  item === 'Live' ? 'text-white' : 'text-white/40 hover:text-white/75'
                }`}
              >
                {item}
                {item === 'Live' && (
                  <span className="absolute -bottom-2 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-sky-400" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="hidden min-w-0 items-center gap-4 md:flex">
          <div className="flex items-center gap-3 rounded-full bg-white/8 px-4 py-2">
            <span className="font-mono text-lg font-black text-white">{String(currentChannel.number).padStart(3, '0')}</span>
            <span className="h-5 w-px bg-white/12" />
            <span className="max-w-44 truncate text-sm font-bold text-white/88">{currentChannel.name}</span>
            {currentChannel.stream && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
                Live
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-end gap-0.5 sm:flex">
            {[1, 2, 3, 4, 5].map((bar) => (
              <span
                key={bar}
                className={`w-1 rounded-full ${bar <= signalStrength ? 'bg-sky-400' : 'bg-white/14'}`}
                style={{ height: `${bar * 3 + 5}px` }}
              />
            ))}
          </div>

          <button
            onClick={onToggleOptions}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
              videoOptionsOpen
                ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                : 'bg-white/8 text-white/75 hover:bg-white/14 hover:text-white'
            }`}
            aria-label="Open settings"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 16v-2m6-6h2M4 12h2m10.95-4.95 1.414-1.414M5.636 18.364 7.05 16.95m9.9 0 1.414 1.414M5.636 5.636 7.05 7.05" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          <div className="font-mono text-base font-semibold text-white/85">{time}</div>
        </div>
      </div>
    </div>
  );
}