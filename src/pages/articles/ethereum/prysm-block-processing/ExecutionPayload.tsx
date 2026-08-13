import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function ExecutionPayload({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="execution-payload" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Execution payload handler는 consensus state와 EL 판정을 같은 block에 결합한다</h2>
      <div className="not-prose mb-5 flex flex-wrap items-center gap-3"><CodeViewButton onClick={() => onCodeRef("execution-payload", codeRefs["execution-payload"])} /><span className="text-xs text-muted-foreground">Prysm execution payload 처리 seam</span></div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Consensus state는 이전 execution payload header를 기억합니다. 새 payload의 parent hash, timestamp, prevRandao와 withdrawals·blob·execution requests 같은 fork별 commitment가 beacon block context와 일치해야 하며, transaction/EVM validity는 Engine API로 execution client에 묻습니다. CL의 local field check와 EL의 payload status를 한 boolean으로 줄이면 어느 소유자가 무엇을 거절했는지 사라집니다.</p>
        <h3>세 가지 실패를 나눕니다</h3>
        <ul><li><strong>Consensus-context mismatch:</strong> parent hash·timestamp·prevRandao·withdrawals 등이 state와 다릅니다.</li><li><strong>Engine INVALID:</strong> execution rule이나 fork-specific commitment를 위반했고 latestValidHash로 invalid suffix를 조정해야 합니다.</li><li><strong>Engine SYNCING:</strong> data 부족으로 아직 판정하지 못했으며 optimistic marker가 필요합니다.</li></ul>
        <h3>Post-state root는 optimistic status의 의미를 숨기면 안 됩니다</h3>
        <p>SYNCING response에서 consensus fields를 적용한 candidate state를 계산할 수 있더라도 execution validity가 확정됐다는 뜻은 아닙니다. State/block record에 execution optimistic flag와 payload hash를 연결하고 나중의 VALID/INVALID response가 어떤 cached state·fork-choice descendant를 확정하거나 무효화하는지 추적합니다.</p>
        <h3>Release gate는 official vector와 adversarial EL fixture를 함께 씁니다</h3>
        <p>같은 pre-state, fork, signed block, Engine responses를 base와 candidate에 주고 wrong parent·timestamp·RANDAO, oversized operation, invalid signature, post-state-root mismatch, VALID/SYNCING/INVALID 전환과 crash/restart를 반복합니다. Reject reason·post-state bytes/root·execution optimistic marker가 같아야 하며 성능은 그 다음입니다.</p>
      </div>
      <div id="paper-prysm-block-source" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"><p className="text-xs font-bold text-primary">공식 구현 읽기 · Prysm block processing</p><p className="mt-2 text-sm font-semibold">OffchainLabs/prysm source repository</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Executable consensus rule이 선택한 Prysm release의 state transition, cache와 Engine seam에 어떻게 대응하는지 확인합니다. Repository의 moving master나 함수 개수를 protocol의 영구 순서로 일반화하지 않습니다.</p><a href="https://github.com/OffchainLabs/prysm" target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">Prysm 공식 source 보기</a></div>
    </section>
  );
}
