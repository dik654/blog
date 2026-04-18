import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function MessageValidation({ onCodeRef }: Props) {
  return (
    <section id="message-validation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메시지 검증 파이프라인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          가십으로 수신된 블록은 6단계 검증을 통과해야 한다.<br />
          검증 결과에 따라 전파·무시·거부를 결정한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('validate-block-pubsub', codeRefs['validate-block-pubsub'])} />
          <span className="text-[10px] text-muted-foreground self-center">validateBeaconBlockPubSub()</span>
        </div>

        {/* ── beacon_block validation ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">beacon_block 검증 — spec 정의 규칙</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">consensus-specs 정의 — beacon_block gossip validation 6조건</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
                <div className="text-foreground/80"><strong>slot 범위</strong> — <code>current_slot +/- MAXIMUM_GOSSIP_CLOCK_DISPARITY</code>(500ms)</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">2</span>
                <div className="text-foreground/80"><strong>유일성</strong> — <code>(slot, proposer_index)</code> 쌍 미처리 확인. 중복 → Ignore</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">3</span>
                <div className="text-foreground/80"><strong>finality</strong> — <code>parent_root</code> 조상이 finalized checkpoint와 일치</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">4</span>
                <div className="text-foreground/80"><strong>제안자 일치</strong> — <code>proposer_index</code>가 해당 slot 예상 proposer와 일치</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-red-500/50 pl-3">
                <span className="font-mono text-xs text-red-400 shrink-0">5</span>
                <div className="text-foreground/80"><strong>서명 검증</strong> — <code>block.signature</code>가 proposer BLS public key로 검증 가능</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-cyan-500/50 pl-3">
                <span className="font-mono text-xs text-cyan-500 shrink-0">6</span>
                <div className="text-foreground/80"><strong>부모 존재</strong> — <code>parent_root</code>가 store에 이미 존재</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2"><code>validateBeaconBlockPubSub()</code> — Prysm 구현</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span>slot 과거/미래 → <code>ValidationIgnore</code></span>
              <span>중복 (slot, proposer) → <code>ValidationIgnore</code></span>
              <span>finality 불일치 → <code>ValidationReject</code></span>
              <span>proposer/signature/parent 실패 → <code>ValidationReject</code></span>
            </div>
            <p className="text-xs text-foreground/60 mt-2">모두 통과 → <code>ValidationAccept</code></p>
          </div>
        </div>
        <p className="leading-7">
          <strong>6단계 검증</strong>을 spec이 정의 — 모든 CL 구현체가 따라야 함.<br />
          slot 체크(±500ms)로 시간 동기화 확인.<br />
          unique (slot, proposer) 체크로 중복 제안 감지.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">검증 단계</h3>
        <ul>
          <li><strong>SSZ-Snappy 디코딩</strong> — 포맷 오류 시 Reject</li>
          <li><strong>슬롯 범위</strong> — 너무 오래된 블록은 Ignore</li>
          <li><strong>서명 검증</strong> — BLS 서명 무효 시 Reject</li>
          <li><strong>부모 존재</strong> — 부모 미확인 시 Ignore (나중에 재시도)</li>
          <li><strong>제안자 인덱스</strong> — 해당 슬롯 예상 제안자와 불일치 시 Reject</li>
          <li><strong>이중 제안</strong> — 같은 슬롯에 이미 제안 확인 시 Ignore</li>
        </ul>

        {/* ── attestation validation ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">beacon_attestation 검증 — 더 엄격</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3"><code>validateBeaconAttestationPubSub()</code> — 7단계 검증</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
                <div className="text-foreground/80"><strong>subnet 일치</strong> — <code>getSubnet(att.data)</code> != topic subnet → Reject</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">2</span>
                <div className="text-foreground/80"><strong>slot 체크</strong> — attestation이 <code>SLOTS_PER_EPOCH</code> 내인지 확인. 범위 외 → Ignore</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">3</span>
                <div className="text-foreground/80"><strong>단일 서명</strong> — <code>popcount(aggregation_bits) == 1</code> 확인. 집계된 건 Reject</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">4</span>
                <div className="text-foreground/80"><strong>committee_index 유효성</strong> — 범위 초과 시 Reject</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-yellow-500/50 pl-3">
                <span className="font-mono text-xs text-yellow-500 shrink-0">5</span>
                <div className="text-foreground/80"><strong>중복 attestation</strong> — 동일 <code>(slot, validator_idx)</code> 이미 확인 → Ignore</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-red-500/50 pl-3">
                <span className="font-mono text-xs text-red-400 shrink-0">6</span>
                <div className="text-foreground/80"><strong>서명 검증</strong> — 단일 validator, <code>FastAggregateVerify</code> 불필요. 실패 → Reject</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-cyan-500/50 pl-3">
                <span className="font-mono text-xs text-cyan-500 shrink-0">7</span>
                <div className="text-foreground/80"><strong>LMD-GHOST vote 일관성</strong> — <code>isValidTarget(att.data.target)</code> 확인. 불일치 → Reject</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">~30K attestation/slot</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">~0.5ms/validator 검증</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">총 ~15s/slot (병렬 필수)</div>
          </div>
        </div>
        <p className="leading-7">
          attestation은 <strong>블록보다 7단계 엄격 검증</strong>.<br />
          볼륨이 30K/slot으로 많아 검증 오버헤드 큼.<br />
          검증 대부분을 병렬 처리 + 배치화 필수.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Reject vs Ignore 차이</strong> — Reject은 피어 점수를 감점하고 메시지를 버림.<br />
          Ignore는 점수 영향 없이 전파만 중단.<br />
          부모 미확인처럼 "나중에 유효할 수 있는" 경우 Ignore로 처리해 오판을 방지.
        </p>
      </div>
    </section>
  );
}
