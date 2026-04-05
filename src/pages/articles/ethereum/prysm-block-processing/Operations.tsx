import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Operations({ onCodeRef }: Props) {
  return (
    <section id="operations" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">오퍼레이션 처리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('process-operations', codeRefs['process-operations'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessOperations()</span>
        </div>

        {/* ── 5가지 operations ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">5가지 Operations — 고정 순서 처리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BeaconBlockBody의 operations (spec 정의 순서):
struct BeaconBlockBody {
    randao_reveal: BLSSignature,
    eth1_data: Eth1Data,
    graffiti: Bytes32,

    // Operations (순서 중요):
    proposer_slashings: List[ProposerSlashing, 16],
    attester_slashings: List[AttesterSlashing, 2],
    attestations: List[Attestation, 128],
    deposits: List[Deposit, 16],
    voluntary_exits: List[VoluntaryExit, 16],
    // Capella+:
    bls_to_execution_changes: List[BLSToExecutionChange, 16],
    // Altair+:
    sync_aggregate: SyncAggregate,
    // Bellatrix+:
    execution_payload: ExecutionPayload,
    // Deneb+:
    blob_kzg_commitments: List[KzgCommitment, 6],
}

// processOperations 순서 (spec):
func ProcessOperations(state *BeaconState, body *BeaconBlockBody) error {
    // 1. Slashings 먼저 (exit 순서 결정에 영향)
    for _, ps := range body.ProposerSlashings {
        processProposerSlashing(state, ps)  // validator 슬래싱
    }
    for _, as := range body.AttesterSlashings {
        processAttesterSlashing(state, as)
    }

    // 2. Attestations
    for _, att := range body.Attestations {
        processAttestation(state, att)
    }

    // 3. Deposits (eth1_data.deposit_count 순서)
    for _, dep := range body.Deposits {
        processDeposit(state, dep)  // 새 validator 등록
    }

    // 4. Voluntary exits
    for _, ve := range body.VoluntaryExits {
        processVoluntaryExit(state, ve)
    }

    // 5. BLS to execution changes (Capella+)
    for _, bec := range body.BlsToExecutionChanges {
        processBlsToExecutionChange(state, bec)
    }
    return nil
}

// 순서가 중요한 이유:
// slashing이 먼저 → exit queue 결정에 반영
// attestation 먼저 → participation flag 설정 후 reward 계산
// deposit은 validator가 활성화되기까지 대기 (queue)`}
        </pre>
        <p className="leading-7">
          5가지 operations는 <strong>고정된 순서</strong>로 처리.<br />
          slashing → attestation → deposit → exit → BLS change.<br />
          순서가 state 변경의 결정성 보장 → 모든 노드 동일 결과.
        </p>

        {/* ── Attestation 처리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Attestation 처리 — 핵심 연산</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// processAttestation: attestation 1개를 state에 반영
func processAttestation(state *BeaconState, att *Attestation) error {
    data := att.Data

    // 1. slot 범위 검증
    if data.Slot + SLOTS_PER_EPOCH < currentSlot &&
       currentSlot < data.Slot + SLOTS_PER_EPOCH * 2 {
        return ErrInvalidAttestationSlot
    }

    // 2. target epoch 검증
    // target은 epoch boundary block
    expectedTarget := blockRootAtSlot(state, epochStart(data.Target.Epoch))
    if data.Target.Root != expectedTarget {
        return ErrInvalidTarget
    }

    // 3. participating validators 조회
    committee := getBeaconCommittee(state, data.Slot, data.CommitteeIndex)
    attestingIndices := []uint64{}
    for i, bit := range att.AggregationBits.BitIterator() {
        if bit {
            attestingIndices = append(attestingIndices, committee[i])
        }
    }

    // 4. 집계 서명 검증
    signing_root := computeSigningRoot(data, getDomain(state, DOMAIN_BEACON_ATTESTER, data.Target.Epoch))
    pubkeys := getValidatorPubkeys(state, attestingIndices)
    if !bls.FastAggregateVerify(pubkeys, signing_root, att.Signature) {
        return ErrInvalidSignature
    }

    // 5. Participation flag 업데이트 (Altair+)
    // source/target/head votes 반영 → 보상 계산 기반
    for _, idx := range attestingIndices {
        flags := state.CurrentEpochParticipation[idx]
        flags |= TIMELY_SOURCE_FLAG
        flags |= TIMELY_TARGET_FLAG
        flags |= TIMELY_HEAD_FLAG  // head vote 정확성 체크
        state.CurrentEpochParticipation[idx] = flags
    }

    return nil
}`}
        </pre>
        <p className="leading-7">
          Attestation 처리가 <strong>블록 처리의 대부분</strong>.<br />
          committee 결정 → 서명 검증 → participation flag 업데이트.<br />
          5단계 검증 + flag 설정으로 보상/슬래싱 기반 확립.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 5가지 오퍼레이션 순서</strong> — Attestation → Deposit → Exit → Slashing 순서 고정.<br />
          어테스테이션은 소스/타겟/헤드 + 위원회 비트를 검증.<br />
          디포짓은 eth1 Merkle Proof로 검증 후 레지스트리에 추가.
        </p>
      </div>
    </section>
  );
}
