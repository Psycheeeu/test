import { ungzip } from 'pako';
import { Channel, Program, getDummyEpgId } from './channels';

export const EPG_SOURCE_URLS = [
  'https://iptv-epg.org/files/epg-ph.xml',
  'https://akariko.netgenx.site/epg/kai-epg.xml',
  'https://epgshare01.online/epgshare01/epg_ripper_PH1.xml.gz',
  'https://epgshare01.online/epgshare01/epg_ripper_PH2.xml.gz',
  'https://gsat.atone77721.workers.dev/gsat.xml',
];

function parseXmltvDate(value: string) {
  const match = value.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(?:\s*([+-]\d{4}))?/);
  if (!match) return null;

  const [, y, mo, d, h, mi, s, zone] = match;
  const utc = Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s));

  if (!zone) return utc;

  const sign = zone.startsWith('-') ? -1 : 1;
  const offsetHours = Number(zone.slice(1, 3));
  const offsetMinutes = Number(zone.slice(3, 5));
  const offsetMs = sign * (offsetHours * 60 + offsetMinutes) * 60 * 1000;
  return utc - offsetMs;
}

function formatTime(ms: number) {
  return new Date(ms).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function textFrom(parent: Element, tagName: string) {
  return parent.getElementsByTagName(tagName)[0]?.textContent?.trim() ?? '';
}

function normalizeId(value: string) {
  return value.trim().toLowerCase();
}

function makeNoScheduleProgram(channel: Channel): Program[] {
  return [{
    title: 'No EPG schedule available',
    startTime: '--:--',
    endTime: '--:--',
    description: `No programme data was found in the configured EPG source for ${channel.name}.`,
    genre: channel.category,
    source: 'none',
  }];
}

async function fetchOneEpgXml(url: string) {
  const sources = [
    url,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
  ];

  let lastError: unknown = null;

  for (const source of sources) {
    try {
      const response = await fetch(source, { cache: 'force-cache' });
      if (!response.ok) throw new Error(`EPG request failed: ${response.status}`);

      const bytes = new Uint8Array(await response.arrayBuffer());
      const isGzip = bytes[0] === 0x1f && bytes[1] === 0x8b;
      const xml = isGzip ? ungzip(bytes, { to: 'string' }) : new TextDecoder().decode(bytes);

      if (xml.includes('<tv') && xml.includes('<programme')) {
        return { url, loadedUrl: source, xml };
      }

      throw new Error('EPG response did not look like XMLTV');
    } catch (error) {
      lastError = error;
    }
  }

  console.warn(`EPG source unavailable: ${url}`, lastError);
  return null;
}

async function fetchEpgXmls() {
  const results = await Promise.all(EPG_SOURCE_URLS.map(fetchOneEpgXml));
  const epgs = results.filter(Boolean) as Array<{ url: string; loadedUrl: string; xml: string }>;

  if (epgs.length === 0) {
    throw new Error('Unable to load any EPG source');
  }

  return epgs;
}

function parseProgrammes(xml: Document, channelIds: Set<string>) {
  const map = new Map<string, Program[]>();
  const normalizedToRequestedId = new Map(Array.from(channelIds).map((id) => [normalizeId(id), id]));

  for (const item of Array.from(xml.getElementsByTagName('programme'))) {
    const channelId = item.getAttribute('channel') ?? '';
    const matchedRequestedId = channelIds.has(channelId)
      ? channelId
      : normalizedToRequestedId.get(normalizeId(channelId));
    if (!matchedRequestedId) continue;

    const startMs = parseXmltvDate(item.getAttribute('start') ?? '');
    const endMs = parseXmltvDate(item.getAttribute('stop') ?? '');
    if (!startMs || !endMs) continue;

    const title = textFrom(item, 'title') || 'Untitled Program';
    const description = textFrom(item, 'desc') || 'No description available from EPG source.';
    const genre = textFrom(item, 'category') || 'Music';
    const rating = textFrom(item, 'value') || undefined;

    const program: Program = {
      title,
      startTime: formatTime(startMs),
      endTime: formatTime(endMs),
      description,
      genre,
      rating,
      startMs,
      endMs,
      source: 'epg',
    };

    map.set(matchedRequestedId, [...(map.get(matchedRequestedId) ?? []), program]);
  }

  for (const [channelId, programs] of map) {
    map.set(channelId, programs.sort((a, b) => (a.startMs ?? 0) - (b.startMs ?? 0)));
  }

  return map;
}

function getDeclaredChannelIds(xml: Document) {
  return new Set(
    Array.from(xml.getElementsByTagName('channel'))
      .flatMap((node) => {
        const id = node.getAttribute('id') ?? '';
        const displayNames = Array.from(node.getElementsByTagName('display-name'))
          .map((name) => name.textContent?.trim() ?? '')
          .filter(Boolean);
        return [id, ...displayNames];
      })
      .filter(Boolean)
  );
}

function findMatchingId(configuredEpgId: string | undefined, declaredIds: Set<string>) {
  if (!configuredEpgId) return undefined;
  if (declaredIds.has(configuredEpgId)) return configuredEpgId;

  const configuredLower = configuredEpgId.toLowerCase();
  return Array.from(declaredIds).find((id) => id.toLowerCase() === configuredLower);
}

export async function loadEpgForChannels(lineup: Channel[]) {
  try {
    const epgTexts = await fetchEpgXmls();
    const requestedIds = new Set(lineup.map((channel) => channel.epgId).filter(Boolean) as string[]);
    const requestedIdsLower = new Set(Array.from(requestedIds).map(normalizeId));
    const allDeclaredIds = new Set<string>();
    const allProgrammes = new Map<string, Program[]>();
    const sourceById = new Map<string, string>();

    for (const epg of epgTexts) {
      const xml = new DOMParser().parseFromString(epg.xml, 'application/xml');
      if (xml.getElementsByTagName('parsererror').length > 0) continue;

      const declaredIds = getDeclaredChannelIds(xml);
      declaredIds.forEach((id) => allDeclaredIds.add(id));

      const idsForThisSource = new Set(
        Array.from(declaredIds).filter((id) => requestedIds.has(id) || requestedIdsLower.has(normalizeId(id)))
      );
      const programmes = parseProgrammes(xml, idsForThisSource);

      programmes.forEach((programs, id) => {
        const existing = allProgrammes.get(id) ?? [];
        allProgrammes.set(id, [...existing, ...programs].sort((a, b) => (a.startMs ?? 0) - (b.startMs ?? 0)));
        sourceById.set(id, epg.url);
      });
    }

    return lineup.map((channel) => {
      const configuredEpgId = channel.epgId;
      const keepLocalSchedule = !configuredEpgId || configuredEpgId === 'none';
      const matchedEpgId = findMatchingId(configuredEpgId, allDeclaredIds);
      const epgPrograms = matchedEpgId ? allProgrammes.get(matchedEpgId) ?? [] : [];
      const hasEpg = epgPrograms.length > 0;
      const fallbackEpgId = getDummyEpgId(channel);
      const epgIdExists = Boolean(matchedEpgId);

      return {
        ...channel,
        // Keep the configured XMLTV channel id visible even when its guide is empty.
        epgId: configuredEpgId,
        fallbackEpgId: hasEpg ? undefined : fallbackEpgId,
        epgSource: hasEpg ? 'epg' as const : 'none' as const,
        epgUrl: matchedEpgId ? sourceById.get(matchedEpgId) : undefined,
        epgIdFound: epgIdExists,
        programs: hasEpg ? epgPrograms : keepLocalSchedule ? channel.programs : makeNoScheduleProgram(channel),
      };
    });
  } catch (error) {
    console.warn('EPG unavailable; programme schedules will be empty until the source loads.', error);
    return lineup.map((channel) => ({
      ...channel,
      epgId: channel.epgId,
      fallbackEpgId: getDummyEpgId(channel),
      epgSource: 'none' as const,
      programs: !channel.epgId || channel.epgId === 'none' ? channel.programs : makeNoScheduleProgram(channel),
    }));
  }
}