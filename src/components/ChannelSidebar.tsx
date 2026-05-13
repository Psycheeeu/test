import { useEffect, useMemo, useRef, useState } from 'react';
import { Channel, getCurrentProgram } from '../data/channels';

interface ChannelSidebarProps {
  channels: Channel[];
  visible: boolean;
  mode: 'channels' | 'categories';
  onModeChange: (mode: 'channels' | 'categories') => void;
  currentChannel: Channel;
  onSelectChannel: (channel: Channel) => void;
  onClose: () => void;
  favorites: number[];
  onToggleFavorite: (channelNumber: number) => void;
}

export default function ChannelSidebar({
  channels,
  visible,
  mode,
  onModeChange,
  currentChannel,
  onSelectChannel,
  onClose,
  favorites,
  onToggleFavorite,
}: ChannelSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const channelRowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const categoryOptions = useMemo(
    () => {
      const channelCategories = Array.from(
        new Set(channels.map((channel) => channel.category).filter(Boolean))
      );

      return ['Favorites', 'All', ...channelCategories];
    },
    [channels]
  );
  const [focusedCategoryIndex, setFocusedCategoryIndex] = useState(0);
  const [focusedChannelIndex, setFocusedChannelIndex] = useState(0);
  const categoryFilteredChannels =
    selectedCategory === 'Favorites'
      ? channels.filter((channel) => favorites.includes(channel.number))
      : selectedCategory === 'All'
      ? channels
      : channels.filter((channel) => channel.category === selectedCategory);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredChannels = normalizedQuery
    ? categoryFilteredChannels.filter((channel) =>
        `${channel.number} ${channel.name} ${channel.category} ${channel.epgId ?? ''}`
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : categoryFilteredChannels;

  useEffect(() => {
    const selectedIndex = categoryOptions.findIndex((category) => category === selectedCategory);
    setFocusedCategoryIndex(Math.max(0, selectedIndex));
  }, [categoryOptions, selectedCategory, mode]);

  useEffect(() => {
    if (!visible || mode !== 'categories') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setFocusedCategoryIndex((index) => (index + 1) % categoryOptions.length);
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setFocusedCategoryIndex((index) => (index - 1 + categoryOptions.length) % categoryOptions.length);
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        const category = categoryOptions[focusedCategoryIndex];
        setSelectedCategory(category);
        onModeChange('channels');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [categoryOptions, focusedCategoryIndex, mode, onModeChange, visible]);

  useEffect(() => {
    if (!visible || mode !== 'channels' || searchOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setFocusedChannelIndex((index) => Math.min(index + 1, Math.max(0, filteredChannels.length - 1)));
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setFocusedChannelIndex((index) => Math.max(index - 1, 0));
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        const focusedChannel = filteredChannels[focusedChannelIndex];
        if (focusedChannel) onSelectChannel(focusedChannel);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredChannels, focusedChannelIndex, mode, onSelectChannel, searchOpen, visible]);

  useEffect(() => {
    setFocusedChannelIndex((index) => Math.min(index, Math.max(0, filteredChannels.length - 1)));
  }, [filteredChannels.length]);

  useEffect(() => {
    if (visible && mode === 'channels') {
      channelRowRefs.current[focusedChannelIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedChannelIndex, mode, visible]);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-30 flex">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[3px]" onClick={onClose} />

      <aside className="relative z-10 flex h-full w-[461px] flex-col border-r border-white/[0.03] bg-[#060608]/98 shadow-[30px_0_70px_rgba(0,0,0,0.78)] guide-slide">
        <div className="px-5 pb-4 pt-[41px]">
          <div className="mb-[30px] flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div>
                <h2 className="text-[24px] font-black tracking-[-0.05em] text-white">PsycheFlix</h2>
                <div className="mt-[2px] text-[12px] font-medium uppercase tracking-[0.04em] text-white/35">Owned by Psycheee</div>
              </div>
            </div>
          </div>

          <div className="mb-[26px] flex items-center justify-between">
            <div className="text-[11px] font-black uppercase tracking-[0.08em] text-white/36">
              {mode === 'categories' ? 'Categories' : 'Channels'}
            </div>
            {mode !== 'categories' && (
              <button
                onClick={() => setSearchOpen((value) => !value)}
                className="flex h-8 w-8 items-center justify-center text-white/85 hover:text-white"
                aria-label="Search channels"
              >
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
                </svg>
              </button>
            )}
          </div>

          {searchOpen && mode !== 'categories' && (
            <div className="mb-4">
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => event.stopPropagation()}
                placeholder="Search channels"
                className="h-12 w-full rounded-[16px] border border-white/10 bg-[#11171a] px-4 text-sm font-semibold text-white outline-none placeholder:text-white/28 focus:border-white/25"
              />
            </div>
          )}

          {mode === 'categories' && (
            <div className="mb-2 flex max-h-[calc(100vh-190px)] flex-col gap-2 overflow-y-auto pr-1">
              {categoryOptions.map((category, index) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    onModeChange('channels');
                  }}
                  onMouseEnter={() => setFocusedCategoryIndex(index)}
                  className={`h-14 rounded-[16px] px-4 text-left text-xs font-black transition-all ${
                    focusedCategoryIndex === index
                      ? 'bg-white text-black shadow-[0_0_35px_rgba(255,255,255,0.16)]'
                      : 'bg-[#11171a] text-white/78 hover:bg-[#1d1d20] hover:text-white'
                  }`}
                >
                  {category === 'All' ? 'All Channels' : category}
                </button>
              ))}
            </div>
          )}
        </div>

        {mode === 'categories' ? (
          <div className="flex-1 px-5 pb-6 text-[12px] font-medium leading-5 text-white/35">
            Press left again to close. Pick a category to return to the channel list.
          </div>
        ) : (
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {filteredChannels.map((channel, index) => {
            const program = getCurrentProgram(channel);
            const isActive = channel.number === currentChannel.number;
            const isFocused = focusedChannelIndex === index;
            const isFavorite = favorites.includes(channel.number);

            return (
              <div
                key={channel.number}
                ref={(element) => {
                  channelRowRefs.current[index] = element;
                }}
                onClick={() => onSelectChannel(channel)}
                onMouseEnter={() => setFocusedChannelIndex(index)}
                className={`group relative mb-[9px] grid h-[93px] cursor-pointer grid-cols-[58px_64px_1fr] items-center rounded-[20px] px-[26px] py-0 transition-all ${
                  isFocused
                    ? 'border border-white/35 bg-white text-black shadow-[0_0_35px_rgba(255,255,255,0.14)]'
                    : isActive
                    ? 'border border-white/26 bg-[#1d1d20] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.05)]'
                    : 'border border-transparent bg-[#11171a] text-white hover:bg-[#151b1e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`font-mono text-[14px] font-black ${isFocused ? 'text-black' : 'text-white/92'}`}>
                    {String(channel.number).padStart(3, '0')}
                  </div>
                </div>

                <div className="flex min-w-0 items-center">
                  <div
                    className={`flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[12px] text-xl ${isFocused ? 'bg-black/10' : 'bg-[#252b2e]'}`}
                  >
                    {channel.logo.startsWith('http') || channel.logo.startsWith('/') ? (
                      <img src={channel.logo} alt={channel.name} className="max-h-8 max-w-10 object-contain" />
                    ) : (
                      channel.logo
                    )}
                  </div>
                </div>

                <div className="min-w-0 pl-[16px]">
                  <div className="flex items-center gap-2">
                    <span className={`truncate text-[16px] font-black uppercase tracking-[-0.03em] ${isFocused ? 'text-black' : 'text-white'}`}>{channel.name}</span>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleFavorite(channel.number);
                      }}
                      className={`text-xs ${isFavorite ? 'text-amber-400' : isFocused ? 'text-black/25' : 'text-white/0 group-hover:text-white/20'}`}
                    >
                      {isFavorite ? '★' : '☆'}
                    </button>
                  </div>
                  <div className={`mt-[5px] truncate text-[13px] font-medium ${isFocused ? 'text-black/55' : 'text-white/70'}`}>
                      {program.title}
                  </div>
                </div>
              </div>
            );
          })}
          {filteredChannels.length === 0 && (
            <div className="px-6 py-8 text-sm font-semibold text-white/30">No channels found.</div>
          )}
        </div>
        )}
      </aside>
    </div>
  );
}