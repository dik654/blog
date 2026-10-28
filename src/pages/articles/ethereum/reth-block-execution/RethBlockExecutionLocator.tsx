import { Link } from "react-router-dom";
import {
  RETH_BLOCK_EXECUTION_NODES,
  getRethBlockExecutionNode,
  getRethBlockExecutionTrackNodes,
  type RethBlockExecutionNodeId,
  type RethBlockExecutionTrack,
} from "@/content/reth-block-execution-learning-tree";

const TRACK_LABEL: Record<RethBlockExecutionTrack, string> = {
  concept: "개념",
  practice: "실무",
  reference: "참고",
};

export default function RethBlockExecutionLocator({
  current,
}: {
  current: RethBlockExecutionNodeId;
}) {
  const node = getRethBlockExecutionNode(current);
  const track = getRethBlockExecutionTrackNodes(node.track);
  const currentIndex = track.findIndex((candidate) => candidate.id === current);
  const previous = currentIndex > 0 ? track[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0 && currentIndex < track.length - 1
      ? track[currentIndex + 1]
      : undefined;

  return (
    <aside
      id="reth-block-execution-map"
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="Reth Block Execution 학습 지도에서 현재 글의 위치"
      data-reth-block-execution-track={node.track}
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/blockchain" className="hover:text-primary">블록체인</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/blockchain/reth#overview" className="hover:text-primary">Reth 전체 구조</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">{node.shortTitle}</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
              {TRACK_LABEL[node.track]}
            </span>
            <span className="text-[11px] text-muted-foreground">현재 영역 · 블록 실행과 결과 검증</span>
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

      <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px" aria-label="Reth Block Execution 개념과 실무 경로">
        {RETH_BLOCK_EXECUTION_NODES.map((candidate, index) => {
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
              <span className="mt-0.5 block text-[9px] font-bold text-primary/80">{TRACK_LABEL[candidate.track]}</span>
              <span className="mt-1 block break-keep text-[10px] leading-4">{candidate.mapLabel}</span>
            </Link>
          );
        })}
      </div>

      {node.track === "practice" && node.anchors?.length ? (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-[10px] font-bold text-muted-foreground">이 실무 글이 출발하는 개념 앵커</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {node.anchors.map((anchor) => (
              <Link key={anchor.href} to={anchor.href} className="hover:text-primary">{anchor.label} ↗</Link>
            ))}
          </div>
        </div>
      ) : null}

      {(previous || next) && (
        <div className="mt-4 flex justify-between border-t border-border pt-3 text-xs">
          {previous ? <Link to={previous.href}>← {previous.shortTitle}</Link> : <span />}
          {next ? <Link to={next.href}>{next.shortTitle} →</Link> : <span />}
        </div>
      )}
      <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-border pt-3 text-xs">
        {node.curriculumPrevious ? <Link to={node.curriculumPrevious.href} className="hover:text-primary">← {node.curriculumPrevious.label}</Link> : <span />}
        {node.curriculumNext ? <Link to={node.curriculumNext.href} className="hover:text-primary">{node.curriculumNext.label} →</Link> : <span />}
      </div>
    </aside>
  );
}

export function RethBlockExecutionMapReturn({
  current,
}: {
  current: RethBlockExecutionNodeId;
}) {
  const node = getRethBlockExecutionNode(current);
  return (
    <aside id="return-map" className="not-prose scroll-mt-20 border-y border-border py-5">
      <p className="text-[10px] font-bold text-primary">부모 지도에 반환</p>
      <p className="mt-2 max-w-3xl break-keep text-sm leading-6">
        {node.track === "concept"
          ? "Reth는 부모 상태와 블록 본문을 활성 fork의 EVM 환경에 넣고, 사전 변경·본문 순서의 거래·사후 변경을 하나의 상태 위에서 실행합니다. 실행 결과는 영수증·요청·gas와 BundleState이며, 별도 검증 계층이 header의 약속과 비교한 뒤에만 블록을 받아들입니다."
          : "실행 경로를 바꿀 때는 처리량보다 먼저 같은 입력의 상태·영수증·요청·gas·검증 결과와 rollback을 대조합니다. 실행과 검증의 authoritative writer를 분리하고 전체 fixture를 다시 통과한 뒤에만 재진입합니다."}
      </p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs">
        <Link to="/cs/blockchain/evm-advanced#return-map" className="font-bold hover:text-primary">EVM 심화 지도로 돌아가기 ↗</Link>
        {node.curriculumNext ? <Link to={node.curriculumNext.href} className="hover:text-primary">다음 글 · {node.curriculumNext.label} ↗</Link> : null}
      </div>
    </aside>
  );
}
