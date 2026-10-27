import { Link } from "react-router-dom";
import {
  RETH_EIP1559_NODES,
  getRethEip1559Node,
  getRethEip1559TrackNodes,
  type RethEip1559NodeId,
  type RethEip1559Track,
} from "@/content/reth-eip1559-learning-tree";

const TRACK_LABEL: Record<RethEip1559Track, string> = {
  concept: "개념",
  practice: "실무",
  reference: "참고",
};

export default function RethEip1559Locator({
  current,
}: {
  current: RethEip1559NodeId;
}) {
  const node = getRethEip1559Node(current);
  const track = getRethEip1559TrackNodes(node.track);
  const currentIndex = track.findIndex((candidate) => candidate.id === current);
  const previous = currentIndex > 0 ? track[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0 && currentIndex < track.length - 1
      ? track[currentIndex + 1]
      : undefined;

  return (
    <aside
      id="reth-eip1559-map"
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="Reth EIP-1559 학습 지도에서 현재 글의 위치"
      data-reth-eip1559-track={node.track}
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/blockchain" className="hover:text-primary">
          블록체인
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/blockchain/reth#overview" className="hover:text-primary">
          Reth 전체 구조
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          {node.shortTitle}
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
              {TRACK_LABEL[node.track]}
            </span>
            <span className="text-[11px] text-muted-foreground">
              현재 영역 · 거래 가격과 블록 검증
            </span>
          </div>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            {node.question}
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">
            직속 부모 지도
          </p>
          <Link
            to={node.parentHref}
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            {node.parentLabel} ↗
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px"
        aria-label="Reth EIP-1559 개념과 실무 경로"
      >
        {RETH_EIP1559_NODES.map((candidate, index) => {
          const active = candidate.id === current;
          return (
            <Link
              key={candidate.id}
              to={candidate.href}
              aria-current={active ? "step" : undefined}
              className={`min-w-0 bg-background px-3 py-3 ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <span className="font-mono text-[9px] font-black text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong className="mt-1 block break-keep text-xs leading-5">
                {candidate.shortTitle}
              </strong>
              <span className="mt-0.5 block text-[9px] font-bold text-primary/80">
                {TRACK_LABEL[candidate.track]}
              </span>
              <span className="mt-1 block break-keep text-[10px] leading-4">
                {candidate.mapLabel}
              </span>
            </Link>
          );
        })}
      </div>

      {node.track === "practice" && node.anchors?.length ? (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-[10px] font-bold text-muted-foreground">
            이 실무 글이 출발하는 개념 앵커
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {node.anchors.map((anchor) => (
              <Link key={anchor.href} to={anchor.href} className="hover:text-primary">
                {anchor.label} ↗
              </Link>
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
        {node.curriculumPrevious ? (
          <Link to={node.curriculumPrevious.href} className="hover:text-primary">
            ← {node.curriculumPrevious.label}
          </Link>
        ) : <span />}
        {node.curriculumNext ? (
          <Link to={node.curriculumNext.href} className="hover:text-primary">
            {node.curriculumNext.label} →
          </Link>
        ) : <span />}
      </div>
    </aside>
  );
}

export function RethEip1559MapReturn({
  current,
}: {
  current: RethEip1559NodeId;
}) {
  const node = getRethEip1559Node(current);
  return (
    <aside
      id="return-map"
      className="not-prose scroll-mt-20 border-y border-border py-5"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 반환</p>
      <p className="mt-2 max-w-3xl break-keep text-sm leading-6">
        {node.track === "concept"
          ? "EIP-1559는 지갑이 임의로 정하는 수수료가 아니라 parent header에서 다음 base fee를 계산하고, 거래 cap 안에서 tip과 burn을 분리하는 합의 규칙입니다. Reth에서는 ChainSpec과 Alloy 계산, header 검증, TxPool 분류가 같은 값의 서로 다른 소비자입니다."
          : "운영 변경은 한 계산 함수의 단위 테스트로 끝나지 않습니다. 같은 parent·ChainSpec·거래를 payload 작성, header 검증, TxPool 유지 경로에서 재생하고 1 wei까지 같은지 확인한 뒤에만 배포 결정을 내립니다."}
      </p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs">
        <Link to="/cs/blockchain/reth#overview" className="font-bold hover:text-primary">
          Reth 전체 구조로 돌아가기 ↗
        </Link>
        {node.curriculumNext ? (
          <Link to={node.curriculumNext.href} className="hover:text-primary">
            다음 글 · {node.curriculumNext.label} ↗
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
