import { ArrowRight, CheckCircle2, ExternalLink, GitBranch, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TopDownResearchTrack, ResearchDependency, ResearchLink } from '@/content/ai/topdownResearchTracks';
import { articlePath } from '@/lib/paths';

function EvidenceLink({
  evidence,
  categorySlug,
  trackId,
  integratedRole,
}: {
  evidence: ResearchLink;
  categorySlug: string;
  trackId: string;
  integratedRole?: 'current' | 'canonical';
}) {
  const className = 'group inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
  if (evidence.articleSlug) {
    const path = `${articlePath(evidence.category ?? categorySlug, evidence.articleSlug)}?track=${encodeURIComponent(trackId)}${evidence.articleAnchor ? `#${evidence.articleAnchor}` : ''}`;
    const label = integratedRole === 'current'
      ? '통합 해설의 현재 변화 절'
      : integratedRole === 'canonical'
        ? '통합 해설의 최소 기준점 절'
        : '내부 해설 읽기';
    return (
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
        <Link to={path} className={className}>
          {label} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
        {evidence.url && (
          <a
            href={evidence.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-sm text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            공식 원문 <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only"> (새 창)</span>
          </a>
        )}
      </div>
    );
  }
  return (
    <a href={evidence.url} target="_blank" rel="noreferrer" className={`${className} mt-3`}>
      공식 원문 열기 <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only"> (새 창)</span>
    </a>
  );
}

function DependencyList({
  items,
  categorySlug,
  trackId,
}: {
  items: ResearchDependency[];
  categorySlug: string;
  trackId: string;
}) {
  return (
    <ul className="divide-y divide-border/70 border-y border-border/70">
      {items.map((item) => (
        <li key={`${item.category ?? categorySlug}:${item.articleSlug}`}>
          <Link
            to={`${articlePath(item.category ?? categorySlug, item.articleSlug)}?track=${encodeURIComponent(trackId)}`}
            className="group relative grid min-w-0 gap-1 rounded-sm py-4 pr-8 transition-colors hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:grid-cols-[10.5rem_minmax(0,1fr)_auto] sm:items-start sm:gap-5 sm:px-3"
          >
            <span className="flex min-w-0 flex-wrap items-center gap-2 text-sm font-bold">
              <span className="min-w-0">{item.label}</span>
              {item.addedByCurrent && (
                <span className="shrink-0 rounded-sm bg-emerald-500/12 px-1.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">새 델타</span>
              )}
            </span>
            <span className="text-sm leading-relaxed text-muted-foreground">{item.reason}</span>
            <ArrowRight className="absolute right-1 top-4 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground sm:static sm:mt-0.5" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function EvidenceRow({
  label,
  evidence,
  categorySlug,
  trackId,
  isStop,
  integratedRole,
}: {
  label: string;
  evidence: ResearchLink;
  categorySlug: string;
  trackId: string;
  isStop?: boolean;
  integratedRole?: 'current' | 'canonical';
}) {
  return (
    <article className="grid min-w-0 gap-3 py-5 first:pt-0 last:pb-0 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6">
      <div>
        <p className={`text-xs font-bold ${isStop ? 'text-blue-700 dark:text-blue-300' : 'text-muted-foreground'}`}>
          {label}
        </p>
        <span className="mt-2 inline-block rounded-sm border border-border px-2 py-1 text-xs font-semibold tabular-nums text-muted-foreground">
          {evidence.published}
        </span>
      </div>
      <div className="min-w-0">
        <h4 className="text-base font-bold leading-snug">{evidence.title}</h4>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{evidence.description}</p>
        <p className="mt-2 text-xs font-medium leading-relaxed text-muted-foreground">{evidence.source}</p>
        <EvidenceLink evidence={evidence} categorySlug={categorySlug} trackId={trackId} integratedRole={integratedRole} />
      </div>
    </article>
  );
}

export default function TopDownResearchRoute({
  track,
  categorySlug,
  branchFirst = false,
}: {
  track: TopDownResearchTrack;
  categorySlug: string;
  branchFirst?: boolean;
}) {
  const deltaCount = [...track.concepts, ...track.foundations, ...track.implementation]
    .filter((item) => item.addedByCurrent).length;
  const hasIntegratedEvidence = Boolean(
    track.current.articleSlug
    && track.canonical.articleSlug
    && track.current.articleSlug === track.canonical.articleSlug,
  );

  return (
    <section
      className="mb-14"
      data-topdown-research-route={track.id}
      data-presentation-owner="research-track"
      data-route-usage={branchFirst ? 'shared-reference' : 'primary-path'}
      aria-labelledby={`research-route-${track.id}`}
    >
      <header className="border-y border-border py-7" data-route-stage="current">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            01 · CURRENT TARGET
          </span>
          <span aria-hidden="true">·</span>
          <span>검토 기준 {track.asOf}</span>
        </div>
        <h2 id={`research-route-${track.id}`} className="mt-3 max-w-3xl text-2xl font-bold leading-tight sm:text-[2rem]">{track.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{track.goal}</p>
        <div className="mt-6 max-w-4xl border-l-2 border-emerald-600/50 pl-4 sm:pl-5">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">현재 확인할 변화</p>
          <h3 className="mt-2 text-lg font-bold leading-snug">{track.current.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{track.current.description}</p>
        </div>
      </header>

      <section
        className="grid min-w-0 gap-5 border-b border-border py-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10"
        data-route-stage="evidence"
        aria-labelledby={`${track.id}-evidence`}
      >
        <div>
          <p className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">02 · PRIMARY SOURCE CHECKPOINTS</p>
          <h3 id={`${track.id}-evidence`} className="mt-2 text-lg font-bold leading-snug">현재 변화와 최소 기준점을 원문으로 검증하기</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">현재 주장을 확인할 근거와 역사 하향을 멈출 기준점만 읽습니다. 더 오래된 인용 사슬은 펼치지 않습니다.</p>
        </div>
        <div className="min-w-0 divide-y divide-border/70 border-y border-border/70">
          <EvidenceRow
            label="현재 근거"
            evidence={track.current}
            categorySlug={categorySlug}
            trackId={track.id}
            integratedRole={hasIntegratedEvidence ? 'current' : undefined}
          />
          <EvidenceRow
            label="최소 기준점"
            evidence={track.canonical}
            categorySlug={categorySlug}
            trackId={track.id}
            isStop
            integratedRole={hasIntegratedEvidence ? 'canonical' : undefined}
          />
          {track.supportingEvidence?.map((evidence) => (
            <EvidenceRow
              key={`${evidence.source}:${evidence.title}`}
              label="분기 원문"
              evidence={evidence}
              categorySlug={categorySlug}
              trackId={track.id}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-5 border-b border-border py-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10" aria-labelledby={`${track.id}-concepts`} data-route-stage="concepts">
        <div>
          <p className="font-mono text-xs font-bold text-foreground">
            {branchFirst ? '03 · SHARED REFERENCES' : (track.conceptsEyebrow ?? '03 · KEY CONCEPTS')}
          </p>
          <h3 id={`${track.id}-concepts`} className="mt-2 text-lg font-bold">
            {branchFirst ? '분기에서 막힐 때만 여는 공통 참조' : (track.conceptsTitle ?? '최소 원문을 읽기 위한 핵심 개념')}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {track.concepts.length}개 · {branchFirst ? '분기를 먼저 선택한 뒤 필요한 항목만 엽니다.' : '원문의 막힌 지점부터 골라 읽습니다.'}
          </p>
        </div>
        <div className="min-w-0">
          <DependencyList items={track.concepts} categorySlug={categorySlug} trackId={track.id} />
        </div>
      </section>

      <section className="grid gap-5 border-b border-border py-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10" aria-labelledby={`${track.id}-foundations`} data-route-stage="foundations">
        <div>
          <p className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300">04 · JUST-IN-TIME FOUNDATION</p>
          <h3 id={`${track.id}-foundations`} className="mt-2 text-lg font-bold">막힐 때만 여는 수학·과학</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{track.foundations.length}개 · 전부 선행하지 말고 필요한 것만 엽니다.</p>
        </div>
        <div className="min-w-0">
          <DependencyList items={track.foundations} categorySlug={categorySlug} trackId={track.id} />
        </div>
      </section>

      <section className="grid gap-5 border-b border-border py-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10" aria-labelledby={`${track.id}-implementation`} data-route-stage="implementation">
        <div>
          <p className="font-mono text-xs font-bold text-foreground">05 · IMPLEMENT &amp; VERIFY</p>
          <h3 id={`${track.id}-implementation`} className="mt-2 flex items-start gap-2 text-lg font-bold">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            {branchFirst ? '선택한 분기를 코드와 측정으로 검산하기' : '이해를 코드와 측정으로 닫기'}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{track.implementation.length}개 · 재현하거나 실패 조건을 측정합니다.</p>
        </div>
        <div className="min-w-0">
          <DependencyList items={track.implementation} categorySlug={categorySlug} trackId={track.id} />
        </div>
      </section>

      <div className="grid gap-5 border-b border-border py-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex gap-3">
          <GitBranch className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
          <div>
            <p className="text-xs font-bold">기반 델타 {deltaCount}개</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">현재 최상단 때문에 새로 필요해진 항목에만 <strong className="font-semibold text-foreground">새 델타</strong>를 붙였다. 이름이나 성능만 달라진 연구는 기반을 늘리지 않는다.</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold">여기서 과거 탐색을 멈춘다</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{track.stopReason}</p>
        </div>
      </div>

      <details className="group border-b border-border">
        <summary className="flex cursor-pointer list-none items-center gap-3 py-4 text-xs font-semibold [&::-webkit-details-marker]:hidden">
          최신 연구가 나왔을 때 갱신 규칙
          <span className="ml-auto text-muted-foreground group-open:hidden">펼치기</span>
          <span className="ml-auto hidden text-muted-foreground group-open:inline">접기</span>
        </summary>
        <p className="max-w-3xl pb-5 text-xs leading-relaxed text-muted-foreground">{track.promotionRule} 기존 최상단은 필수 경로에서 내리고 근거 기록으로 보존한다. 새 개념은 기존 기반으로 설명할 수 없고 직접 계산·구현해야 할 때만 아래에 추가한다.</p>
      </details>
    </section>
  );
}
