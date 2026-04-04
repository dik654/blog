import type { CodeRef } from '@/components/code/types';

import nifsRs from './codebase/nova/src/nova/nifs.rs?raw';
import novaModRs from './codebase/nova/src/nova/mod.rs?raw';
import r1csRs from './codebase/nova/src/r1cs/mod.rs?raw';
import spartanRs from './codebase/nova/src/spartan/mod.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'nova-nifs-prove': {
    path: 'nova/src/nova/nifs.rs',
    code: nifsRs,
    lang: 'rust',
    highlight: [19, 73],
    desc: 'NIFS::prove는 교차항 T를 계산하고 커밋하여 두 R1CS 인스턴스를 폴딩합니다. comm_T가 유일한 증거이며 Fiat-Shamir 도전값 r로 선형 결합합니다.',
    annotations: [
      { lines: [19, 21], color: 'sky', note: 'NIFS 구조체 — comm_T가 유일한 증거' },
      { lines: [36, 45], color: 'emerald', note: 'prove 시그니처 — Relaxed U1/W1 + 표준 U2/W2 입력' },
      { lines: [55, 63], color: 'amber', note: '교차항 T 계산 + 커밋 + Fiat-Shamir 도전값' },
      { lines: [65, 72], color: 'violet', note: '선형 폴딩 — U/W fold 후 반환' },
    ],
  },

  'nova-prove-step': {
    path: 'nova/src/nova/mod.rs',
    code: novaModRs,
    lang: 'rust',
    highlight: [456, 555],
    desc: 'prove_step은 이중 곡선 IVC의 핵심입니다. 보조 회로 폴딩 → 주 회로 합성 → 주 회로 폴딩 → 보조 회로 합성 순서로 진행하며, 매 스텝마다 상태를 누적합니다.',
    annotations: [
      { lines: [464, 473], color: 'sky', note: '1단계: 보조 회로 폴딩 (E2 곡선)' },
      { lines: [490, 499], color: 'emerald', note: '2단계: 주 회로 합성 (NovaAugmentedCircuit)' },
      { lines: [502, 511], color: 'amber', note: '3단계: 주 회로 폴딩 (E1 곡선)' },
      { lines: [543, 555], color: 'violet', note: '상태 업데이트 — 다음 스텝으로 전달' },
    ],
  },

  'nova-r1cs': {
    path: 'nova/src/r1cs/mod.rs',
    code: r1csRs,
    lang: 'rust',
    highlight: [30, 80],
    desc: 'R1CSShape와 RelaxedR1CSInstance/Witness 타입 정의입니다. Relaxed R1CS는 u 스케일과 E 에러 벡터를 추가하여 폴딩이 가능한 형태로 확장합니다.',
    annotations: [
      { lines: [30, 39], color: 'sky', note: 'R1CSShape — 제약 수, 변수 수, 희소 행렬 A/B/C' },
      { lines: [44, 48], color: 'emerald', note: 'R1CSWitness — 증인 벡터 W + 블라인딩 r_W' },
      { lines: [62, 67], color: 'amber', note: 'RelaxedR1CSWitness — W + E 에러 벡터 추가' },
      { lines: [73, 80], color: 'violet', note: 'RelaxedR1CSInstance — comm_W, comm_E, u 스케일' },
    ],
  },

  'nova-spartan': {
    path: 'nova/src/spartan/mod.rs',
    code: spartanRs,
    lang: 'rust',
    highlight: [1, 40],
    desc: 'Spartan 모듈은 최종 압축 SNARK를 구현합니다. RelaxedR1CS 만족을 Sumcheck 기반으로 증명하여 수 KB 크기의 간결한 증명을 생성합니다.',
    annotations: [
      { lines: [1, 10], color: 'sky', note: 'Spartan 모듈 — ppsnark + snark 하위 모듈' },
    ],
  },
};
