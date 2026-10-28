import { Link } from "react-router-dom";
import {
  HELIOS_NODES,
  getHeliosNode,
  type HeliosNodeId,
  type HeliosTrack,
} from "@/content/helios-learning-tree";

const TRACK_LABEL: Record<HeliosTrack, string> = {
  concept: "개념",
  practice: "실무",
  reference: "참고",
};

const REGION_LABEL = {
  whole: "전체",
  consensus: "Consensus",
  execution: "Execution",
  evidence: "증거 형식",
  operations: "운영",
} as const;

export default function HeliosLocator({ current }: { current: HeliosNodeId }) {
  const node = getHeliosNode(current);

  return (
    <aside
      id="helios-map"
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="Helios 학습 지도에서 현재 글의 위치"
      data-helios-track={node.track}
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/blockchain" className="hover:text-primary">블록체인</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/blockchain#eth-helios" className="hover:text-primary">Ethereum Light client</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">{node.shortTitle}</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">{TRACK_LABEL[node.track]}</span>
            <span className="text-[11px] text-muted-foreground">현재 영역 · {REGION_LABEL[node.region]}</span>
          </div>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">{node.question}</p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link to={node.parentHref} className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">{node.parentLabel} ↗</Link>
        </div>
      </div>

      <div className="mt-5 grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Helios 개념·참고·실무 경로">
        {HELIOS_NODES.map((candidate, index) => {
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
    </aside>
  );
}

export function HeliosMapReturn({ current }: { current: HeliosNodeId }) {
  const node = getHeliosNode(current);
  const fact = current === "helios"
    ? "Helios는 먼저 checkpoint에서 검증한 consensus block을 유지합니다. 잔액 요청이 오면 그 block hash에 맞춘 account proof를 받아 execution state root와 대조합니다. 따라서 endpoint의 응답과 검증된 block identity가 섞이면 전체 결과를 거절해야 합니다."
    : current === "helios-bootstrap"
      ? "Checkpoint C 자체는 protocol 밖에서 고른 신뢰 입력입니다. Helios는 HTR(H)=C와 Fold(HTR(K),B)=H.state_root를 모두 확인한 뒤에만 H와 K로 LightClientStore S1을 만듭니다. 따라서 HTTP 성공이나 decode 성공은 Store를 바꾸는 근거가 아닙니다."
      : current === "helios-consensus"
        ? "Helios는 Store의 current·next committee로 update의 시간·period·Merkle branch·BLS signature를 먼저 검증합니다. 그 뒤 2/3 참여와 더 새로운 finality를 따로 확인해 optimistic·finalized header와 committee를 바꿉니다. 따라서 유효한 signature 하나가 곧 finalized Store를 뜻하지는 않습니다."
      : current === "helios-update"
        ? "검증된 update는 먼저 best 후보와 참여 최댓값을 남기고, safety threshold와 2/3 gate를 따로 적용해 optimistic·finalized header를 전진시킵니다. Finalized period가 바뀔 때만 증명된 next committee를 current로 넘깁니다. 따라서 Store 변경은 하나의 Boolean이나 전체 덮어쓰기가 아니라 조건별 field transition입니다."
      : current === "helios-state"
        ? "Helios는 선택한 block H의 header hash로 eth_getProof를 고정하고, header의 state root R에서 account를 먼저 검증합니다. 그 account가 묶은 storage root에서 slot proof를 다시 확인한 뒤에만 값을 반환·저장합니다. 따라서 RPC 응답 성공이나 오래된 valid proof만으로 현재 조회에 답할 수 없습니다."
      : "이 글에서 확인한 결과는 Helios 전체 지도의 해당 영역으로 돌아갑니다. 직속 부모에서 같은 block·root·request identity가 유지되는지 확인해야 다음 경로로 넘어갈 수 있습니다.";

  return (
    <section id="return-map" className="scroll-mt-20 border-y border-border py-6">
      <p className="text-xs font-bold text-primary">부모 지도에 돌려줄 사실</p>
      <p className="mt-2 break-keep text-base font-bold leading-7">{fact}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <Link to={node.parentHref} className="font-bold text-primary hover:underline">직속 부모로 돌아가기 ↗</Link>
        {node.curriculumPrevious && <Link to={node.curriculumPrevious.href} className="text-muted-foreground hover:text-primary">← {node.curriculumPrevious.label}</Link>}
        {node.curriculumNext && <Link to={node.curriculumNext.href} className="text-muted-foreground hover:text-primary">{node.curriculumNext.label} →</Link>}
      </div>
    </section>
  );
}
