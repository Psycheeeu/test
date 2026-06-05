import { ungzip } from 'pako';
import { Channel, Program, getDummyEpgId } from './channels';

export const EPG_SOURCE_URLS = [
  'https://akariko.netgenx.site/epg/kai-epg.xml',
  'https://epgshare01.online/epgshare01/epg_ripper_PH1.xml.gz',
  'https://epgshare01.online/epgshare01/epg_ripper_PH2.xml.gz',
  'https://raw.githubusercontent.com/atone77721/CIGNAL_EPG/refs/heads/main/clickthecity_epg.xml',
  'https://raw.githubusercontent.com/atone77721/CIGNAL_EPG/refs/heads/main/cignal_epg.xml',
  'https://raw.githubusercontent.com/atone77721/AMZN_EPG/refs/heads/main/nowtv.xml',
  'https://raw.githubusercontent.com/AqFad2811/epg/refs/heads/main/astro.xml',
  'https://raw.githubusercontent.com/AqFad2811/epg/refs/heads/main/unifitv.xml',
  'https://raw.githubusercontent.com/AqFad2811/epg/refs/heads/main/indonesia.xml',
  'https://github.com/atone77721/AMZN_EPG/raw/refs/heads/main/nowtv.xml',
  'https://raw.githubusercontent.com/laleeroy/epg/c17822d42b8f995e0f9f802a03b4a290d1dd37a0/guide.xml',
  'https://raw.githubusercontent.com/IPTVCloud-app/EPG/07326114617efe3ac0c39f1228d6854fa355d699/sites/singtel.com/singtel.com.xml',
  'https://gsat.atone77721.workers.dev/gsat.xml',
  'https://epgshare01.online/epgshare01/epg_ripper_DUMMY_CHANNELS.xml.gz',
];

// --- UTILS ---

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
  return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function textFrom(parent: Element, tagName: string) {
  return parent.getElementsByTagName(tagName)[0]?.textContent?.trim() ?? '';
}

function normalizeId(value: string) {
  return value.trim().toLowerCase().replace(/&amp;/g, '&').replace(/[^\p{L}\p{N}]+/gu, '');
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

// --- FETCHING ---

async function fetchOneEpgXml(url: string) {
  const sources = [
    url,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
  ];

  for (const source of sources) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const response = await fetch(source, { cache: 'force-cache', signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) continue;

      const bytes = new Uint8Array(await response.arrayBuffer());
      const isGzip = bytes[0] === 0x1f && bytes[1] === 0x8b;
      const xml = isGzip ? ungzip(bytes, { to: 'string' }) : new TextDecoder().decode(bytes);

      if (xml.includes('<tv')) return { url, xml };
    } catch (e) { /* continue to next source */ }
  }
  return null;
}

// --- PARSING CORE ---

/**
 * Parses a single XML file and maps programmes directly to the user's requested EPG IDs.
 * This prevents the "ID Mismatch" bug by ensuring the Map key is always the actual channel.epgId.
 */
