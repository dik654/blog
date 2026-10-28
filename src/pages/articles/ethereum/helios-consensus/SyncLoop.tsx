import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation";
import { codeRefs } from "./codeRefs";

interface Props { title: string; onCodeRef: (key: string, ref: CodeRef) => void }

export default function SyncLoop({ title, onCodeRef }: Props) {
  return (
    <section id="sync-loop" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          처음 동기화할 때 <code>sync</code>는 Store를 초기화하고 checkpoint로 bootstrap한 뒤 update 목록을 차례로 검증·적용합니다. 마지막에
          finality update를 반영하고, 새 checkpoint가 있으면 channel로 알립니다.
        </p>
        <p>
          이미 동기화된 뒤 <code>advance</code>는 finality update를 먼저 검증·적용합니다. Store에 next committee가 없을 때만 현재 period의 update를 하나 더
          요청해 committee를 채우려고 시도합니다.
        </p>
        <h3>이 snapshot은 memory Store를 바꿔 다음 소비자에 알립니다</h3>
        <p>
          확인한 Helios commit <code>43a8c9f3</code>의 <code>LightClientStore</code>는 이 코드 경로에서 memory 구조입니다. 검증된 update가 적용됐다는
          사실을 disk의 원자적 commit이나 process restart 뒤 복구 보장으로 확대해서는 안 됩니다.
        </p>
        <p>
          Endpoint timeout이면 다른 endpoint에 같은 요청을 보낼 수 있습니다. 그러나 invalid signature·wrong branch·future slot은 같은 payload를 다시
          받아도 바뀌지 않습니다. Local clock이 크게 어긋나면 future·stale 판정의 기준 자체가 흔들립니다.
        </p>
        <h3>이 상태 기계에서 확인할 경계</h3>
        <p>
          개념 경계에서는 341/342 참여, bit·public-key 결속, domain, finality·committee branch, slot 8,191/8,192 전환을 구분할 수 있어야 합니다.
          Endpoint failover, crash·restart, disk persistence, latency·availability 임계값은 고정한 환경에서 실험할 실무 문제입니다.
        </p>
      </div>
      <div className="not-prose mt-5">
        <CodeViewButton label="실제 sync·advance 순서 보기" onClick={() => onCodeRef("hl-sync-loop", codeRefs["hl-sync-loop"])} />
      </div>
      <div id="paper-helios-consensus-source" className="scroll-mt-24">
        <CitationBlock source="a16z/helios source snapshot 43a8c9f — Ethereum consensus client" href="https://github.com/a16z/helios/tree/43a8c9f3cdda41a6f383c4db41d9a83f102638b1/ethereum" citeKey={1} type="code">
          문제: Portable client에서 Ethereum light-client update를 가져오고 적용하는 구현 경계. 기여: 선택한 SHA에 consensus RPC·store·sync
          integration이 들어 있습니다. 전제: SHA·features·network config·provider를 고정합니다. 근거 범위: 해당 snapshot의 함수와 error behavior입니다.
          주장하지 않는 것: moving master의 경로, audit 완료, 모든 hardware의 고정 latency를 보장하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-light-client-update-spec" className="scroll-mt-24">
        <CitationBlock source="Ethereum consensus-specs v1.6.1 — Altair light-client sync protocol" href="https://github.com/ethereum/consensus-specs/blob/v1.6.1/specs/altair/light-client/sync-protocol.md" citeKey={2}>
          문제: Resource-limited client가 untrusted updates에서 safe optimistic/finalized header와 committee를 유지하는 문제. 기여:
          validation·ranking·store processing·force-update rules를 executable pseudocode로 정의합니다. 전제: v1.6.1·fork/preset·trusted store를
          고정합니다. 근거 범위: light-client consensus state machine입니다. 주장하지 않는 것: Helios polling·disk durability·execution RPC를 정하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-bls-consensus-dependency" className="scroll-mt-24">
        <CitationBlock source="Ethereum consensus-specs v1.6.1 — BLS and signing domains" href="https://github.com/ethereum/consensus-specs/tree/v1.6.1/specs" citeKey={3}>
          문제: Consensus object signature를 chain·fork·duty에 결속하는 문제. 기여: signing root·domain과 fork별 verification 호출에 필요한 protocol
          context를 정합니다. 전제: 정확한 fork version·genesis validators root·BLS ciphersuite입니다. 근거 범위: Ethereum consensus signature
          semantics입니다. 주장하지 않는 것: BLS validity가 finality branch·execution state validity를 대신하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-sync-committee-selection" className="scroll-mt-24">
        <CitationBlock source="Ethereum consensus-specs v1.6.1 — Altair sync committee selection" href="https://github.com/ethereum/consensus-specs/blob/v1.6.1/specs/altair/beacon-chain.md#get_next_sync_committee_indices" citeKey={4}>
          문제: 고정 크기 sync committee의 position과 public key를 protocol state에서 만드는 문제. 기여: Validator index를 중복 가능하게 뽑고
          같은 순서의 public key 목록을 만드는 절차를 정의합니다. 전제: v1.6.1·Altair 이후 active validator set·network preset입니다. 근거 범위:
          512 position과 distinct validator 수가 다를 수 있는 이유입니다. 주장하지 않는 것: Position 중복을 제거해도 된다는 뜻이 아닙니다.
        </CitationBlock>
      </div>
    </section>
  );
}
