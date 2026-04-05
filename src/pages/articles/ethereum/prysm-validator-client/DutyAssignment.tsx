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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// validator/client/runner.go
func (v *validator) Run(ctx context.Context) {
    // 매 slot 12초 ticker
    ticker := slotutil.NewSlotTicker(v.genesisTime, 12*time.Second)
    defer ticker.Done()

    for {
        select {
        case slot := <-ticker.C():
            v.processSlot(ctx, slot)
        case <-ctx.Done():
            return
        }
    }
}

// 각 slot에서 수행할 작업 결정
func (v *validator) processSlot(ctx context.Context, slot Slot) {
    // 1. 모든 validator의 역할 조회
    roles := v.RolesAt(ctx, slot)

    // 2. 역할별 병렬 실행 (goroutine)
    var wg sync.WaitGroup
    for pubKey, role := range roles {
        wg.Add(1)
        go func(pk [48]byte, r []ValidatorRole) {
            defer wg.Done()
            for _, roleType := range r {
                switch roleType {
                case RoleAttester:
                    v.SubmitAttestation(ctx, slot, pk)
                case RoleAggregator:
                    v.SubmitAggregateAndProof(ctx, slot, pk)
                case RoleProposer:
                    v.ProposeBlock(ctx, slot, pk)
                case RoleSyncCommittee:
                    v.SubmitSyncCommitteeMessage(ctx, slot, pk)
                case RoleSyncCommitteeAggregator:
                    v.SubmitSyncAggregate(ctx, slot, pk)
                }
            }
        }(pubKey, role)
    }
    wg.Wait()
}

// RolesAt 내부 로직:
// - 매 epoch 시작 시 beacon-chain에 duties 조회
// - duties 캐시 보관
// - slot별로 해당 duties 반환

// 한 validator가 여러 역할 동시 수행 가능:
// - Attester: 매 epoch (32 slot 중 1번)
// - Aggregator: 확률적 (~1/16)
// - Proposer: 매우 드물게 (슬롯별 추첨)
// - SyncCommittee: 선정 시 27시간 연속`}
        </pre>
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
