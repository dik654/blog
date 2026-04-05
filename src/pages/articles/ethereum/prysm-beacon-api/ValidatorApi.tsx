import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ValidatorApi(_props: Props) {
  return (
    <section id="validator-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Validator API</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Validator ↔ Beacon-chain 통신 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Validator Workflow — 매 epoch</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Validator 클라이언트의 epoch 워크플로우

// Epoch 시작:
// 1. GetDuties(epoch)
//    - 이번 epoch의 attester/proposer/sync duty 조회
//    - 대응: /eth/v1/validator/duties/attester/{epoch}
//
// 각 duty 담긴 정보:
// AttesterDuty {
//     pubkey: ValidatorPubkey,
//     validator_index: ValidatorIndex,
//     committee_index: CommitteeIndex,
//     committee_length: uint64,
//     committees_at_slot: uint64,
//     validator_committee_index: uint64,
//     slot: Slot,
// }
//
// ProposerDuty {
//     pubkey: ValidatorPubkey,
//     validator_index: ValidatorIndex,
//     slot: Slot,
// }

// Slot N (attester duty 있는 경우):
// 2. GetAttestationData(slot, committee_index)
//    - 현재 head + checkpoint 반환
//    - 대응: /eth/v1/validator/attestation_data
//
// 3. Attestation 서명 (validator 측)
//
// 4. ProposeAttestation(att)
//    - 서명된 attestation 제출
//    - 대응: /eth/v1/beacon/pool/attestations

// Slot N (proposer duty 있는 경우):
// 2. GetBeaconBlock(slot)
//    - 비콘 블록 템플릿 반환
//    - 대응: /eth/v3/validator/blocks/{slot}
//
// 3. Block 서명 (validator 측)
//
// 4. ProposeBlock(block)
//    - SignedBeaconBlock 제출
//    - 대응: /eth/v1/beacon/blocks

// Aggregator duty:
// 5. GetAggregateAttestation(att_data)
//    - subnet 내 aggregated attestation 반환
// 6. SubmitAggregateAndProof(aggregate)

// 통신 빈도:
// - 매 epoch GetDuties 1회
// - 매 slot attestation duty 수행 (~slot당 1회)
// - proposer는 수백 slot당 1회
// - aggregator는 confirming ~1/16`}
        </pre>
        <p className="leading-7">
          Validator의 <strong>API 호출 패턴</strong>이 epoch/slot 주기적 동작.<br />
          매 epoch GetDuties → slot별 attestation/block 수행.<br />
          gRPC 저지연 통신 필수 (slot 12초 제약).
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">의무 조회</h3>
        <p className="leading-7">
          <code>GetDuties(epoch)</code> — 해당 에폭의 어테스테이션·제안·싱크위원회 의무를 반환한다.<br />
          검증자 클라이언트는 에폭 시작 시 의무를 가져와 슬롯별 스케줄링.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 제안</h3>
        <p className="leading-7">
          <code>GetBeaconBlock(slot)</code> — 비콘 블록 템플릿을 요청한다.<br />
          비콘 노드가 어테스테이션 풀, 실행 페이로드, RANDAO reveal을 조립하여 반환.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">어테스테이션 제출</h3>
        <p className="leading-7">
          <code>ProposeAttestation(att)</code> — 서명된 어테스테이션을 제출한다.<br />
          비콘 노드는 유효성 검증 후 서브넷에 gossip 전파.
        </p>

        {/* ── Event streaming ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Event Streaming — Server-Sent Events</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GET /eth/v1/events?topics=head,block,finalized_checkpoint
// Server-Sent Events (SSE) 스트림
// 클라이언트가 실시간으로 이벤트 수신

// 지원 topics:
// - head: 새 head block
// - block: 새 block 수신
// - attestation: 새 attestation
// - voluntary_exit
// - finalized_checkpoint: finalized 갱신
// - chain_reorg: reorg 발생
// - contribution_and_proof: sync committee contribution
// - payload_attributes: block building 시작

// Response format (SSE):
// event: head
// data: {"slot":"4500000","block":"0x...","state":"0x...",...}
//
// event: finalized_checkpoint
// data: {"block":"0x...","state":"0x...","epoch":"140624"}

// 클라이언트 예시 (JavaScript):
const events = new EventSource(
    "/eth/v1/events?topics=head,finalized_checkpoint"
);
events.addEventListener("head", (e) => {
    const data = JSON.parse(e.data);
    console.log("New head:", data.block);
});

// 사용처:
// - Dashboard (실시간 모니터링)
// - Block explorer (실시간 업데이트)
// - Alerting systems (finality 지연 등)
// - Bot/Bridge (새 block 감지)`}
        </pre>
        <p className="leading-7">
          <strong>Event streaming</strong>이 실시간 이벤트 구독 API.<br />
          SSE로 head/finalized/reorg 등 주요 이벤트 수신.<br />
          Dashboard, explorer, bridge 등 실시간 도구의 핵심 API.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 검증자 워크플로우</strong> — 에폭 시작 → GetDuties → 슬롯별 스케줄.<br />
          제안 슬롯: GetBeaconBlock → 서명 → ProposeBlock.<br />
          어테스테이션 슬롯: GetAttestationData → 서명 → ProposeAttestation.
        </p>
      </div>
    </section>
  );
}
