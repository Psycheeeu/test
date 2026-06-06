export interface Program {
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  genre: string;
  rating?: string;
  startMs?: number;
  endMs?: number;
  source?: 'epg' | 'none';
}

export interface StreamSource {
  url: string;
  type: 'hls' | 'dash';
  drm?: {
    scheme: 'widevine' | 'clearkey';
    licenseServer?: string;
    headers?: Record<string, string>;
    clearkeys?: Record<string, string>;
  };
}

export interface Channel {
  number: number;
  name: string;
  category: string;
  logo: string;
  epgId: string;
  epgSource: 'epg' | 'none';
  stream: StreamSource;
  programs: Program[];
  fallbackEpgId?: string;
  epgIdFound?: boolean;
  epgUrl?: string;
  isAdult?: boolean;
}

// Category options are generated from channel.category values at runtime.
// Use any category name on a channel and it will appear in the guide.

export function getDummyEpgId(channel: Pick<Channel, 'number' | 'name'>) {
  const slug = channel.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `dummy-${String(channel.number).padStart(3, '0')}-${slug || 'channel'}`;
}

export const noScheduleProgram = (channelName: string, genre: string): Program[] => [{
  title: 'No EPG schedule available',
  startTime: '--:--',
  endTime: '--:--',
  description: `No programme data was found in the configured EPG source for ${channelName}.`,
  genre,
  source: 'none',
}];

const musicProgram = (): Program[] => [{
  title: 'NMIXX - Heavy Serenade',
  startTime: '00:00',
  endTime: '23:59',
  description: "NMIXX's Heavy Serenade is one of their most cohesive \"MIXX POP\" projects so far — emotionally focused, sonically layered, and structurally designed around the idea of love becoming overwhelming in both a beautiful and frightening way.",
  genre: 'Music',
  source: 'none',
}];

const mchProgram = (): Program[] => [{
  title: 'M-CH',
  startTime: '00:00',
  endTime: '23:59',
  description: 'M-CH programming block.',
  genre: 'Music',
  source: 'none',
}];

