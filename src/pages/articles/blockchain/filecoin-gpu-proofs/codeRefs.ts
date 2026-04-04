import type { CodeRef } from '@/components/code/types';

import multiexpRs from './codebase/bellperson/src/gpu/multiexp.rs?raw';
import nativeRs from './codebase/bellperson/src/groth16/prover/native.rs?raw';
import verifierRs from './codebase/bellperson/src/groth16/verifier.rs?raw';
import proofRs from './codebase/bellperson/src/groth16/proof.rs?raw';
import generatorRs from './codebase/bellperson/src/groth16/generator.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'bp-gpu-multiexp': {
    path: 'bellperson/src/gpu/multiexp.rs',
    code: multiexpRs,
    lang: 'rust',
    highlight: [55, 141],
    desc: 'CpuGpuMultiexpKernel은 GPU와 CPU 간 MSM 워크로드를 분배합니다. BELLMAN_CPU_UTILIZATION 비율로 CPU에 할당하고, 나머지를 GPU 커널에서 병렬 실행한 뒤 결과를 합산합니다.',
    annotations: [
      { lines: [55, 58], color: 'sky', note: 'CpuGpuMultiexpKernel — GPU+CPU 하이브리드 MSM' },
      { lines: [60, 74], color: 'emerald', note: 'create — GPU 디바이스별 커널 초기화' },
      { lines: [95, 110], color: 'amber', note: 'multiexp — CPU/GPU 워크로드 분할' },
      { lines: [115, 141], color: 'violet', note: 'parallel_multiexp + CPU 결과 합산' },
    ],
  },

  'bp-groth16-prover': {
    path: 'bellperson/src/groth16/prover/native.rs',
    code: nativeRs,
    lang: 'rust',
    highlight: [35, 100],
    desc: 'create_proof_batch_priority_inner는 Groth16 증명 생성의 핵심 함수입니다. 회로를 합성하고, FFT(NTT)로 다항식 평가 후 MSM으로 G1/G2 점을 계산합니다.',
    annotations: [
      { lines: [35, 47], color: 'sky', note: '함수 시그니처 — 배치 증명 + GPU 우선순위' },
      { lines: [50, 67], color: 'emerald', note: '회로 합성 + vk/밀도 정보 추출' },
      { lines: [107, 119], color: 'amber', note: 'FFT 커널로 다항식 평가 (GPU 가속)' },
      { lines: [121, 143], color: 'violet', note: 'MSM 커널로 h 벡터 계산 (GPU 가속)' },
    ],
  },

  'bp-verifier': {
    path: 'bellperson/src/groth16/verifier.rs',
    code: verifierRs,
    lang: 'rust',
    highlight: [36, 104],
    desc: 'verify_proof는 Groth16 단일 증명 검증입니다. A*B = alpha*beta + inputs*gamma + C*delta 방정식을 Miller Loop 3개를 병렬 실행 후 final_exponentiation으로 확인합니다.',
    annotations: [
      { lines: [36, 49], color: 'sky', note: 'verify_proof 시그니처 + 입력 길이 검사' },
      { lines: [51, 57], color: 'emerald', note: '검증 방정식 재배열 — 단일 final_exp로 최적화' },
      { lines: [67, 93], color: 'amber', note: 'rayon 병렬: ML(A*B), ML(C*-delta), 입력 누적' },
      { lines: [96, 103], color: 'violet', note: 'final_exponentiation 결과 비교' },
    ],
  },

  'bp-proof': {
    path: 'bellperson/src/groth16/proof.rs',
    code: proofRs,
    lang: 'rust',
    highlight: [12, 18],
    desc: 'Proof<E> 구조체는 Groth16 증명의 세 점 (A: G1, B: G2, C: G1)을 담습니다. 직렬화/역직렬화와 배치 읽기를 지원합니다.',
    annotations: [
      { lines: [12, 18], color: 'sky', note: 'Proof<E> — a: G1Affine, b: G2Affine, c: G1Affine' },
      { lines: [60, 67], color: 'emerald', note: 'write — G1+G2+G1 바이트 직렬화' },
      { lines: [87, 98], color: 'amber', note: 'read_many — 배치 역직렬화 + rayon 병렬 디코딩' },
    ],
  },

  'bp-generator': {
    path: 'bellperson/src/groth16/generator.rs',
    code: generatorRs,
    lang: 'rust',
    highlight: [24, 45],
    desc: 'generate_random_parameters는 Groth16 CRS(공통 참조 문자열)를 생성합니다. 랜덤 tau, alpha, beta, gamma, delta를 샘플링하여 Trusted Setup을 수행합니다.',
    annotations: [
      { lines: [24, 45], color: 'sky', note: 'generate_random_parameters — tau 샘플링 + CRS 생성' },
      { lines: [49, 59], color: 'emerald', note: 'KeypairAssembly — 회로를 QAP로 합성' },
      { lines: [61, 76], color: 'amber', note: 'ConstraintSystem 구현 — 변수 할당 + 제약 수집' },
    ],
  },
};
