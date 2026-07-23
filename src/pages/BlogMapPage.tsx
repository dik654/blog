import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Clock, Network, Sparkles, X } from 'lucide-react';
import { topDownResearchTracks, type TopDownResearchTrack } from '@/content/ai/topdownResearchTracks';
import { getSidebarLearningStages, type SidebarLearningCluster } from '@/content/sidebar-learning-structure';
import { getCategoryBySlug } from '@/content';
import { BLOG_ROOT, subcategoryPath } from '@/lib/paths';
import { cn } from '@/lib/utils';
import TopDownResearchRoute from '@/pages/category/TopDownResearchRoute';

const CATEGORY_SLUG = 'ai';
// 사용자가 이름 붙인 두 축을 앞에 세운다: agent(행동 시스템) + LLM(언어·추론).
const FEATURED_IDS = ['ai-agents', 'llm-architecture'];

type Lens = 'map' | 'lineage';

// 트랙의 subcategory 와 cluster 의 subcategory slug 를 정확히 같거나 접두로 잇는다.
// 예: 트랙 subcategory 'ai-llm-post-training' 은 cluster slug 'ai-llm' 에 접두로 붙는다.
function related(trackSub: string, clusterSlug: string): boolean {
  return (
    trackSub === clusterSlug ||
    trackSub.startsWith(`${clusterSlug}-`) ||
    clusterSlug.startsWith(`${trackSub}-`)
  );
}

interface ClusterGroup {
  cluster: SidebarLearningCluster;
  tracks: TopDownResearchTrack[];
}

// 18개 트랙을 목표-분야 cluster(언어·지식 / 인식·생성 / 행동·예측)로 투영한다.
// 각 트랙은 첫 매칭 cluster 에 정확히 한 번만 배정된다(track.id 기준 자동 dedupe).
function useProjectedClusters() {
  return useMemo(() => {
    const category = getCategoryBySlug(CATEGORY_SLUG);
    const clusters = category
      ? (getSidebarLearningStages(category).find((stage) => stage.role === 'target' && stage.clusters.length)?.clusters ?? [])
      : [];

    const groups: ClusterGroup[] = clusters.map((cluster) => ({ cluster, tracks: [] }));
    const fallback: TopDownResearchTrack[] = [];

    for (const track of topDownResearchTracks) {
      const group = groups.find(({ cluster }) =>
        cluster.subcategories.some((sub) => track.subcategories.some((ts) => related(ts, sub.slug))),
      );
      if (group) group.tracks.push(track);
      else fallback.push(track);
    }

    // 파편화 방지 계약: 어떤 트랙도 조용히 사라지지 않는다.
    const assigned = groups.reduce((sum, g) => sum + g.tracks.length, 0) + fallback.length;
    if (import.meta.env.DEV && assigned !== topDownResearchTracks.length) {
      console.warn(`[BlogMap] 트랙 배정 누락: ${assigned}/${topDownResearchTracks.length}`);
    }

    return { groups: groups.filter((g) => g.tracks.length > 0), fallback };
  }, []);
}

function LensToggle({ lens, onChange }: { lens: Lens; onChange: (next: Lens) => void }) {
  const options: { value: Lens; label: string; hint: string; icon: typeof Network }[] = [
    { value: 'map', label: '필요한 것들', hint: '이걸 이해하려면', icon: Network },
    { value: 'lineage', label: '발전 계보', hint: '어디서 여기까지', icon: Clock },
  ];
  return (
    <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1" role="tablist" aria-label="지도 렌즈">
      {options.map((option) => {
        const active = lens === option.value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold transition-colors',
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {active && (
              <motion.span
                layoutId="lens-pill"
                className="absolute inset-0 rounded-md border border-border bg-card shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <Icon className="relative h-4 w-4" aria-hidden="true" />
            <span className="relative">{option.label}</span>
            <span className="relative hidden text-[11px] font-medium text-muted-foreground sm:inline">· {option.hint}</span>
          </button>
        );
      })}
    </div>
  );
}

function LineageSummary({ track }: { track: TopDownResearchTrack }) {
  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2 text-xs">
        <span className="shrink-0 rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
          {track.canonical.published}
        </span>
        <span className="min-w-0 truncate text-muted-foreground">{track.canonical.title}</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="shrink-0 rounded-sm border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
          {track.current.published}
        </span>
        <span className="min-w-0 truncate font-semibold">{track.current.title}</span>
      </div>
      <p className="text-[11px] text-muted-foreground">검토 기준 {track.asOf}</p>
    </div>
  );
}

