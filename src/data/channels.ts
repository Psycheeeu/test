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
    name: 'NHK G',
    category: 'Japan',
    logo: 'https://raw.githubusercontent.com/Psycheeeu/logostv/refs/heads/main/jptv/local2.png',
    epgId: 'gd01',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/api/proxy/ch-1782738566013/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MjU3OTY0MCwiZXhwIjoxNzkwMzU1NjQwLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3OTAzNTU2NDAsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.HPOrT64Os500BwPlO4oavM-cAEwjlEzn37octaDUi9A',
      type: 'hls',
    },
    programs: noScheduleProgram('BS10 Premium', 'Foreign'),
  },
  {
    number: 3,
    name: 'NHK E',
    category: 'Japan',
    logo: 'https://raw.githubusercontent.com/Psycheeeu/logostv/refs/heads/main/jptv/local3.png',
    epgId: 'gd02',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/api/proxy/ch-1782738565986/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MjU3OTY0MCwiZXhwIjoxNzkwMzU1NjQwLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3OTAzNTU2NDAsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.HPOrT64Os500BwPlO4oavM-cAEwjlEzn37octaDUi9A',
      type: 'hls',
    },
    programs: noScheduleProgram('BS10 Premium', 'Foreign'),
  },
  {
    number: 4,
    name: 'Nippon TV',
    category: 'Japan',
    logo: 'https://raw.githubusercontent.com/Psycheeeu/logostv/refs/heads/main/jptv/local4.png',
    epgId: 'gd03',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/api/proxy/ch-1782738566023/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MjU3OTY0MCwiZXhwIjoxNzkwMzU1NjQwLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3OTAzNTU2NDAsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.HPOrT64Os500BwPlO4oavM-cAEwjlEzn37octaDUi9A',
      type: 'hls',
    },
    programs: noScheduleProgram('BS10 Premium', 'Foreign'),
  },
  {
    number: 5,
    name: 'TBS',
    category: 'Japan',
    logo: 'https://raw.githubusercontent.com/Psycheeeu/logostv/refs/heads/main/jptv/local5.png',
    epgId: 'gd04',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/api/proxy/ch-1782738566030/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MjU3OTY0MCwiZXhwIjoxNzkwMzU1NjQwLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3OTAzNTU2NDAsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.HPOrT64Os500BwPlO4oavM-cAEwjlEzn37octaDUi9A',
      type: 'hls',
    },
    programs: noScheduleProgram('BS10 Premium', 'Foreign'),
  },
  {
    number: 6,
    name: 'Fuji TV',
    category: 'Japan',
    logo: 'https://raw.githubusercontent.com/Psycheeeu/logostv/refs/heads/main/jptv/local1.png',
    epgId: 'gd05',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/api/proxy/ch-1782738565972/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MjU3OTY0MCwiZXhwIjoxNzkwMzU1NjQwLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3OTAzNTU2NDAsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.HPOrT64Os500BwPlO4oavM-cAEwjlEzn37octaDUi9A',
      type: 'hls',
    },
    programs: noScheduleProgram('BS10 Premium', 'Foreign'),
  },
  {
    number: 7,
    name: 'TV Asahi',
    category: 'Japan',
    logo: 'https://raw.githubusercontent.com/Psycheeeu/logostv/refs/heads/main/jptv/local7.png',
    epgId: 'gd06',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/api/proxy/ch-1782738566048/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MjU3OTY0MCwiZXhwIjoxNzkwMzU1NjQwLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3OTAzNTU2NDAsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.HPOrT64Os500BwPlO4oavM-cAEwjlEzn37octaDUi9A',
      type: 'hls',
    },
    programs: noScheduleProgram('BS10 Premium', 'Foreign'),
  },
  {
    number: 8,
    name: 'TV Tokyo',
    category: 'Japan',
    logo: 'https://raw.githubusercontent.com/Psycheeeu/logostv/refs/heads/main/jptv/local8.png',
    epgId: 'gd06',
    epgSource: 'none',
    stream: {
      url: 'https://converse.nathcreqtives.com/api/proxy/ch-1782738566054/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwc3ljaGVlZSIsImlhdCI6MTc4MjU3OTY0MCwiZXhwIjoxNzkwMzU1NjQwLCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3OTAzNTU2NDAsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vcHN5Y2hlZWVmbGl4dXV1Lm5ldGxpZnkuYXBwIiwiaHR0cHM6Ly9wc3ljaGVmbGl4LnBhZ2VzLmRldiIsImh0dHBzOi8vcHN5Y2hlY3ViaWJpYmliaXNtLnZlcmNlbC5hcHAiXX0.HPOrT64Os500BwPlO4oavM-cAEwjlEzn37octaDUi9A',
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
