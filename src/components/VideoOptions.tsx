import { useEffect, useMemo, useRef, useState } from 'react';
import { Channel, getCurrentProgram } from '../data/channels';
import { StreamInfo, VideoSettings } from '../data/videoSettings';

interface VideoOptionsProps {
  visible: boolean;
  channel: Channel;
  settings: VideoSettings;
  streamInfo: StreamInfo;
  onSettingsChange: (settings: Partial<VideoSettings>) => void;
  onRefresh: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
  streamStatus: string;
  onOpenGuide: () => void;
}

interface FocusItem {
  id: string;
  action: () => void;
}

function SettingsRow({ title, subtitle, accent, focused, focusId, onClick, onMouseEnter }: {
  title: string;
  subtitle: string;
  accent?: 'blue' | 'green' | 'white';
  focused?: boolean;
  focusId?: string;
  onClick: () => void;
  onMouseEnter?: () => void;
}) {
  const color = accent === 'blue' ? 'text-sky-400' : accent === 'green' ? 'text-emerald-400' : 'text-white/88';

  return (
    <button
      data-focus-id={focusId}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`group w-full border-b border-white/10 px-[20px] py-[14px] text-left transition-colors ${focused ? 'bg-white/[0.075]' : 'hover:bg-white/[0.035]'}`}
      type="button"
    >
      <div className={`text-[14px] font-black tracking-[-0.02em] ${color}`}>{title}</div>
      <div className="mt-[3px] truncate text-[9px] font-medium text-white/32 group-hover:text-white/42">{subtitle}</div>
    </button>
  );
}

