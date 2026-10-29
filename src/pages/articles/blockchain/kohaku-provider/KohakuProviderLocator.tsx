import { Link } from "react-router-dom";
import {
  KOHAKU_PROVIDER_NODES,
  getKohakuProviderNode,
  type KohakuProviderNodeId,
  type KohakuProviderTrack,
} from "@/content/kohaku-provider-learning-tree";

const TRACK_LABEL: Record<KohakuProviderTrack, string> = {
  concept: "개념",
  practice: "실무",
  reference: "참고",
};

export default function KohakuProviderLocator({ current }: { current: KohakuProviderNodeId }) {
  const node = getKohakuProviderNode(current);

  return (
    <aside
      id="kohaku-provider-map"
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="Kohaku Provider 학습 지도에서 현재 글의 위치"
      data-kohaku-provider-track={node.track}
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/blockchain" className="hover:text-primary">블록체인</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/blockchain/helios#boundary" className="hover:text-primary">검증된 Ethereum 조회</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">{node.shortTitle}</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">{TRACK_LABEL[node.track]}</span>
            <span className="text-[11px] text-muted-foreground">현재 영역 · Provider adapter와 신뢰 경로</span>
          </div>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">{node.question}</p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link to={node.parentHref} className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">
            {node.parentLabel} ↗
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-px bg-border p-px sm:grid-cols-2" aria-label="Kohaku Provider 개념과 실무 경로">
        {KOHAKU_PROVIDER_NODES.map((candidate, index) => {
          const active = candidate.id === current;
          return (
            <Link
              key={candidate.id}
              to={candidate.href}
              aria-current={active ? "step" : undefined}
              className={`min-w-0 bg-background px-3 py-3 ${active ? "text-foreground" : "text-muted-foreground hover:text-primary"}`}
            >
              <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-xs leading-5">{candidate.shortTitle}</strong>
              <span className="mt-0.5 block text-[9px] font-medium">{TRACK_LABEL[candidate.track]}</span>
            </Link>
          );
        })}
      </div>

      {node.anchors?.length ? (
        <div className="mt-4 border-t border-border pt-4" aria-label="이 실무 글이 사용하는 개념 앵커">
          <p className="text-[10px] font-bold text-muted-foreground">먼저 확인할 개념</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {node.anchors.map((anchor) => (
              <Link key={anchor.href} to={anchor.href} className="inline-flex min-h-11 items-center border-b border-border py-2 text-xs font-semibold leading-5 hover:border-primary hover:text-primary">
                {anchor.label} ↗
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export function KohakuProviderMapReturn({ current }: { current: KohakuProviderNodeId }) {
  const node = getKohakuProviderNode(current);

  return (
    <section id="return-map" className="scroll-mt-20 border-y border-border py-6">
      <p className="text-xs font-bold text-primary">부모 지도에 돌려줄 사실</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{node.closure}</p>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs">
        <Link to={node.parentHref} className="inline-flex min-h-11 items-center border-b border-border font-bold hover:border-primary hover:text-primary">
          직속 부모: {node.parentLabel} ↗
        </Link>
        {node.paired ? (
          <Link to={node.paired.href} className="inline-flex min-h-11 items-center border-b border-border font-semibold hover:border-primary hover:text-primary">
            이어서: {node.paired.label} ↗
          </Link>
        ) : null}
        {node.curriculumPrevious ? (
          <Link to={node.curriculumPrevious.href} className="inline-flex min-h-11 items-center text-muted-foreground hover:text-primary">
            ← {node.curriculumPrevious.label}
          </Link>
        ) : null}
        {node.curriculumNext ? (
          <Link to={node.curriculumNext.href} className="inline-flex min-h-11 items-center text-muted-foreground hover:text-primary">
            {node.curriculumNext.label} →
          </Link>
        ) : null}
      </div>
    </section>
  );
}
