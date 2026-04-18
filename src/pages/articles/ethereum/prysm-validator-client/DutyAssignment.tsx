import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function DutyAssignment({ onCodeRef }: Props) {
  return (
    <section id="duty-assignment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">의무 할당 & 슬롯 루프</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('validator-loop', codeRefs['validator-loop'])} />
          <span className="text-[10px] text-muted-foreground self-center">Run() 메인 루프</span>
          <CodeViewButton onClick={() => onCodeRef('roles-at', codeRefs['roles-at'])} />
          <span className="text-[10px] text-muted-foreground self-center">RolesAt()</span>
        </div>

        {/* ── Validator main loop ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Validator 메인 루프 — slot tick 기반</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Run() — 메인 루프</p>
            <p className="text-sm text-foreground/80 mb-2">
              <code>SlotTicker(genesisTime, 12s)</code>로 매 슬롯 tick 수신 → <code>processSlot(ctx, slot)</code> 호출.
            </p>
            <p className="text-xs font-bold text-foreground/70 mb-2">processSlot() — 역할 분기</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. <code>RolesAt(ctx, slot)</code>로 모든 validator의 역할 조회</p>
              <p>2. 각 pubKey별 goroutine 병렬 실행</p>
              <p>3. 역할별 switch: <code>SubmitAttestation</code> / <code>SubmitAggregateAndProof</code> / <code>ProposeBlock</code> / <code>SubmitSyncCommitteeMessage</code> / <code>SubmitSyncAggregate</code></p>
              <p>4. <code>wg.Wait()</code>로 전부 완료 대기</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">RolesAt 내부 로직</p>
            <p className="text-sm text-foreground/80 mb-2">매 epoch 시작 시 beacon-chain에 duties 조회 → 캐시 보관 → slot별 해당 duties 반환.</p>
            <p className="text-xs font-bold text-foreground/70 mb-2">한 validator의 동시 역할</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">Attester</p><p className="text-foreground/50">매 epoch 1번</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">Aggregator</p><p className="text-foreground/50">확률적 ~1/16</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">Proposer</p><p className="text-foreground/50">매우 드물게</p></div>
              <div className="rounded border border-border/40 p-2"><p className="text-foreground/70 font-semibold">SyncCommittee</p><p className="text-foreground/50">27시간 연속</p></div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Validator는 <strong>매 slot tick에 역할 실행</strong>.<br />
          RolesAt으로 duty 조회 → goroutine 병렬 처리.<br />
          한 validator가 여러 역할(attester + aggregator + sync 등) 동시 수행 가능.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 고루틴 병렬 실행</strong> — ProposeBlock, SubmitAttestation, SubmitSyncCommitteeMessage를 각각 고루틴으로 실행.<br />
          하나의 슬롯에서 여러 역할이 동시에 할당될 수 있기 때문.<br />
          비콘 노드에 gRPC로 DutiesAt(slot) 질의 → 역할 분기.
        </p>
      </div>
    </section>
  );
}
