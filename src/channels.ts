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

const starMProgram = (): Program[] => [{
  title: 'StarM',
  startTime: '00:00',
  endTime: '23:59',
  description: 'StarM programming block.',
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
    stream: { url: 'https://video.gumlet.io/69097ed4aa9e79860d918dd9/6a02526137b9faaace286abd/main.m3u8', type: 'hls', },
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
      url: 'https://converse.nathcreqtives.com/channels/kapamilya-channel-hd/playlist.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
      type: 'hls',
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
      url: 'https://converse.nathcreqtives.com/channels/gma-7/playlist.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
      type: 'hls',
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
      url: 'https://converse.nathcreqtives.com/channels/gtv/playlist.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
      type: 'hls',
    },
    programs: noScheduleProgram('GTV', 'Local'),
  },
  {
    number: 5,
    name: 'TV5',
    category: 'Local',
    logo: 'https://i.imgur.com/vhIcFmV.png',
    epgId: 'tv5',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/tv5/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
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
      url: 'https://converse.nathcreqtives.com/channels/one-sports-hd/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
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
      url: 'https://converse.nathcreqtives.com/channels/rptv/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
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
      url: 'https://converse.nathcreqtives.com/channels/a2z/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
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
      url: 'https://converse.nathcreqtives.com/channels/all-tv/playlist.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
      type: 'hls',
    },
    programs: noScheduleProgram('ALLTV', 'Local'),
  },
  {
    number: 10,
    name: 'PTV',
    category: 'Local',
    logo: 'https://i.imgur.com/ycPz1Uc.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/ptv4/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
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
    epgId: 'HBO.sg',
    epgSource: 'https://iptv-epg.org/files/epg-sg.xml',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/hbo/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
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
    epgId: 'CINEMAX.sg',
    epgSource: '',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/cinemax/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
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
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/bilyonaryo-channel/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
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
      url: 'https://converse.nathcreqtives.com/channels/aliw-channel/playlist.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
      type: 'hls',
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
      url: 'https://converse.nathcreqtives.com/channels/dzrh-tv/playlist.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
      type: 'hls',
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
      url: 'https://converse.nathcreqtives.com/channels/cnn-international/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
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
      url: 'https://converse.nathcreqtives.com/channels/fe185fb3-8d94-4cbe-bbca-acc104ca967f/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
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
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/solarflix/playlist.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
      type: 'hls',
    },
    programs: noScheduleProgram('Solarflix', 'Local'),
  },
  {
    number: 19,
    name: 'Premier Sports',
    category: 'Sports',
    logo: 'https://i.imgur.com/VzWOJHn.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/premier-sports/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
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
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/premier-sports-2/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '59454adb530b4e0784eae62735f9d850': '61100d0b8c4dd13e4eb8b4851ba192cc' },
      },
    },
    programs: noScheduleProgram('Premier Sports 2', 'Sports'),
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
