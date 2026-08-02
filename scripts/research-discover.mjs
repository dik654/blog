import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import { mergeResearchQueue } from './research-queue-state.mjs';

const root = process.cwd();
const pipelineDir = resolve(root, 'knowledge/research-pipeline');
const sourcesPath = resolve(pipelineDir, 'sources.json');
const topicsPath = resolve(pipelineDir, 'topics.json');
const queuePath = resolve(pipelineDir, 'queue.json');
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', trimValues: true });

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value = 'true'] = arg.replace(/^--/, '').split('=');
  return [key, value];
}));
const dryRun = args.has('dry-run');
const sinceDays = Number(args.get('since-days') ?? 45);
const sourceFilter = args.get('source');
const cutoff = Date.now() - sinceDays * 24 * 60 * 60 * 1000;

function list(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function text(value) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') return value['#text'] ?? value['__cdata'] ?? '';
  return '';
}

function canonicalize(rawUrl) {
  const url = new URL(rawUrl);
  url.hash = '';
  for (const key of [...url.searchParams.keys()]) {
    if (key.startsWith('utm_') || ['source', 'ref', 'via'].includes(key)) url.searchParams.delete(key);
  }
  return url.toString().replace(/\/$/, '');
}

function humanizeUrl(url) {
  const slug = new URL(url).pathname.split('/').filter(Boolean).at(-1) ?? url;
  return decodeURIComponent(slug).replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function matches(url, source) {
  const included = source.include.length === 0 || source.include.some((pattern) => new RegExp(pattern).test(url));
  const excluded = source.exclude.some((pattern) => new RegExp(pattern).test(url));
  return included && !excluded;
}

async function fetchXml(url) {
  const response = await fetch(url, { headers: { 'User-Agent': 'HeruResearchIndexer/1.0 (evidence discovery)' } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return parser.parse(await response.text());
}

async function readSitemap(url, depth = 0) {
  const document = await fetchXml(url);
  if (document.sitemapindex && depth < 2) {
    const nested = list(document.sitemapindex.sitemap).map((item) => text(item.loc)).filter(Boolean);
    const pages = await Promise.all(nested.map((nestedUrl) => readSitemap(nestedUrl, depth + 1)));
    return pages.flat();
  }
  return list(document.urlset?.url).map((item) => ({
    url: text(item.loc),
    title: humanizeUrl(text(item.loc)),
    publishedAt: text(item.lastmod) || null,
    summary: '',
  })).filter((item) => item.url);
}

async function readAtom(url) {
  const document = await fetchXml(url);
  return list(document.feed?.entry).map((entry) => {
    const links = list(entry.link);
    const alternate = links.find((link) => link['@_rel'] === 'alternate') ?? links[0];
    return {
      url: alternate?.['@_href'] ?? text(entry.id),
      title: text(entry.title).replace(/\s+/g, ' ').trim(),
      publishedAt: text(entry.published) || text(entry.updated) || null,
      summary: text(entry.summary).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    };
  }).filter((item) => item.url);
}

function scoreTopics(item, topics) {
  const haystack = `${item.title} ${item.summary} ${item.url}`.toLocaleLowerCase('en');
  const contains = (keyword) => {
    const escaped = keyword.toLocaleLowerCase('en').replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '[\\s/_-]+');
    return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(haystack);
  };
  return topics.map((topic) => ({
    topicId: topic.id,
    trackId: topic.track ?? topic.id,
    category: topic.category,
    score: (topic.strongKeywords ?? []).reduce((score, keyword) => score + (contains(keyword) ? 3 : 0), 0)
      + topic.keywords.reduce((score, keyword) => score + (contains(keyword) ? 1 : 0), 0),
  })).filter((match) => match.score >= 2).sort((a, b) => b.score - a.score);
}

function placementHint(item, matches) {
  const textValue = `${item.title} ${item.summary}`.toLocaleLowerCase('en');
  if (/survey|tutorial|foundations|from scratch|principles/.test(textValue)) return 'evidence-review';
  if (/introducing|release|new model|system|agent|robot|framework/.test(textValue)) return 'compare-current-top';
  if (matches[0]?.score >= 3) return 'compare-current-top';
  return 'watchlist';
}

const [sourceRegistry, topicRegistry, previousQueue] = await Promise.all([
  readFile(sourcesPath, 'utf8').then(JSON.parse),
  readFile(topicsPath, 'utf8').then(JSON.parse),
  readFile(queuePath, 'utf8').then(JSON.parse),
]);

const selectedSources = sourceRegistry.sources.filter((source) => !sourceFilter || source.id === sourceFilter);
if (selectedSources.length === 0) throw new Error(`Unknown source: ${sourceFilter}`);

const discovered = [];
const failures = [];
const successfulSourceIds = new Set();
for (const source of selectedSources) {
  try {
    const rawItems = source.kind === 'atom' ? await readAtom(source.url) : await readSitemap(source.url);
    const candidates = rawItems
      .filter((item) => matches(item.url, source))
      .filter((item) => !item.publishedAt || Number.isNaN(Date.parse(item.publishedAt)) || Date.parse(item.publishedAt) >= cutoff)
      .map((item) => {
        const topicMatches = scoreTopics(item, topicRegistry.topics);
        return {
          id: canonicalize(item.url),
          canonicalUrl: canonicalize(item.url),
          title: item.title,
          publishedAt: item.publishedAt,
          discoveredAt: new Date().toISOString(),
          sourceId: source.id,
          organization: source.organization,
          sourceKind: source.kind,
          topicMatches,
          proposedTrack: topicMatches[0]?.trackId ?? null,
          proposedCategory: topicMatches[0]?.category ?? null,
          placementHint: placementHint(item, topicMatches),
          promotionReview: {
            currentTopCompared: false,
            mechanismChanged: null,
            existingFoundationsSufficient: null,
            foundationDelta: [],
            decision: 'pending',
          },
          status: 'discovered',
        };
      })
      .filter((item) => item.topicMatches.length > 0)
      .sort((a, b) => (Date.parse(b.publishedAt ?? '') || 0) - (Date.parse(a.publishedAt ?? '') || 0))
      .slice(0, source.maxCandidates);
    successfulSourceIds.add(source.id);
    discovered.push(...candidates);
  } catch (error) {
    failures.push({ sourceId: source.id, message: error instanceof Error ? error.message : String(error) });
  }
}

const refreshedAt = new Date().toISOString();
const mergedCandidates = mergeResearchQueue({
  previousCandidates: previousQueue.candidates,
  discovered,
  successfulSourceIds,
  refreshedAt,
});

const queue = {
  version: 1,
  generatedAt: new Date().toISOString(),
  lastRun: { successfulSources: [...successfulSourceIds], failures },
  candidates: mergedCandidates.sort((a, b) => (Date.parse(b.publishedAt ?? '') || 0) - (Date.parse(a.publishedAt ?? '') || 0)),
};

const summary = selectedSources.map((source) => ({ source: source.id, candidates: discovered.filter((item) => item.sourceId === source.id).length, status: successfulSourceIds.has(source.id) ? 'ok' : 'failed' }));
process.stdout.write(`${JSON.stringify({ dryRun, sinceDays, totalNewOrRefreshed: discovered.length, failures, bySource: summary }, null, 2)}\n`);
if (!dryRun) await writeFile(queuePath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
if (successfulSourceIds.size === 0) process.exitCode = 1;
