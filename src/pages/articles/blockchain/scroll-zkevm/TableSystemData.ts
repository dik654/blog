export const RW_TABLE_CODE = `// RwTable — 모든 읽기/쓰기 연산 순서 기록
pub struct RwTable {
    pub q_enable: Column<Fixed>,
    pub rw_counter: Column<Advice>,   // 전역 순서 카운터
    pub is_write: Column<Advice>,     // 읽기(0) / 쓰기(1)
    pub tag: Column<Advice>,          // Stack, Memory, Storage, ...
    pub id: Column<Advice>,           // call_id
    pub address: Column<Advice>,      // stack_ptr / memory_addr
    pub field_tag: Column<Advice>,    // 필드 구분자
    pub storage_key: Column<Advice>,  // 스토리지 키
    pub value: Column<Advice>,        // 현재 값
    pub value_prev: Column<Advice>,   // 이전 값
    pub aux1: Column<Advice>,         // 보조 필드
    pub aux2: Column<Advice>,
}
// 사용: EVM Circuit(lookup), State Circuit(write)`;

export const rwAnnotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: 'rw_counter — 전역 순서 보장' },
  { lines: [6, 10] as [number, number], color: 'emerald' as const, note: 'tag/id/address — 연산 식별' },
  { lines: [11, 14] as [number, number], color: 'amber' as const, note: 'value/value_prev — 상태 변화 추적' },
];

export const TABLE_OVERVIEW_CODE = `// 테이블 타입 요약 (table.rs)
//
// 핵심 실행 테이블:
//   RwTable       — r/w 순서 추적 (12 컬럼)
//   CopyTable     — 복사 이벤트 기록
//
// 트랜잭션 & 블록:
//   TxTable       — tx_id, tag, index, value
//   BlockTable    — tag, index, value
//
// 코드 & 해시:
//   BytecodeTable — code_hash, tag, index, is_code, value
//   KeccakTable   — is_final, input_rlc, input_len, output_rlc
//   PoseidonTable — hash_id, input0, input1, control, domain_spec
//   SHA256Table   — is_final, input_rlc, input_len, output_rlc
//
// 상태 & 암호:
//   MptTable      — address, storage_key, proof_type, old/new root/value
//   SigTable      — msg_hash_rlc, sig_v/r/s_rlc, recovered_addr
//   EccTable      — 타원곡선 연산 검증
//   ExpTable      — EXP 오퍼코드 검증`;

export const overviewAnnotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: '핵심 실행 — RW + Copy' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: '블록/TX 메타데이터' },
  { lines: [11, 14] as [number, number], color: 'amber' as const, note: '해시 — Keccak/Poseidon/SHA256' },
  { lines: [16, 20] as [number, number], color: 'violet' as const, note: '상태 증명 + 암호 검증' },
];