function parseXmlToUserMap(xml: Document, requestedIds: Set<string>, normRequestedMap: Map<string, string>): Map<string, Program[]> {
  const userProgramMap = new Map<string, Program[]>();
  const xmlToUserMapping = new Map<string, string>(); // Maps XML ID -> User's EPG ID

  // 1. Create a mapping table by looking at <channel> tags
  const channelNodes = xml.getElementsByTagName('channel');
  for (let i = 0; i < channelNodes.length; i++) {
    const node = channelNodes[i];
    const xmlId = node.getAttribute('id') ?? '';
    
    // Check the ID itself
    const normXmlId = normalizeId(xmlId);
    if (normXmlId && normRequestedMap.has(normXmlId)) {
      xmlToUserMapping.set(xmlId, normRequestedMap.get(normXmlId)!);
      xmlToUserMapping.set(normXmlId, normRequestedMap.get(normXmlId)!);
    }

    // Check display-names (common in EPGs)
    const displayNames = node.getElementsByTagName('display-name');
    for (let j = 0; j < displayNames.length; j++) {
      const name = displayNames[j].textContent?.trim() ?? '';
      const normName = normalizeId(name);
      if (normName && normRequestedMap.has(normName)) {
        const targetId = normRequestedMap.get(normName)!;
        xmlToUserMapping.set(xmlId, targetId);
        xmlToUserMapping.set(name, targetId);
        xmlToUserMapping.set(normName, targetId);
      }
    }
  }

  // 2. Parse programmes and use the mapping table
  const programmes = xml.getElementsByTagName('programme');
  for (let i = 0; i < programmes.length; i++) {
    const item = programmes[i];
    const rawXmlId = item.getAttribute('channel') ?? '';
    
    // Find which user-requested ID this belongs to
    let targetId = xmlToUserMapping.get(rawXmlId) || xmlToUserMapping.get(normalizeId(rawXmlId));
    
    // Fallback: Direct normalized check if not found in channel tags
    if (!targetId) {
      targetId = normRequestedMap.get(normalizeId(rawXmlId));
    }

    if (!targetId) continue;

    const startAttr = item.getAttribute('start');
    const stopAttr = item.getAttribute('stop');
    if (!startAttr || !stopAttr) continue;

    const startMs = parseXmltvDate(startAttr);
    const endMs = parseXmltvDate(stopAttr);
    if (!startMs || !endMs) continue;

    const program: Program = {
      title: textFrom(item, 'title') || 'Untitled Program',
      startTime: formatTime(startMs),
      endTime: formatTime(endMs),
      description: textFrom(item, 'desc') || 'No description available.',
      genre: textFrom(item, 'category') || 'General',
      rating: item.getElementsByTagName('value')[0]?.textContent?.trim(),
      startMs,
      endMs,
      source: 'epg',
    };

    const existing = userProgramMap.get(targetId) ?? [];
    existing.push(program);
    userProgramMap.set(targetId, existing);
  }

  return userProgramMap;
}

// --- MAIN EXPORT ---

export async function loadEpgForChannels(lineup: Channel[]) {
  try {
    const epgResults = await Promise.all(EPG_SOURCE_URLS.map(fetchOneEpgXml));
    const validEpgs = epgResults.filter((e): e is { url: string; xml: string } => e !== null);

    if (validEpgs.length === 0) throw new Error('No EPG sources loaded');

    // Prepare mapping helpers
    const requestedIds = new Set<string>();
    const normRequestedMap = new Map<string, string>(); // normalized -> actual epgId

    lineup.forEach(ch => {
      if (ch.epgId && ch.epgId !== 'none') {
        requestedIds.add(ch.epgId);
        normRequestedMap.set(normalizeId(ch.epgId), ch.epgId);
      }
    });

    // The Master Map: Key is ALWAYS the actual ch.epgId
    const masterProgramMap = new Map<string, Program[]>();

    for (const epg of validEpgs) {
      const xmlDoc = new DOMParser().parseFromString(epg.xml, 'application/xml');
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) continue;

      const sourceMap = parseXmlToUserMap(xmlDoc, requestedIds, normRequestedMap);
      
      // Merge sourceMap into masterProgramMap
      sourceMap.forEach((programs, targetId) => {
        const existing = masterProgramMap.get(targetId) ?? [];
        masterProgramMap.set(targetId, [...existing, ...programs]);
      });
    }

    // Sort all programs once after merging all sources
    masterProgramMap.forEach(progs => progs.sort((a, b) => (a.startMs ?? 0) - (b.startMs ?? 0)));

    // Final mapping to lineup
    return lineup.map((channel) => {
      const epgId = channel.epgId;
      const hasEpg = epgId && masterProgramMap.has(epgId);
      const programs = hasEpg ? (masterProgramMap.get(epgId) ?? []) : (epgId === 'none' ? channel.programs : makeNoScheduleProgram(channel));

      return {
        ...channel,
        epgId, // Keep configured ID
        epgSource: hasEpg ? 'epg' : 'none',
        programs,
        epgIdFound: !!hasEpg,
        fallbackEpgId: hasEpg ? undefined : getDummyEpgId(channel),
      };
    });

  } catch (error) {
    console.warn('EPG loading failed:', error);
    return lineup.map(ch => ({
      ...ch,
      epgSource: 'none' as const,
      programs: ch.epgId === 'none' ? ch.programs : makeNoScheduleProgram(ch),
    }));
  }
}
