import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import SlotDetailViz from './viz/SlotDetailViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ProcessSlot({ onCodeRef }: Props) {
  return (
    <section id="process-slot" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ProcessSlot 내부</h2>
      <div className="not-prose mb-8"><SlotDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('process-slot', codeRefs['process-slot'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessSlot()</span>
        </div>

        {/* ── ProcessSlot 구현 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">ProcessSlot — 단일 슬롯 전환</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// process_slot: 슬롯 1개 진전시키는 함수
func ProcessSlot(state *BeaconState) error {
    // 1. 이전 slot의 state root 계산
    prevStateRoot, err := state.HashTreeRoot()
    if err != nil { return err }

    // 2. latest_block_header.state_root 백필
    //    블록 생성 시 state_root가 0이었음 (circular dependency)
    //    이제 계산된 값으로 채움
    header := state.LatestBlockHeader()
    if header.StateRoot == ZERO_HASH {
        header.StateRoot = prevStateRoot
        state.SetLatestBlockHeader(header)
    }

    // 3. state_roots 배열 업데이트 (ring buffer)
    //    현재 slot의 이전 state root 저장
    idx := (state.Slot()) % SLOTS_PER_HISTORICAL_ROOT  // 8192
    state.UpdateStateRootAt(idx, prevStateRoot)

    // 4. latest_block_header 자체도 변경되었으니 block_roots 갱신
    prevBlockRoot, err := header.HashTreeRoot()
    state.UpdateBlockRootAt(idx, prevBlockRoot)

    return nil
}

// 핵심 개념:
// - "slot n의 state"는 slot n 시작 직전의 state
// - block이 있으면 → process_block 후 state 변경
// - 다음 slot에서 이 state의 root를 state_roots에 저장

// Ring buffer (SLOTS_PER_HISTORICAL_ROOT = 8192):
// state_roots[slot % 8192] = state_root
// block_roots[slot % 8192] = block_root
// 약 27시간 (8192 × 12초) 분량 유지
// 이보다 오래된 건 historical_roots로 이동`}
        </pre>
        <p className="leading-7">
          ProcessSlot의 핵심: <strong>state root를 이전 슬롯에 소급 기록</strong>.<br />
          latest_block_header.state_root를 다음 slot에서 backfill.<br />
          ring buffer로 최근 8192 slot의 roots 유지.
        </p>

        {/* ── circular dependency ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">순환 의존성 해결 — state_root backfill</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 문제: block 서명 시점에 자기 state_root를 알 수 없음
//
// Block 구조:
// SignedBeaconBlock {
//     block: BeaconBlock {
//         slot, proposer_index, parent_root,
//         state_root: ???,  ← 이 값이 문제
//         body: BeaconBlockBody { ... }
//     },
//     signature: BLSSignature
// }
//
// state_root는 이 블록 실행 "후" state의 hash
// 하지만 블록 서명은 실행 "전"에 필요
// → 닭과 달걀 문제

// 해결책: state_root를 0으로 두고 백필
//
// Slot N에서 proposer가 블록 생성:
// 1. state_root 자리에 ZERO 임시 값
// 2. 블록 body 채우기 (attestation, etc.)
// 3. 블록 body로 임시 상태 계산
// 4. 그 상태에서 "slot N의 header" 구성
//    (header.state_root = ZERO 여전히)
// 5. ProcessBlock 실행 후 state.slot = N
//    → state_roots[N % 8192] = 여전히 비어있음
// 6. Slot N+1 시작 → ProcessSlot 호출
//    → state_root 계산 (slot N 실행 후 state의 root)
//    → latest_block_header.state_root = 계산된 값 (backfill!)

// 결과:
// - 블록 서명은 state_root 몰라도 가능
// - 최종 state_root는 다음 slot에 기록
// - 무결성 보존

// 검증:
// 수신자는 블록 실행 후 동일 state_root 재계산
// → header의 state_root와 일치 확인
// → 이 과정이 consensus의 핵심 불변식`}
        </pre>
        <p className="leading-7">
          <strong>circular dependency</strong>를 backfill 패턴으로 해결.<br />
          블록 서명 시점에 state_root = 0, 다음 slot에서 실제 값 채움.<br />
          이 설계가 proposer의 서명 부담 제거 + 무결성 보장.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 상태 루트 백필</strong> — 블록 제안 시점에는 자신의 상태 루트를 아직 모름.<br />
          LatestBlockHeader.StateRoot를 0으로 두고, 다음 슬롯의 ProcessSlot에서 계산된 루트로 채움.
        </p>
      </div>
    </section>
  );
}
