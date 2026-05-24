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
    epgId: 'gsat.KAPAMILYA_CHANNEL',
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
    epgId: 'gsat.GMA_7',
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
    epgId: 'gsat.GTV',
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
    epgId: 'gsat.TV5',
    epgSource: 'none',
    stream: {
      url: 'https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/tv5_hd/default1/index.mpd',
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
    epgId: 'OneSports.ph',
    epgSource: 'none',
    stream: {
      url: 'https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_onesports_hd/default/index.mpd',
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
    name: 'A2Z',
    category: 'Local',
    logo: 'https://i.imgur.com/DVSTY3w.png',
    epgId: 'A2Z.ph',
    epgSource: 'none',
    stream: {
      url: 'https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_a2z/default/index.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '3f6d8a2c1b7e4c9f8d52a7e1b0c6f93d': '4019f9269b9054a2b9e257b114ebbaf2' },
      },
    },
    programs: noScheduleProgram('A2Z', 'Local'),
  },
  {
    number: 8,
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
    name: 'HBO',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/pa2SF5Z.png',
    epgId: 'HBO.sg',
    epgSource: 'https://iptv-epg.org/files/epg-sg.xml',
    stream: {
      url: 'https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_hbohd/default/index.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'c2b7a1e95d4f4c3a8e617f9d0a2b6c18': '27fca1ab042998b0c2f058b0764d7ed4' },
      },
    },
    programs: noScheduleProgram('HBO', 'Entertainment'),
  },
  {
    number: 11,
    name: 'Cinemax',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/X6H75p2.png',
    epgId: 'CINEMAX.sg',
    epgSource: 'https://iptv-epg.org/files/epg-sg.xml',
    stream: {
      url: 'https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_cinemax/default/index.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'b207c44332844523a3a3b0469e5652d7': 'fe71aea346db08f8c6fbf0592209f955' },
      },
    },
    programs: noScheduleProgram('Cinemax', 'Entertainment'),
  },
  {
    number: 12,
    name: 'Rock Entertainment',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/6MlNllK.png',
    epgId: 'ROCKEntertainment.sg',
    epgSource: 'https://iptv-epg.org/files/epg-sg.xml',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/unifi-rock-entertainment/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '6bbe30dc7d7949849ba0c4f2abb2a3ff': '9eb316564523faecf7d5b2fef8081007' },
      },
    },
    programs: noScheduleProgram('Rock Entertainment', 'Entertainment'),
  },
  {
    number: 13,
    name: 'Rock Action',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/xh8vUt9.png',
    epgId: 'ROCKAction.sg',
    epgSource: 'https://iptv-epg.org/files/epg-sg.xml',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/unifi-rock-action/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'c64cf911505e42c8aa17869ae51206ba': '2f3f5f1c609c1120216d4d72377d1ac2' },
      },
    },
    programs: noScheduleProgram('Rock Action', 'Entertainment'),
  },
  {
    number: 14,
    name: 'Rock X Stream',
    category: 'Entertainment',
    logo: 'https://i.imgur.com/w9Q8bil.png',
    epgId: 'CINEMAX.sg',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/5c931c0f-83bd-4ad8-ac56-0b1827232889/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '325370d722565ab5ed09a548ba360e10': 'c88fe8f34b9dc8e10a00e876a6ff4136' },
      },
    },
    programs: noScheduleProgram('Rock X Stream', 'Entertainment'),
  },
  {
    number: 31,
    name: 'Animax',
    category: 'Foreign',
    logo: 'https://i.imgur.com/QxTehhs.png',
    epgId: 'Animax.sg',
    epgSource: 'https://iptv-epg.org/files/epg-sg.xml',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/2-animax-hd/manifest.mpd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'ea16d113e1724e7c99adb7f7c6560eb0': '84ff4efdbbce828dc99035dfc8c639cb' },
      },
    },
    programs: noScheduleProgram('Animax', 'Foreign'),
  },
  {
    number: 32,
    name: 'Aniplus',
    category: 'Foreign',
    logo: 'https://i.imgur.com/QgRMmBS.png',
    epgId: 'ANIPLUS.sg',
    epgSource: 'https://iptv-epg.org/files/epg-sg.xml',
    stream: {
      url: 'https://amg18481-amg18481c1-amgplt0352.playout.now3.amagi.tv/playlist/amg18481-amg18481c1-amgplt0352/playlist.m3u8',
      type: 'hls',
    },
    programs: noScheduleProgram('Aniplus', 'Foreign'),
  },
  {
    number: 50,
    name: 'Hallypop',
    category: 'Local',
    logo: 'https://ottepg8.comclark.com:8443/iptvepg/images/markurl/mark_1733707474289.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/channels/hallypop/playlist.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc3OTU0MDYwMSwiZXhwIjoxNzg3MzE2NjAxLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODczMTY2MDEsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVlZWZsaXh1dXUudmVyY2VsLmFwcCIsImh0dHBzOi8vcHN5Y2hlZmxpeC5wYWdlcy5kZXYiXX0.G9RVqvRccbU9QyWSE8yu67IR2-2-yotmB1AyIa-Cheo',
      type: 'hls',
    },
    programs: noScheduleProgram('Hallypop', 'Local'),
  },
  {
    number: 51,
    name: 'MNET',
    category: 'Music',
    logo: 'https://www.jcom.co.jp/service/tv/channel/option_ch/images_v10/logo/logo_mnetHD.png',
    epgId: 'Mnet_jp',
    epgSource: 'none',
    stream: {
      url: 'https://akariko.netgenx.site/stream/jp/mnet/stream-output.m3u8?mode=hls',
      type: 'hls',
    },
    programs: noScheduleProgram('MTV', 'Music'),
  },
  {
    number: 52,
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
    number: 53,
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
    number: 54,
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
    number: 55,
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
    number: 56,
    name: 'StarM',
    category: 'Music',
    logo: 'https://i.imgur.com/ms2Hnny.jpeg',
    epgId: 'none',
    epgSource: 'none',
    stream: {
      url: 'https://lbgo.bozztv.com/ssh101/ssh101/starmchannel/playlist.m3u8',
      type: 'hls',
    },
    programs: noScheduleProgram('StarM', 'Music'),
  },
  {
    number: 100,
    name: "Men's Neco",
    category: 'NSFW',
    logo: 'https://help.unext.jp/images/channels/mensneco.png',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://streaml01cf.nxtv.jp/p-menecoch01-amni5j72tc/index1/manifest.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'a4f627d962f2487f9d34c723f662ad5e': '76b6fc1d5c60dcbadea1fe42338c95b4' },
      },
    },
    isAdult: true,
    programs: noScheduleProgram("Men's Neco", 'NSFW'),
  },
  {
    number: 101,
    name: 'Pigoo',
    category: 'NSFW',
    logo: 'https://xuanzi-storage.netgenx.site/icons/icon_94.png',
    epgId: 'pigoo',
    epgSource: 'none',
    stream: { url: 'https://nl.utako.moe/pigoo/index.m3u8', type: 'hls' },
    isAdult: true,
    programs: noScheduleProgram('Pigoo', 'NSFW'),
  },
  {
    number: 102,
    name: 'V Paradise',
    category: 'NSFW',
    logo: 'https://www.jcom.co.jp/service/tv/channel/list/images_v10/logo/logo_vparaduse.png',
    epgId: 'v_paradise',
    epgSource: 'none',
    stream: { url: 'https://nl.utako.moe/v_paradise/index.m3u8', type: 'hls' },
    isAdult: true,
    programs: noScheduleProgram('V Paradise', 'NSFW'),
  },
  {
    number: 103,
    name: 'Venus',
    category: 'NSFW',
    logo: '18+',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://zap-live1-ott.izzigo.tv/11/out/u/dash/VENUS-HD/default.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '3d5090bbd1ae282e0485a96897c55072': '7b7a010ccf0805aa9a980c5492ddb329' },
      },
    },
    isAdult: true,
    programs: noScheduleProgram('Venus', 'NSFW'),
  },
  {
    number: 104,
    name: 'Sextreme',
    category: 'NSFW',
    logo: '18+',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://zap-live1-ott.izzigo.tv/12/out/u/dash/SEXTREME-HD/default.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { '70c880ec2be3d06a1c9d3affe38c3067': '1a191b0f75b7e40ccbb8229bbcdeaaec' },
      },
    },
    isAdult: true,
    programs: noScheduleProgram('Sextreme', 'NSFW'),
  },
  {
    number: 105,
    name: 'Penthouse Gold',
    category: 'NSFW',
    logo: '18+',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://zap-live1-ott.izzigo.tv/12/out/u/dash/PENTHOUSE-HD/default.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'a640ab23ef9c97c8386debb824d9323e': 'e0fded3030fe2c292a5f8442977babae' },
      },
    },
    isAdult: true,
    programs: noScheduleProgram('Penthouse Gold', 'NSFW'),
  },
  {
    number: 106,
    name: 'Playboy',
    category: 'NSFW',
    logo: '18+',
    epgId: '',
    epgSource: 'none',
    stream: {
      url: 'https://lilac01.pontiscloud.com/live/eds/Playboy/live_dash_cld/Playboy.mpd',
      type: 'dash',
      drm: {
        scheme: 'clearkey',
        clearkeys: { 'f51160ad68cb411abbae2b7e51e20ad4': '3015d76327dcd38f19037e5af639ebb2' },
      },
    },
    isAdult: true,
    programs: noScheduleProgram('Playboy', 'NSFW'),
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
