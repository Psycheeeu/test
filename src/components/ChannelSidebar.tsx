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
    if (visible && mode === 'channels') {
      const activeIndex = filteredChannels.findIndex((ch) => ch.number === currentChannel.number);
      if (activeIndex !== -1) {
        setFocusedChannelIndex(activeIndex);
        setTimeout(() => {
          channelRowRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }, 100);
      }
    }
  }, [visible, mode, filteredChannels, currentChannel.number]);

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

      <aside className="relative z-10 flex h-full w-full sm:w-[347px] flex-col border-r border-white/[0.03] bg-[#060608]/98 shadow-[30px_0_70px_rgba(0,0,0,0.78)] guide-slide">
        <div className="px-5 pb-3 pt-8 sm:pt-9">
          <div className="mb-9 flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.45em] text-sky-300">いらっしゃいませ！</div>
                <h2 className="mt-1 text-[26px] font-black leading-none tracking-[-0.07em] text-white">PsycheFlix</h2>
                <div className="mt-2 text-[12px] font-black uppercase tracking-[0.04em] text-white/32">Owned by Psycheee</div>
              </div>
            </div>
            <button onClick={onClose} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all hover:bg-white hover:text-black">
               <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <div className="text-[12px] font-black uppercase tracking-[0.08em] text-white/36">
              {mode === 'categories' ? 'Categories' : 'Channels'}
            </div>
            {mode !== 'categories' && (
              <button
                onClick={() => setSearchOpen((value) => !value)}
                className="flex h-10 w-10 items-center justify-center text-white/85 hover:text-white"
                aria-label="Search channels"
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
                </svg>
              </button>
            )}
          </div>

          {searchOpen && mode !== 'categories' && (
            <div className="mb-3">
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => event.stopPropagation()}
                placeholder="Search channels"
                className="h-11 w-full rounded-[14px] border border-white/10 bg-[#11171a] px-4 text-sm font-semibold text-white outline-none placeholder:text-white/28 focus:border-white/25"
              />
            </div>
          )}

          {mode === 'categories' && (
            <div className="mb-2 flex max-h-[calc(100vh-200px)] flex-col gap-2 overflow-y-auto pr-1">
              {categoryOptions.map((category, index) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    onModeChange('channels');
                  }}
                  onMouseEnter={() => setFocusedCategoryIndex(index)}
                  className={`h-12 sm:h-14 rounded-[16px] px-4 text-left text-xs font-black transition-all ${
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
          <div className="flex-1 px-5 pb-6 text-[10px] sm:text-[12px] font-medium leading-5 text-white/35">
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
                className={`group relative mb-2 grid h-20 sm:h-[82px] cursor-pointer grid-cols-[54px_1fr_44px] items-center rounded-[18px] sm:rounded-[20px] px-4 py-0 transition-all ${
                  isFocused
                    ? 'border border-white/35 bg-white text-black shadow-[0_0_35px_rgba(255,255,255,0.14)]'
                    : isActive
                    ? 'border border-white/26 bg-[#1d1d20] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.05)]'
                    : 'border border-transparent bg-[#11171a] text-white hover:bg-[#151b1e]'
                }`}
              >
                <div className="flex min-w-0 items-center">
                  <div className="flex h-10 w-10 sm:h-[48px] sm:w-[48px] shrink-0 items-center justify-center rounded-[10px] sm:rounded-[12px] bg-[#252525] text-base sm:text-xl">
                    {channel.logo.startsWith('http') || channel.logo.startsWith('/') ? (
                      <img src={channel.logo} alt={channel.name} className="max-h-6 sm:max-h-8 max-w-8 sm:max-w-10 object-contain" />
                    ) : (
                      channel.logo
                    )}
                  </div>
                </div>

                <div className="min-w-0 pl-3">
                  <div className="flex items-center gap-2">
                    <span className={`truncate text-sm sm:text-[16px] font-black uppercase tracking-[-0.03em] ${isFocused ? 'text-black' : 'text-white'}`}>{channel.name}</span>
                    {isFavorite && <span className="text-xs text-amber-400">★</span>}
                  </div>
                  <div className={`mt-0.5 sm:mt-[5px] truncate text-[10px] sm:text-[13px] font-medium ${isFocused ? 'text-black/55' : 'text-white/70'}`}>
                      {program.title}
                  </div>
                </div>

                <div className={`justify-self-end self-start pt-3 font-mono text-[12px] font-black ${isFocused ? 'text-black/55' : 'text-white/32'}`}>
                  {String(channel.number).padStart(3, '0')}
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
