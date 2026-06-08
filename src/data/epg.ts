import { ungzip } from 'pako';
import { Channel, Program, getDummyEpgId } from './channels';

// EPG sources with short tags for targeting.
// Channels use 'epgId@tag' to pull EPG from only that source.
// e.g. 'cg_animax_sd_new@epgs1' → only searches the cignal_epg.xml source.
// If no '@tag' is specified, all sources are searched (original behaviour).

export const EPG_SOURCES: { tag: string; url: string }[] = [
  { tag: 'jp', url: 'https://akariko.netgenx.site/epg/kai-epg.xml' },
  { tag: 'cignaltv', url: 'https://raw.githubusercontent.com/atone77721/CIGNAL_EPG/refs/heads/main/cignal_epg.xml' },
  { tag: 'ctc', url: 'https://raw.githubusercontent.com/atone77721/CIGNAL_EPG/refs/heads/main/clickthecity_epg.xml' },
  { tag: 'astromy', url: 'https://raw.githubusercontent.com/AqFad2811/epg/refs/heads/main/astro.xml' },
  { tag: 'starhubsg', url: 'https://raw.githubusercontent.com/dbghelp/StarHub-TV-EPG/refs/heads/main/starhub.xml' },
  { tag: 'singtelsg', url: 'https://raw.githubusercontent.com/dbghelp/Singtel-TV-EPG/refs/heads/main/singtel.xml' },
  { tag: 'dummy', url: 'https://epgshare01.online/epgshare01/epg_ripper_DUMMY_CHANNELS.xml.gz' },
  { tag: 'ph1', url: 'https://epgshare01.online/epgshare01/epg_ripper_PH1.xml.gz' },
  { tag: 'ph2', url: 'https://epgshare01.online/epgshare01/epg_ripper_PH2.xml.gz' },
  { tag: 'id', url: 'https://raw.githubusercontent.com/AqFad2811/epg/refs/heads/main/indonesia.xml' },
  { tag: 'random', url: 'https://raw.githubusercontent.com/laleeroy/epg/c17822d42b8f995e0f9f802a03b4a290d1dd37a0/guide.xml' },
  { tag: 'gsat', url: 'https://gsat.atone77721.workers.dev/gsat.xml' },
];

// Keep a flat URL list for backwards compat
export const EPG_SOURCE_URLS = EPG_SOURCES.map(s => s.url);

// --- UTILS ---

/**
 * Parses an epgId that may contain a source tag.
 *   'cg_animax_sd_new@cignal' → { rawId: 'cg_animax_sd_new', sourceTag: 'cignal' }
 *   'cs18'                    → { rawId: 'cs18',              sourceTag: null }
 */
function parseEpgId(epgId: string): { rawId: string; sourceTag: string | null } {
  const atIdx = epgId.lastIndexOf('@');
  if (atIdx > 0) {
    return { rawId: epgId.slice(0, atIdx), sourceTag: epgId.slice(atIdx + 1) };
  }
  return { rawId: epgId, sourceTag: null };
}

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
 * normRequestedMap keys are normalized rawIds (without @tag), values are the full original epgId.
 */
function parseXmlToUserMap(xml: Document, normRequestedMap: Map<string, string>): Map<string, Program[]> {
  const userProgramMap = new Map<string, Program[]>();
  const xmlToUserMapping = new Map<string, string>(); // Maps XML ID -> User's full epgId

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
    // Fetch all EPG sources in parallel, keeping track of the tag for each
    const epgResults = await Promise.all(
      EPG_SOURCES.map(async (source) => {
        const result = await fetchOneEpgXml(source.url);
        return result ? { tag: source.tag, url: result.url, xml: result.xml } : null;
      })
    );
    const validEpgs = epgResults.filter((e): e is { tag: string; url: string; xml: string } => e !== null);

    if (validEpgs.length === 0) throw new Error('No EPG sources loaded');

    // Build a set of tags that are actually available
    const availableTags = new Set(validEpgs.map(e => e.tag));

    // Group channels by which source tag they target (null = all sources)
    // For each source, build a normRequestedMap containing only the channels that want data from it.

    // First, parse all channel epgIds to understand targeting
    const channelTargets = new Map<string, { rawId: string; sourceTag: string | null }>();
    for (const ch of lineup) {
      if (ch.epgId && ch.epgId !== 'none') {
        channelTargets.set(ch.epgId, parseEpgId(ch.epgId));
      }
    }

    // The Master Map: Key is ALWAYS the full ch.epgId (with @tag if present)
    const masterProgramMap = new Map<string, Program[]>();

    for (const epg of validEpgs) {
      const xmlDoc = new DOMParser().parseFromString(epg.xml, 'application/xml');
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) continue;

      // Build normRequestedMap for THIS source only:
      // Include channels that either target this specific tag, or have no tag (search all)
      const normRequestedMap = new Map<string, string>();

      for (const [fullEpgId, { rawId, sourceTag }] of channelTargets) {
        // Skip if channel targets a specific different source
        if (sourceTag !== null && sourceTag !== epg.tag) continue;
        // Skip if channel targets a source that doesn't exist (typo protection)
        if (sourceTag !== null && !availableTags.has(sourceTag)) continue;

        normRequestedMap.set(normalizeId(rawId), fullEpgId);
      }

      if (normRequestedMap.size === 0) continue;

      const sourceMap = parseXmlToUserMap(xmlDoc, normRequestedMap);
      
      // Merge sourceMap into masterProgramMap
      sourceMap.forEach((programs, targetId) => {
        const existing = masterProgramMap.get(targetId) ?? [];
        masterProgramMap.set(targetId, [...existing, ...programs]);
      });
    }

    // Sort all programs once after merging all sources
    masterProgramMap.forEach(progs => progs.sort((a, b) => (a.startMs ?? 0) - (b.startMs ?? 0)));

    // Deduplicate: remove programmes with identical title + startMs + endMs
    masterProgramMap.forEach((progs, key) => {
      const seen = new Set<string>();
      const deduped = progs.filter(p => {
        const fingerprint = `${p.title}|${p.startMs}|${p.endMs}`;
        if (seen.has(fingerprint)) return false;
        seen.add(fingerprint);
        return true;
      });
      masterProgramMap.set(key, deduped);
    });

    // Final mapping to lineup
    return lineup.map((channel): Channel => {
      const epgId = channel.epgId;
      const hasEpg = epgId && masterProgramMap.has(epgId);
      const programs = hasEpg ? (masterProgramMap.get(epgId) ?? []) : (epgId === 'none' ? channel.programs : makeNoScheduleProgram(channel));

      return {
        ...channel,
        epgId, // Keep configured ID (with @tag)
        epgSource: hasEpg ? 'epg' as const : 'none' as const,
        programs,
        epgIdFound: !!hasEpg,
        fallbackEpgId: hasEpg ? undefined : getDummyEpgId(channel),
      };
    });

  } catch (error) {
    console.warn('EPG loading failed:', error);
    return lineup.map((ch): Channel => ({
      ...ch,
      epgSource: 'none' as const,
      programs: ch.epgId === 'none' ? ch.programs : makeNoScheduleProgram(ch),
    }));
  }
}
