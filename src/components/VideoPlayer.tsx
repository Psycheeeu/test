import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import Hls from 'hls.js';
import { Channel, StreamSource } from '../data/channels';
import { StreamInfo, VideoSettings, defaultStreamInfo } from '../data/videoSettings';

// Lazy load shaka-player
let shakaInstance: any = null;
async function getShaka() {
  if (!shakaInstance) {
    const shaka = await import('shaka-player');
    const playerLib = (shaka as any).default || shaka;
    if (playerLib.polyfill?.installAll) {
      playerLib.polyfill.installAll();
    } else if (playerLib.installAllPolyfills) {
      playerLib.installAllPolyfills();
    }
    
    // Ensure SMPTE-TT (stpp) support for DASH streams
    if (playerLib.text && playerLib.text.TextEngine && playerLib.text.Mp4TtmlParser) {
      try {
        playerLib.text.TextEngine.registerParser('application/mp4; codecs="stpp"', playerLib.text.Mp4TtmlParser);
      } catch (e) {
        // Parser might already be registered
      }
    }
    
    shakaInstance = playerLib;
  }
  return shakaInstance;
}

export interface VideoPlayerHandle {
  getStatus: () => string;
  requestPiP: () => void;
}

interface VideoPlayerProps {
  channel: Channel;
  isTransitioning: boolean;
  settings: VideoSettings;
  onError?: (msg: string) => void;
  onStatusChange?: (status: string) => void;
  onStreamInfoChange?: (info: StreamInfo) => void;
  onSettingsChange?: (settings: Partial<VideoSettings>) => void;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  function VideoPlayer({ channel, isTransitioning, settings, onError, onStatusChange, onStreamInfoChange, onSettingsChange }, ref) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const shakaRef = useRef<any>(null);
    const bufferingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const settingsRef = useRef(settings);
    const shouldAutoResumeRef = useRef(false);
    const lastShakaErrorAtRef = useRef(0);
    const loadStartedAtRef = useRef(0);
    const [status, setStatus] = useState<'idle' | 'loading' | 'buffering' | 'playing' | 'error' | 'no-stream'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [retryCount, setRetryCount] = useState(0);

    const formatBandwidth = (bandwidth?: number) => {
      if (!bandwidth) return 'Unknown';
      return `${(bandwidth / 1000000).toFixed(1)} Mbps`;
    };

    const makeVariantLabel = (height?: number, bandwidth?: number) => {
      const quality = height ? `${height}p` : 'Unknown';
      const speed = bandwidth ? ` / ${(bandwidth / 1000000).toFixed(1)} Mbps` : '';
      return `${quality}${speed}`;
    };

    const normalizeAudioId = (id: string) => id.split('|')[0];
    const normalizeTrackId = (id: string) => id.split('|')[0];

    const getDashAudioTracks = (variantTracks: any[]) => {
      const seen = new Set<string>();

      return variantTracks
        .map((track: any, index: number) => {
          const language = track.language || track.originalLanguage || 'und';
          const role = Array.isArray(track.audioRoles) ? track.audioRoles[0] || '' : '';
          const audioId = track.audioId ?? track.originalAudioId ?? `${language}-${role}-${track.audioCodec || 'audio'}`;
          const key = `${audioId}|${language}|${role}`;

          if (seen.has(key)) return null;
          seen.add(key);

          const channels = track.channelsCount ? `${track.channelsCount}ch` : '';
          const codec = track.audioCodec || track.codecs || '';
          const labelParts = [track.label, language !== 'und' ? language.toUpperCase() : 'Audio', role, channels].filter(Boolean);

          return {
            id: `${language}|${role}|${audioId}|${index}`,
            label: labelParts.join(' / '),
            language,
            active: Boolean(track.active),
            codec,
          };
        })
        .filter(Boolean);
    };

    const getDashVideoVariants = (variantTracks: any[]) => {
      const seen = new Set<string>();

      return variantTracks
        .map((track: any) => {
          const videoKey = String(track.videoId ?? track.originalVideoId ?? `${track.width}x${track.height}-${track.videoCodec}-${track.videoBandwidth ?? track.bandwidth}`);
          if (seen.has(videoKey)) return null;
          seen.add(videoKey);

          return {
            id: videoKey,
            label: makeVariantLabel(track.height, track.videoBandwidth ?? track.bandwidth),
            width: track.width,
            height: track.height,
            bandwidth: track.videoBandwidth ?? track.bandwidth,
            codecs: [track.videoCodec, track.audioCodec].filter(Boolean).join(' / '),
            frameRate: track.frameRate,
            active: Boolean(track.active),
          };
        })
        .filter(Boolean);
    };

