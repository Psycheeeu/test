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
      <div className="relative h-auto sm:h-[172px] overflow-hidden bg-gradient-to-t from-black via-black/95 to-[#111214]/92 px-4 sm:px-[43px] pb-6 sm:pb-8 pt-4 sm:pt-5 shadow-[0_-28px_70px_rgba(0,0,0,0.92)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />

        {/* Header Row: Channel Info (Left) + Live/Time (Right) */}
        <div className="flex items-center justify-between mb-4">
          {/* Left: logo, name, quality */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="flex h-11 w-11 sm:h-[60px] sm:w-[60px] items-center justify-center rounded-[12px] sm:rounded-[14px] bg-[#202124] text-xl sm:text-2xl shadow-xl shadow-black/35 shrink-0">
              {channel.logo.startsWith('http') || channel.logo.startsWith('/') ? (
                <img src={channel.logo} alt={channel.name} className="max-h-7 sm:max-h-10 max-w-9 sm:max-w-12 object-contain" />
              ) : (
                channel.logo
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-lg sm:text-[20px] font-black uppercase tracking-[-0.03em] text-white">{channel.name}</h2>
                {qualityBadge && (
                  <span className="rounded-md bg-white px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black text-black shrink-0">{qualityBadge}</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Live badge and Time */}
          <div className="flex items-center gap-2 sm:gap-5 shrink-0">
            {channel.stream && (
              <div className="rounded-full bg-white/15 px-2.5 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wide text-white/90">
                Live
              </div>
            )}
            <div className="whitespace-nowrap font-mono text-lg sm:text-[22px] font-semibold text-white">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Grid: Now | Next | Later */}
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(200px,1fr)_1px_minmax(150px,0.8fr)_1px_minmax(150px,0.8fr)] gap-4 sm:gap-5">
          {/* Now Section */}
          <section className="min-w-0">
            <div className="mb-1 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.22em] text-white/30">Now</div>
            <div className="truncate text-sm sm:text-[15px] font-black tracking-[-0.02em] text-white">{program.title}</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-[4px] flex-1 overflow-hidden bg-white/17">
                <div className="h-full rounded-full bg-white transition-all duration-1000" style={{ width: `${progress}%` }} />
              </div>
              <span className="whitespace-nowrap font-mono text-[9px] sm:text-[10px] text-white/36">
                {program.startTime === '--:--' ? '' : `${program.startTime} - ${program.endTime}`}
              </span>
            </div>
          </section>

          <div className="hidden sm:block h-full w-px bg-white/15" />

          {/* Next Section */}
          <section className="min-w-0">
            <div className="mb-1 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.22em] text-white/30">Next</div>
            <h3 className="truncate text-sm sm:text-[13px] font-semibold text-white/90">{nextProgram.title}</h3>
            <p className="mt-1 font-mono text-[9px] text-white/34">{nextProgram.startTime === '--:--' ? '--:--' : nextProgram.startTime}</p>
          </section>

          <div className="hidden sm:block h-full w-px bg-white/15" />

          {/* Later Section */}
          <section className="min-w-0">
            <div className="mb-1 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.22em] text-white/30">Later</div>
            <h3 className="truncate text-sm sm:text-[13px] font-semibold text-white/90">{laterProgram.title}</h3>
            <p className="mt-1 font-mono text-[9px] text-white/34">{laterProgram.startTime === '--:--' ? '--:--' : laterProgram.startTime}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
