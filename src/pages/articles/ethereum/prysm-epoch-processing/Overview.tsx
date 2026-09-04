import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import EpochPipelineViz from "./viz/EpochPipelineViz";

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Epoch processing은 누적 vote를 finality·balance·validator lifecycle로 정산한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
            Slot마다 block이 없더라도 BeaconState는 앞으로 진행합니다. 다음 slot이 epoch 경계에 닿으면 Prysm은 지난 epoch 동안 모은
            participation evidence를 읽어 checkpoint를 갱신하고 reward·penalty를 계산합니다. 이어서
            activation·exit·slashing·pending queue를 처리한 뒤 다음 epoch에 필요한 순환 state를 준비합니다.
          </p>
        <p>이 글은 함수 이름 목록보다 <strong>evidence 집계 → finality → 회계 → membership → rotation/lookahead</strong>의 dependency를 추적합니다. Epoch는 mainnet preset에서 32 slots이므로 12초 slot을 가정하면 약 6.4분이지만, 값은 network preset과 fork receipt에 고정해야 합니다.</p>
      </div>
      <ContentBoundary article="prysm-epoch-processing" />
      <ContextViz />
      <EpochPipelineViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>경계는 다음 slot을 처리하기 직전에 옵니다</h3>
        <p><code>process_slots</code>는 현재 state slot을 한 칸씩 진행하며 <code>(state.slot + 1) % SLOTS_PER_EPOCH == 0</code>인 지점에서 <code>process_epoch</code>를 실행합니다. Slot 63 state가 다음 slot 64로 가는 경우 64/32=2이므로 epoch 1의 누적 evidence를 정산한 뒤 state slot을 64로 올립니다.</p>
        <h3>순서는 포크별 executable spec이 소유합니다</h3>
        <p>Altair는 inactivity score·participation flag·sync committee를 추가했고, Electra는 pending deposits와 consolidations를, Fulu는 proposer lookahead를 epoch pipeline에 넣었습니다. 따라서 “항상 7단계” 같은 고정 설명보다 사용한 consensus-spec release·fork의 <code>process_epoch</code> 호출 순서를 provenance로 남깁니다.</p>
        <p>Checkpoint와 head의 차이는 <Link to="/blockchain/prysm">Prysm 전체 지도</Link>, BeaconState schema는 <Link to="/blockchain/prysm-beacon-state">상태 정본</Link>, validator의 서명 권한은 <Link to="/blockchain/prysm-validator-client">validator client</Link>에서 확장합니다.</p>
      </div>
      <div id="paper-consensus-epoch-transition" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"><p className="text-xs font-bold text-primary">공식 규격 읽기 · epoch transition</p><p className="mt-2 text-sm font-semibold">Ethereum Consensus Specifications v1.6.1 · Altair, Electra, Fulu</p><p className="mt-2 text-sm leading-6 text-muted-foreground">
            누적 participation과 validator queue를 모든 client가 같은 ordered state transition으로 정산하는 일이 문제의 핵심입니다. 규격이
            주는 것은 함수·상수·reference test까지이고 Prysm의 cache·parallelization·latency는 규격 밖입니다. 이 글은 v1.6.1 stable
            fork를 고정했으며 unstable fork 초안을 현재 mainnet behavior로 확대하지 않습니다.
          </p><a href="https://github.com/ethereum/consensus-specs/tree/v1.6.1/specs" target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">고정한 consensus specs 보기</a></div>
    </section>
  );
}
