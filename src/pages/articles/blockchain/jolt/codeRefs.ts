import type { CodeRef } from '@/components/code/types';

import proverRs from './codebase/jolt/src/zkvm/prover.rs?raw';
import sumcheckRs from './codebase/jolt/src/subprotocols/sumcheck.rs?raw';
import proofRs from './codebase/jolt/src/zkvm/proof_serialization.rs?raw';
import instructionRs from './codebase/jolt/src/zkvm/instruction/mod.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'jolt-prover': {
    path: 'jolt/src/zkvm/prover.rs',
    code: proverRs,
    lang: 'rust',
    highlight: [167, 200],
    desc: 'JoltCpuProver 구조체는 Jolt zkVM의 핵심 증명자입니다. 8단계 Sumcheck 파이프라인을 실행하며, Spartan R1CS + Lasso 룩업 + RAM 메모리 검사를 단일 증명으로 통합합니다.',
    annotations: [
      { lines: [167, 200], color: 'sky', note: 'JoltCpuProver — 트레이스, Spartan 키, RAM 상태, 오프닝 누적기' },
      { lines: [841, 875], color: 'emerald', note: 'prove_stage1 — Spartan Outer Sumcheck (R1CS → Sumcheck 환원)' },
      { lines: [880, 940], color: 'amber', note: 'prove_stage2 — RAM + Instruction + Product 결합 Sumcheck' },
    ],
  },

  'jolt-sumcheck': {
    path: 'jolt/src/subprotocols/sumcheck.rs',
    code: sumcheckRs,
    lang: 'rust',
    highlight: [32, 76],
    desc: 'BatchedSumcheck는 여러 독립 Sumcheck 인스턴스를 단일 증명으로 병합합니다. 배치 계수로 클레임을 스케일링하고, 라운드별 단변수 다항식을 계산하여 도전값을 바인딩합니다.',
    annotations: [
      { lines: [32, 39], color: 'sky', note: 'BatchedSumcheck::prove 시그니처' },
      { lines: [46, 50], color: 'emerald', note: '초기 클레임 기록 + 배치 계수 α 샘플링' },
      { lines: [61, 75], color: 'amber', note: '클레임 스케일링 (라운드 수 차이 보정) + 초기 배치 클레임' },
      { lines: [84, 100], color: 'violet', note: '라운드별 Sumcheck — 단변수 다항식 계산 + 도전값 바인딩' },
    ],
  },

  'jolt-proof': {
    path: 'jolt/src/zkvm/proof_serialization.rs',
    code: proofRs,
    lang: 'rust',
    highlight: [36, 63],
    desc: 'JoltProof 구조체는 8단계 Sumcheck의 모든 증명 데이터를 담습니다. Stage 1~7의 Sumcheck 증명과 Dory PCS 공동 개구 증명, 트레이스 길이 등을 포함합니다.',
    annotations: [
      { lines: [36, 41], color: 'sky', note: 'JoltProof 제네릭 — Field, Curve, PCS, Transcript' },
      { lines: [42, 46], color: 'emerald', note: '커밋 + Stage 1~2 UniSkip + Sumcheck 증명' },
      { lines: [47, 51], color: 'amber', note: 'Stage 3~7 Sumcheck 증명' },
      { lines: [54, 63], color: 'violet', note: '공동 개구 증명 + 트레이스 메타데이터' },
    ],
  },

  'jolt-instruction': {
    path: 'jolt/src/zkvm/instruction/mod.rs',
    code: instructionRs,
    lang: 'rust',
    highlight: [13, 43],
    desc: 'InstructionLookup과 LookupQuery 트레이트는 RISC-V 명령어를 Lasso 룩업으로 매핑합니다. interleave_bits로 두 피연산자를 단일 인덱스로 변환하여 희소 테이블에서 조회합니다.',
    annotations: [
      { lines: [13, 15], color: 'sky', note: 'InstructionLookup — 명령어 → 룩업 테이블 매핑' },
      { lines: [21, 43], color: 'emerald', note: 'LookupQuery — 피연산자 → 인덱스/출력 변환' },
      { lines: [63, 80], color: 'amber', note: 'CircuitFlags — R1CS 제약에서 사용하는 명령어 플래그' },
    ],
  },
};
