import { Link } from "react-router-dom";
import {
  RETH_PAYLOAD_BUILDER_NODES,
  getRethPayloadBuilderNode,
  getRethPayloadBuilderTrackNodes,
  type RethPayloadBuilderNodeId,
  type RethPayloadBuilderTrack,
} from "@/content/reth-payload-builder-learning-tree";

const TRACK_LABEL: Record<RethPayloadBuilderTrack, string> = {
  concept: "개념",
  practice: "실무",
  reference: "참고",
};

export default function RethPayloadBuilderLocator({
  current,
}: {
  current: RethPayloadBuilderNodeId;
}) {
  const node = getRethPayloadBuilderNode(current);
  const track = getRethPayloadBuilderTrackNodes(node.track);
  const currentIndex = track.findIndex((candidate) => candidate.id === current);
  const previous = currentIndex > 0 ? track[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0 && currentIndex < track.length - 1
      ? track[currentIndex + 1]
      : undefined;

  return (
    <aside
      id="reth-payload-builder-map"
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="Reth Payload Builder 학습 지도에서 현재 글의 위치"
      data-reth-payload-builder-track={node.track}
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
            <span className="text-[11px] text-muted-foreground">현재 영역 · 후보 block 생성</span>
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

      <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px" aria-label="Reth Payload Builder 개념과 실무 경로">
        {RETH_PAYLOAD_BUILDER_NODES.map((candidate, index) => {
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

export function RethPayloadBuilderMapReturn({
  current,
}: {
  current: RethPayloadBuilderNodeId;
}) {
  const node = getRethPayloadBuilderNode(current);
  return (
    <aside id="return-map" className="not-prose scroll-mt-20 border-y border-border py-5">
      <p className="text-[10px] font-bold text-primary">부모 지도에 반환</p>
      <p className="mt-2 max-w-3xl break-keep text-sm leading-6">
        {node.track === "concept"
          ? "Payload Builder는 forkchoice 요청을 곧바로 canonical block으로 쓰지 않습니다. Parent와 attributes로 job을 만들고, 현재 txpool을 반복해서 실행한 임시 후보 가운데 가장 나은 결과를 payloadId로 조회하게 합니다."
          : "운영 변경은 평균 build 시간만 비교해서 결정하지 않습니다. 같은 parent·attributes·거래와 장애 일정을 재생해 payload·receipt·실패 결과와 rollback을 먼저 대조한 뒤 채택 여부를 결정합니다."}
      </p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs">
        <Link to="/cs/blockchain/reth#overview" className="font-bold hover:text-primary">Reth 전체 구조로 돌아가기 ↗</Link>
        {node.curriculumNext ? <Link to={node.curriculumNext.href} className="hover:text-primary">다음 글 · {node.curriculumNext.label} ↗</Link> : null}
      </div>
    </aside>
  );
}