function OptionButton({ active, focused, primary, secondary, focusId, onClick, onMouseEnter, disabled = false }: {
  active: boolean;
  focused?: boolean;
  primary: string;
  secondary?: string;
  focusId?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      data-focus-id={focusId}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      disabled={disabled}
      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[10px] transition-colors ${active ? 'bg-white/12 text-white' : focused ? 'bg-white/10 text-white/85' : disabled ? 'bg-white/[0.02] text-white/18' : 'text-white/45 hover:bg-white/5 hover:text-white/70'}`}
      type="button"
    >
      <span className="truncate font-semibold">{primary}</span>
      {secondary && <span className="ml-3 shrink-0 text-white/28">{secondary}</span>}
    </button>
  );
}

export default function VideoOptions({ visible, channel, settings, streamInfo, onSettingsChange, onRefresh, isFavorite, onToggleFavorite, onClose, streamStatus, onOpenGuide }: VideoOptionsProps) {
  const [showPlayback, setShowPlayback] = useState(false);
  const [showDisplay, setShowDisplay] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  const selectedVariant = useMemo(() => {
    if (settings.quality === 'auto') return streamInfo.variants.find((variant) => variant.active) ?? streamInfo.variants[0];
    return streamInfo.variants.find((variant) => variant.id === settings.quality) ?? streamInfo.variants[0];
  }, [settings.quality, streamInfo.variants]);

  const selectedAudio = useMemo(() => {
    if (settings.audioTrack === 'auto') return streamInfo.audioTracks.find((track) => track.active) ?? streamInfo.audioTracks[0];
    return streamInfo.audioTracks.find((track) => track.id === settings.audioTrack) ?? streamInfo.audioTracks[0];
  }, [settings.audioTrack, streamInfo.audioTracks]);

  const qualityLabel = settings.quality === 'auto' ? selectedVariant?.label ? `Auto (${selectedVariant.label})` : 'Auto' : selectedVariant?.label ?? streamInfo.selectedQuality;
  const audioLabel = settings.audioTrack === 'auto' ? selectedAudio?.label ? `Auto (${selectedAudio.label})` : 'Auto' : selectedAudio?.label ?? streamInfo.selectedAudio ?? 'Auto';
  const captionsLabel = streamInfo.textTracks.length === 0 ? 'Unavailable' : settings.subtitles ? streamInfo.selectedText || 'Default' : 'Off';
  const playbackSummary = `${qualityLabel} / ${audioLabel} / Audio ${settings.audioEnabled ? 'On' : 'Off'} / ${captionsLabel}`;
  const displayLabel = settings.aspectRatio === 'contain' ? 'Fit to Screen' : settings.aspectRatio === 'cover' ? 'Fill' : settings.aspectRatio === 'fill' ? 'Stretch' : 'Original';
  const displaySummary = `${displayLabel} / ${streamInfo.resolution} / ${streamInfo.bandwidth}`;
  const statusLabel = streamStatus === 'playing' ? 'Reload source access' : streamStatus === 'loading' ? 'Loading manifest' : streamStatus === 'error' ? 'Stream access failed' : channel.stream ? 'Reload source access' : 'No stream on this channel';

  const currentProgram = getCurrentProgram(channel);
  const upcomingPrograms = useMemo(() => {
    const now = Date.now();
    const programs = channel.programs;
    if (!programs || programs.length === 0) return [];

    // For EPG programs with ms timestamps, filter to current + future
    const hasTimestamps = programs.some(p => typeof p.startMs === 'number');
    if (hasTimestamps) {
      return programs.filter(p => typeof p.endMs === 'number' && p.endMs > now);
    }
    // For static programs (no timestamps), show all
    return programs;
  }, [channel.programs]);

  const epgSummary = upcomingPrograms.length > 0
    ? `${upcomingPrograms.length} program${upcomingPrograms.length !== 1 ? 's' : ''} — ${currentProgram.title}`
    : 'No schedule available';

  const focusItems = useMemo<FocusItem[]>(() => {
    const items: FocusItem[] = [
      { id: 'guide', action: () => setShowGuide((value) => !value) },
      { id: 'favorite', action: onToggleFavorite },
      { id: 'playback', action: () => setShowPlayback((value) => !value) },
    ];

    if (showPlayback) {
      items.push({ id: 'quality:auto', action: () => onSettingsChange({ quality: 'auto' }) });
      streamInfo.variants.forEach((variant) => items.push({ id: `quality:${variant.id}`, action: () => onSettingsChange({ quality: variant.id }) }));
      items.push({ id: 'audio:enabled', action: () => onSettingsChange({ audioEnabled: !settings.audioEnabled }) });
      items.push({ id: 'audio:auto', action: () => onSettingsChange({ audioTrack: 'auto' }) });
      streamInfo.audioTracks.forEach((track) => items.push({ id: `audio:${track.id}`, action: () => onSettingsChange({ audioTrack: track.id }) }));
      streamInfo.textTracks.forEach((track) => items.push({ id: `subtitle:${track.id}`, action: () => onSettingsChange({ subtitleTrack: track.id, subtitles: true }) }));
      items.push({ id: 'stats', action: () => onSettingsChange({ stats: !settings.stats }) });
    }

    items.push({ id: 'display', action: () => setShowDisplay((value) => !value) });
    if (showDisplay) {
      items.push({ id: 'display:contain', action: () => onSettingsChange({ aspectRatio: 'contain' }) });
      items.push({ id: 'display:cover', action: () => onSettingsChange({ aspectRatio: 'cover' }) });
      items.push({ id: 'display:fill', action: () => onSettingsChange({ aspectRatio: 'fill' }) });
      items.push({ id: 'display:none', action: () => onSettingsChange({ aspectRatio: 'none' }) });
    }

    items.push({ id: 'pip', action: () => onSettingsChange({ pip: !settings.pip }) });
    items.push({ id: 'epg', action: onOpenGuide });
    items.push({ id: 'reload', action: onRefresh });
    return items;
  }, [onRefresh, onSettingsChange, onToggleFavorite, settings.audioEnabled, settings.pip, settings.stats, showDisplay, showPlayback, streamInfo.audioTracks, streamInfo.textTracks, streamInfo.variants, upcomingPrograms, onOpenGuide]);

  const focusedId = focusItems[focusedIndex]?.id;
  const focusById = (id: string) => setFocusedIndex(Math.max(0, focusItems.findIndex((item) => item.id === id)));

  useEffect(() => {
    setFocusedIndex((index) => Math.min(index, Math.max(0, focusItems.length - 1)));
  }, [focusItems.length]);

  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setFocusedIndex((index) => (index + 1) % focusItems.length);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setFocusedIndex((index) => (index - 1 + focusItems.length) % focusItems.length);
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        focusItems[focusedIndex]?.action();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, focusItems, visible]);

  useEffect(() => {
    if (!visible || !focusedId) return;
    bodyRef.current?.querySelector<HTMLElement>(`[data-focus-id="${focusedId}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [focusedId, visible]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-30 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="relative z-10 h-full w-full sm:w-[347px] options-slide border-l border-white/5 bg-[#08080a]/98 shadow-[-25px_0_65px_rgba(0,0,0,0.82)]">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-4 px-[22px] pb-5 pt-10 sm:pt-[51px]">
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/8 hover:text-white" type="button" aria-label="Close settings">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h2 className="text-[20px] font-black tracking-[-0.04em] text-white">Settings</h2>
          </div>
          <div ref={bodyRef} className="flex-1 overflow-y-auto px-[22px] pb-6 pt-1">
            <button data-focus-id="guide" onClick={() => setShowGuide((value) => !value)} onMouseEnter={() => focusById('guide')} className={`group w-full border-b border-white/10 px-[20px] py-[14px] text-left transition-colors ${focusedId === 'guide' ? 'bg-white/[0.075]' : 'hover:bg-white/[0.035]'}`} type="button">
              <div className="text-[14px] font-black tracking-[-0.02em] text-sky-400">Guide</div>
              {showGuide && <div className="mx-auto mt-3 flex max-w-[260px] flex-wrap items-center justify-center gap-2 rounded-[18px] bg-white/[0.045] p-2 shadow-xl shadow-black/25"><span className="rounded-full bg-white/8 px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/42">Esc Close</span><span className="rounded-full bg-white/8 px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/42">↑↓ Channel</span><span className="rounded-full bg-white/12 px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/55">Enter OK</span><span className="rounded-full bg-white/8 px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/42">← Guide</span><span className="rounded-full bg-white/8 px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/42">→ Settings</span></div>}
              <div className="mt-2 truncate text-[9px] font-medium text-white/32 group-hover:text-white/42">Remote shortcuts only</div>
            </button>
            <SettingsRow focusId="favorite" title="Favorite" subtitle={isFavorite ? 'Remove from favorites' : 'Add to favorites'} focused={focusedId === 'favorite'} onMouseEnter={() => focusById('favorite')} onClick={onToggleFavorite} />
            <SettingsRow focusId="playback" title="Playback" subtitle={playbackSummary} focused={focusedId === 'playback'} onMouseEnter={() => focusById('playback')} onClick={() => setShowPlayback((value) => !value)} />
            {showPlayback && <div className="border-b border-white/10 bg-white/[0.025] px-5 py-3"><div className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/22">Quality</div><div className="space-y-1.5"><OptionButton focusId="quality:auto" active={settings.quality === 'auto'} focused={focusedId === 'quality:auto'} primary="Auto" secondary={selectedVariant?.label ?? 'ABR'} onMouseEnter={() => focusById('quality:auto')} onClick={() => onSettingsChange({ quality: 'auto' })} />{streamInfo.variants.map((variant) => <OptionButton focusId={`quality:${variant.id}`} key={variant.id} active={settings.quality === variant.id} focused={focusedId === `quality:${variant.id}`} primary={variant.label} secondary={variant.codecs || (variant.width && variant.height ? `${variant.width}x${variant.height}` : 'Stream')} onMouseEnter={() => focusById(`quality:${variant.id}`)} onClick={() => onSettingsChange({ quality: variant.id })} />)}{streamInfo.variants.length === 0 && <OptionButton active={false} primary="No variants reported yet" secondary="Manifest pending" disabled />}</div><div className="mb-2 mt-4 text-[9px] font-bold uppercase tracking-[0.18em] text-white/22">Audio</div><div className="space-y-1.5"><OptionButton focusId="audio:enabled" active={settings.audioEnabled} focused={focusedId === 'audio:enabled'} primary="Audio Output" secondary={settings.audioEnabled ? 'On' : 'Off'} onMouseEnter={() => focusById('audio:enabled')} onClick={() => onSettingsChange({ audioEnabled: !settings.audioEnabled })} /><OptionButton focusId="audio:auto" active={settings.audioTrack === 'auto'} focused={focusedId === 'audio:auto'} primary="Auto" secondary={audioLabel} onMouseEnter={() => focusById('audio:auto')} onClick={() => onSettingsChange({ audioTrack: 'auto' })} />{streamInfo.audioTracks.map((track) => <OptionButton focusId={`audio:${track.id}`} key={track.id} active={settings.audioTrack === track.id} focused={focusedId === `audio:${track.id}`} primary={track.label} secondary={track.language || 'Audio'} onMouseEnter={() => focusById(`audio:${track.id}`)} onClick={() => onSettingsChange({ audioTrack: track.id })} />)}{streamInfo.audioTracks.length === 0 && <OptionButton active={false} primary="None" secondary="No alternate audio" disabled />}</div>{streamInfo.textTracks.length > 0 && <><div className="mb-2 mt-4 text-[9px] font-bold uppercase tracking-[0.18em] text-white/22">Subtitles</div><div className="space-y-1.5">{streamInfo.textTracks.map((track) => <OptionButton focusId={`subtitle:${track.id}`} key={track.id} active={settings.subtitleTrack === track.id} focused={focusedId === `subtitle:${track.id}`} primary={track.label} secondary={track.language || 'Subtitle'} onMouseEnter={() => focusById(`subtitle:${track.id}`)} onClick={() => onSettingsChange({ subtitleTrack: track.id, subtitles: true })} />)}</div></>}<div className="mt-3"><OptionButton focusId="stats" active={settings.stats} focused={focusedId === 'stats'} primary="Stats" secondary={settings.stats ? 'On' : 'Off'} onMouseEnter={() => focusById('stats')} onClick={() => onSettingsChange({ stats: !settings.stats })} /></div></div>}
            <SettingsRow focusId="display" title="Display" subtitle={displaySummary} focused={focusedId === 'display'} onMouseEnter={() => focusById('display')} onClick={() => setShowDisplay((value) => !value)} />
            {showDisplay && <div className="border-b border-white/10 bg-white/[0.025] px-5 py-3"><div className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/22">Display Size</div><div className="space-y-1.5"><OptionButton focusId="display:contain" active={settings.aspectRatio === 'contain'} focused={focusedId === 'display:contain'} primary="Fit to Screen" secondary="Default playback size" onMouseEnter={() => focusById('display:contain')} onClick={() => onSettingsChange({ aspectRatio: 'contain' })} /><OptionButton focusId="display:cover" active={settings.aspectRatio === 'cover'} focused={focusedId === 'display:cover'} primary="Fill" secondary="Crop edges" onMouseEnter={() => focusById('display:cover')} onClick={() => onSettingsChange({ aspectRatio: 'cover' })} /><OptionButton focusId="display:fill" active={settings.aspectRatio === 'fill'} focused={focusedId === 'display:fill'} primary="Stretch" secondary="Fill frame" onMouseEnter={() => focusById('display:fill')} onClick={() => onSettingsChange({ aspectRatio: 'fill' })} /><OptionButton focusId="display:none" active={settings.aspectRatio === 'none'} focused={focusedId === 'display:none'} primary="Original" secondary="Native video size" onMouseEnter={() => focusById('display:none')} onClick={() => onSettingsChange({ aspectRatio: 'none' })} /></div></div>}
            <SettingsRow focusId="pip" title="Picture in Picture" subtitle={settings.pip ? 'On' : 'Off'} focused={focusedId === 'pip'} onMouseEnter={() => focusById('pip')} onClick={() => onSettingsChange({ pip: !settings.pip })} />
            <SettingsRow focusId="epg" title="Programme Guide" subtitle={epgSummary} accent="blue" focused={focusedId === 'epg'} onMouseEnter={() => focusById('epg')} onClick={onOpenGuide} />
            <SettingsRow focusId="reload" title="Reload" subtitle={statusLabel} accent="green" focused={focusedId === 'reload'} onMouseEnter={() => focusById('reload')} onClick={onRefresh} />
          </div>
        </div>
      </aside>
    </div>
  );
}
