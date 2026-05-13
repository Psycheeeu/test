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
    <div className="absolute bottom-0 left-0 right-0 z-20 info-slide">
      <div className="relative h-[172px] overflow-hidden bg-gradient-to-t from-black via-black/95 to-[#111214]/92 px-[43px] pb-8 pt-5 shadow-[0_-28px_70px_rgba(0,0,0,0.92)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />

        <div className="grid h-full grid-cols-[minmax(455px,1.2fr)_1px_minmax(260px,0.75fr)_1px_minmax(260px,0.75fr)_auto] items-end gap-5">
          <section className="min-w-0">
            <div className="mb-4 flex items-center gap-4">
              <div className="font-mono text-[22px] font-black text-white">{String(channel.number).padStart(3, '0')}</div>
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[14px] bg-[#202124] text-2xl shadow-xl shadow-black/35">
                {channel.logo.startsWith('http') || channel.logo.startsWith('/') ? (
                  <img src={channel.logo} alt={channel.name} className="max-h-10 max-w-12 object-contain" />
                ) : (
                  channel.logo
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h2 className="truncate text-[20px] font-black uppercase tracking-[-0.03em] text-white">{channel.name}</h2>
                  {qualityBadge && (
                    <span className="rounded-md bg-white px-2 py-1 text-[10px] font-black text-black">{qualityBadge}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-1 text-[9px] font-black uppercase tracking-[0.22em] text-white/30">Now</div>
            <div className="truncate text-[15px] font-black tracking-[-0.02em] text-white">{program.title}</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-[5px] flex-1 overflow-hidden bg-white/17">
                <div className="h-full rounded-full bg-white transition-all duration-1000" style={{ width: `${progress}%` }} />
              </div>
              <span className="whitespace-nowrap font-mono text-[10px] text-white/36">
                {program.startTime} - {program.endTime}
              </span>
            </div>
          </section>

          <div className="h-[43px] w-px bg-white/15" />

          <section className="min-w-0 pb-[9px]">
            <div className="mb-2 text-[9px] font-black uppercase tracking-[0.22em] text-white/30">Next</div>
            <h3 className="truncate text-[13px] font-semibold text-white/90">{nextProgram.title}</h3>
            <p className="mt-1 font-mono text-[10px] text-white/34">{nextProgram.startTime}</p>
          </section>

          <div className="h-[43px] w-px bg-white/15" />

          <section className="min-w-0 pb-[9px]">
            <div className="mb-2 text-[9px] font-black uppercase tracking-[0.22em] text-white/30">Later</div>
            <h3 className="truncate text-[13px] font-semibold text-white/90">{laterProgram.title}</h3>
            <p className="mt-1 font-mono text-[10px] text-white/34">{laterProgram.startTime}</p>
          </section>

          <section className="flex items-start gap-8 self-start pt-[18px]">
            {channel.stream && (
              <div className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white/90">
                Live
              </div>
            )}
            <div className="whitespace-nowrap font-mono text-[22px] font-semibold text-white">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
