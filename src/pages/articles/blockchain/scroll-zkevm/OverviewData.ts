export const CRATE_CODE = `// zkevm-circuits/src/

// 주요 서브회로
evm_circuit.rs       // EVM 실행 흐름 메인 회로
  execution/         // 오퍼코드별 ExecutionGadget (ADD, CALL, SLOAD 등)
bytecode_circuit.rs  // 바이트코드 무결성 검증
keccak_circuit.rs    // Keccak256 해시 회로
mpt_circuit.rs       // Merkle Patricia Trie 상태 검증 (수정 연산)
copy_circuit.rs      // 메모리/calldata 복사 추적
rw_circuit (RwTable) // 읽기/쓰기 순서 증명 (상태, 메모리, 스택)
sig_circuit.rs       // ECDSA 서명 검증
ecc_circuit.rs       // 점 곱셈 등 타원곡선 연산

// 공유 테이블 (table.rs):
//   RwTable:       모든 읽기/쓰기 연산 순서 기록
//   BytecodeTable: 바이트코드 바이트 → 인덱스 매핑
//   TxTable:       트랜잭션 메타데이터
//   KeccakTable:   Keccak 입출력 쌍
//   CopyTable:     복사 이벤트 기록`;

export const EVM_CONFIG_CODE = `// zkevm-circuits/src/evm_circuit.rs

pub struct EvmCircuitConfig<F> {
    fixed_table: [Column<Fixed>; 4],   // 오퍼코드 상수 룩업
    byte_table:  [Column<Fixed>; 1],   // 바이트 범위 검사
    pub(crate) execution: Box<ExecutionConfig<F>>,
    // 서브회로 테이블 (주 회로 ↔ 서브회로 일관성)
    tx_table:       TxTable,
    rw_table:       RwTable,           // 스택/메모리/스토리지 r/w
    bytecode_table: BytecodeTable,
    block_table:    BlockTable,
    copy_table:     CopyTable,
    keccak_table:   KeccakTable,
    exp_table:      ExpTable,
    sig_table:      SigTable,
    ecc_table:      EccTable,
}

// ExecutionConfig::configure():
//   - 스텝 상태(ExecutionState), 오퍼코드, 가스 카운터 열 설정
//   - configure_gadget!(add_sub_gadget) 매크로로 각 오퍼코드 가젯 초기화
//   - 모든 가젯에서 공유 테이블로의 룩업 제약 등록`;
