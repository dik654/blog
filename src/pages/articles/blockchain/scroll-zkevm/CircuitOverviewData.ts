export const SUBCIRCUIT_MAP_CODE = `// zkevm-circuits/src/ — 서브회로 구성
evm_circuit.rs       // EVM 실행 메인 회로 (오퍼코드별 가젯)
bytecode_circuit.rs  // 바이트코드 무결성 검증
copy_circuit.rs      // 메모리/calldata 복사 추적
keccak_circuit.rs    // Keccak256 해시 회로
mpt_circuit.rs       // zkTrie (Sparse Binary Merkle Patricia Trie)
sig_circuit.rs       // ECDSA 서명 검증
ecc_circuit.rs       // 타원곡선 연산 (EcAdd, EcMul)
sha256_circuit.rs    // SHA256 프리컴파일
modexp_circuit.rs    // MODEXP 프리컴파일
rlp_circuit.rs       // RLP 인코딩 검증
poseidon_circuit.rs  // Poseidon 해시 (SNARK-friendly)
exp_circuit.rs       // EXP 오퍼코드 검증`;

export const subcircuitAnnotations = [
  { lines: [2, 2] as [number, number], color: 'sky' as const, note: 'EVM — 140+ 오퍼코드 가젯' },
  { lines: [3, 6] as [number, number], color: 'emerald' as const, note: '핵심 서브회로 — 바이트코드/복사/해시/상태' },
  { lines: [7, 8] as [number, number], color: 'amber' as const, note: '암호 서브회로 — 서명/타원곡선' },
  { lines: [9, 13] as [number, number], color: 'violet' as const, note: '프리컴파일 & 유틸리티 서브회로' },
];

export const SUPER_CIRCUIT_CODE = `// zkevm-circuits/src/super_circuit.rs
pub struct SuperCircuitConfig<F: Field> {
    evm_circuit:      EvmCircuitConfig<F>,
    bytecode_circuit:  BytecodeCircuitConfig<F>,
    copy_circuit:      CopyCircuitConfig<F>,
    keccak_circuit:    KeccakCircuitConfig<F>,
    mpt_circuit:       MptCircuitConfig<F>,
    sig_circuit:       SigCircuitConfig<F>,
    poseidon_circuit:  PoseidonCircuitConfig<F>,
    // ... 추가 서브회로
}
// SuperCircuit::synthesize → 모든 서브회로를 순차 합성
// 공유 테이블(RwTable, TxTable 등)로 회로 간 일관성 유지`;

export const superCircuitAnnotations = [
  { lines: [2, 11] as [number, number], color: 'sky' as const, note: 'SuperCircuit — 모든 서브회로 통합' },
  { lines: [13, 14] as [number, number], color: 'emerald' as const, note: 'synthesize에서 순차 합성 + 테이블 공유' },
];