export const channels: Channel[] = [
  {
    number: 1,
    name: 'WELCOME!',
    category: 'Welcome',
    logo: 'https://i.imgur.com/x4MvRc9.jpeg',
    epgId: 'none',
    epgSource: 'none',
    stream: {
      url: 'https://video.gumlet.io/69097ed4aa9e79860d918dd9/6a02526137b9faaace286abd/main.m3u8',
      type: 'hls',
    },
    programs: musicProgram(),
  },
  {
    number: 2,
    name: 'Kapamilya Channel',
    category: 'Local',
    logo: 'https://i.imgur.com/d3LXERq.png',
    epgId: 'kapamilya-channel',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/kapamilya-channel-hd/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Kapamilya Channel', 'Local'),
  },
  {
    number: 3,
    name: 'GMA',
    category: 'Local',
    logo: 'https://i.imgur.com/D3qGmme.png',
    epgId: 'gma',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/gma-7/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('GMA', 'Local'),
  },
  {
    number: 4,
    name: 'GTV',
    category: 'Local',
    logo: 'https://i.imgur.com/YwKq8Ta.png',
    epgId: 'gtv',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/gtv/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('GTV', 'Local'),
  },
  {
    number: 5,
    name: 'TV5',
    category: 'Local',
    logo: 'https://i.imgur.com/vhIcFmV.png',
    epgId: 'TV5.ph',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/tv5/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '2615129ef2c846a9bbd43a641c7303ef': '07c7f996b1734ea288641a68e1cfdc4d' },
      },
    },
    programs: noScheduleProgram('TV5', 'Local'),
  },
  {
    number: 6,
    name: 'One Sports',
    category: 'Local',
    logo: 'https://i.imgur.com/btiNwYt.png',
    epgId: 'cg_onesports_hd',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/one-sports-hd/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '53c3bf2eba574f639aa21f2d4409ff11': '3de28411cf08a64ea935b9578f6d0edd' },
      },
    },
    programs: noScheduleProgram('One Sports', 'Local'),
  },
  {
    number: 7,
    name: 'RPTV',
    category: 'Local',
    logo: 'https://i.imgur.com/IDCHfXm.png',
    epgId: 'cnn_rptv_prod_hd',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/rptv/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '1917f4caf2364e6d9b1507326a85ead6': 'a1340a251a5aa63a9b0ea5d9d7f67595' },
      },
    },
    programs: noScheduleProgram('RPTV', 'Local'),
  },
  {
    number: 8,
    name: 'A2Z',
    category: 'Local',
    logo: 'https://i.imgur.com/DVSTY3w.png',
    epgId: 'A2Z.ph',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/a2z/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '3f6d8a2c1b7e4c9f8d52a7e1b0c6f93d': '4019f9269b9054a2b9e257b114ebbaf2' },
      },
    },
    programs: noScheduleProgram('A2Z', 'Local'),
  },
  {
    number: 9,
    name: 'ALLTV',
    category: 'Local',
    logo: 'https://i.imgur.com/NGDPhIj.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/all-tv/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('ALLTV', 'Local'),
  },
  {
    number: 10,
    name: 'PTV',
    category: 'Local',
    logo: 'https://i.imgur.com/ycPz1Uc.png',
    epgId: 'cg_ptv4_sd',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/ptv4/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '71a130a851b9484bb47141c8966fb4a3': 'ad1f003b4f0b31b75ea4593844435600' },
      },
    },
    programs: noScheduleProgram('PTV', 'Local'),
  },
  {
    number: 11,
    name: 'HBO',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/pa2SF5Z.png',
    epgId: 'HBOAsia.sg',
    epgSource: 'https://iptv-epg.org/files/epg-sg.xml',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/hbo/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'c2b7a1e95d4f4c3a8e617f9d0a2b6c18': '27fca1ab042998b0c2f058b0764d7ed4' },
      },
    },
    programs: noScheduleProgram('HBO', 'Entertainment'),
  },
  {
    number: 12,
    name: 'Cinemax',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/X6H75p2.png',
    epgId: 'CinemaxAsia.sg',
    epgSource: '',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/cinemax/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'b207c44332844523a3a3b0469e5652d7': 'fe71aea346db08f8c6fbf0592209f955' },
      },
    },
    programs: noScheduleProgram('Cinemax', 'Entertainment'),
  },
  {
    number: 13,
    name: 'Bilyonaryo News',
    category: 'Local',
    logo: 'https://i.imgur.com/xvdO8G6.png',
    epgId: 'bilyonaryoch',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/bilyonaryo-channel/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '227ffaf09bec4a889e0e0988704d52a2': 'b2d0dce5c486891997c1c92ddaca2cd2' },
      },
    },
    programs: noScheduleProgram('Bilyonaryo News', 'Local'),
  },
  {
    number: 14,
    name: 'Aliw Channel',
    category: 'Local',
    logo: 'https://i.imgur.com/3tbmAlN.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/aliw-channel/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Aliw Channel', 'Local'),
  },
  {
    number: 15,
    name: 'DZRH',
    category: 'Local',
    logo: 'https://i.imgur.com/P1mCl2k.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/dzrh-tv/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('DZRH', 'Local'),
  },
  {
    number: 16,
    name: 'CNN',
    category: 'News',
    logo: 'https://i.imgur.com/UYpxXca.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/cnn-international/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '900c43f0e02742dd854148b7a75abbec': 'da315cca7f2902b4de23199718ed7e90' },
      },
    },
    programs: noScheduleProgram('CNN', 'News'),
  },
  {
    number: 17,
    name: 'Bloomberg',
    category: 'News',
    logo: 'https://i.imgur.com/La3o9MU.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/fe185fb3-8d94-4cbe-bbca-acc104ca967f/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'db1343545ae25ddecf8dfa4422f35410': '79a044b30d64f5c37e6d45d503cbb280' },
      },
    },
    programs: noScheduleProgram('Bloomberg', 'News'),
  },
  {
    number: 18,
    name: 'Solarflix',
    category: 'Local',
    logo: 'https://i.imgur.com/KLdsqfm.png',
    epgId: 'solar-flix',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/solarflix/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Solarflix', 'Local'),
  },
  {
    number: 19,
    name: 'Premier Sports',
    category: 'Sports',
    logo: 'https://i.imgur.com/VzWOJHn.png',
    epgId: 'cg_ps_hd1',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/premier-sports/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'b8b595299fdf41c1a3481fddeb0b55e4': 'cd2b4ad0eb286239a4a022e6ca5fd007' },
      },
    },
    programs: noScheduleProgram('Premier Sports', 'Sports'),
  },
  {
    number: 20,
    name: 'Premier Sports 2',
    category: 'Sports',
    logo: 'https://i.imgur.com/2HVWtx0.png',
    epgId: 'premiersports2hd',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/premier-sports-2/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '59454adb530b4e0784eae62735f9d850': '61100d0b8c4dd13e4eb8b4851ba192cc' },
      },
    },
    programs: noScheduleProgram('Premier Sports 2', 'Sports'),
  },
  {
    number: 21,
    name: 'PBO',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/709Uy7N.png',
    epgId: 'pbo',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/converge-pbo/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('PBO', 'Local Entertainment'),
  },
  {
    number: 22,
    name: 'Viva Cinema',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/8y3fc3F.png',
    epgId: 'viva-cinema',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/converge-viva-cinema/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Viva Cinema', 'Local Entertainment'),
  },
  {
    number: 23,
    name: 'IBC',
    category: 'Local',
    logo: 'https://i.imgur.com/PwFOHQb.png',
    epgId: 'ibc13_sd_new',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/ibc-13/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '16ecd238c0394592b8d3559c06b1faf5': '05b47ae3be1368912ebe28f87480fc84' },
      },
    },
    programs: noScheduleProgram('IBC', 'Local'),
  },
  {
    number: 24,
    name: 'Russia Today',
    category: 'News',
    logo: 'https://i.imgur.com/fJpnzad.png',
    epgId: 'Russia.Today..sg',
    epgSource: 'none',
    stream: {
      url: 'https://1a-1791.com/live/hr6yv36f/slot-4/mxtm-wdfe_360p/chunklist_DVR.m3u8',
      type: 'hls',
    },
    programs: noScheduleProgram('Russia Today', 'News'),
  },
  {
    number: 25,
    name: 'CNA',
    category: 'News',
    logo: 'https://i.imgur.com/jNEGuBN.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/76b295fa-45b2-48ad-a9cf-e3b2fb32b432/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'f812aeae6be5b924a8181b512d5d7910': '44275884ee394d05081fde395ff6e415' },
      },
    },
    programs: noScheduleProgram('CNA', 'News'),
  },
  {
    number: 26,
    name: 'Hallypop',
    category: 'Music',
    logo: 'https://ottepg8.comclark.com:8443/iptvepg/images/markurl/mark_1733707474289.png',
    epgId: 'Music.Dummy.us',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/hallypop/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Hallypop', 'Music'),
  },
  {
    number: 27,
    name: 'MYX',
    category: 'Local',
    logo: 'https://i.imgur.com/CIPTNnT.png',
    epgId: 'MYX.ph',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/myx-philippines/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('MYX', 'Music'),
  },
  {
    number: 28,
    name: 'Rock TV Manila',
    category: 'Local',
    logo: 'https://i.imgur.com/ST060qy.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/rock-tv-of-manila/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Rock TV Manila', 'Music'),
  },
  {
    number: 29,
    name: 'RJ TV',
    category: 'Local',
    logo: 'https://i.imgur.com/LpPaA89.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/rjtv-29/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'hls',
    },
    programs: noScheduleProgram('RJ TV', 'Local'),
  },
  {
    number: 30,
    name: 'HBO Signature',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/3BOoqQn.png',
    epgId: '603',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/hbo-signature/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'a06ca6c275744151895762e0346380f5': '559da1b63eec77b5a942018f14d3f56f' },
      },
    },
    programs: noScheduleProgram('HBO Signature', 'Entertainment'),
  },
  {
    number: 31,
    name: 'HBO Hits',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/pZn9JHj.png',
    epgId: '605',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/hbo-hits/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'b04ae8017b5b4601a5a0c9060f6d5b7d': 'a8795f3bdb8a4778b7e888ee484cc7a1' },
      },
    },
    programs: noScheduleProgram('HBO Hits', 'Entertainment'),
  },
  {
    number: 32,
    name: 'HBO Family',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/Zy3pvJV.png',
    epgId: '604',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/hbo-family/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '872910c843294319800d85f9a0940607': 'f79fd895b79c590708cf5e8b5c6263be' },
      },
    },
    programs: noScheduleProgram('HBO Family', 'Entertainment'),
  },
  {
    number: 33,
    name: 'CNBC',
    category: 'News',
    logo: 'https://i.imgur.com/Jlcamdx.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/a46dd9ec-c577-4286-92c1-81bdecdc387c/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'c3a38f1340531759a1ca97bc5d80c810': '602827a870d49862d1a23f2912957b4c' },
      },
    },
    programs: noScheduleProgram('CNBC', 'News'),
  },
  {
    number: 34,
    name: 'Animax',
    category: 'Foreign',
    logo: 'https://i.imgur.com/QxTehhs.png',
    epgId: 'cg_animax_sd_new',
    epgSource: 'https://iptv-epg.org/files/epg-sg.xml',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/animax/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '92032b0e41a543fb9830751273b8debd': '03f8b65e2af785b10d6634735dbe6c11' },
      },
    },
    programs: noScheduleProgram('Animax', 'Foreign'),
  },
  {
    number: 35,
    name: 'Aniplus',
    category: 'Foreign',
    logo: 'https://i.imgur.com/QgRMmBS.png',
    epgId: 'AniplusAsia.sg',
    epgSource: 'https://iptv-epg.org/files/epg-sg.xml',
    stream: {
      url: 'https://amg18481-amg18481c1-amgplt0352.playout.now3.amagi.tv/playlist/amg18481-amg18481c1-amgplt0352/playlist.m3u8',
      type: 'hls',
    },
    programs: noScheduleProgram('Aniplus', 'Foreign'),
  },
  {
    number: 36,
    name: 'Rock Entertainment',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/6MlNllK.png',
    epgId: '473',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/rock-entertainment/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'e4ee0cf8ca9746f99af402ca6eed8dc7': 'be2a096403346bc1d0bb0f812822bb62' },
      },
    },
    programs: noScheduleProgram('Rock Entertainment', 'Entertainment'),
  },
  {
    number: 37,
    name: 'Rock Action',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/xh8vUt9.png',
    epgId: '474"',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/rock-action/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '0f852fb8412b11edb8780242ac120002': '4cbc004d8c444f9f996db42059ce8178' },
      },
    },
    programs: noScheduleProgram('Rock Action', 'Entertainment'),
  },
  {
    number: 38,
    name: 'Rock X Stream',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/w9Q8bil.png',
    epgId: 'ROCKXStream',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/5c931c0f-83bd-4ad8-ac56-0b1827232889/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '325370d722565ab5ed09a548ba360e10': 'c88fe8f34b9dc8e10a00e876a6ff4136' },
      },
    },
    programs: noScheduleProgram('Rock X Stream', 'Entertainment'),
  },
  {
    number: 39,
    name: 'tvN',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/lY1BAUH.png',
    epgId: 'cg_tvnpre',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/tvn-premium/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'e1bde543e8a140b38d3f84ace746553e': 'b712c4ec307300043333a6899a402c10' },
      },
    },
    programs: noScheduleProgram('tvN', 'Foreign'),
  },
  {
    number: 40,
    name: 'tvN Movies',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/oLzTyUX.png',
    epgId: 'tvNMovies',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/75a0ca10-3900-41a6-81ac-f8b406f9ebd2/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '8e269c8aa32ad77eb83068312343d610': 'd12ccebafbba2a535d88a3087f884252' },
      },
    },
    programs: noScheduleProgram('tvN Movies', 'Foreign'),
  },
  {
    number: 41,
    name: 'One News',
    category: 'News',
    logo: 'https://i.imgur.com/bmP06bk.png',
    epgId: 'onenews_hd1',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/one-news/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '2e6a9d7c1f4b4c8a8d33c7b1f0a5e924': '4c71e178d090332fbfe72e023b59f6d2' },
      },
    },
    programs: noScheduleProgram('One News', 'News'),
  },
  {
    number: 42,
    name: 'One PH',
    category: 'News',
    logo: 'https://i.imgur.com/9dMuFE1.png',
    epgId: 'oneph_sd',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/one-ph/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'b1c7e9d24f8a4d6c9e337a2f1c5b8d60': '8ff2e524cc1e028f2a4d4925e860c796' },
      },
    },
    programs: noScheduleProgram('One PH', 'News'),
  },
  {
    number: 43,
    name: 'True FM TV',
    category: 'News',
    logo: 'https://i.imgur.com/U8L0Liq.png',
    epgId: 'truefm_tv',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/true-tv/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'a4e2b9d61c754f3a8d109b6c2f1e7a55': '1d8d975f0bc2ed90eda138bd31f173f4' },
      },
    },
    programs: noScheduleProgram('True FM TV', 'Local'),
  },
  {
    number: 44,
    name: 'Solar Sports',
    category: 'Sports',
    logo: 'https://i.imgur.com/b7nN681.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/solarsports/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Solar Sports', 'Sports'),
  },
  {
    number: 45,
    name: 'Trace Sports Stars',
    category: 'Sports',
    logo: 'https://i.imgur.com/rR5SYHY.png',
    epgId: 'TraceSportStars.fr',
    epgSource: 'none',
    stream: {
      url: 'https://tracetv-sportstarts-vidaa.amagi.tv/playlist.m3u8',
      type: 'hls',
    },
    programs: noScheduleProgram('Trace Sports Stars', 'Sports'),
  },
  {
    number: 46,
    name: 'NET25',
    category: 'Local',
    logo: 'https://i.imgur.com/e6rZCVd.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/net-25/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('NET25', 'Local'),
  },
  {
    number: 47,
    name: 'DreamWorks Tagalized',
    category: 'Kids',
    logo: 'https://i.imgur.com/Z5yBthu.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/dreamworks-tagalized/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '564b3b1c781043c19242c66e348699c5': 'd3ad27d7fe1f14fb1a2cd5688549fbab' },
      },
    },
    programs: noScheduleProgram('DreamWorks Tagalized', 'Kids'),
  },
  {
    number: 48,
    name: 'Hits',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/2iKSRM4.png',
    epgId: '454',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/hits-hd/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '6d2f8a1c9b5e4c7da1f03e7b9d6c2a55': '37c9835795779f8d848a6119d3270c69' },
      },
    },
    programs: noScheduleProgram('Hits', 'Entertainment'),
  },
  {
    number: 49,
    name: 'Hits Movies',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/FUaEcJe.png',
    epgId: '407',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/176700f3-7def-4a42-b216-bc1562e1e189/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'ff1febd7018d0dd711601e795e0d6210': '38fbfb3a56e40ff92c9df8acbcba9ef6' },
      },
    },
    programs: noScheduleProgram('Hits Movies', 'Entertainment'),
  },
  {
    number: 50,
    name: 'Hits Now',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/gAm7L6V.png',
    epgId: '452',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/e44d67c2-ce18-4ea5-9bce-96afb1fecbd5/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '4307def6a29bec082f8c93f1f98e5910': 'a4d49bda8cd29ba2888c732b4e7d9d63' },
      },
    },
    programs: noScheduleProgram('Hits Now', 'Entertainment'),
  },
  {
    number: 51,
    name: 'Celestial Movies Pinoy',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/xDqZUOI.png',
    epgId: 'celmovie_pinoy_sd',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/celestial-movies-pinoy/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '0f8537d8412b11edb8780242ac120002': '2ffd7230416150fd5196fd7ea71c36f3' },
      },
    },
    programs: noScheduleProgram('Celestial Movies Pinoy', 'Local'),
  },
  {
    number: 52,
    name: 'tvN Movies Pinoy',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/e9vo9Z8.png',
    epgId: 'cg_tvnmovie',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/tvn-movies-pinoy/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '2e53f8d8a5e94bca8f9a1e16ce67df33': '3471b2464b5c7b033a03bb8307d9fa35' },
      },
    },
    programs: noScheduleProgram('tvN Movies Pinoy', 'Local'),
  },
  {
    number: 53,
    name: 'TMC',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/ZbrvQpg.png',
    epgId: 'Tagalized.Movie.Channel.ph',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/tmc/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '96701d297d1241e492d41c397631d857': 'ca2931211c1a261f082a3a2c4fd9f91b' },
      },
    },
    programs: noScheduleProgram('TMC', 'Local'),
  },
  {
    number: 54,
    name: 'ANC',
    category: 'News',
    logo: 'https://i.imgur.com/XzVYXaV.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/anc/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('ANC', 'News'),
  },
  {
    number: 55,
    name: 'DZMM Teleradyo',
    category: 'News',
    logo: 'https://i.imgur.com/zlMDkeG.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/dzmm-teleradyo/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('DZMM Teleradyo', 'News'),
  },
  {
    number: 56,
    name: 'WOWOW Cinema',
    category: 'Foreign',
    logo: 'https://www.starcat.co.jp/ch/upload/channel/34/wowow-cinema_logo.jpg',
    epgId: 'bs07',
    epgSource: 'none',
    stream: {
      url: 'https://akariko.netgenx.site/stream/jp/wowow_cinema/stream-output.m3u8?mode=hls',
      type: 'hls',
    },
    programs: noScheduleProgram('WOWOW Cinema', 'Foreign'),
  },
  {
    number: 57,
    name: 'WOWOW Live',
    category: 'Foreign',
    logo: 'https://www.starcat.co.jp/ch/upload/channel/33/wowow-live_logo.jpg',
    epgId: 'jp31',
    epgSource: 'none',
    stream: {
      url: 'https://akariko.netgenx.site/stream/jp/wowow_live/stream-output.m3u8?mode=hls',
      type: 'hls',
    },
    programs: noScheduleProgram('WOWOW Live', 'Foreign'),
  },
  {
    number: 58,
    name: 'WOWOW Plus',
    category: 'Foreign',
    logo: 'https://www.starcat.co.jp/ch/upload/channel/4/cinefilwowow_logo.jpg',
    epgId: 'jp33',
    epgSource: 'none',
    stream: {
      url: 'https://akariko.netgenx.site/stream/jp/wowow_plus/stream-output.m3u8?mode=hls',
      type: 'hls',
    },
    programs: noScheduleProgram('WOWOW Plus', 'Foreign'),
  },
  {
    number: 59,
    name: 'WOWOW Prime',
    category: 'Foreign',
    logo: 'https://www.starcat.co.jp/ch/upload/channel/32/wowow-prime_logo.jpg',
    epgId: 'bs12',
    epgSource: 'none',
    stream: {
      url: 'https://akariko.netgenx.site/stream/jp/wowow_prime/stream-output.m3u8?mode=hls',
      type: 'hls',
    },
    programs: noScheduleProgram('WOWOW Prime', 'Foreign'),
  },
  {
    number: 60,
    name: 'FX',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/gbvwqxl.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://nog-live1-ott.izzigo.tv/13/out/u/dash/FX-HD/default.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '8ce1ec3e2402a170cbe13b79ce9bb30f': '82fdcfde32cc02673547e58b50e2b5ae' },
      },
    },
    programs: noScheduleProgram('FX', 'Entertainment'),
  },
  {
    number: 61,
    name: 'Cinema One',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/hJ6MBiA.png',
    epgId: 'cinema-one',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/cinema-one/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Cinema One', 'Local Entertainment'),
  },
  {
    number: 62,
    name: 'Cinemo!',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/Pf8CNau.png',
    epgId: 'CineMo.ph',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/cinemo/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Cinemo', 'Local Entertainment'),
  },
  {
    number: 63,
    name: 'Jeepney TV',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/3yzbJE5.png',
    epgId: 'jeepney-tv',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/converge-jeepney-tv/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Jeepney TV', 'Local Entertainment'),
  },
  {
    number: 64,
    name: 'Kix',
    category: 'Foreign',
    logo: 'https://i.imgur.com/rwdQBJm.png',
    epgId: 'kix_hd1',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/kix/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Kix', 'Foreign'),
  },
  {
    number: 65,
    name: 'Thrill',
    category: 'Foreign',
    logo: 'https://i.imgur.com/LCX2guc.png',
    epgId: 'cg_thrill_sd',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/thrill/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '928114ffb2394d14b5585258f70ed183': 'a82edc340bc73447bac16cdfed0a4c62' },
      },
    },
    programs: noScheduleProgram('Thrill', 'Foreign'),
  },
  {
    number: 66,
    name: 'AXN',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/fLWFUhy.png',
    epgId: 'AXN',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/e3a61692-7bcd-4b1a-a8a2-6a7e0601aefe/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'c24a7811d9ab46b48b746a0e7e269210': 'c321afe1689b07d5b7e55bd025c483ce' },
      },
    },
    programs: noScheduleProgram('AXN', 'Entertainment'),
  },
  {
    number: 67,
    name: 'Tap TV',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/J6Olkop.png',
    epgId: 'TAPTV.ph',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/tap-tv/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Tap TV', 'Entertainment'),
  },
  {
    number: 68,
    name: 'Tap Edge',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/QyoUx60.png',
    epgId: 'TAPEDGE.ph',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/tap-edge/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Tap Edge', 'Entertainment'),
  },
  {
    number: 69,
    name: 'Tap Movies',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/3RVA5mV.png',
    epgId: 'TAPMovies.ph',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/tap-movies/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '71cbdf02b595468bb77398222e1ade09': 'c3f2aa420b8908ab8761571c01899460' },
      },
    },
    programs: noScheduleProgram('Tap Movies', 'Entertainment'),
  },
  {
    number: 70,
    name: 'Tap ActionFlix',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/2kwXRSR.png',
    epgId: 'TAPACTIONFLIX.ph',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/tap-action-flix/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Tap ActionFlix', 'Entertainment'),
  },
  {
    number: 71,
    name: 'Crime+Investigation',
    category: 'Documentary',
    logo: 'https://i.imgur.com/KeM5KlR.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/crime-investigation/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '21e2843b561c4248b8ea487986a16d33': 'db6bb638ccdfc1ad1a3e98d728486801' },
      },
    },
    programs: noScheduleProgram('Tap Movies', 'Documentary'),
  },
  {
    number: 72,
    name: 'Lifetime',
    category: 'Documentary',
    logo: 'https://i.imgur.com/LIrEjuN.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/lifetime/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'cf861d26e7834166807c324d57df5119': '64a81e30f6e5b7547e3516bbf8c647d0' },
      },
    },
    programs: noScheduleProgram('Tap Movies', 'Documentary'),
  },
  {
    number: 73,
    name: 'TRT World',
    category: 'News',
    logo: 'https://static.epg.best/tr/TRTWorld.tr.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://tv-trtworld.medya.trt.com.tr/master.m3u8',
      type: 'hls',
    },
    programs: noScheduleProgram('TRT World', 'News'),
  },
  {
    number: 74,
    name: 'UAAP Varsity',
    category: 'Sports',
    logo: 'https://i.imgur.com/V0sxXci.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/uaap-varsity-channel/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '95588338ee37423e99358a6d431324b9': '6e0f50a12f36599a55073868f814e81e' },
      },
    },
    programs: noScheduleProgram('UAAP Varsity', 'Sports'),
  },
  {
    number: 75,
    name: 'Lotus Macau',
    category: 'Foreign',
    logo: 'https://i.imgur.com/SNc90AX.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/lotus-macao/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '60dc692e64ea443a8fb5ac186c865a9b': '01bdbe22d59b2a4504b53adc2f606cc1' },
      },
    },
    programs: noScheduleProgram('UAAP Varsity', 'Foreign'),
  },
  {
    number: 76,
    name: 'Deutsche Welle',
    category: 'News',
    logo: 'https://i.imgur.com/UtR5MHV.png',
    epgId: 'DWEnglish.id',
    epgSource: 'none',
    stream: {
      url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
      type: 'hls',
    },
    programs: noScheduleProgram('Deutsche Welle', 'News'),
  },
  {
    number: 77,
    name: 'Tap Sports',
    category: 'Sports',
    logo: 'https://i.imgur.com/aeRpXyj.png',
    epgId: 'TAPSPORTS.ph',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/tap-sports/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'eabd2d95c89e42f2b0b0b40ce4179ea0': '0e7e35a07e2c12822316c0dc4873903f' },
      },
    },
    programs: noScheduleProgram('Tap Sports', 'Sports'),
  },
  {
    number: 78,
    name: 'Blast Movies',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/yVlZBrR.png',
    epgId: 'BLASTMOVIES.ph',
    epgSource: 'none',
    stream: {
      url: 'https://amg19223-amg19223c7-amgplt0351.playout.now3.amagi.tv/playlist/amg19223-amg19223c7-amgplt0351/playlist.m3u8',
      type: 'hls',
    },
    programs: noScheduleProgram('Blast Movies', 'Entertainment'),
  },
  {
    number: 79,
    name: 'Abante Radyo',
    category: 'Local',
    logo: 'https://i.imgur.com/seVOqBj.png',
    epgId: 'ABANTE.ph',
    epgSource: 'none',
    stream: {
      url: 'https://amg19223-amg19223c12-amgplt0352.playout.now3.amagi.tv/playlist/amg19223-amg19223c12-amgplt0352/playlist.m3u8',
      type: 'hls',
    },
    programs: noScheduleProgram('Abante Radyo', 'Local'),
  },
  {
    number: 80,
    name: 'Warner TV',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/Hy26eiy.png',
    epgId: '451',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/warner-tv/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '4503cf86bca3494ab95a77ed913619a0': 'afc9c8f627fb3fb255dee8e3b0fe1d71' },
      },
    },
    programs: noScheduleProgram('Warner TV', 'Entertainment'),
  },
  {
    number: 81,
    name: 'USA Today',
    category: 'News',
    logo: 'https://i.imgur.com/6l5i7DF.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/usa-today/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('USA Today', 'News'),
  },
  {
    number: 82,
    name: 'WION',
    category: 'News',
    logo: 'https://static.epg.best/in/WION.in.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://d7x8z4yuq42qn.cloudfront.net/index_7.m3u8',
      type: 'hls',
    },
    programs: noScheduleProgram('WION', 'News'),
  },
  {
    number: 83,
    name: 'Moonbug',
    category: 'Kids',
    logo: 'https://i.imgur.com/v4ZYiUL.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/moonbug-kids/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '0bf00921bec94a65a124fba1ef52b1cd': '0f1488487cbe05e2badc3db53ae0f29f' },
      },
    },
    programs: noScheduleProgram('Moonbug', 'Kids'),
  },
  {
    number: 84,
    name: 'JimJam',
    category: 'Kids',
    logo: 'https://i.imgur.com/2hKQJkR.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://tvcdn.tv.telia.lt/live/eds/JimJam/DASH_5_CPIX_NPVR/JimJam.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'd3b2f20862fa7f361fc703d8b9bcd340': 'f849ca1496a4c3eca2394628c08493d1' },
      },
    },
    programs: noScheduleProgram('JimJam', 'Kids'),
  },
  {
    number: 85,
    name: 'Metro Channel',
    category: 'Documentary',
    logo: 'https://i.imgur.com/9ekYwkZ.png',
    epgId: 'Metro.Channel.ph',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/metro-channel/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Metro Channel', 'Documentary'),
  },
  {
    number: 86,
    name: 'TapSILOG',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/WaB2VXq.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/tapsilog/playlist.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'hls',
    },
    programs: noScheduleProgram('TapSILOG', 'Local Entertainment'),
  },
  {
    number: 87,
    name: 'MNET',
    category: 'Foreign',
    logo: 'https://www.jcom.co.jp/service/tv/channel/option_ch/images_v10/logo/logo_mnetHD.png',
    epgId: 'Mnet_jp',
    epgSource: 'none',
    stream: {
      url: 'https://akariko.netgenx.site/stream/jp/mnet/stream-output.m3u8?mode=hls',
      type: 'hls',
    },
    programs: noScheduleProgram('MNET', 'Foreign'),
  },
  {
    number: 88,
    name: 'One',
    category: 'Foreign',
    logo: 'https://i.imgur.com/Xv8cQh0.png',
    epgId: 'ONE',
    epgSource: 'none',
    stream: {
      url: 'https://slive.mana2.my/OneHD/index.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '3dd653fc7aa1e3075b7f0233620df68f': '8573791fa55bff03a3094ff559fc1407' },
      },
    },
    programs: noScheduleProgram('One', 'Foreign'),
  },
  {
    number: 89,
    name: 'Arirang',
    category: 'Foreign',
    logo: 'https://i.imgur.com/jgiNWxJ.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/arirang/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '13815d0fa026441ea7662b0c9de00bcf': '2d99a55743677c3879a068dd9c92f824' },
      },
    },
    programs: noScheduleProgram('Arirang', 'Foreign'),
  },
  {
    number: 90,
    name: 'Asian Food Network',
    category: 'Documentary',
    logo: 'https://i.imgur.com/O5jBcL2.png',
    epgId: 'AFN',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/343bd328-606c-4bd6-8ed5-016f8911d0bd/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '346b9f41e2933748c8861f82932e0110': 'cf0cffb637b81598a27bd6b0d90d65a8' },
      },
    },
    programs: noScheduleProgram('Asian Food Network', 'Documentary'),
  },
  {
    number: 91,
    name: 'Cartoonito',
    category: 'Kids',
    logo: 'https://i.imgur.com/kHhmOMp.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/no-tvg-id/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Cartoonito', 'Kids'),
  },
  {
    number: 92,
    name: 'NHK World',
    category: 'Foreign',
    logo: 'https://i.imgur.com/WX0fL1C.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/nhk-japan/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '3d6e9d4de7d7449aadd846b7a684e564': '0800fff80980f47f7ac6bc60b361b0cf' },
      },
    },
    programs: noScheduleProgram('NHK World', 'Foreign'),
  },
  {
    number: 93,
    name: 'NHK World Premium',
    category: 'Foreign',
    logo: 'https://i.imgur.com/h5omTCQ.png',
    epgId: 'nhkpremium.hk',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/db113a07-aa77-4178-b6bb-46adf7efa815/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '98817b144bcf19fd0ddca7fe54cee110': '44b423a77dd34ace162db35cbb0fb6a3' },
      },
    },
    programs: noScheduleProgram('NHK World Premium', 'Foreign'),
  },
  {
    number: 94,
    name: 'BS10',
    category: 'Foreign',
    logo: 'https://i.imgur.com/UiJ9Kgj.png',
    epgId: 'jp34',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/bs10/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('BS10', 'Foreign'),
  },
  {
    number: 95,
    name: 'BS10 Premium',
    category: 'Foreign',
    logo: 'https://i.imgur.com/iDJ0EP4.jpeg',
    epgId: 'bs08',
    epgSource: 'none',
    stream: {
      url: 'https://akariko.netgenx.site/stream/jp/bs_10_premium/stream-output.m3u8?mode=hls',
      type: 'hls',
    },
    programs: noScheduleProgram('BS10 Premium', 'Foreign'),
  },
  {
    number: 96,
    name: 'ZooMoo',
    category: 'Kids',
    logo: 'https://i.imgur.com/daHHNzj.png',
    epgId: 'ZooMoo.id',
    epgSource: 'none',
    stream: {
      url: 'https://amg01553-blueantmediaasi-zoomoonz-samsungnz-rdufn.amagi.tv/playlist/amg01553-blueantmediaasi-zoomoonz-samsungnz/playlist.m3u8',
      type: 'hls',
    },
    programs: noScheduleProgram('ZooMoo', 'Kids'),
  },
  {
    number: 97,
    name: 'One Sports+',
    category: 'Foreign',
    logo: 'https://i.imgur.com/D33wRIq.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/one-sports/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'f00bd0122a8a4da1a49ea6c49f7098ad': 'a4079f3667ba4c2bcfdeb13e45a6e9c6' },
      },
    },
    programs: noScheduleProgram('One Sports+', 'Sports'),
  },
  {
    number: 98,
    name: 'PBA Rush',
    category: 'Foreign',
    logo: 'https://i.imgur.com/F2npB7o.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/pba-rush/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'd7f1a9c36b2e4f8d9a441c5e7b2d8f60': 'fb83c86f600ab945e7e9afed8376eb1e' },
      },
    },
    programs: noScheduleProgram('PBA Rush', 'Sports'),
  },
  {
    number: 99,
    name: 'EDGEsport',
    category: 'Sports',
    logo: 'https://i.imgur.com/V5Dz7RB.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/edge-sports/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('EDGEsport', 'Sports'),
  },
  {
    number: 100,
    name: 'Trace Urban',
    category: 'Music',
    logo: 'https://i.imgur.com/VRazo4V.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://lightning-traceurban-samsungau.amagi.tv/playlist.m3u8',
      type: 'hls',
    },
    programs: noScheduleProgram('Trace Urban', 'Music'),
  },
  {
    number: 101,
    name: 'MTV',
    category: 'Music',
    logo: 'https://www.jcom.co.jp/service/tv/channel/list/images_v10/logo/logo_mtvHD.png',
    epgId: 'cs18',
    epgSource: 'none',
    stream: {
      url: 'https://akariko.netgenx.site/stream/jp/mtv/stream-output.m3u8?mode=hls',
      type: 'hls',
    },
    programs: noScheduleProgram('MTV', 'Music'),
  },
  {
    number: 102,
    name: 'Space Shower TV',
    category: 'Music',
    logo: 'https://i.imgur.com/2yAiqhE.png',
    epgId: 'bs26',
    epgSource: 'none',
    stream: {
      url: 'https://akariko.netgenx.site/stream/jp/space_shower_tv/stream-output.m3u8?mode=hls',
      type: 'hls',
    },
    programs: noScheduleProgram('Space Shower TV', 'Music'),
  },
  {
    number: 103,
    name: 'Music Japan TV',
    category: 'Music',
    logo: 'https://xuanzi-storage.netgenx.site/icons/icon_77.png',
    epgId: 'cs06',
    epgSource: 'none',
    stream: {
      url: 'https://akariko.netgenx.site/stream/jp/music_japan_tv/stream-output.m3u8?mode=hls',
      type: 'hls',
    },
    programs: noScheduleProgram('Music Japan TV', 'Music'),
  },
  {
    number: 104,
    name: 'Music ON TV',
    category: 'Music',
    logo: 'https://xuanzi-storage.netgenx.site/icons/icon_75.png',
    epgId: 'jp78',
    epgSource: 'none',
    stream: {
      url: 'https://akariko.netgenx.site/stream/jp/music_on_tv/stream-output.m3u8?mode=hls',
      type: 'hls',
    },
    programs: noScheduleProgram('Music ON TV', 'Music'),
  },
  {
    number: 105,
    name: 'Music Air',
    category: 'Music',
    logo: 'https://xuanzi-storage.netgenx.site/icons/icon_76.png',
    epgId: 'jp79',
    epgSource: 'none',
    stream: {
      url: 'https://akariko.netgenx.site/stream/jp/music_air/stream-output.m3u8?mode=hls',
      type: 'hls',
    },
    programs: noScheduleProgram('Music ON TV', 'Music'),
  },
];