    const getDashVideoKey = (track: any) => String(track.videoId ?? track.originalVideoId ?? `${track.width}x${track.height}-${track.videoCodec}-${track.videoBandwidth ?? track.bandwidth}`);

    const configureTextVisibility = (player: any, visible: boolean) => {
      if (typeof player.setTextVisibility === 'function') {
        player.setTextVisibility(visible);
      } else if (typeof player.setTextTrackVisibility === 'function') {
        player.setTextTrackVisibility(visible);
      }
    };

    const updateStatus = useCallback((s: typeof status) => {
      setStatus(s);
      onStatusChange?.(s);
    }, [onStatusChange]);

    const shouldShowBlockingError = useCallback((video: HTMLVideoElement) => {
      const hasBufferedData = video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA || video.buffered.length > 0;
      const stillStarting = Date.now() - loadStartedAtRef.current < 25000;
      return !hasBufferedData && !stillStarting;
    }, []);

    const keepAudioOn = useCallback((video: HTMLVideoElement) => {
      if (!settingsRef.current.audioEnabled) return;
      video.muted = false;
      video.volume = 1;
    }, []);

    const startVideoPlayback = useCallback((video: HTMLVideoElement) => {
      video.muted = !settingsRef.current.audioEnabled;
      video.volume = 1;

      const tryPlay = () => video.play().then(() => {
        keepAudioOn(video);
        updateStatus('playing');
      });

      return tryPlay().catch(() => {
        // Muted fallback for autoplay-blocked browsers
        video.muted = true;
        return tryPlay().catch(() => {
          if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            updateStatus('playing');
          } else if (!shouldShowBlockingError(video)) {
            updateStatus('buffering');
          } else {
            updateStatus('error');
            setErrorMsg('Playback could not start');
          }
        });
      });
    }, [keepAudioOn, shouldShowBlockingError, updateStatus]);

    useEffect(() => {
      settingsRef.current = settings;
    }, [settings]);

    useImperativeHandle(ref, () => ({
      getStatus: () => status,
      requestPiP: () => {
        const video = videoRef.current;
        if (video && document.pictureInPictureEnabled) {
          if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch(() => {});
          } else {
            video.requestPictureInPicture().catch(() => {});
          }
        }
      },
    }));

    const destroyPlayers = useCallback(() => {
      shouldAutoResumeRef.current = false;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (shakaRef.current) {
        shakaRef.current.destroy();
        shakaRef.current = null;
      }
    }, []);

    const playHLS = useCallback(async (stream: StreamSource, video: HTMLVideoElement) => {
      shouldAutoResumeRef.current = true;
      loadStartedAtRef.current = Date.now();
      updateStatus('loading');

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 30,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          liveSyncDurationCount: 4,
          liveMaxLatencyDurationCount: 10,
          capLevelToPlayerSize: true,
          abrEwmaFastLive: 5,
          abrEwmaSlowLive: 15,
          abrEwmaFastVoD: 5,
          abrEwmaSlowVoD: 20,
          manifestLoadingMaxRetry: 5,
          levelLoadingMaxRetry: 5,
          fragLoadingMaxRetry: 5,
          manifestLoadingRetryDelay: 1000,
          levelLoadingRetryDelay: 1000,
          fragLoadingRetryDelay: 1000,
          startLevel: settingsRef.current.quality === 'auto' ? -1 : undefined,
        });

        hlsRef.current = hls;

        hls.loadSource(stream.url);
        hls.attachMedia(video);

        const updateHlsStreamInfo = () => {
          const variants = hls.levels.map((level, index) => ({
            id: String(index),
            label: makeVariantLabel(level.height, level.bitrate),
            width: level.width,
            height: level.height,
            bandwidth: level.bitrate,
            codecs: [level.videoCodec, level.audioCodec].filter(Boolean).join(' / '),
            active: hls.currentLevel === index,
          }));
          const audioTracks = hls.audioTracks.map((track, index) => ({
            id: String(index),
            label: track.name || track.lang || `Audio ${index + 1}`,
            language: track.lang,
            active: hls.audioTrack === index,
          }));
          const textTracks = hls.subtitleTracks.map((track, index) => ({
            id: String(index),
            label: track.name || track.lang || `Subtitle ${index + 1}`,
            language: track.lang,
            active: hls.subtitleTrack === index,
          }));
          const selectedVariant = variants.find((variant) => variant.active) ?? variants[0];
          const currentSettings = settingsRef.current;

          onStreamInfoChange?.({
            protocol: 'hls',
            drm: stream.drm?.scheme?.toUpperCase() ?? 'None',
            variants,
            audioTracks,
            textTracks,
            selectedQuality: currentSettings.quality === 'auto' ? 'Auto' : selectedVariant?.label ?? 'Auto',
            selectedAudio: currentSettings.audioTrack === 'auto'
              ? audioTracks.find((track) => track.active)?.label ?? audioTracks[0]?.label ?? 'Auto'
              : audioTracks.find((track) => track.id === normalizeAudioId(currentSettings.audioTrack))?.label ?? audioTracks.find((track) => track.active)?.label ?? 'Auto',
            selectedText: currentSettings.subtitles ? textTracks.find((track) => track.id === normalizeTrackId(currentSettings.subtitleTrack))?.label ?? textTracks[0]?.label ?? 'On' : 'Off',
            resolution: selectedVariant?.height ? `${selectedVariant.width ?? ''}x${selectedVariant.height}` : 'Unknown',
            bandwidth: formatBandwidth(selectedVariant?.bandwidth),
            manifestUrl: stream.url,
          });
        };

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const currentSettings = settingsRef.current;

          if (currentSettings.quality !== 'auto') {
            const targetLevel = Number(currentSettings.quality);
            if (!Number.isNaN(targetLevel) && hls.levels[targetLevel]) {
              hls.autoLevelCapping = targetLevel;
            }
          } else {
            hls.autoLevelCapping = -1;
          }

          if (currentSettings.audioTrack !== 'auto') {
            const targetAudio = Number(normalizeAudioId(currentSettings.audioTrack));
            if (!Number.isNaN(targetAudio) && hls.audioTracks[targetAudio]) {
              hls.audioTrack = targetAudio;
            }
          }

          if (currentSettings.subtitles && hls.subtitleTracks.length > 0) {
            const targetSubtitle = currentSettings.subtitleTrack === 'Default'
              ? 0
              : Number(normalizeTrackId(currentSettings.subtitleTrack));
            hls.subtitleTrack = !Number.isNaN(targetSubtitle) && hls.subtitleTracks[targetSubtitle]
              ? targetSubtitle
              : 0;
          } else {
            hls.subtitleTrack = -1;
          }

          updateHlsStreamInfo();

          startVideoPlayback(video);
        });

        hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, updateHlsStreamInfo);
        hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, updateHlsStreamInfo);
        hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, updateHlsStreamInfo);
        hls.on(Hls.Events.SUBTITLE_TRACK_SWITCH, updateHlsStreamInfo);
        hls.on(Hls.Events.LEVEL_SWITCHED, updateHlsStreamInfo);

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('HLS network error, trying to recover...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('HLS media error, trying to recover...');
                hls.recoverMediaError();
                break;
              default:
                if (shouldShowBlockingError(video)) {
                  updateStatus('error');
                  setErrorMsg('Stream playback failed');
                  onError?.('Stream playback failed');
                }
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream.url;
        video.addEventListener('loadedmetadata', () => {
          startVideoPlayback(video);
        });
      } else {
        updateStatus('error');
        setErrorMsg('HLS not supported in this browser');
      }
    }, [onError, onStreamInfoChange, shouldShowBlockingError, startVideoPlayback, updateStatus]);

    const playDASH = useCallback(async (stream: StreamSource, video: HTMLVideoElement) => {
      shouldAutoResumeRef.current = true;
      loadStartedAtRef.current = Date.now();
      updateStatus('loading');

      try {
        const shaka = await getShaka();
        const player = new shaka.Player(video);
        shakaRef.current = player;

        player.addEventListener('error', (event: any) => {
          console.error('Shaka error:', event.detail);
          const videoReady = video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !video.paused && !video.ended;
          const errorCode = event.detail?.code;
          const now = Date.now();
          const duplicateError = now - lastShakaErrorAtRef.current < 1500;
          lastShakaErrorAtRef.current = now;

          // Live DASH streams often emit recoverable/non-fatal Shaka errors while
          // continuing playback. Do not interrupt visible playback for those.
          if (event.detail?.severity === 1 || videoReady || duplicateError) return;

          // If there is buffered media, give Shaka a moment to recover before
          // showing the blocking error overlay.
          setTimeout(() => {
            const recovered = video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !video.paused && !video.ended;
            if (recovered) return;
            if (!shouldShowBlockingError(video)) {
              updateStatus('buffering');
              return;
            }
            updateStatus('error');
            setErrorMsg(`DASH Error${errorCode ? ` ${errorCode}` : ''}: ${event.detail?.message || 'Unknown error'}`);
            onError?.(event.detail?.message || 'DASH stream failed');
          }, 1200);
        });

        player.configure({
          streaming: {
            bufferingGoal: 30,
            rebufferingGoal: 3,
            bufferBehind: 30,
            gapDetectionThreshold: 0.5,
            gapJumpTimerTime: 0.25,
            stallThreshold: 2,
            stallSkip: 0.1,
            stallEnabled: true,
            ignoreTextStreamFailures: true,
            inaccurateManifestTolerance: 2,
            segmentPrefetchLimit: 2,
            lowLatencyMode: false,
            startAtSegmentBoundary: false,
            safeSeekOffset: 2,
            liveSync: {
              enabled: false,
              targetLatency: 20,
              targetLatencyTolerance: 10,
              maxPlaybackRate: 1,
              minPlaybackRate: 1,
              panicMode: false,
              panicThreshold: 60,
            },
            retryParameters: {
              maxAttempts: 6,
              baseDelay: 1000,
              backoffFactor: 2,
              fuzzFactor: 0.5,
              timeout: 45000,
            },
          },
          manifest: {
            dash: {
              autoCorrectDrift: true,
              ignoreMinBufferTime: true,
              ignoreSuggestedPresentationDelay: true,
              ignoreEmptyAdaptationSet: true,
              ignoreMaxSegmentDuration: true,
            },
            retryParameters: {
              maxAttempts: 6,
              baseDelay: 1000,
              backoffFactor: 2,
              fuzzFactor: 0.5,
              timeout: 45000,
            },
          },
          drm: {
            retryParameters: {
              maxAttempts: 6,
              baseDelay: 1000,
              backoffFactor: 2,
              fuzzFactor: 0.5,
              timeout: 45000,
            },
          },
          abr: {
            enabled: settingsRef.current.quality === 'auto',
            switchInterval: 12,
            bandwidthUpgradeTarget: 0.7,
            bandwidthDowngradeTarget: 0.9,
          },
        });

        // Configure DRM (ClearKey)
        if (stream.drm?.scheme === 'clearkey' && stream.drm.clearkeys) {
          player.configure({
            drm: {
              clearKeys: stream.drm.clearkeys,
            },
          });
        } else if (stream.drm?.scheme === 'widevine' && stream.drm.licenseServer) {
          player.configure({
            drm: {
              servers: {
                'com.widevine.alpha': stream.drm.licenseServer,
              },
            },
          });

          if (stream.drm.headers) {
            player.getNetworkingEngine()?.registerRequestFilter((_type: any, request: any) => {
              if (stream.drm?.headers) {
                Object.entries(stream.drm.headers).forEach(([key, value]) => {
                  request.headers[key] = value;
                });
              }
            });
          }
        }

        const manifestUrl = new URL(stream.url);
        const manifestQuery = manifestUrl.search;

        player.getNetworkingEngine()?.registerRequestFilter((_type: any, request: any) => {
          request.allowCrossSiteCredentials = false;

          // Some tokenized DASH manifests use relative segment URLs. Shaka resolves
          // those URLs without the manifest query string, so carry the token over to
          // init/fragment requests from the same channel path.
          if (manifestQuery && Array.isArray(request.uris)) {
            request.uris = request.uris.map((uri: string) => {
              try {
                const requestUrl = new URL(uri, stream.url);
                const sameOrigin = requestUrl.origin === manifestUrl.origin;
                const samePath = requestUrl.pathname.startsWith(manifestUrl.pathname.replace(/\/[^/]*$/, '/'));

                if (sameOrigin && samePath && !requestUrl.search) {
                  requestUrl.search = manifestQuery;
                  return requestUrl.toString();
                }
              } catch {
                return uri;
              }

              return uri;
            });
          }
        });

        await player.load(stream.url);

        try {
          const range = player.seekRange?.();
          if (range && Number.isFinite(range.end) && range.end > range.start) {
            const liveStart = Math.max(range.start, range.end - 18);
            if (Number.isFinite(liveStart)) video.currentTime = liveStart;
          }
        } catch {
          // Some VOD-like DASH manifests may not expose a live seek range.
        }

        let variantTracks = player.getVariantTracks?.() ?? [];
        const textTracks = player.getTextTracks?.() ?? [];

        const currentSettings = settingsRef.current;

        if (currentSettings.audioTrack !== 'auto' && variantTracks.length > 0) {
          const [selectedLanguage, selectedRole, selectedAudioId] = currentSettings.audioTrack.split('|');
          const activeVariant = variantTracks.find((track: any) => track.active);
          const audioVariant = variantTracks.find((track: any) => {
            const trackLanguage = track.language || track.originalLanguage || 'und';
            const trackRole = Array.isArray(track.audioRoles) ? track.audioRoles[0] || '' : '';
            const trackAudioId = String(track.audioId ?? track.originalAudioId ?? `${trackLanguage}-${trackRole}-${track.audioCodec || 'audio'}`);
            const sameAudio = trackLanguage === selectedLanguage && trackRole === selectedRole && trackAudioId === selectedAudioId;
            const sameVideo = !activeVariant || !track.videoId || !activeVariant.videoId || track.videoId === activeVariant.videoId;
            return sameAudio && sameVideo;
          }) ?? variantTracks.find((track: any) => {
            const trackLanguage = track.language || track.originalLanguage || 'und';
            const trackRole = Array.isArray(track.audioRoles) ? track.audioRoles[0] || '' : '';
            const trackAudioId = String(track.audioId ?? track.originalAudioId ?? `${trackLanguage}-${trackRole}-${track.audioCodec || 'audio'}`);
            return trackLanguage === selectedLanguage && trackRole === selectedRole && trackAudioId === selectedAudioId;
          });

          if (audioVariant) {
            player.selectVariantTrack(audioVariant, false);
            variantTracks = player.getVariantTracks?.() ?? variantTracks;
          }
        }

        const variants = getDashVideoVariants(variantTracks) as Array<any>;
        const audioTracks = getDashAudioTracks(variantTracks) as Array<{ id: string; label: string; language?: string; active?: boolean; codec?: string }>;
        let selectedVariant = variants.find((variant: any) => variant.active) ?? variants[0];

        if (currentSettings.quality !== 'auto') {
          const selectedTrack = variantTracks.find((track: any) => getDashVideoKey(track) === currentSettings.quality);
          if (selectedTrack) {
            player.configure({
              abr: { enabled: true },
              restrictions: {
                minHeight: 0,
                minWidth: 0,
                minBandwidth: 0,
                maxHeight: selectedTrack.height || 1000000000,
                maxWidth: selectedTrack.width || 1000000000,
                maxBandwidth: selectedTrack.bandwidth || 1000000000,
              },
            });
            selectedVariant = variants.find((variant: any) => variant.id === getDashVideoKey(selectedTrack)) ?? selectedVariant;
          }
        } else {
          player.configure({
            abr: { enabled: true },
            restrictions: {
              minHeight: 0,
              minWidth: 0,
              minBandwidth: 0,
              maxHeight: 1000000000,
              maxWidth: 1000000000,
              maxBandwidth: 1000000000,
            },
          });
        }

        if (currentSettings.subtitles && textTracks[0]) {
          configureTextVisibility(player, true);
          const selectedTextTrack = currentSettings.subtitleTrack === 'Default'
            ? textTracks.find((track: any) => track.active) ?? textTracks[0]
            : textTracks.find((track: any) => String(track.id) === normalizeTrackId(currentSettings.subtitleTrack)) ?? textTracks[0];
          player.selectTextTrack(selectedTextTrack);
        } else {
          configureTextVisibility(player, false);
        }

        onStreamInfoChange?.({
          protocol: 'dash',
          drm: stream.drm?.scheme?.toUpperCase() ?? 'None',
          variants,
          audioTracks,
          textTracks: textTracks.map((track: any) => ({
            id: String(track.id),
            label: track.label || track.language || `Text ${track.id}`,
            language: track.language,
            active: currentSettings.subtitleTrack === String(track.id) || (currentSettings.subtitleTrack === 'Default' && track.active),
          })),
          selectedQuality: currentSettings.quality === 'auto' ? 'Auto' : selectedVariant?.label ?? 'Auto',
          selectedAudio: audioTracks.find((track: any) => track.active)?.label ?? 'Auto',
          selectedText: currentSettings.subtitles ? (textTracks.find((track: any) => String(track.id) === normalizeTrackId(currentSettings.subtitleTrack))?.label ?? textTracks.find((track: any) => track.active)?.label ?? 'On') : 'Off',
          resolution: selectedVariant?.height ? `${selectedVariant.width ?? ''}x${selectedVariant.height}` : 'Unknown',
          bandwidth: formatBandwidth(selectedVariant?.bandwidth),
          manifestUrl: stream.url,
        });

        startVideoPlayback(video);

      } catch (err: any) {
        console.error('Shaka init error:', err);
        if (shouldShowBlockingError(video)) {
          updateStatus('error');
          setErrorMsg(`Failed to initialize player: ${err.message || 'Unknown error'}`);
        } else {
          updateStatus('buffering');
        }
      }
    }, [onError, onStreamInfoChange, shouldShowBlockingError, startVideoPlayback, updateStatus]);

    // Load stream when channel changes
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const stream = channel.stream;

      destroyPlayers();
      updateStatus('idle');
      setErrorMsg('');
      onStreamInfoChange?.({ ...defaultStreamInfo, manifestUrl: stream?.url ?? '' });

      if (!stream) {
        updateStatus('no-stream');
        return;
      }

      if (typeof window !== 'undefined' && window.location.protocol === 'https:' && stream.url.startsWith('http:')) {
        updateStatus('error');
        setErrorMsg('This HTTP stream is blocked on HTTPS. Open the app over HTTP to play it.');
        return;
      }

      const timer = setTimeout(() => {
        if (stream.type === 'hls') {
          playHLS(stream, video);
        } else if (stream.type === 'dash') {
          playDASH(stream, video);
        }
      }, 200);

      return () => {
        clearTimeout(timer);
        destroyPlayers();
      };
    }, [channel.stream?.url, channel.stream?.type, channel.stream?.drm, retryCount, destroyPlayers, playHLS, playDASH, updateStatus, onStreamInfoChange, settings.reloadToken]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;
      if (video.paused && (hlsRef.current || shakaRef.current || video.src)) {
        startVideoPlayback(video);
      }
    }, [startVideoPlayback]);
	
    // Sync PiP state when closed externally
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;
      const handleLeavePiP = () => {
        if (settingsRef.current.pip) {
          onSettingsChange?.({ pip: false });
        }
      };
      video.addEventListener('leavepictureinpicture', handleLeavePiP);
      return () => video.removeEventListener('leavepictureinpicture', handleLeavePiP);
    }, [onSettingsChange]);
	
    // Apply playback-option changes without destroying/reloading the active stream.
    useEffect(() => {
      const video = videoRef.current;
      if (video) video.muted = !settings.audioEnabled;

      const hls = hlsRef.current;
      if (hls) {
        if (settings.quality === 'auto') {
            hls.autoLevelCapping = -1;
            hls.currentLevel = -1;
        } else {
          const targetLevel = Number(settings.quality);
            if (!Number.isNaN(targetLevel) && hls.levels[targetLevel]) {
              hls.autoLevelCapping = targetLevel;
              hls.currentLevel = targetLevel;
              hls.nextLoadLevel = targetLevel;
            }
        }

        if (settings.audioTrack === 'auto') {
          if (hls.audioTracks.length > 0 && hls.audioTrack < 0) hls.audioTrack = 0;
        } else {
          const targetAudio = Number(normalizeAudioId(settings.audioTrack));
          if (!Number.isNaN(targetAudio) && hls.audioTracks[targetAudio]) hls.audioTrack = targetAudio;
        }

        if (settings.subtitles && hls.subtitleTracks.length > 0) {
          const targetSubtitle = settings.subtitleTrack === 'Default' ? 0 : Number(normalizeTrackId(settings.subtitleTrack));
          hls.subtitleTrack = !Number.isNaN(targetSubtitle) && hls.subtitleTracks[targetSubtitle] ? targetSubtitle : 0;
        } else {
          hls.subtitleTrack = -1;
        }
      }

      const player = shakaRef.current;
      if (player) {
        try {
          let variantTracks = player.getVariantTracks?.() ?? [];
          const activeVariant = variantTracks.find((track: any) => track.active);

          let selectedVariant: any = null;
          let audioVariantForSelection: any = null;
          if (settings.quality !== 'auto') {
            selectedVariant = variantTracks.find((track: any) => getDashVideoKey(track) === settings.quality) ?? null;
          }

          if (settings.audioTrack !== 'auto') {
            const [selectedLanguage, selectedRole, selectedAudioId] = settings.audioTrack.split('|');
            const audioVariant = variantTracks.find((track: any) => {
              const trackLanguage = track.language || track.originalLanguage || 'und';
              const trackRole = Array.isArray(track.audioRoles) ? track.audioRoles[0] || '' : '';
              const trackAudioId = String(track.audioId ?? track.originalAudioId ?? `${trackLanguage}-${trackRole}-${track.audioCodec || 'audio'}`);
              const sameAudio = trackLanguage === selectedLanguage && trackRole === selectedRole && trackAudioId === selectedAudioId;
              const sameVideo = selectedVariant
                ? (!track.videoId || !selectedVariant.videoId || track.videoId === selectedVariant.videoId)
                : (!activeVariant || !track.videoId || !activeVariant.videoId || track.videoId === activeVariant.videoId);
              return sameAudio && sameVideo;
            }) ?? variantTracks.find((track: any) => {
              const trackLanguage = track.language || track.originalLanguage || 'und';
              const trackRole = Array.isArray(track.audioRoles) ? track.audioRoles[0] || '' : '';
              const trackAudioId = String(track.audioId ?? track.originalAudioId ?? `${trackLanguage}-${trackRole}-${track.audioCodec || 'audio'}`);
              return trackLanguage === selectedLanguage && trackRole === selectedRole && trackAudioId === selectedAudioId;
            });

            if (audioVariant) {
              audioVariantForSelection = audioVariant;
              selectedVariant = audioVariant;
            }
          }

          if (selectedVariant) {
            player.configure({
              abr: { enabled: false },
              restrictions: {
                minHeight: 0,
                minWidth: 0,
                minBandwidth: 0,
                maxHeight: selectedVariant.height || 1000000000,
                maxWidth: selectedVariant.width || 1000000000,
                maxBandwidth: selectedVariant.bandwidth || 1000000000,
              },
            });
            player.selectVariantTrack(selectedVariant, true);
          } else {
            player.configure({
              abr: { enabled: true },
              restrictions: {
                minHeight: 0,
                minWidth: 0,
                minBandwidth: 0,
                maxHeight: 1000000000,
                maxWidth: 1000000000,
                maxBandwidth: 1000000000,
              },
            });
          }

          if (audioVariantForSelection) {
            player.selectVariantTrack(audioVariantForSelection, true);
          }

          variantTracks = player.getVariantTracks?.() ?? variantTracks;
          const textTracks = player.getTextTracks?.() ?? [];
          if (settings.subtitles && textTracks[0]) {
            configureTextVisibility(player, true);
            const selectedTextTrack = settings.subtitleTrack === 'Default'
              ? textTracks.find((track: any) => track.active) ?? textTracks[0]
              : textTracks.find((track: any) => String(track.id) === normalizeTrackId(settings.subtitleTrack)) ?? textTracks[0];
            player.selectTextTrack(selectedTextTrack);
          } else {
            configureTextVisibility(player, false);
          }

          const variants = getDashVideoVariants(variantTracks) as Array<any>;
          const audioTracks = getDashAudioTracks(variantTracks) as Array<{ id: string; label: string; language?: string; active?: boolean; codec?: string }>;
          const currentVariant = variants.find((variant: any) => variant.active) ?? variants[0];

          onStreamInfoChange?.({
            protocol: 'dash',
            drm: channel.stream?.drm?.scheme?.toUpperCase() ?? 'None',
            variants,
            audioTracks,
            textTracks: textTracks.map((track: any) => ({
              id: String(track.id),
              label: track.label || track.language || `Text ${track.id}`,
              language: track.language,
              active: settings.subtitleTrack === String(track.id) || (settings.subtitleTrack === 'Default' && track.active),
            })),
            selectedQuality: settings.quality === 'auto' ? 'Auto' : currentVariant?.label ?? 'Auto',
            selectedAudio: audioTracks.find((track: any) => track.active)?.label ?? 'Auto',
            selectedText: settings.subtitles ? (textTracks.find((track: any) => String(track.id) === normalizeTrackId(settings.subtitleTrack))?.label ?? textTracks.find((track: any) => track.active)?.label ?? 'On') : 'Off',
            resolution: currentVariant?.height ? `${currentVariant.width ?? ''}x${currentVariant.height}` : 'Unknown',
            bandwidth: formatBandwidth(currentVariant?.bandwidth),
            manifestUrl: channel.stream?.url ?? '',
          });
        } catch (error) {
          console.warn('Unable to apply playback option without reload', error);
        }
      }
    }, [channel.stream, onStreamInfoChange, settings.audioEnabled, settings.audioTrack, settings.quality, settings.subtitleTrack, settings.subtitles]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        destroyPlayers();
      };
    }, [destroyPlayers]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleWaiting = () => {
        if (video.paused || video.ended) return;

        if (bufferingTimerRef.current) clearTimeout(bufferingTimerRef.current);
        bufferingTimerRef.current = setTimeout(() => {
          if (!video.paused && !video.ended && video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
            updateStatus('buffering');
          }
        }, 1200);
      };
      const clearBufferingState = () => {
        if (bufferingTimerRef.current) {
          clearTimeout(bufferingTimerRef.current);
          bufferingTimerRef.current = null;
        }
      };
      const handlePlaying = () => {
        clearBufferingState();
        updateStatus('playing');
      };
      const handleCanPlay = () => {
        clearBufferingState();
        if (!video.paused) updateStatus('playing');
      };
      const handlePause = () => {
        if (!shouldAutoResumeRef.current || video.ended || video.error) return;

        setTimeout(() => {
          if (shouldAutoResumeRef.current && video.paused && !video.ended && !video.error) {
            startVideoPlayback(video);
          }
        }, 250);
      };
      const handleEnded = () => {
        if (channel.number !== 1 || channel.stream?.type !== 'hls') return;

        const hls = hlsRef.current;
        try {
          video.currentTime = 0;
          hls?.startLoad(0);
          startVideoPlayback(video);
        } catch {
          setRetryCount((count) => count + 1);
        }
      };
      const handleError = () => {
        clearBufferingState();
        if (video.error && video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA && status !== 'playing') {
          updateStatus('error');
          setErrorMsg('Video element playback failed');
        }
      };

      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('stalled', handleWaiting);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('error', handleError);

      return () => {
        clearBufferingState();
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('stalled', handleWaiting);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('error', handleError);
      };
    }, [channel.number, channel.stream?.type, startVideoPlayback, status, updateStatus]);

    // Apply aspect ratio setting
    const objectFitStyle: React.CSSProperties = {
      objectFit: settings.aspectRatio === 'contain'
        ? 'contain'
        : settings.aspectRatio === 'cover'
        ? 'cover'
        : settings.aspectRatio === 'none'
        ? 'none'
        : 'fill',
      objectPosition: 'center',
    };

    // PiP toggle
    useEffect(() => {
      if (settings.pip) {
        const video = videoRef.current;
        if (video && document.pictureInPictureEnabled && !document.pictureInPictureElement) {
          video.requestPictureInPicture().catch(() => {});
        }
      } else {
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture().catch(() => {});
        }
      }
    }, [settings.pip]);

    const handleClick = () => {
      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        video.play().then(() => updateStatus('playing')).catch(() => {});
      }
    };

    const handleRetry = () => {
      setRetryCount((c) => c + 1);
    };

    return (
      <div className="relative w-full h-full" onClick={handleClick}>
        {/* Video element */}
        <video
          ref={videoRef}
          className={`w-full h-full transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
          style={objectFitStyle}
          playsInline
          autoPlay
          loop={channel.number === 1 && channel.stream?.type === 'hls'}
          muted={!settings.audioEnabled}
        />

        {/* Stats overlay */}
        {settings.stats && status === 'playing' && (
          <div className="absolute top-14 left-4 z-10 bg-black/70 backdrop-blur-md rounded-lg p-3 border border-white/10 text-[10px] font-mono space-y-1 min-w-48">
            <div className="text-white/30 font-sans font-semibold tracking-wider mb-1.5">STREAM STATS</div>
            <div className="flex justify-between text-white/50">
              <span>Protocol</span>
              <span className="text-white/80 uppercase">{channel.stream?.type ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between text-white/50">
              <span>Quality</span>
              <span className="text-white/80">{settings.quality}</span>
            </div>
            <div className="flex justify-between text-white/50">
              <span>Aspect</span>
              <span className="text-white/80">{settings.aspectRatio}</span>
            </div>
            <div className="flex justify-between text-white/50">
              <span>Status</span>
              <span className="text-green-400">● Playing</span>
            </div>
            <div className="flex justify-between text-white/50">
              <span>Channel</span>
              <span className="text-white/80">{channel.number} — {channel.name}</span>
            </div>
          </div>
        )}

        {/* Status overlays */}
        {(status === 'loading' || status === 'buffering') && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
            <div className="flex flex-col items-center">
              <div className="relative h-14 w-14">
                <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-white border-r-white" />
              </div>
            </div>
          </div>
        )}

        {status === 'no-stream' && (
          <div className="absolute inset-0 z-10 bg-black" />
        )}

        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10 cursor-pointer">
            <div className="relative flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-400 text-2xl">⚠</span>
              </div>
              <div className="text-white/60 text-sm">{errorMsg || 'Stream unavailable'}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRetry();
                }}
                className="px-4 py-2 rounded-lg bg-white text-sm font-medium text-black transition-all hover:scale-105"
              >
                Retry
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }
);

export default VideoPlayer;
