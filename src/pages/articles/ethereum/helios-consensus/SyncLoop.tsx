import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";

interface Props { title: string; onCodeRef: (key: string, ref: CodeRef) => void }

export default function SyncLoop({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="sync-loop" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}: fetch·validate·rank·apply·persist를 분리한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Sync loop는 “12초마다 덮어쓰기”가 아닙니다. New update event나 polling schedule에서 후보를 받고, current slot을 다시 계산해
          validate한 뒤, 기존 best-valid update와 participation·relevance·finality 조건으로 비교합니다. 채택할 때는 optimistic header,
          finalized header, current/next committee와 participation counters를 하나의 새 store generation으로 적용합니다.
        </p>
        <h3>실패해도 마지막 검증 상태를 유지합니다</h3>
        <p>
          Endpoint timeout은 backoff/failover할 수 있지만 invalid signature·wrong branch·future slot은 같은 payload를 다른 endpoint에서 받아도
          valid가 되지 않습니다. Persist 응답이 timeout으로 끝나 commit 여부가 불명확하면 generation과 update root로 재조회해 이미 적용됐는지
          조정하고, 같은 update를 두 번 누적하지 않습니다. Local clock이 크게 어긋나면 future/stale 판정이 모두 흔들리므로 fail-closed
          상태와 clock diagnostic을 분리합니다.
        </p>
        <h3>Release gate</h3>
        <p>
          341/342 참여 경계, wrong bit/public-key binding, wrong domain, finality/committee branch 변경, slot 8,191/8,192 전환, reorg,
          endpoint failover, persist 전후 crash와 restart를 pinned spec fixture로 재생합니다. Base와 candidate의 accept/reject reason,
          optimistic/finalized roots, committee period와 generation이 같아야 하며 그 뒤에 BLS latency·sync lag·RPC availability를 비교합니다.
        </p>
      </div>
      <div id="paper-helios-consensus-source" className="scroll-mt-24">
        <CitationBlock source="a16z/helios source snapshot 43a8c9f — Ethereum consensus client" href="https://github.com/a16z/helios/tree/43a8c9f3cdda41a6f383c4db41d9a83f102638b1/ethereum" citeKey={1} type="code">
          문제: Portable client에서 Ethereum light-client update를 가져오고 적용하는 구현 경계. 기여: 선택한 SHA의 consensus RPC·store·sync
          integration을 제공합니다. 전제: SHA·features·network config·provider를 고정합니다. 근거 범위: 해당 snapshot의 함수와 error behavior입니다.
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
          문제: Consensus object signature를 chain·fork·duty에 결속하는 문제. 기여: signing root·domain과 fork별 verification 호출의 protocol
          context를 제공합니다. 전제: 정확한 fork version·genesis validators root·BLS ciphersuite입니다. 근거 범위: Ethereum consensus signature
          semantics입니다. 주장하지 않는 것: BLS validity가 finality branch·execution state validity를 대신하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
