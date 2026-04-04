export const PHASES = [
  {
    id: 'executor',
    label: 'Executor',
    color: '#6366f1',
    desc: 'RISC-V ELF 실행 → Execution Trace 생성',
    detail: [
      'ExecutorEnv::builder().write(&input).build()',
      '매 사이클마다 32개 레지스터 + 메모리 상태 기록',
      'env::read() / env::commit() I/O',
      '세그먼트 크기: 2^po2 사이클 (보통 2^22)',
    ],
  },
  {
    id: 'prover',
    label: 'Prover',
    color: '#10b981',
    desc: '세그먼트별 STARK 증명 생성',
    detail: [
      'SegmentProver가 각 세그먼트를 독립 증명',
      'RISC-V AIR 제약: 32열 레지스터 추적',
      'FRI(Fast Reed-Solomon IOP)로 다항식 커밋',
      '재귀 압축: 여러 세그먼트 → 단일 STARK',
    ],
  },
  {
    id: 'receipt',
    label: 'Receipt',
    color: '#f59e0b',
    desc: 'Journal + Seal 패키지',
    detail: [
      'Journal: env::commit()한 공개 출력 (바이트 벡터)',
      'Seal: STARK 또는 Groth16 SNARK',
      'InnerReceipt::Flat (STARK) / Compact (Groth16)',
      'receipt.verify(IMAGE_ID) — ImageID = ELF 해시',
    ],
  },
  {
    id: 'verify',
    label: '온체인 검증',
    color: '#8b5cf6',
    desc: 'Groth16 래핑 → Solidity 검증자 컨트랙트',
    detail: [
      'ProofMode::Groth16으로 증명 생성',
      'RiscZeroGroth16Verifier.sol 배포',
      'verifier.verify(seal, imageId, journalHash)',
      'EVM에서 약 250k gas, ~256 bytes',
    ],
  },
];
