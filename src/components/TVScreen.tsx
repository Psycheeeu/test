import { forwardRef } from 'react';
import { Channel } from '../data/channels';
import { StreamInfo, VideoSettings } from '../data/videoSettings';
import VideoPlayer, { VideoPlayerHandle } from './VideoPlayer';

interface TVScreenProps {
  channel: Channel;
  isTransitioning: boolean;
  settings: VideoSettings;
  onStatusChange?: (status: string) => void;
  onStreamInfoChange?: (info: StreamInfo) => void;
}

const TVScreen = forwardRef<VideoPlayerHandle, TVScreenProps>(
  function TVScreen({ channel, isTransitioning, settings, onStatusChange, onStreamInfoChange }, ref) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-black">
        {/* Video player (when stream is available) */}
        {channel.stream ? (
          <VideoPlayer
            ref={ref}
            channel={channel}
            isTransitioning={isTransitioning}
            settings={settings}
            onStatusChange={onStatusChange}
            onStreamInfoChange={onStreamInfoChange}
          />
        ) : (
          <div className="relative w-full h-full bg-black" />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 z-[7] h-36 bg-gradient-to-b from-black/55 to-transparent" />
      </div>
    );
  }
);

export default TVScreen;
