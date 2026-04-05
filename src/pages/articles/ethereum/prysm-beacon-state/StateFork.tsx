import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StateFork({ onCodeRef: _ }: Props) {
  return (
    <section id="state-fork" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">포크별 상태 변형</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Fork 진화 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">BeaconState의 하드포크별 진화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Ethereum 2.0 하드포크 연대기:
//
// Phase0 (2020-12): 최초 런칭
//   - Basic BeaconState (20 fields)
//
// Altair (2021-10): Sync committee 도입
//   - + current_sync_committee
//   - + next_sync_committee
//   - + inactivity_scores
//   - participation flags (bit → byte 확장)
//   - + previous/current_epoch_participation
//
// Bellatrix (2022-09): The Merge (PoS)
//   - + latest_execution_payload_header
//
// Capella (2023-04): Withdrawals
//   - + next_withdrawal_index
//   - + next_withdrawal_validator_index
//   - + historical_summaries
//
// Deneb (2024-03): EIP-4844 Blobs
//   - latest_execution_payload_header 확장
//     (blob_gas_used, excess_blob_gas 추가)
//
// Electra (2025 예정): Single-slot finality 준비
//   - + pending_balance_deposits
//   - + pending_partial_withdrawals
//   - + pending_consolidations

// 각 포크의 state struct는 완전히 다른 타입:
// - BeaconStatePhase0
// - BeaconStateAltair
// - BeaconStateBellatrix
// - BeaconStateCapella
// - BeaconStateDeneb

// 공통 인터페이스로 추상화:
type BeaconState interface {
    Slot() Slot
    Validators() []Validator
    Version() int
    HashTreeRoot() [32]byte
    // 포크별 고유 메서드는 type assertion 필요
}`}
        </pre>
        <p className="leading-7">
          Beacon state가 <strong>5번 포크로 진화</strong>했음.<br />
          각 포크마다 새 필드 추가 → 기존 타입 호환성 유지.<br />
          공통 interface로 추상화 + 포크별 구체 타입 존재.
        </p>

        {/* ── Upgrade 함수 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">UpgradeToXxx — 포크 활성화 시 state 변환</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 포크 활성화 epoch에 state 변환
// 예: Altair 활성화 시
func UpgradeToAltair(preState BeaconStatePhase0) BeaconStateAltair {
    // 1. 기존 필드 복사 (같은 타입 공유)
    altair := &BeaconStateAltair{
        GenesisTime: preState.GenesisTime,
        Slot: preState.Slot,
        Fork: Fork{
            PreviousVersion: preState.Fork.CurrentVersion,
            CurrentVersion:  ALTAIR_FORK_VERSION,
            Epoch:           currentEpoch,
        },
        Validators: preState.Validators,
        Balances: preState.Balances,
        // ... 기존 20 필드 복사 ...
    }

    // 2. Altair 신규 필드 초기화
    //    inactivity_scores: 모두 0으로 시작
    altair.InactivityScores = make([]uint64, len(preState.Validators))

    //    current/previous_epoch_participation:
    //    기존 PendingAttestation → ParticipationFlags 변환
    altair.PreviousEpochParticipation = translatePendingAttestations(
        preState.PreviousEpochAttestations,
        preState.Validators,
    )
    altair.CurrentEpochParticipation = make([]ParticipationFlags, len(preState.Validators))

    //    sync committees: 첫 committee 랜덤 선정
    altair.CurrentSyncCommittee = getNextSyncCommittee(altair)
    altair.NextSyncCommittee = getNextSyncCommittee(altair)

    return altair
}

// In-place 변환:
// - 대부분 필드는 pointer 공유
// - 새 필드만 메모리 할당
// - 원본 state는 유지 (rollback 가능)

// trigger:
// SLOT_PER_EPOCH * ALTAIR_FORK_EPOCH 도달 시 자동 호출
// 모든 노드가 동일 시점에 upgrade → 분기 없음`}
        </pre>
        <p className="leading-7">
          <code>UpgradeToXxx</code>가 <strong>포크 전환의 상태 변환</strong>.<br />
          기존 필드 공유 + 새 필드 초기화 → 메모리 효율적 in-place 변환.<br />
          activation epoch 기점에 모든 노드 동시 전환.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 인플레이스 변환</strong> — UpgradeToAltair() 등으로 기존 상태를 복사하지 않고 제자리에서 변환.<br />
          새 필드(SyncCommittee 등)를 초기화하고 fork 버전을 갱신.<br />
          Phase0 → Altair → Bellatrix → Capella → Deneb 순서.
        </p>

        <p className="text-sm border-l-2 border-violet-500/50 pl-3 mt-4">
          <strong>💡 fieldIndex 확장</strong> — 포크마다 열거형이 확장됨.<br />
          Bellatrix에서 latestExecutionPayloadHeader 추가.<br />
          Deneb에서 blobKzgCommitments 추가 — Version() 메서드로 포크별 로직 분기.
        </p>
      </div>
    </section>
  );
}
