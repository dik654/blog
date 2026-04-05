import ContextViz from './viz/ContextViz';
import SSZMerkleViz from './viz/SSZMerkleViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SSZ 규격</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 SSZ 인코딩 규칙, 청크 패킹, HashTreeRoot 계산 과정을 코드 수준으로 추적한다.
        </p>

        {/* ── SSZ vs RLP ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">SSZ vs RLP — 왜 새로운 직렬화?</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Ethereum 1 (EL): RLP (Recursive Length Prefix)
// Ethereum 2 (CL): SSZ (Simple Serialize)

// RLP의 한계:
// - 정수 길이 가변 (canonical form 복잡)
// - Merkle root 직접 계산 불가능 (별도 MPT 필요)
// - 스트림 파싱 어려움
// - Fixed-size 구조체도 length prefix 필요

// SSZ의 설계 목표:
// 1. Merkleization 내장
//    - 모든 타입이 HashTreeRoot 계산 가능
//    - 체크포인트/상태 해시 검증에 직접 사용
// 2. Fixed vs Variable 구분
//    - Fixed size: length prefix 없음
//    - Variable size: 4-byte offset table
// 3. 스키마 기반
//    - 컴파일 타임 결정된 필드 순서
//    - reflection 없이 효율적 인코딩
// 4. 하위 호환
//    - Ethereum 2.0 spec 전용 설계

// SSZ 타입 시스템:
// Basic types:
//   uint{8,16,32,64,128,256}
//   bool
//   byte (= uint8)
// Composite types:
//   Vector[T, N]     - 고정 길이
//   List[T, N]       - 가변 길이 (최대 N)
//   Container        - 구조체
//   Bitvector[N]     - 고정 비트
//   Bitlist[N]       - 가변 비트
//   Union[T1, T2]    - tagged union (EIP-7495)`}
        </pre>
        <p className="leading-7">
          SSZ는 <strong>Merkleization 내장</strong>이 핵심 차이.<br />
          RLP는 인코딩만 → MPT 별도 필요. SSZ는 인코딩 + 해시 통합.<br />
          BeaconState, BeaconBlock 등 모든 CL 타입이 SSZ 기반.
        </p>

        {/* ── SSZ 인코딩 규칙 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">SSZ 인코딩 규칙 — Fixed vs Variable</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Basic types: little-endian 바이트 시퀀스
encode(uint64(42)) = [0x2a, 0, 0, 0, 0, 0, 0, 0]
encode(bool(true)) = [0x01]
encode(byte(0xff)) = [0xff]

// Fixed-size Vector: 단순 concat
encode(Vector[uint64, 3](1, 2, 3)) =
  [0x01,0,0,0,0,0,0,0,  0x02,0,0,0,0,0,0,0,  0x03,0,0,0,0,0,0,0]

// Variable-size List: length 없이 원소만
encode(List[uint64, 100](1, 2, 3)) =
  [0x01,0,0,0,0,0,0,0,  0x02,0,0,0,0,0,0,0,  0x03,0,0,0,0,0,0,0]
// ← 길이는 offset table에서 암묵적으로 유도

// Container 인코딩 (Fixed + Variable 혼합):
// 1. fixed-size 필드: 그대로 인코딩
// 2. variable-size 필드: 4-byte offset (전체 인코딩 내 시작 위치)
// 3. variable-size 필드 내용: 끝에 순서대로

// 예: struct { a: uint64, b: List[uint64, 10], c: uint32 }
// encode({ a: 1, b: [10, 20], c: 3 }) =
//   [a=1 (8B)] [b_offset=16 (4B)] [c=3 (4B)] [b=10, 20 (16B)]
//        ^ fixed        ^ offset         ^ fixed     ^ variable data
//
// 총 길이: 8 + 4 + 4 + 16 = 32 bytes

// 디코딩:
// - fixed 부분을 먼저 파싱
// - offset으로 variable 부분 위치 파악
// - 다음 offset (없으면 끝)까지가 현재 필드 데이터`}
        </pre>
        <p className="leading-7">
          SSZ의 핵심: <strong>fixed vs variable 구분</strong>.<br />
          variable 필드만 4-byte offset 필요 → RLP 대비 공간 효율.<br />
          offset 기반 파싱으로 random access 가능.
        </p>

        {/* ── BeaconState 직렬화 크기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BeaconState 직렬화 — 실전 수치</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BeaconState 구조 (Deneb fork 기준):
struct BeaconState {
    // Fixed-size (앞부분):
    genesis_time: uint64,
    genesis_validators_root: B256,
    slot: Slot,
    fork: Fork,
    latest_block_header: BeaconBlockHeader,
    block_roots: Vector[B256, SLOTS_PER_HISTORICAL_ROOT],     // 8192
    state_roots: Vector[B256, SLOTS_PER_HISTORICAL_ROOT],     // 8192
    historical_roots: List[B256, HISTORICAL_ROOTS_LIMIT],     // variable
    eth1_data: Eth1Data,
    eth1_data_votes: List[Eth1Data, SLOTS_PER_ETH1_VOTING],
    eth1_deposit_index: uint64,

    // Variable-size (validators 배열 등):
    validators: List[Validator, VALIDATOR_REGISTRY_LIMIT],    // 2^40
    balances: List[Gwei, VALIDATOR_REGISTRY_LIMIT],
    randao_mixes: Vector[B256, EPOCHS_PER_HISTORICAL_VECTOR], // 65536
    slashings: Vector[Gwei, EPOCHS_PER_SLASHINGS_VECTOR],

    // ... 약 30개 필드 ...

    execution_payload_header: ExecutionPayloadHeader,
    next_withdrawal_index: WithdrawalIndex,
    historical_summaries: List[HistoricalSummary, HISTORICAL_ROOTS_LIMIT],
}

// 메인넷 BeaconState 크기 (2025 기준):
// - validators: ~1M × ~120 bytes = ~120 MB
// - balances: ~1M × 8 bytes = ~8 MB
// - historical roots: ~수 MB
// - 기타 필드: ~100 MB
// 총 합: ~250 MB (raw SSZ serialized)

// 이 거대한 구조체의 HashTreeRoot가 상수 시간 업데이트되어야 함
// → FieldTrie 해시 캐싱의 필요성`}
        </pre>
        <p className="leading-7">
          BeaconState는 <strong>~250MB 거대 구조체</strong>.<br />
          매 슬롯(12초)마다 state_root 재계산 필요 → 증분 업데이트 필수.<br />
          FieldTrie로 변경된 필드만 재해시 → O(1) 해시 업데이트 달성.
        </p>
      </div>
      <div className="not-prose mt-6"><SSZMerkleViz /></div>
    </section>
  );
}
