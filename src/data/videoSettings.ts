export type VideoQuality = 'auto' | string;
export type AspectRatio = 'contain' | 'cover' | 'fill' | 'none';

export interface StreamVariant {
  id: string;
  label: string;
  width?: number;
  height?: number;
  bandwidth?: number;
  codecs?: string;
  frameRate?: number;
  active?: boolean;
}

export interface StreamTrack {
  id: string;
  label: string;
  language?: string;
  active?: boolean;
}

export interface StreamInfo {
  protocol: 'hls' | 'dash' | 'none';
  drm: string;
  variants: StreamVariant[];
  audioTracks: StreamTrack[];
  textTracks: StreamTrack[];
  selectedQuality: string;
  selectedAudio: string;
  selectedText: string;
  resolution: string;
  bandwidth: string;
  manifestUrl: string;
}

export interface VideoSettings {
  quality: VideoQuality;
  aspectRatio: AspectRatio;
  subtitles: boolean;
  subtitleTrack: string;
  audioTrack: string;
  audioEnabled: boolean;
  pip: boolean;
  stats: boolean;
  reloadToken: number;
}

export const defaultSettings: VideoSettings = {
  quality: 'auto',
  aspectRatio: 'contain',
  subtitles: false,
  subtitleTrack: 'Default',
  audioTrack: 'auto',
  audioEnabled: true,
  pip: false,
  stats: false,
  reloadToken: 0,
};

export const defaultStreamInfo: StreamInfo = {
  protocol: 'none',
  drm: 'None',
  variants: [],
  audioTracks: [],
  textTracks: [],
  selectedQuality: 'Auto',
  selectedAudio: 'Auto',
  selectedText: 'Off',
  resolution: 'Unknown',
  bandwidth: 'Unknown',
  manifestUrl: '',
};
