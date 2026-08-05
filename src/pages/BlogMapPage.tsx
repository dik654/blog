import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Clock, Network, X } from 'lucide-react';
import { topDownResearchTracks, type TopDownResearchTrack } from '@/content/ai/topdownResearchTracks';
import { getSidebarLearningStages, type SidebarLearningCluster } from '@/content/sidebar-learning-structure';
import { getCategoryBySlug } from '@/content';
import { BLOG_ROOT, subcategoryPath } from '@/lib/paths';
import { cn } from '@/lib/utils';
import TopDownResearchRoute from '@/pages/category/TopDownResearchRoute';

const CATEGORY_SLUG = 'ai';

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

// 연구 트랙을 목표-분야 cluster(언어·지식 / 인식·생성 / 행동·예측)로 투영한다.
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

    return {
      groups: groups
        .filter((group) => group.tracks.length > 0),
      fallback,
    };
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
            <span className="relative hidden text-xs font-medium text-muted-foreground sm:inline">· {option.hint}</span>
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
        <span className="shrink-0 rounded-sm border border-border px-1.5 py-0.5 font-mono text-xs font-semibold text-muted-foreground">
          {track.canonical.published}
        </span>
        <span className="min-w-0 truncate text-muted-foreground">{track.canonical.title}</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="shrink-0 rounded-sm border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
          {track.current.published}
        </span>
        <span className="min-w-0 truncate font-semibold">{track.current.title}</span>
      </div>
      <p className="text-xs text-muted-foreground">검토 기준 {track.asOf}</p>
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
            className="rounded-sm bg-muted/60 px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
          >
            {concept.label}
          </span>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        필요 개념 {track.concepts.length} · 기반 {track.foundations.length} · 구현 {track.implementation.length}
      </p>
    </div>
  );
}

function TrackCard({
  track,
  lens,
  selected,
  onSelect,
}: {
  track: TopDownResearchTrack;
  lens: Lens;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-expanded={selected}
      data-research-track-card={track.id}
      className={cn(
        'flex h-full flex-col rounded-lg border bg-card p-4 text-left transition-colors hover:border-foreground/30 hover:bg-muted/20',
        selected ? 'border-foreground/50 ring-1 ring-foreground/20' : 'border-border',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold leading-snug">{track.title}</h3>
      </div>
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{track.goal}</p>
      {lens === 'lineage' ? <LineageSummary track={track} /> : <MapSummary track={track} />}
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
        {selected ? '상세 접기' : lens === 'lineage' ? '계보 펼치기' : '필요 항목 펼치기'}
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
      </span>
    </button>
  );
}

function SelectedTrackDetail({
  track,
  onClose,
}: {
  track: TopDownResearchTrack;
  onClose: () => void;
}) {
  const detailRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const detail = detailRef.current;
    if (!detail) return;

    detail.focus({ preventScroll: true });
    detail.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [track.id]);

  return (
    <motion.section
      ref={detailRef}
      tabIndex={-1}
      aria-label={`${track.title} 연구 경로 상세`}
      data-selected-track-detail={track.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18 }}
      className="mt-5 scroll-mt-6 rounded-lg border border-border bg-card p-5 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-7"
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase text-muted-foreground">선택한 목표 · 근거와 필요한 기반을 함께 본다</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={subcategoryPath(CATEGORY_SLUG, track.subcategories[0])}
            className="text-xs font-semibold text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
          >
            커리큘럼에서 열기
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            닫기 <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <TopDownResearchRoute track={track} categorySlug={CATEGORY_SLUG} />
    </motion.section>
  );
}

export default function BlogMapPage() {
  const [lens, setLens] = useState<Lens>('map');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { groups, fallback } = useProjectedClusters();

  const selectedTrack = selectedId ? topDownResearchTracks.find((t) => t.id === selectedId) ?? null : null;
  const toggleSelect = (id: string) => setSelectedId((prev) => (prev === id ? null : id));

  const renderTrackSection = (tracks: TopDownResearchTrack[]) => {
    const sectionTrack = selectedTrack && tracks.some((track) => track.id === selectedTrack.id)
      ? selectedTrack
      : null;

    return (
      <>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              lens={lens}
              selected={selectedId === track.id}
              onSelect={() => toggleSelect(track.id)}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          {sectionTrack && (
            <SelectedTrackDetail
              key={sectionTrack.id}
              track={sectionTrack}
              onClose={() => setSelectedId(null)}
            />
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="max-w-3xl">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-muted-foreground">
          <Network className="h-3.5 w-3.5" aria-hidden="true" /> CURRENT-FIRST LEARNING PATHS
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">최신 목표에서 필요한 기반까지</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          먼저 지금 이해하거나 만들고 싶은 분야를 고른다. 각 경로는 최신 연구·산업 목표에서 시작해 이를 검증할 원문,
          막힌 지점에 필요한 핵심 개념과 최소 수학·과학, 직접 확인할 구현으로 이어진다. 새 연구가 나오면 해당 경로의{' '}
          <strong className="font-semibold text-foreground">현재 목표</strong>만 교체하고, 새 개념이 생겼을 때만 아래 기반을 보강한다.
        </p>
        <div className="mt-6">
          <LensToggle lens={lens} onChange={setLens} />
        </div>
      </header>

      {groups.map(({ cluster, tracks }) => (
        <section key={cluster.id} className="mt-10" aria-labelledby={`map-${cluster.id}`}>
          <div className="mb-3">
            <h2 id={`map-${cluster.id}`} className="text-lg font-bold">{cluster.label}</h2>
            {cluster.description && <p className="mt-1 text-sm text-muted-foreground">{cluster.description}</p>}
          </div>
          {renderTrackSection(tracks)}
        </section>
      ))}

      {fallback.length > 0 && (
        <section className="mt-10" aria-labelledby="map-other">
          <h2 id="map-other" className="mb-3 text-lg font-bold">기타</h2>
          {renderTrackSection(fallback)}
        </section>
      )}

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
