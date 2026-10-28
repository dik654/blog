import { Link } from "react-router-dom";
import {
  RAILGUN_NODES,
  getRailgunNode,
  getRailgunTrackNodes,
  type RailgunNodeId,
  type RailgunTrack,
} from "@/content/railgun-learning-tree";

const TRACK_LABEL: Record<RailgunTrack, string> = {
  concept: "개념",
  practice: "실무",
  reference: "참고",
};

export default function RailgunLocator({ current }: { current: RailgunNodeId }) {
  const node = getRailgunNode(current);
  const track = getRailgunTrackNodes(node.track);
  const currentIndex = track.findIndex((candidate) => candidate.id === current);
  const previous = currentIndex > 0 ? track[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < track.length - 1 ? track[currentIndex + 1] : undefined;

  return (
    <aside
      id="railgun-map"
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="RAILGUN 학습 지도에서 현재 글의 위치"
      data-railgun-track={node.track}
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/blockchain" className="hover:text-primary">블록체인</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/blockchain#eth-privacy" className="hover:text-primary">프라이버시</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">{node.shortTitle}</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">{TRACK_LABEL[node.track]}</span>
            <span className="text-[11px] text-muted-foreground">현재 영역 · 비공개 note 상태 전이</span>
          </div>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">{node.question}</p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link to={node.parentHref} className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">{node.parentLabel} ↗</Link>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px" aria-label="RAILGUN 개념과 실무 경로">
        {RAILGUN_NODES.map((candidate, index) => {
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

      {node.anchors && (
        <div className="mt-5">
          <p className="text-[10px] font-bold text-muted-foreground">이 실무 글이 사용하는 개념 앵커</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {node.anchors.map((anchor) => (
              <Link key={anchor.href} to={anchor.href} className="border border-border px-2 py-1 text-[10px] leading-4 hover:border-primary hover:text-primary">{anchor.label}</Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-[11px]">
        <div>{previous && <Link to={previous.href} className="hover:text-primary">← 같은 트랙 · {previous.shortTitle}</Link>}</div>
        <div>{next && <Link to={next.href} className="hover:text-primary">같은 트랙 · {next.shortTitle} →</Link>}</div>
      </div>
    </aside>
  );
}

export function RailgunMapReturn({ current }: { current: RailgunNodeId }) {
  const node = getRailgunNode(current);
  return (
    <section id="return-map" className="scroll-mt-20 border-y border-border py-6">
      <p className="text-xs font-bold text-primary">부모 지도에 돌려줄 사실</p>
      <p className="mt-2 break-keep text-base font-bold leading-7">
        {current === "railgun"
          ? "RAILGUN의 비공개 송금은 proof 하나가 아니라 note commitment tree, 회로의 비공개 관계, 공개 nullifier와 계약의 원자적 상태 전이가 맞물려야 성립합니다. Broadcaster는 제출자이지 잔액이나 spent 상태의 소유자가 아닙니다."
          : "계약·회로·키·engine 변경은 같은 기존 note와 부정 입력에서 state root·nullifier·commitment·wallet 잔액이 기준선과 같고, 되돌린 client가 현재 on-chain 상태를 다시 읽을 수 있을 때만 채택할 수 있습니다."}
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <Link to={node.parentHref} className="font-bold text-primary hover:underline">직속 부모로 돌아가기 ↗</Link>
        {node.curriculumPrevious && <Link to={node.curriculumPrevious.href} className="text-muted-foreground hover:text-primary">← {node.curriculumPrevious.label}</Link>}
        {node.curriculumNext && <Link to={node.curriculumNext.href} className="text-muted-foreground hover:text-primary">{node.curriculumNext.label} →</Link>}
      </div>
    </section>
  );
}
