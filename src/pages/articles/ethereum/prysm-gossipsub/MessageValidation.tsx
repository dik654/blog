import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function MessageValidation({ onCodeRef }: Props) {
  return (
    <section id="message-validation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메시지 검증 파이프라인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Gossip으로 받은 block과 attestation은 topic별 validation rule을 통과한 뒤에만 mesh의 다른 peer로 전파됩니다. Validator는 결과를 accept, ignore 또는 reject로 구분해 local processing 여부와 sender score에 서로 다른 영향을 줍니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef(
                "validate-block-pubsub",
                codeRefs["validate-block-pubsub"],
              )
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            validateBeaconBlockPubSub()
          </span>
        </div>

        {/* ── beacon_block validation ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          beacon_block 검증 — spec 정의 규칙
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">
              consensus-specs 정의 — beacon_block gossip validation 6조건
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">
                  1
                </span>
                <div className="text-foreground/80">
                  <strong>slot 범위</strong> —{" "}
                  <code>current_slot +/- MAXIMUM_GOSSIP_CLOCK_DISPARITY</code>
                  (500ms)
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">
                  2
                </span>
                <div className="text-foreground/80">
                  <strong>유일성</strong> — <code>(slot, proposer_index)</code>{" "}
                  쌍 미처리 확인. 중복 → Ignore
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">
                  3
                </span>
                <div className="text-foreground/80">
                  <strong>finality</strong> — <code>parent_root</code> 조상이
                  finalized checkpoint와 일치
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">
                  4
                </span>
                <div className="text-foreground/80">
                  <strong>제안자 일치</strong> — <code>proposer_index</code>가
                  해당 slot 예상 proposer와 일치
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-red-500/50 pl-3">
                <span className="font-mono text-xs text-red-400 shrink-0">
                  5
                </span>
                <div className="text-foreground/80">
                  <strong>서명 검증</strong> — <code>block.signature</code>가
                  proposer BLS public key로 검증 가능
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-cyan-500/50 pl-3">
                <span className="font-mono text-xs text-cyan-500 shrink-0">
                  6
                </span>
                <div className="text-foreground/80">
                  <strong>부모 존재</strong> — <code>parent_root</code>가
                  store에 이미 존재
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              <code>validateBeaconBlockPubSub()</code> — Prysm 구현
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span>
                slot 과거/미래 → <code>ValidationIgnore</code>
              </span>
              <span>
                중복 (slot, proposer) → <code>ValidationIgnore</code>
              </span>
              <span>
                finality 불일치 → <code>ValidationReject</code>
              </span>
              <span>
                proposer/signature/parent 실패 → <code>ValidationReject</code>
              </span>
            </div>
            <p className="text-xs text-foreground/60 mt-2">
              모두 통과 → <code>ValidationAccept</code>
            </p>
          </div>
        </div>
        <p>
          Beacon-block gossip rule은 fork digest, topic과 object 일치, propagation range, proposer index·signature, parent availability와 state-transition precondition을 단계적으로 확인합니다. 허용할 clock disparity와 propagation range는 현재 consensus specification과 client configuration에서 읽어야 하며, 이미 본 <code>(slot, proposer)</code> 조합은 duplicate proposal이나 equivocation 경로로 구분합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">검증 단계</h3>
        <ul>
          <li>
            <strong>SSZ-Snappy 디코딩</strong> — 포맷 오류 시 Reject
          </li>
          <li>
            <strong>슬롯 범위</strong> — 너무 오래된 블록은 Ignore
          </li>
          <li>
            <strong>서명 검증</strong> — BLS 서명 무효 시 Reject
          </li>
          <li>
            <strong>부모 존재</strong> — 부모 미확인 시 Ignore (나중에 재시도)
          </li>
          <li>
            <strong>제안자 인덱스</strong> — 해당 슬롯 예상 제안자와 불일치 시
            Reject
          </li>
          <li>
            <strong>이중 제안</strong> — 같은 슬롯에 이미 제안 확인 시 Ignore
          </li>
        </ul>

        {/* ── attestation validation ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          beacon_attestation 검증 — 더 엄격
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">
              <code>validateBeaconAttestationPubSub()</code> — 7단계 검증
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">
                  1
                </span>
                <div className="text-foreground/80">
                  <strong>subnet 일치</strong> —{" "}
                  <code>getSubnet(att.data)</code> != topic subnet → Reject
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">
                  2
                </span>
                <div className="text-foreground/80">
                  <strong>slot 체크</strong> — attestation이{" "}
                  <code>SLOTS_PER_EPOCH</code> 내인지 확인. 범위 외 → Ignore
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">
                  3
                </span>
                <div className="text-foreground/80">
                  <strong>단일 서명</strong> —{" "}
                  <code>popcount(aggregation_bits) == 1</code> 확인. 집계된 건
                  Reject
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">
                  4
                </span>
                <div className="text-foreground/80">
                  <strong>committee_index 유효성</strong> — 범위 초과 시 Reject
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-yellow-500/50 pl-3">
                <span className="font-mono text-xs text-yellow-500 shrink-0">
                  5
                </span>
                <div className="text-foreground/80">
                  <strong>중복 attestation</strong> — 동일{" "}
                  <code>(slot, validator_idx)</code> 이미 확인 → Ignore
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-red-500/50 pl-3">
                <span className="font-mono text-xs text-red-400 shrink-0">
                  6
                </span>
                <div className="text-foreground/80">
                  <strong>서명 검증</strong> — 단일 validator,{" "}
                  <code>FastAggregateVerify</code> 불필요. 실패 → Reject
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-cyan-500/50 pl-3">
                <span className="font-mono text-xs text-cyan-500 shrink-0">
                  7
                </span>
                <div className="text-foreground/80">
                  <strong>LMD-GHOST vote 일관성</strong> —{" "}
                  <code>isValidTarget(att.data.target)</code> 확인. 불일치 →
                  Reject
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              message volume
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              signature batch
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              queue backpressure
            </div>
          </div>
        </div>
        <p>
          Attestation은 subnet·committee index, target epoch, aggregation bits와 BLS signature처럼 block과 다른 validation rule을 갖고 message volume도 큽니다. Client는 값싼 topic·range·duplicate check를 먼저 수행하고 signature check를 batching·parallelism에 적합한 경로로 보내지만, 단계 수와 per-slot volume을 고정 상수로 가정해서는 안 됩니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 Reject vs Ignore 차이</strong> — Reject은 피어 점수를
          invalid message로 판단해 sender score에 penalty를 줄 수 있고, ignore는 현재 node가 처리·전파하지 않되 악성이라고 단정하지 않는 결과입니다. Unknown parent나 duplicate처럼 context에 따라 정상일 수 있는 경우를 ignore로 분리해 false penalty를 줄입니다.
        </p>
      </div>
    </section>
  );
}
