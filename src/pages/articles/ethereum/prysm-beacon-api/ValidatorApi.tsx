import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ValidatorApi(_props: Props) {
  return (
    <section id="validator-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Validator API</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Validator ↔ Beacon-chain 통신 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Validator Workflow — 매 epoch</h3>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Epoch 시작: <code>GetDuties(epoch)</code></h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded border p-2">
                <p className="font-medium mb-1">AttesterDuty</p>
                <div className="text-muted-foreground space-y-0.5">
                  <p><code>pubkey</code>, <code>validator_index</code></p>
                  <p><code>committee_index</code>, <code>committee_length</code></p>
                  <p><code>committees_at_slot</code>, <code>validator_committee_index</code></p>
                  <p><code>slot</code></p>
                </div>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium mb-1">ProposerDuty</p>
                <div className="text-muted-foreground space-y-0.5">
                  <p><code>pubkey</code>, <code>validator_index</code></p>
                  <p><code>slot</code></p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Attester 흐름</h4>
              <div className="grid gap-1.5 text-xs text-muted-foreground">
                <div className="flex gap-2"><span className="font-mono font-medium shrink-0 w-4">2</span><code>GetAttestationData(slot, committee_index)</code></div>
                <div className="flex gap-2"><span className="font-mono font-medium shrink-0 w-4">3</span>Attestation 서명 (validator 측)</div>
                <div className="flex gap-2"><span className="font-mono font-medium shrink-0 w-4">4</span><code>ProposeAttestation(att)</code> → <code>/eth/v1/beacon/pool/attestations</code></div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">Proposer 흐름</h4>
              <div className="grid gap-1.5 text-xs text-muted-foreground">
                <div className="flex gap-2"><span className="font-mono font-medium shrink-0 w-4">2</span><code>GetBeaconBlock(slot)</code> → <code>/eth/v3/validator/blocks/{'{slot}'}</code></div>
                <div className="flex gap-2"><span className="font-mono font-medium shrink-0 w-4">3</span>Block 서명 (validator 측)</div>
                <div className="flex gap-2"><span className="font-mono font-medium shrink-0 w-4">4</span><code>ProposeBlock(block)</code> → <code>/eth/v1/beacon/blocks</code></div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">통신 빈도</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
              <span>GetDuties: 매 epoch 1회</span>
              <span>Attestation: 매 slot ~1회</span>
              <span>Proposer: 수백 slot당 1회</span>
              <span>Aggregator: ~1/16 확률</span>
            </div>
          </div>
        </div>
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
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code>GET /eth/v1/events?topics=...</code> — Server-Sent Events</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <span className="rounded bg-muted px-2 py-1 text-muted-foreground">head</span>
              <span className="rounded bg-muted px-2 py-1 text-muted-foreground">block</span>
              <span className="rounded bg-muted px-2 py-1 text-muted-foreground">attestation</span>
              <span className="rounded bg-muted px-2 py-1 text-muted-foreground">voluntary_exit</span>
              <span className="rounded bg-muted px-2 py-1 text-muted-foreground">finalized_checkpoint</span>
              <span className="rounded bg-muted px-2 py-1 text-muted-foreground">chain_reorg</span>
              <span className="rounded bg-muted px-2 py-1 text-muted-foreground">contribution_and_proof</span>
              <span className="rounded bg-muted px-2 py-1 text-muted-foreground">payload_attributes</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">SSE 응답 포맷</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><code>event: head</code></p>
                <p><code>{'data: {"slot":"4500000","block":"0x...","state":"0x..."}'}</code></p>
                <p className="pt-1"><code>event: finalized_checkpoint</code></p>
                <p><code>{'data: {"block":"0x...","state":"0x...","epoch":"140624"}'}</code></p>
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
