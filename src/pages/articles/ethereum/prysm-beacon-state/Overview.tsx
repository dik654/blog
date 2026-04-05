import ContextViz from './viz/ContextViz';
import StateStructureViz from './viz/StateStructureViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BeaconState 전체 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 BeaconState의 필드 구성, Copy-on-Write 메커니즘, FieldTrie 해시 캐싱의 내부를 코드 수준으로 추적한다.
        </p>

        {/* ── BeaconState 30+ 필드 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BeaconState — 30+ 필드 구조체</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Deneb fork BeaconState (Ethereum 2.0 spec)
struct BeaconState {
    // Versioning
    genesis_time: uint64,
    genesis_validators_root: Bytes32,
    slot: Slot,
    fork: Fork,

    // History
    latest_block_header: BeaconBlockHeader,
    block_roots: Vector[Bytes32, 8192],      // SLOTS_PER_HISTORICAL_ROOT
    state_roots: Vector[Bytes32, 8192],
    historical_roots: List[Bytes32, 16777216],

    // Eth1 data
    eth1_data: Eth1Data,
    eth1_data_votes: List[Eth1Data, 2048],
    eth1_deposit_index: uint64,

    // Registry (가장 큰 부분)
    validators: List[Validator, 1099511627776],  // 1M validator
    balances: List[Gwei, 1099511627776],

    // Randomness
    randao_mixes: Vector[Bytes32, 65536],        // EPOCHS_PER_HISTORICAL

    // Slashings
    slashings: Vector[Gwei, 8192],

    // Participation (Altair+)
    previous_epoch_participation: List[ParticipationFlags, 1099511627776],
    current_epoch_participation: List[ParticipationFlags, 1099511627776],

    // Finality
    justification_bits: Bitvector[4],
    previous_justified_checkpoint: Checkpoint,
    current_justified_checkpoint: Checkpoint,
    finalized_checkpoint: Checkpoint,

    // Inactivity (Altair+)
    inactivity_scores: List[uint64, 1099511627776],

    // Sync committee (Altair+)
    current_sync_committee: SyncCommittee,
    next_sync_committee: SyncCommittee,

    // Execution (Bellatrix+)
    latest_execution_payload_header: ExecutionPayloadHeader,

    // Capella+
    next_withdrawal_index: WithdrawalIndex,
    next_withdrawal_validator_index: ValidatorIndex,
    historical_summaries: List[HistoricalSummary, 16777216],
}

// 크기 추정 (메인넷 2025):
// validators: ~1M × 120B = 120 MB
// balances: ~1M × 8B = 8 MB
// participation: ~1M × 1B × 2 = 2 MB
// inactivity_scores: ~1M × 8B = 8 MB
// 기타: ~100 MB
// 총: ~250 MB per snapshot`}
        </pre>
        <p className="leading-7">
          BeaconState는 <strong>30+ 필드 거대 구조체</strong>.<br />
          validators 배열이 120MB로 가장 큰 부분.<br />
          매 슬롯(12초)마다 업데이트 + state_root 재계산 필요.
        </p>

        {/* ── Validator 구조체 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Validator — registry entry 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// validators list의 각 entry
struct Validator {
    pubkey: BLSPubkey,                  // 48 bytes (signature key)
    withdrawal_credentials: Bytes32,     // 32 bytes (fund recipient)

    // Balance (economics)
    effective_balance: Gwei,            // 8 bytes (rounded to 1 ETH)
    slashed: bool,                      // 1 byte

    // Lifecycle epochs
    activation_eligibility_epoch: Epoch, // 8 bytes
    activation_epoch: Epoch,             // 8 bytes
    exit_epoch: Epoch,                   // 8 bytes
    withdrawable_epoch: Epoch,           // 8 bytes
}
// 총: 121 bytes per validator

// Validator lifecycle:
// 1. PENDING_INITIALIZED: 32 ETH 예치, waiting queue
// 2. PENDING_QUEUED: 활성화 대기
// 3. ACTIVE_ONGOING: 정상 동작 (attestation 필수)
// 4. ACTIVE_EXITING: exit 요청 후 대기
// 5. ACTIVE_SLASHED: slashed but still active
// 6. EXITED_UNSLASHED: exit 완료, 출금 대기
// 7. EXITED_SLASHED: 슬래싱으로 exit
// 8. WITHDRAWAL_POSSIBLE: 출금 가능
// 9. WITHDRAWAL_DONE: 완전 종료

// activation_epoch와 exit_epoch로 상태 결정
// 현재 epoch >= activation_epoch && < exit_epoch → ACTIVE

// withdrawal_credentials:
// BLS_WITHDRAWAL_PREFIX (0x00) + bytes31: BLS 키 기반 (legacy)
// ETH1_ADDRESS_PREFIX (0x01) + 0x00*11 + address: EL 주소 (권장)

// effective_balance: 실제 balance를 1 ETH 단위로 내림
// 32 ETH 예치 → effective 32
// 32.5 ETH → effective 32 (자주 업데이트 안 함, 0.5 차이 내에서)`}
        </pre>
        <p className="leading-7">
          각 Validator는 <strong>121 bytes 고정 크기</strong>.<br />
          9가지 lifecycle state → activation/exit epoch로 결정.<br />
          effective_balance는 1 ETH 단위로 rounding → hash 변화 최소화.
        </p>

        {/* ── state 변경 패턴 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">State 변경 패턴 — 매 슬롯의 업데이트</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 매 슬롯마다 BeaconState 변경되는 필드:

// slot transition (매 슬롯):
// - slot (+1)
// - state_roots[slot % 8192] (이전 slot의 state root)
// - block_roots[slot % 8192] (이전 block root 또는 빈 slot)
// - historical_roots (32768 slot마다)

// block processing (블록이 있는 슬롯):
// - latest_block_header
// - randao_mixes[epoch % 65536]
// - eth1_data_votes (추가)
// - validators (입출금 처리)
// - balances
// - participation (attestation 처리)
// - justification_bits
// - finalized_checkpoint (epoch 경계에서)

// epoch transition (매 32 슬롯):
// - previous/current_epoch_participation (교대)
// - validators (보상/페널티)
// - balances (reward 지급)
// - justification_bits (shift)
// - slashings (epoch offset)
// - randao_mixes (새 epoch)
// - inactivity_scores

// 필드별 변경 빈도 (12초 slot, 메인넷):
// 매 슬롯: slot, state_roots, block_roots
// 블록 있는 슬롯: validators, balances, participation (일부)
// 에폭 경계 (~6.4분): 전체 validators/balances 업데이트

// 일반 슬롯의 변경 필드:
// - ~5개 "state" 필드
// - ~1500 validator의 balance/participation
// → 전체 대비 ~0.15% 필드만 변경

// 이 관찰이 FieldTrie 캐싱의 근거가 됨
// 변경 안 된 필드는 이전 해시 재사용 → O(1)`}
        </pre>
        <p className="leading-7">
          매 슬롯 <strong>0.15% 필드만 변경</strong> — 99.85%는 그대로.<br />
          이 불변성이 <code>FieldTrie</code> 해시 캐싱의 수학적 근거.<br />
          변경 필드만 재해시 → state_root 재계산 O(1) 달성.
        </p>
      </div>
      <div className="not-prose mt-6"><StateStructureViz /></div>
    </section>
  );
}
