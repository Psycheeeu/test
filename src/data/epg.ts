import { ungzip } from 'pako';
import { Channel, Program, getDummyEpgId } from './channels';

export const EPG_SOURCE_URLS = [
  'https://akariko.netgenx.site/epg/kai-epg.xml',
  'https://iptv-epg.org/files/epg-ph.xml',
  'https://iptv-epg.org/files/epg-sg.xml',
  'https://iptv-epg.org/files/epg-my.xml',
  'https://github.com/atone77721/CIGNAL_EPG/raw/refs/heads/main/clickthecity_epg.xml',
  'https://gsat.atone77721.workers.dev/gsat.xml',
  'https://epgshare01.online/epgshare01/epg_ripper_PH1.xml.gz',
  'https://epgshare01.online/epgshare01/epg_ripper_PH2.xml.gz',
  'https://epgshare01.online/epgshare01/epg_ripper_SG1.xml.gz',
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
  return value
    .trim()
    .toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/[^\p{L}\p{N}]+/gu, '');
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(source, {
        cache: 'force-cache',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`EPG request failed: ${response.status}`);

      const bytes = new Uint8Array(await response.arrayBuffer());
      const isGzip = bytes[0] === 0x1f && bytes[1] === 0x8b;
      const xml = isGzip
        ? ungzip(bytes, { to: 'string' })
        : new TextDecoder().decode(bytes);

      if (xml.includes('<tv')) {
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

/**
 * Build a map from every raw XML channel id → the configured epgId it corresponds to.
 * This means allProgrammes will always be keyed by the configured epgId,
 * making lookup reliable later.
 */
function buildXmlIdToConfiguredIdMap(
  xml: Document,
  configuredIds: Set<string>,
  normalizedToConfigured: Map<string, string>
): Map<string, string> {
  const map = new Map<string, string>();

  // Map from declared <channel> nodes
  const channelNodes = xml.getElementsByTagName('channel');
  for (let i = 0; i < channelNodes.length; i++) {
    const node = channelNodes[i];
    const rawId = node.getAttribute('id') ?? '';
    if (!rawId) continue;

    // Exact match
    if (configuredIds.has(rawId)) {
      map.set(rawId, rawId);
      continue;
    }

    // Normalized match
    const configuredId = normalizedToConfigured.get(normalizeId(rawId));
    if (configuredId) {
      map.set(rawId, configuredId);
    }
  }

  // Also scan <programme channel=""> attributes directly
  // in case some sources have programmes without a <channel> declaration
  const programmes = xml.getElementsByTagName('programme');
  for (let i = 0; i < programmes.length; i++) {
    const rawId = programmes[i].getAttribute('channel') ?? '';
    if (!rawId || map.has(rawId)) continue;

    if (configuredIds.has(rawId)) {
      map.set(rawId, rawId);
      continue;
    }

    const configuredId = normalizedToConfigured.get(normalizeId(rawId));
    if (configuredId) {
      map.set(rawId, configuredId);
    }
  }

  return map;
}

/**
 * Parse all <programme> elements from the XML.
 * Returns a map keyed by the CONFIGURED epgId (not the raw XML id).
 */
function parseProgrammes(
  xml: Document,
  xmlIdToConfiguredId: Map<string, string>
): Map<string, Program[]> {
  const map = new Map<string, Program[]>();
  const programmes = xml.getElementsByTagName('programme');
  const len = programmes.length;

  for (let i = 0; i < len; i++) {
    const item = programmes[i];
    const rawId = item.getAttribute('channel') ?? '';

    // Resolve to configured id - key used for allProgrammes
    const configuredId = xmlIdToConfiguredId.get(rawId);
    if (!configuredId) continue;

    const startAttr = item.getAttribute('start');
    const stopAttr = item.getAttribute('stop');
    if (!startAttr || !stopAttr) continue;

    const startMs = parseXmltvDate(startAttr);
    const endMs = parseXmltvDate(stopAttr);
    if (startMs === null || endMs === null) continue;

    const title = textFrom(item, 'title') || 'Untitled Program';
    const description = textFrom(item, 'desc') || 'No description available from EPG source.';
    const genre = textFrom(item, 'category') || 'Music';
    const ratingNode = item.getElementsByTagName('value')[0];
    const rating = ratingNode ? ratingNode.textContent?.trim() : undefined;

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

    let list = map.get(configuredId);
    if (!list) {
      list = [];
      map.set(configuredId, list);
    }
    list.push(program);
  }

  // Sort each channel's programmes chronologically
  for (const programs of map.values()) {
    programs.sort((a, b) => (a.startMs ?? 0) - (b.startMs ?? 0));
  }

  return map;
}

/**
 * Look up programmes for a channel.
 * Tries exact match first, then normalized match.
 * This is safe because allProgrammes is always keyed by configuredId.
 */
function resolvePrograms(
  configuredEpgId: string,
  allProgrammes: Map<string, Program[]>
): Program[] {
  // 1. Exact match (most cases)
  const exact = allProgrammes.get(configuredEpgId);
  if (exact?.length) return exact;

  // 2. Normalized fallback (handles casing / punctuation differences)
  const normalizedTarget = normalizeId(configuredEpgId);
  for (const [key, programs] of allProgrammes) {
    if (normalizeId(key) === normalizedTarget && programs.length) {
      return programs;
    }
  }

  return [];
}

export async function loadEpgForChannels(lineup: Channel[]) {
  try {
    const epgTexts = await fetchEpgXmls();

    // Build a set of all configured epgIds and a normalized → configured map
    const configuredIds = new Set(
      lineup.map((ch) => ch.epgId).filter(Boolean) as string[]
    );
    const normalizedToConfigured = new Map(
      Array.from(configuredIds).map((id) => [normalizeId(id), id])
    );

    // allProgrammes is ALWAYS keyed by configured epgId
    const allProgrammes = new Map<string, Program[]>();
    const sourceById = new Map<string, string>();

    for (const epg of epgTexts) {
      const xml = new DOMParser().parseFromString(epg.xml, 'application/xml');
      if (xml.getElementsByTagName('parsererror').length > 0) {
        console.warn(`Skipping malformed EPG XML from ${epg.url}`);
        continue;
      }

      // Single consistent mapping: raw XML id → configured epgId
      const xmlIdToConfiguredId = buildXmlIdToConfiguredIdMap(
        xml,
        configuredIds,
        normalizedToConfigured
      );

      // Parse programmes, already keyed by configured epgId
      const programmes = parseProgrammes(xml, xmlIdToConfiguredId);

      // Merge into allProgrammes
      programmes.forEach((programs, configuredId) => {
        const existing = allProgrammes.get(configuredId) ?? [];
        const merged = [...existing, ...programs].sort(
          (a, b) => (a.startMs ?? 0) - (b.startMs ?? 0)
        );
        allProgrammes.set(configuredId, merged);
        sourceById.set(configuredId, epg.url);
      });
    }

    // Map each channel to its resolved programmes
    return lineup.map((channel) => {
      const configuredEpgId = channel.epgId;
      const keepLocalSchedule = !configuredEpgId || configuredEpgId === 'none';

      const epgPrograms = configuredEpgId
        ? resolvePrograms(configuredEpgId, allProgrammes)
        : [];

      const hasEpg = epgPrograms.length > 0;
      const fallbackEpgId = getDummyEpgId(channel);

      return {
        ...channel,
        epgId: configuredEpgId,
        fallbackEpgId: hasEpg ? undefined : fallbackEpgId,
        epgSource: hasEpg ? ('epg' as const) : ('none' as const),
        epgUrl: hasEpg ? sourceById.get(configuredEpgId!) : undefined,
        epgIdFound: hasEpg,
        programs: hasEpg
          ? epgPrograms
          : keepLocalSchedule
          ? channel.programs
          : makeNoScheduleProgram(channel),
      };
    });
  } catch (error) {
    console.warn(
      'EPG unavailable; programme schedules will be empty until the source loads.',
      error
    );
    return lineup.map((channel) => ({
      ...channel,
      epgId: channel.epgId,
      fallbackEpgId: getDummyEpgId(channel),
      epgSource: 'none' as const,
      programs:
        !channel.epgId || channel.epgId === 'none'
          ? channel.programs
          : makeNoScheduleProgram(channel),
    }));
  }
}
