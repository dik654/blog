import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ExecutionPayload({ onCodeRef }: Props) {
  return (
    <section id="execution-payload" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실행 페이로드 검증</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('validate-execution', codeRefs['validate-execution'])} />
          <span className="text-[10px] text-muted-foreground self-center">validateExecutionOnBlock()</span>
        </div>

        {/* ── ExecutionPayload 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ExecutionPayload — CL과 EL의 데이터 경계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// The Merge 이후 CL 블록이 EL 페이로드를 포함
struct ExecutionPayload {
    parent_hash: Hash32,              // EL block parent
    fee_recipient: ExecutionAddress,   // 수수료 받는 주소
    state_root: Bytes32,               // EL state root (post-execution)
    receipts_root: Bytes32,
    logs_bloom: ByteVector[256],
    prev_randao: Bytes32,              // RANDAO (CL에서 제공)
    block_number: uint64,
    gas_limit: uint64,
    gas_used: uint64,
    timestamp: uint64,                 // must match CL slot timestamp
    extra_data: ByteList[32],
    base_fee_per_gas: uint256,
    block_hash: Hash32,

    transactions: List[Transaction, 1048576],
    withdrawals: List[Withdrawal, 16],  // Capella+
    blob_gas_used: uint64,              // Deneb+
    excess_blob_gas: uint64,            // Deneb+
}

// CL의 역할:
// - payload 유효성의 기본 검증 (timestamp, slot 일치)
// - EL에 payload 전달 (engine_newPayload API)
// - EL의 VALID/INVALID/SYNCING 응답 처리

// EL의 역할:
// - EVM 실행
// - state_root 재계산 및 검증
// - 모든 TX 검증
// - 실행 결과 반환`}
        </pre>
        <p className="leading-7">
          <code>ExecutionPayload</code>가 <strong>CL ↔ EL 데이터 경계</strong>.<br />
          CL 블록 내에 EL 블록 전체 포함 → 단일 블록 구조.<br />
          CL은 구조만 검증, 실제 실행은 EL에 위임.
        </p>

        {/* ── validateExecutionOnBlock ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">validateExecutionOnBlock — EL 호출 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CL이 EL에 payload 전달하여 검증 요청
func validateExecutionOnBlock(
    ctx context.Context,
    state *BeaconState,
    block *BeaconBlock,
) error {
    payload := block.Body.ExecutionPayload

    // 1. Basic consistency checks (CL 내부)
    expectedTimestamp := slotToTimestamp(block.Slot)
    if payload.Timestamp != expectedTimestamp {
        return ErrTimestampMismatch
    }

    expectedRandao := getRandaoMix(state, currentEpoch)
    if payload.PrevRandao != expectedRandao {
        return ErrRandaoMismatch
    }

    // 2. EL의 parent check
    if payload.ParentHash != state.LatestExecutionPayloadHeader.BlockHash {
        return ErrInvalidParent
    }

    // 3. Engine API로 EL 호출
    result, err := s.engineClient.NewPayload(ctx, payload, blob_versioned_hashes, parent_beacon_block_root)
    if err != nil { return err }

    // 4. 결과 처리
    switch result.Status {
    case VALID:
        return nil  // payload 유효 → 진행
    case INVALID:
        return ErrInvalidPayload  // EL이 거부
    case SYNCING:
        // EL이 아직 sync 중 → optimistic 수락
        return s.markBlockOptimistic(block)
    case ACCEPTED:
        return nil  // side chain으로 수락
    }

    return nil
}

// Optimistic sync:
// EL이 SYNCING인데 CL은 진행해야 함
// → 블록을 "optimistically valid"로 표시
// → EL sync 완료 후 재검증
// → INVALID 판정 시 블록 무효화 + reorg`}
        </pre>
        <p className="leading-7">
          <code>validateExecutionOnBlock</code>이 <strong>CL → EL 게이트웨이</strong>.<br />
          Engine API의 newPayload 호출 → VALID/INVALID/SYNCING 처리.<br />
          Optimistic sync로 EL 지연 시에도 CL 계속 진행.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Optimistic Sync</strong> — EL이 SYNCING을 반환하면 CL은 블록을 낙관적으로 수락.<br />
          이후 EL 동기화 완료 시 재검증하여 최종 확정.<br />
          VALID/INVALID/SYNCING 3가지 응답 상태로 분기.
        </p>
      </div>
    </section>
  );
}
