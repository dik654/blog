import type { CodeRef } from '@/components/code/types';
import proverImplRs from './codebase/risc0/zkvm/src/host/server/prove/prover_impl.rs?raw';

export const proverCodeRefs: Record<string, CodeRef> = {
  'prover-prove': {
    path: 'risc0/zkvm/src/host/server/prove/prover_impl.rs',
    code: proverImplRs,
    lang: 'rust',
    highlight: [53, 66],
    annotations: [
      { lines: [53, 56], color: 'sky',     note: 'prove() 진입 -- VerifierContext 생성 후 prove_with_ctx 위임' },
      { lines: [58, 65], color: 'emerald', note: 'ELF 바이너리 실행 -> Session 생성 -> prove_session 호출' },
    ],
    desc:
`Prover의 최상위 진입점입니다. prove()는 ExecutorEnv(호스트 환경)와 ELF 바이너리를 받아:
1. VerifierContext를 생성 (dev_mode 여부 반영)
2. prove_with_ctx()로 위임하면 내부에서 ExecutorImpl이 RISC-V 명령어를 실행
3. 실행 결과(Session)를 받아 prove_session()으로 증명 생성

이것이 "실행 → 증명" 2단계 파이프라인의 시작점입니다.`,
  },

  'prover-session': {
    path: 'risc0/zkvm/src/host/server/prove/prover_impl.rs',
    code: proverImplRs,
    lang: 'rust',
    highlight: [68, 173],
    annotations: [
      { lines: [68, 81],   color: 'sky',     note: 'prove_session 진입 -- poseidon2 해시 함수 검증' },
      { lines: [86, 96],   color: 'emerald', note: '세그먼트 순회 -- 각 segment를 개별 STARK 증명으로 변환' },
      { lines: [146, 161], color: 'amber',   note: 'CompositeReceipt 조립 -- segments + assumptions + verifier_parameters' },
      { lines: [163, 173], color: 'violet',  note: 'ReceiptKind::Composite면 여기서 반환 (재귀 압축 생략)' },
    ],
    desc:
`prove_session()은 실행 트레이스(Session)를 받아 증명을 만드는 핵심 로직입니다.

1단계: 각 Segment를 순회하며 prove_segment()로 개별 STARK 증명(SegmentReceipt) 생성
2단계: keccak 가속 증명이 있으면 별도로 prove_keccak() 실행
3단계: CompositeReceipt 조립 (모든 SegmentReceipt + assumption 영수증)
4단계: ReceiptKind에 따라 Composite/Succinct/Groth16 중 선택해 반환

Composite → Succinct → Groth16 순서로 증명 크기가 줄어듭니다.`,
  },

  'prover-receipt-pipeline': {
    path: 'risc0/zkvm/src/host/server/prove/prover_impl.rs',
    code: proverImplRs,
    lang: 'rust',
    highlight: [175, 216],
    annotations: [
      { lines: [175, 182], color: 'sky',     note: 'Succinct 압축 -- composite_to_succinct()로 재귀 STARK 압축' },
      { lines: [184, 194], color: 'emerald', note: 'ReceiptKind::Succinct면 여기서 반환' },
      { lines: [196, 208], color: 'amber',   note: 'Groth16 변환 -- succinct_to_groth16()으로 SNARK 생성 (~200바이트)' },
    ],
    desc:
`증명 파이프라인의 마지막 단계입니다.

Composite → Succinct: lift(세그먼트→재귀회로) + join(재귀 합성)으로 하나의 SuccinctReceipt로 압축
Succinct → Groth16: identity_p254(Poseidon BN254 전환) + Groth16 Prover로 ~200바이트 SNARK 생성

Groth16Receipt는 이더리움 온체인 검증에 최적화된 최종 형태입니다.`,
  },
};
