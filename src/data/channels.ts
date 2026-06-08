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
  title: 'NEEDY GIRL OVERDOSE - INTERNET ANGEL',
  startTime: '00:00',
  endTime: '23:59',
  description: "\"INTERNET ANGEL\" from the hit game NEEDY GIRL OVERDOSE (01.28.2024).",
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
    logo: 'https://i.imgur.com/DIlvh7t.png',
    epgId: 'none',
    epgSource: 'none',
    stream: {
      url: 'https://video.gumlet.io/69097ed4aa9e79860d918dd9/6a25fa79bc82cd6f1abe33d8/main.m3u8',
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
    epgId: 'gma@ctc',
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
    epgId: 'gtv@ctc',
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
    number: 8,
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
    number: 11,
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
    number: 12,
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
    number: 13,
    name: 'Cinema One',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/hJ6MBiA.png',
    epgId: 'cinema-one@ctc',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/cinema-one/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Cinema One', 'Local Entertainment'),
  },
  {
    number: 14,
    name: 'Cinemo!',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/Pf8CNau.png',
    epgId: 'CineMo.ph@random',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/cinemo/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Cinemo', 'Local Entertainment'),
  },
  {
    number: 15,
    name: 'Jeepney TV',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/3yzbJE5.png',
    epgId: 'jeepney-tv@ctc',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/converge-jeepney-tv/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MDU3NTA1MywiZXhwIjoxNzg4MzUxMDUzLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODgzNTEwNTMsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.ngv2-3w4tcSIZR4J72tEsTZGQYt4iWRdVfFo3sQZa84',
      type: 'dash',
    },
    programs: noScheduleProgram('Jeepney TV', 'Local Entertainment'),
  },
  {
    number: 16,
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
    number: 17,
    name: 'IBC',
    category: 'Local',
    logo: 'https://i.imgur.com/PwFOHQb.png',
    epgId: 'ibc13_sd_new@cignaltv',
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
    number: 20,
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
    number: 21,
    name: 'CNA',
    category: 'News',
    logo: 'https://i.imgur.com/jNEGuBN.png',
    epgId: 'CNA@astromy',
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
    number: 21,
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
    number: 22,
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
    number: 23,
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
    number: 24,
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
    number: 25,
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
    number: 26,
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
    number: 27,
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
    number: 28,
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
    number: 31,
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
    number: 32,
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
    number: 33,
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
    number: 34,
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
    number: 35,
    name: 'TMC',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/ZbrvQpg.png',
    epgId: 'Tagalized.Movie.Channel.ph',
    epgSource: 'none',
    stream: {
      url: 'https://psycheflixcignal.csx067.workers.dev/tmc/manifest.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '96701d297d1241e492d41c397631d857': 'ca2931211c1a261f082a3a2c4fd9f91b' },
      },
    },
    programs: noScheduleProgram('TMC', 'Local'),
  },
  {
    number: 36,
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
    number: 37,
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
    number: 38,
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
    number: 39,
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
    number: 40,
    name: 'Kapatid Channel',
    category: 'Local Entertainment',
    logo: 'https://i.imgur.com/BUVWBm2.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://psycheflixcignal.csx067.workers.dev/kapatidchannel/manifest.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '045d103180f64562b1db7c932741c3ba': 'c3380548b9075c767a6ae2006ef4bff8' },
      },
    },
    programs: noScheduleProgram('Kapatid Channel', 'Local Entertainment'),
  },
  {
    number: 41,
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
    programs: noScheduleProgram('Lotus Macau', 'Foreign'),
  },
  {
    number: 42,
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
    number: 43,
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
    number: 44,
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
    number: 45,
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
    number: 46,
    name: 'One Sports+',
    category: 'Sports',
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
    number: 47,
    name: 'PBA Rush',
    category: 'Sports',
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
    number: 48,
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
    number: 49,
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
    number: 50,
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
