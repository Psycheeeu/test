import { Channel, getCurrentProgram, getProgress } from '../data/channels';
import { StreamInfo } from '../data/videoSettings';
interface ChannelInfoProps {
  channel: Channel;
  visible: boolean;
  streamInfo?: StreamInfo;
}

function getQualityBadge(streamInfo?: StreamInfo) {
  const height = Number(streamInfo?.resolution?.split('x')[1]);
  if (!Number.isNaN(height) && height > 0) {
    if (height >= 2160) return 'UHD';
    if (height >= 1080) return 'FHD';
    if (height >= 720) return 'HD';
    return 'SD';
  }
  return null;
}

export default function ChannelInfo({ channel, visible, streamInfo }: ChannelInfoProps) {
  if (!visible) return null;

  const program = getCurrentProgram(channel);
  const progress = getProgress(channel);
  const currentIndex = Math.max(0, channel.programs.findIndex((item) => item.title === program.title));
  const nextProgram = channel.programs[(currentIndex + 1) % channel.programs.length];
  const laterProgram = channel.programs[(currentIndex + 2) % channel.programs.length];
  const qualityBadge = getQualityBadge(streamInfo);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 info-slide sm:p-0">
      <div className="relative h-auto overflow-hidden bg-gradient-to-t from-black via-black/95 to-[#111214]/92 px-4 pb-6 pt-4 shadow-[0_-28px_70px_rgba(0,0,0,0.92)] backdrop-blur-sm sm:px-[43px] sm:pb-8 sm:pt-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />

        {/* Header row - always visible */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="font-mono text-lg font-black text-white shrink-0">{String(channel.number).padStart(3, '0')}</div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#202124] text-base shadow-xl shadow-black/35 shrink-0">
              {channel.logo.startsWith('http') || channel.logo.startsWith('/') ? (
                <img src={channel.logo} alt={channel.name} className="max-h-7 max-w-8 object-contain" />
              ) : (
                channel.logo
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-base font-black uppercase tracking-tight text-white">{channel.name}</h2>
                {qualityBadge && (
                  <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-black text-black shrink-0">{qualityBadge}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {channel.stream && (
              <div className="rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-white/90">
                Live
              </div>
            )}
            <div className="whitespace-nowrap font-mono text-lg font-semibold text-white">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Now section - full width */}
        <div className="mb-3">
          <div className="mb-1 text-[8px] font-black uppercase tracking-[0.22em] text-white/30">Now</div>
          <div className="truncate text-sm font-black tracking-tight text-white">{program.title}</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-[4px] flex-1 overflow-hidden bg-white/17">
              <div className="h-full rounded-full bg-white transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
            <span className="whitespace-nowrap font-mono text-[9px] text-white/36">
              {program.startTime === '--:--' ? '' : `${program.startTime} - ${program.endTime}`}
            </span>
          </div>
        </div>

        {/* Next and Later - stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1px_1fr] gap-3 sm:gap-5">
          <div>
            <div className="mb-1 text-[8px] font-black uppercase tracking-[0.22em] text-white/30">Next</div>
            <h3 className="truncate text-[13px] font-semibold text-white/90">{nextProgram.title}</h3>
            <p className="mt-1 font-mono text-[9px] text-white/34">{nextProgram.startTime === '--:--' ? '--:--' : nextProgram.startTime}</p>
          </div>

          <div className="hidden sm:block h-full w-px bg-white/15" />

          <div>
            <div className="mb-1 text-[8px] font-black uppercase tracking-[0.22em] text-white/30">Later</div>
            <h3 className="truncate text-[13px] font-semibold text-white/90">{laterProgram.title}</h3>
            <p className="mt-1 font-mono text-[9px] text-white/34">{laterProgram.startTime === '--:--' ? '--:--' : laterProgram.startTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