export function getCurrentProgram(channel: Channel): Program {
  const now = new Date();
  const nowMs = now.getTime();
  const timedProgram = channel.programs.find((program) =>
    typeof program.startMs === 'number' &&
    typeof program.endMs === 'number' &&
    nowMs >= program.startMs &&
    nowMs < program.endMs
  );
  if (timedProgram) return timedProgram;

  const currentTime = now.getHours() * 60 + now.getMinutes();

  for (const program of channel.programs) {
    const [startH, startM] = program.startTime.split(':').map(Number);
    const [endH, endM] = program.endTime.split(':').map(Number);
    const start = startH * 60 + startM;
    const end = endH * 60 + endM;

    if (currentTime >= start && currentTime < end) {
      return program;
    }
  }
  return channel.programs[0];
}

export function getProgress(channel: Channel): number {
  const now = new Date();
  const program = getCurrentProgram(channel);
  if (typeof program.startMs === 'number' && typeof program.endMs === 'number') {
    return Math.min(100, Math.max(0, ((now.getTime() - program.startMs) / (program.endMs - program.startMs)) * 100));
  }

  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [startH, startM] = program.startTime.split(':').map(Number);
  const [endH, endM] = program.endTime.split(':').map(Number);
  if ([startH, startM, endH, endM].some((value) => Number.isNaN(value))) return 0;
  const start = startH * 60 + startM;
  const end = endH * 60 + endM;
  return Math.min(100, Math.max(0, ((currentTime - start) / (end - start)) * 100));
}
