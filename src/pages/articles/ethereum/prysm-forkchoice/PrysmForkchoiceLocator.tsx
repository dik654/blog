import { Link } from "react-router-dom";
import { PRYSM_FORKCHOICE_NODE } from "@/content/prysm-forkchoice-learning-tree";

export default function PrysmForkchoiceLocator() {
  const node = PRYSM_FORKCHOICE_NODE;
  return (
    <aside
      id="prysm-forkchoice-map"
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="Prysm 학습 지도에서 가지 선택 글의 위치"
      data-prysm-forkchoice-track={node.track}
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/blockchain" className="hover:text-primary">블록체인</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/blockchain/node-architecture#deeper" className="hover:text-primary">이더리움 노드</Link>
        <span aria-hidden>›</span>
        <Link to={node.parentHref} className="hover:text-primary">{node.parentLabel}</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">{node.shortTitle}</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
            <span className="text-[11px] text-muted-foreground">현재 영역 · {node.region}</span>
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

      <div className="mt-5 grid gap-px bg-border p-px sm:grid-cols-3" aria-label="현재 글과 커리큘럼 이웃">
        <Link to={node.curriculumPrevious.href} className="min-w-0 bg-background px-3 py-3 text-muted-foreground hover:text-primary">
          <span className="text-[9px] font-bold">이전</span>
          <strong className="mt-1 block break-keep text-xs leading-5">{node.curriculumPrevious.label}</strong>
        </Link>
        <div aria-current="step" className="min-w-0 bg-background px-3 py-3 ring-2 ring-inset ring-primary">
          <span className="text-[9px] font-bold text-primary">현재 · 개념</span>
          <strong className="mt-1 block break-keep text-xs leading-5">{node.shortTitle}</strong>
        </div>
        <Link to={node.curriculumNext.href} className="min-w-0 bg-background px-3 py-3 text-muted-foreground hover:text-primary">
          <span className="text-[9px] font-bold">다음</span>
          <strong className="mt-1 block break-keep text-xs leading-5">{node.curriculumNext.label}</strong>
        </Link>
      </div>
    </aside>
  );
}

export function PrysmForkchoiceMapReturn() {
  const node = PRYSM_FORKCHOICE_NODE;
  return (
    <section id="return-map" className="scroll-mt-20 border-y border-border py-6">
      <h2 className="text-xs font-bold text-primary">부모 지도에 돌려줄 사실</h2>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{node.closure}</p>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs">
        <Link to={node.parentHref} className="inline-flex min-h-11 items-center border-b border-border font-bold hover:border-primary hover:text-primary">
          직속 부모: {node.parentLabel} ↗
        </Link>
        <Link to={node.curriculumPrevious.href} className="inline-flex min-h-11 items-center text-muted-foreground hover:text-primary">
          ← {node.curriculumPrevious.label}
        </Link>
        <Link to={node.curriculumNext.href} className="inline-flex min-h-11 items-center text-muted-foreground hover:text-primary">
          {node.curriculumNext.label} →
        </Link>
      </div>
    </section>
  );
}
