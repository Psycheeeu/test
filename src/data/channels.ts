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
  title: 'Aiobahn +81『INTERNET ANGEL』',
  startTime: '00:00',
  endTime: '23:59',
  description: "\"INTERNET ANGEL\" from the animation adaptation of the hit game NEEDY GIRL OVERDOSE (06.21.26).",
  genre: 'Music',
  source: 'none',
}];

const mchProgram = (): Program[] => [{
  title: 'M-CH Programming',
  startTime: '00:00',
  endTime: '23:59',
  description: 'Test Broadcast programme of M-CH.',
  genre: 'Music',
  source: 'none',
}];

export const channels: Channel[] = [
  {
    number: 1,
    name: 'WELCOME!',
    category: 'Welcome',
    logo: 'https://i.imgur.com/DIlvh7t.png',
    epgId: 'none',
    epgSource: 'none',
    stream: {
      url: 'https://video.gumlet.io/69097ed4aa9e79860d918dd9/6a48c4c4e4e7cc890e3a2d62/main.m3u8',
      type: 'hls',
    },
    programs: musicProgram(),
  },
  {
    number: 2,
    name: 'Kapamilya Channel',
    category: 'Local',
    logo: 'https://i.imgur.com/d3LXERq.png',
    epgId: 'kapamilya-channel@ctc',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-77/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MjU3OTY0MCwiZXhwIjoxNzkwMzU1NjQwLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3OTAzNTU2NDAsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.HPOrT64Os500BwPlO4oavM-cAEwjlEzn37octaDUi9A',
      type: 'dash',
    },
    programs: noScheduleProgram('Kapamilya Channel', 'Local'),
  },
  {
    number: 3,
    name: 'A2Z',
    category: 'Local',
    logo: 'https://i.imgur.com/DVSTY3w.png',
    epgId: 'a2z@ctc',
    epgSource: 'none',
    stream: {
      url: 'https://psycheflixcignal.csx067.workers.dev/a2z/manifest.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '3f6d8a2c1b7e4c9f8d52a7e1b0c6f93d': '4019f9269b9054a2b9e257b114ebbaf2' },
      },
    },
    programs: noScheduleProgram('A2Z', 'Local'),
  },
  {
    number: 4,
    name: 'PTV',
    category: 'Local',
    logo: 'https://i.imgur.com/ycPz1Uc.png',
    epgId: 'cg_ptv4_sd@cignaltv',
    epgSource: 'none',
    stream: {
      url: 'https://psycheflixcignal.csx067.workers.dev/ptv4/manifest.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '71a130a851b9484bb47141c8966fb4a3': 'ad1f003b4f0b31b75ea4593844435600' },
      },
    },
    programs: noScheduleProgram('PTV', 'Local'),
  },
  {
    number: 5,
    name: 'TV5',
    category: 'Local',
    logo: 'https://i.imgur.com/vhIcFmV.png',
    epgId: 'tv5@ctc',
    epgSource: 'none',
    stream: {
      url: 'https://psycheflixcignal.csx067.workers.dev/tv5/manifest.mpd',
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
    epgId: 'cg_onesports_hd@cignaltv',
    epgSource: 'none',
    stream: {
      url: 'https://psycheflixcignal.csx067.workers.dev/onesports/manifest.mpd',
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
    name: 'GMA',
    category: 'Local',
    logo: 'https://i.imgur.com/D3qGmme.png',
    epgId: 'gma@ctc',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-15/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MjU3OTY0MCwiZXhwIjoxNzkwMzU1NjQwLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3OTAzNTU2NDAsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.HPOrT64Os500BwPlO4oavM-cAEwjlEzn37octaDUi9A',
      type: 'dash',
    },
    programs: noScheduleProgram('GMA', 'Local'),
  },
  {
    number: 8,
    name: 'GTV',
    category: 'Local',
    logo: 'https://i.imgur.com/YwKq8Ta.png',
    epgId: 'gtv@ctc',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-34/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MjU3OTY0MCwiZXhwIjoxNzkwMzU1NjQwLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3OTAzNTU2NDAsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.HPOrT64Os500BwPlO4oavM-cAEwjlEzn37octaDUi9A',
      type: 'dash',
    },
    programs: noScheduleProgram('GTV', 'Local'),
  },
  {
    number: 9,
    name: 'ALLTV',
    category: 'Local',
    logo: 'https://i.imgur.com/NGDPhIj.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/all-tv/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
    },
    programs: noScheduleProgram('ALLTV', 'Local'),
  },
  {
    number: 10,
    name: 'One News',
    category: 'News',
    logo: 'https://i.imgur.com/bmP06bk.png',
    epgId: 'onenews_hd1',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/one-news/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '2e6a9d7c1f4b4c8a8d33c7b1f0a5e924': '4c71e178d090332fbfe72e023b59f6d2' },
      },
    },
    programs: noScheduleProgram('One News', 'News'),
  },
  {
    number: 11,
    name: 'One PH',
    category: 'News',
    logo: 'https://i.imgur.com/9dMuFE1.png',
    epgId: 'oneph_sd',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/one-ph/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'b1c7e9d24f8a4d6c9e337a2f1c5b8d60': '8ff2e524cc1e028f2a4d4925e860c796' },
      },
    },
    programs: noScheduleProgram('One PH', 'News'),
  },
  {
    number: 12,
    name: 'RPTV',
    category: 'Local',
    logo: 'https://i.imgur.com/IDCHfXm.png',
    epgId: 'cnn_rptv_prod_hd@cignaltv',
    epgSource: 'none',
    stream: {
      url: 'https://psycheflixcignal.csx067.workers.dev/rptv/manifest.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '1917f4caf2364e6d9b1507326a85ead6': 'a1340a251a5aa63a9b0ea5d9d7f67595' },
      },
    },
    programs: noScheduleProgram('RPTV', 'Local'),
  },
  {
    number: 13,
    name: 'IBC',
    category: 'Local',
    logo: 'https://i.imgur.com/PwFOHQb.png',
    epgId: 'ibc13_sd_new@cignaltv',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/ibc-13/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '16ecd238c0394592b8d3559c06b1faf5': '05b47ae3be1368912ebe28f87480fc84' },
      },
    },
    programs: noScheduleProgram('IBC', 'Local'),
  },
  {
    number: 14,
    name: 'True FM TV',
    category: 'News',
    logo: 'https://i.imgur.com/U8L0Liq.png',
    epgId: 'truefm_tv',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/true-tv/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'a4e2b9d61c754f3a8d109b6c2f1e7a55': '1d8d975f0bc2ed90eda138bd31f173f4' },
      },
    },
    programs: noScheduleProgram('True FM TV', 'Local'),
  },
  {
    number: 15,
    name: 'Cinemo!',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/Pf8CNau.png',
    epgId: 'CONV:CINEMO@conv',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/cinemo/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
    },
    programs: noScheduleProgram('Cinemo', 'Local Entertainment'),
  },
  {
    number: 16,
    name: 'Jeepney TV',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/3yzbJE5.png',
    epgId: 'jeepney-tv@ctc',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/converge-jeepney-tv/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
    },
    programs: noScheduleProgram('Jeepney TV', 'Local Entertainment'),
  },
  {
    number: 17,
    name: 'Cinema One',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/hJ6MBiA.png',
    epgId: 'cinema-one@ctc',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/cinema-one/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
    },
    programs: noScheduleProgram('Cinema One', 'Local Entertainment'),
  },
  {
    number: 18,
    name: 'Solarflix',
    category: 'Local',
    logo: 'https://i.imgur.com/KLdsqfm.png',
    epgId: 'solar-flix',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/solarflix/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
    },
    programs: noScheduleProgram('Solarflix', 'Local'),
  },
  {
    number: 19,
    name: 'Solar Sports',
    category: 'Sports',
    logo: 'https://i.imgur.com/b7nN681.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/solarsports/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
    },
    programs: noScheduleProgram('Solar Sports', 'Sports'),
  },
  {
    number: 20,
    name: 'Rock TV Manila',
    category: 'Local',
    logo: 'https://i.imgur.com/ST060qy.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/rock-tv-of-manila/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
    },
    programs: noScheduleProgram('Rock TV Manila', 'Music'),
  },
  {
    number: 21,
    name: 'ANC',
    category: 'News',
    logo: 'https://i.imgur.com/XzVYXaV.png',
    epgId: 'ANC.ph@ph2',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/anc/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
    },
    programs: noScheduleProgram('ANC', 'News'),
  },
  {
    number: 22,
    name: 'DZMM Teleradyo',
    category: 'News',
    logo: 'https://i.imgur.com/zlMDkeG.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/dzmm-teleradyo/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
    },
    programs: noScheduleProgram('DZMM Teleradyo', 'News'),
  },
  {
    number: 23,
    name: 'Kix',
    category: 'Foreign',
    logo: 'https://i.imgur.com/rwdQBJm.png',
    epgId: 'kix_hd1@cignaltv',
    epgSource: 'none',
    stream: {
      url: 'https://psycheflixcignal.csx067.workers.dev/kix/manifest.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'c9d4b7a18e2f4d6c9a103f5b7e1c2d88': '7f3139092bf87d8aa51ee40e6294d376' },
      },
    },
    programs: noScheduleProgram('Kix', 'Foreign'),
  },
  {
    number: 24,
    name: 'Thrill',
    category: 'Foreign',
    logo: 'https://i.imgur.com/LCX2guc.png',
    epgId: 'cg_thrill_sd@cignaltv',
    epgSource: 'none',
    stream: {
      url: 'https://psycheflixcignal.csx067.workers.dev/thrill/manifest.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '928114ffb2394d14b5585258f70ed183': 'a82edc340bc73447bac16cdfed0a4c62' },
      },
    },
    programs: noScheduleProgram('Thrill', 'Foreign'),
  },
  {
    number: 25,
    name: 'NET25',
    category: 'Local',
    logo: 'https://i.imgur.com/e6rZCVd.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/net-25/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
    },
    programs: noScheduleProgram('NET25', 'Local'),
  },
  {
    number: 26,
    name: 'Hallypop',
    category: 'Music',
    logo: 'https://ottepg8.comclark.com:8443/iptvepg/images/markurl/mark_1733707474289.png',
    epgId: 'CONV:HALLYPOP@conv',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-41/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MjU3OTY0MCwiZXhwIjoxNzkwMzU1NjQwLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3OTAzNTU2NDAsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.HPOrT64Os500BwPlO4oavM-cAEwjlEzn37octaDUi9A',
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
      url: 'https://converse.nathcreqtives.com/channels/myx-philippines/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
    },
    programs: noScheduleProgram('MYX', 'Music'),
  },
  {
    number: 28,
    name: 'Metro Channel',
    category: 'Documentary',
    logo: 'https://i.imgur.com/9ekYwkZ.png',
    epgId: 'Metro.Channel.ph',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/metro-channel/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
    },
    programs: noScheduleProgram('Metro Channel', 'Documentary'),
  },
  {
    number: 29,
    name: 'RJ TV',
    category: 'Local',
    logo: 'https://i.imgur.com/LpPaA89.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/rjtv-29/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'hls',
    },
    programs: noScheduleProgram('RJ TV', 'Local'),
  },
  {
    number: 30,
    name: 'PBO',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/709Uy7N.png',
    epgId: 'pbo',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/converge-pbo/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
    },
    programs: noScheduleProgram('PBO', 'Local Entertainment'),
  },
  {
    number: 31,
    name: 'Viva Cinema',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/8y3fc3F.png',
    epgId: 'viva-cinema',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/converge-viva-cinema/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
    },
    programs: noScheduleProgram('Viva Cinema', 'Local Entertainment'),
  },
  {
    number: 32,
    name: 'Bilyonaryo News',
    category: 'Local',
    logo: 'https://i.imgur.com/xvdO8G6.png',
    epgId: 'bilyonaryoch',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/bilyonaryo-channel/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '227ffaf09bec4a889e0e0988704d52a2': 'b2d0dce5c486891997c1c92ddaca2cd2' },
      },
    },
    programs: noScheduleProgram('Bilyonaryo News', 'Local'),
  },
  {
    number: 33,
    name: 'Aliw Channel',
    category: 'Local',
    logo: 'https://i.imgur.com/3tbmAlN.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/aliw-channel/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
    },
    programs: noScheduleProgram('Aliw Channel', 'Local'),
  },
  {
    number: 34,
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
    number: 35,
    name: 'Lotus Macau',
    category: 'Foreign',
    logo: 'https://i.imgur.com/SNc90AX.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/lotus-macao/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MTEwMTg0OCwiZXhwIjoxNzg4ODc3ODQ4LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg4Nzc4NDgsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.xrFbkB-Cv4Em8IBAtJmwWzGFGKzNjLn6QDwuLdIkro0',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '60dc692e64ea443a8fb5ac186c865a9b': '01bdbe22d59b2a4504b53adc2f606cc1' },
      },
    },
    programs: noScheduleProgram('Lotus Macau', 'Foreign'),
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