function MapSummary({ track }: { track: TopDownResearchTrack }) {
  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {track.concepts.slice(0, 4).map((concept) => (
          <span
            key={concept.articleSlug}
            className="rounded-sm bg-muted/60 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
          >
            {concept.label}
          </span>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">
        필요 개념 {track.concepts.length} · 기반 {track.foundations.length} · 구현 {track.implementation.length}
      </p>
    </div>
  );
}

function TrackCard({
  track,
  lens,
  featured,
  selected,
  onSelect,
}: {
  track: TopDownResearchTrack;
  lens: Lens;
  featured?: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-expanded={selected}
      className={cn(
        'flex h-full flex-col rounded-lg border bg-card p-4 text-left transition-colors hover:border-foreground/30 hover:bg-muted/20',
        selected ? 'border-foreground/50 ring-1 ring-foreground/20' : 'border-border',
        featured && !selected && 'border-emerald-500/40',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold leading-snug">{track.title}</h3>
        {featured && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-emerald-500/12 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">
            <Sparkles className="h-3 w-3" aria-hidden="true" /> 시작점
          </span>
        )}
      </div>
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{track.goal}</p>
      {lens === 'lineage' ? <LineageSummary track={track} /> : <MapSummary track={track} />}
      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
        {selected ? '상세 접기' : lens === 'lineage' ? '계보 펼치기' : '필요 항목 펼치기'}
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
      </span>
    </button>
  );
}

export default function BlogMapPage() {
  const [lens, setLens] = useState<Lens>('map');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { groups, fallback } = useProjectedClusters();

  const featured = useMemo(
    () => FEATURED_IDS.map((id) => topDownResearchTracks.find((t) => t.id === id)).filter((t): t is TopDownResearchTrack => Boolean(t)),
    [],
  );

  const selectedTrack = selectedId ? topDownResearchTracks.find((t) => t.id === selectedId) ?? null : null;
  const toggleSelect = (id: string) => setSelectedId((prev) => (prev === id ? null : id));

  const renderGrid = (tracks: TopDownResearchTrack[]) => (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tracks.map((track) => (
        <TrackCard
          key={track.id}
          track={track}
          lens={lens}
          featured={FEATURED_IDS.includes(track.id)}
          selected={selectedId === track.id}
          onSelect={() => toggleSelect(track.id)}
        />
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="max-w-3xl">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase text-muted-foreground">
          <Network className="h-3.5 w-3.5" aria-hidden="true" /> AI 지도
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">발전이 빨라도 흐름을 잃지 않는 지도</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          이 지도는 각 분야의 연구 트랙을 그대로 투영한 결과다. 새 모델·논문이 나오면 지도를 다시 그리지 않는다 —
          해당 트랙의 <strong className="font-semibold text-foreground">현재 최전선(current)</strong>만 갱신 규칙에 따라 교체하면 지도가 따라 바뀐다.
          한 노드를 두 렌즈로 본다: <strong className="font-semibold text-foreground">필요한 것들</strong>(이해에 필요한 항목)과{' '}
          <strong className="font-semibold text-foreground">발전 계보</strong>(최소 구조에서 최전선까지).
        </p>
        <div className="mt-6">
          <LensToggle lens={lens} onChange={setLens} />
        </div>
      </header>

      <section className="mt-10" aria-labelledby="map-featured">
        <div className="mb-3 flex items-baseline gap-2">
          <h2 id="map-featured" className="text-lg font-bold">여기서 시작</h2>
          <span className="text-xs text-muted-foreground">agent · LLM</span>
        </div>
        {renderGrid(featured)}
      </section>

      {groups.map(({ cluster, tracks }) => (
        <section key={cluster.id} className="mt-10" aria-labelledby={`map-${cluster.id}`}>
          <div className="mb-3">
            <h2 id={`map-${cluster.id}`} className="text-lg font-bold">{cluster.label}</h2>
            {cluster.description && <p className="mt-1 text-sm text-muted-foreground">{cluster.description}</p>}
          </div>
          {renderGrid(tracks)}
        </section>
      ))}

      {fallback.length > 0 && (
        <section className="mt-10" aria-labelledby="map-other">
          <h2 id="map-other" className="mb-3 text-lg font-bold">기타</h2>
          {renderGrid(fallback)}
        </section>
      )}

      <AnimatePresence mode="wait">
        {selectedTrack && (
          <motion.section
            key={selectedTrack.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="mt-12 rounded-xl border border-border bg-card p-5 sm:p-7"
          >
            <div className="mb-2 flex items-center justify-between gap-4">
              <p className="text-[11px] font-bold uppercase text-muted-foreground">선택한 트랙 · 두 축을 함께 본다</p>
              <div className="flex items-center gap-3">
                <Link
                  to={subcategoryPath(CATEGORY_SLUG, selectedTrack.subcategories[0])}
                  className="text-xs font-semibold text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
                >
                  커리큘럼에서 열기
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  닫기 <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <TopDownResearchRoute track={selectedTrack} categorySlug={CATEGORY_SLUG} />
          </motion.section>
        )}
      </AnimatePresence>

      <p className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
        전체 주제 목록은{' '}
        <Link to={`${BLOG_ROOT}/${CATEGORY_SLUG}`} className="font-semibold underline decoration-border underline-offset-4 hover:text-foreground">
          AI 카테고리
        </Link>
        에서 이어서 볼 수 있다.
      </p>
    </div>
  );
}
