import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function ValidatorApi(_props: Props) {
  return (
    <section id="validator-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Validator API</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── Validator ↔ Beacon-chain 통신 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          Validator Workflow — 매 epoch
        </h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              Epoch 시작: <code>GetDuties(epoch)</code>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded border p-2">
                <p className="font-medium mb-1">AttesterDuty</p>
                <div className="text-muted-foreground space-y-0.5">
                  <p>
                    <code>pubkey</code>, <code>validator_index</code>
                  </p>
                  <p>
                    <code>committee_index</code>, <code>committee_length</code>
                  </p>
                  <p>
                    <code>committees_at_slot</code>,{" "}
                    <code>validator_committee_index</code>
                  </p>
                  <p>
                    <code>slot</code>
                  </p>
                </div>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium mb-1">ProposerDuty</p>
                <div className="text-muted-foreground space-y-0.5">
                  <p>
                    <code>pubkey</code>, <code>validator_index</code>
                  </p>
                  <p>
                    <code>slot</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Attester 흐름</h4>
              <div className="grid gap-1.5 text-xs text-muted-foreground">
                <div className="flex min-w-0 flex-wrap gap-2">
                  <span className="font-mono font-medium shrink-0 w-4">2</span>
                  <code className="break-all">
                    GetAttestationData(slot, committee_index)
                  </code>
                </div>
                <div className="flex min-w-0 flex-wrap gap-2">
                  <span className="font-mono font-medium shrink-0 w-4">3</span>
                  Attestation 서명 (validator 측)
                </div>
                <div className="flex min-w-0 flex-wrap gap-2">
                  <span className="font-mono font-medium shrink-0 w-4">4</span>
                  <code className="break-all">ProposeAttestation(att)</code> →{" "}
                  <code className="break-all">
                    /eth/v1/beacon/pool/attestations
                  </code>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Proposer 흐름</h4>
              <div className="grid gap-1.5 text-xs text-muted-foreground">
                <div className="flex min-w-0 flex-wrap gap-2">
                  <span className="font-mono font-medium shrink-0 w-4">2</span>
                  <code className="break-all">GetBeaconBlock(slot)</code> →{" "}
                  <code className="break-all">
                    /eth/v3/validator/blocks/{"{slot}"}
                  </code>
                </div>
                <div className="flex min-w-0 flex-wrap gap-2">
                  <span className="font-mono font-medium shrink-0 w-4">3</span>
                  Block 서명 (validator 측)
                </div>
                <div className="flex min-w-0 flex-wrap gap-2">
                  <span className="font-mono font-medium shrink-0 w-4">4</span>
                  <code className="break-all">ProposeBlock(block)</code> →{" "}
                  <code className="break-all">/eth/v1/beacon/blocks</code>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">호출 시점</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
              <span>Duty: epoch 전 prefetch·reorg 시 갱신</span>
              <span>Attestation: 배정된 slot</span>
              <span>Proposal: proposer duty slot</span>
              <span>Aggregation: selection proof 통과 시</span>
            </div>
          </div>
        </div>
        <p>
          Validator client는 epoch 경계에서 duty를 갱신하고 각 slot의 attestation·aggregation·block proposal deadline에 맞춰 beacon node API를 호출합니다. Prysm 내부 gRPC와 표준 Beacon REST API의 method 이름은 다르지만, duty 조회 → unsigned object 생성 → local key 서명 → signed object 제출이라는 lifecycle은 같습니다. 12-second slot 안에서도 준비·gossip deadline이 더 촘촘하므로 평균 latency보다 tail latency가 중요합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">의무 조회</h3>
        <p>
          <code>GetDuties(epoch)</code> — 해당 에폭의
          attestation·proposal·sync committee duty를 반환합니다. Validator client는 epoch 시작 전에 가능한 duty를 prefetch하고 dependent root가 바뀌는 reorg 상황에서는 필요한 duty를 다시 확인해 slot별 scheduler를 갱신합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 제안</h3>
        <p>
          <code>GetBeaconBlock(slot)</code> 계열 호출은 proposer가 서명할 unsigned beacon block을 요청합니다. Beacon node는 operation pool의 항목과 execution payload를 조립하며, validator가 제공한 RANDAO reveal과 graffiti 같은 input도 함께 반영합니다. Builder를 사용할 때는 blinded block 경로가 별도로 선택될 수 있습니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">어테스테이션 제출</h3>
        <p>
          <code>ProposeAttestation</code> 계열 호출로 signed attestation을 제출하면 beacon node가 signature와 consensus condition을 검증한 뒤 해당 subnet에 gossip합니다. 제출 성공은 즉시 block inclusion을 보장하지 않으므로 validator monitoring은 publish result와 이후 inclusion result를 구분해야 합니다.
        </p>

        {/* ── Event streaming ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Event Streaming — Server-Sent Events
        </h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              <code>GET /eth/v1/events?topics=...</code> — Server-Sent Events
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <span className="rounded bg-muted px-2 py-1 text-muted-foreground">
                head
              </span>
              <span className="rounded bg-muted px-2 py-1 text-muted-foreground">
                block
              </span>
              <span className="rounded bg-muted px-2 py-1 text-muted-foreground">
                attestation
              </span>
              <span className="rounded bg-muted px-2 py-1 text-muted-foreground">
                voluntary_exit
              </span>
              <span className="rounded bg-muted px-2 py-1 text-muted-foreground">
                finalized_checkpoint
              </span>
              <span className="rounded bg-muted px-2 py-1 text-muted-foreground">
                chain_reorg
              </span>
              <span className="rounded bg-muted px-2 py-1 text-muted-foreground">
                contribution_and_proof
              </span>
              <span className="rounded bg-muted px-2 py-1 text-muted-foreground">
                payload_attributes
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">SSE 응답 포맷</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  <code>event: head</code>
                </p>
                <p>
                  <code>
                    {'data: {"slot":"4500000","block":"0x...","state":"0x..."}'}
                  </code>
                </p>
                <p className="pt-1">
                  <code>event: finalized_checkpoint</code>
                </p>
                <p>
                  <code>
                    {'data: {"block":"0x...","state":"0x...","epoch":"140624"}'}
                  </code>
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">사용처</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>Dashboard (실시간 모니터링)</li>
                <li>Block explorer (실시간 업데이트)</li>
                <li>Alerting systems (finality 지연 등)</li>
                <li>Bot / Bridge (새 block 감지)</li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          표준 event endpoint는 SSE로 head, finalized checkpoint와 chain reorg 같은 topic을 stream합니다. Dashboard와 explorer는 polling을 줄일 수 있지만 event stream만 durable log로 간주해서는 안 되며, 연결이 끊긴 구간은 canonical API query로 다시 확인해야 합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 검증자 워크플로우</strong> — 에폭 시작 → GetDuties → 슬롯별
          scheduler를 만듭니다. Proposal duty에서는 unsigned block을 받아 서명한 뒤 publish하고, attestation duty에서는 attestation data를 받아 서명한 뒤 제출합니다. 실제 deployment에서는 표준 REST endpoint와 Prysm gRPC 중 사용 중인 interface 이름을 기준으로 mapping해야 합니다.
        </p>
      </div>
    </section>
  );
}
