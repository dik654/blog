import type { CodeRef } from "@/components/code/types";

export default function CheckpointSync({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="checkpoint-sync" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Checkpoint sync는 계산을 생략하는 대신 recent root에 대한 trust를 명시한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Genesis부터 모든 state transition을 재생하면 검증 경로는 길지만 외부 checkpoint 신뢰가 필요 없습니다. Checkpoint sync는
          recent finalized block/state에서 시작해 시간을 줄이는 대신, 그 tuple을 신뢰할 근거와 weak-subjectivity freshness를
          operator가 확인해야 합니다. Download endpoint와 trust source는 같은 역할이 아닙니다.
        </p>

        <h3>Bootstrap 순서</h3>
        <ol>
          <li>독립 경로에서 network·epoch·checkpoint block root와 state root를 얻습니다.</li>
          <li>Checkpoint가 current weak-subjectivity policy 안에 있는지 확인합니다.</li>
          <li>State bytes를 bounded SSZ로 decode하고 hash-tree-root를 약속한 state root와 비교합니다.</li>
          <li>Genesis validators root·fork schema·slot과 checkpoint block을 교차 검증합니다.</li>
          <li>격리된 DB에 anchor를 원자적으로 쓰고 그 이후 range sync를 수행합니다.</li>
          <li>Forward sync와 execution handoff가 안정된 뒤 service를 새 DB로 전환합니다.</li>
        </ol>
        <p>
          예를 들어 checkpoint root는 맞지만 state bytes의 root가 다르면 endpoint corruption 또는 잘못 짝지은 snapshot이므로
          시작하지 않습니다. State root가 맞아도 다른 genesis validators root라면 다른 network이므로 실패합니다. Old DB를 먼저
          덮어쓰지 않아야 검증 실패와 forward-sync 실패 때 rollback할 수 있습니다.
        </p>

        <h3>신뢰를 과장하지 않습니다</h3>
        <p>
          Finalized checkpoint는 consensus safety anchor이지 archive availability, execution state correctness나 provider honesty
          전체를 보장하지 않습니다. Consensus state와 block root를 확인한 뒤 execution client가 같은 chain identity에서 payload를
          검증하는지 별도로 조정합니다. “공식처럼 보이는 URL” 대신 확인한 tuple과 시각, source independence를 receipt에 남깁니다.
        </p>
      </div>
    </section>
  );
}
