import type { CodeRef } from '@/components/code/types';

import babyBearRs from './codebase/plonky3/baby-bear/src/baby_bear.rs?raw';
import twoAdicPcsRs from './codebase/plonky3/fri/src/two_adic_pcs.rs?raw';
import poseidon2Rs from './codebase/plonky3/poseidon2/src/lib.rs?raw';
import keccakAirRs from './codebase/plonky3/keccak-air/src/air.rs?raw';
import configRs from './codebase/plonky3/uni-stark/src/config.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'p3-babybear': {
    path: 'plonky3/baby-bear/src/baby_bear.rs',
    code: babyBearRs,
    lang: 'rust',
    highlight: [9, 52],
    desc: 'BabyBear 필드 정의입니다. 소수 p = 2^31 - 2^27 + 1 위의 Montgomery 형식 필드로, 27비트 2-adic 구조 덕분에 효율적인 FFT를 지원합니다.',
    annotations: [
      { lines: [9, 10], color: 'sky', note: 'BabyBear 타입 — MontyField31<BabyBearParameters>' },
      { lines: [15, 22], color: 'emerald', note: 'MontyParameters — 소수, Montgomery 비트, MU 상수' },
      { lines: [41, 51], color: 'amber', note: 'TwoAdicData — 27비트 2-adic 생성자 목록' },
      { lines: [65, 74], color: 'violet', note: 'BinomialExtension<4> — 4차 확장 (128비트 보안)' },
    ],
  },

  'p3-fri-pcs': {
    path: 'plonky3/fri/src/two_adic_pcs.rs',
    code: twoAdicPcsRs,
    lang: 'rust',
    highlight: [42, 65],
    desc: 'TwoAdicFriPcs는 FRI 기반 다항식 커밋 스킴(PCS)입니다. coset gH 위의 평가값에서 FRI 접기(folding)를 수행하여 저차 검증 증명을 생성합니다.',
    annotations: [
      { lines: [42, 54], color: 'sky', note: 'TwoAdicFriPcs 구조체 — DFT + MMCS + FRI 파라미터' },
      { lines: [97, 130], color: 'emerald', note: 'fold_row — 단일 행 Lagrange 보간 + 접기' },
      { lines: [133, 161], color: 'amber', note: 'fold_matrix (arity=2) — 짝/홀 분해 + beta 접기' },
      { lines: [215, 229], color: 'violet', note: 'lagrange_interpolate_at — 무게중심 보간 공식' },
    ],
  },

  'p3-poseidon2': {
    path: 'plonky3/poseidon2/src/lib.rs',
    code: poseidon2Rs,
    lang: 'rust',
    highlight: [29, 63],
    desc: 'Poseidon2 순열은 외부(External) + 내부(Internal) 라운드로 구성된 대수적 해시입니다. S-box(x^d) + MDS 행렬 연산으로 STARK 친화적 해싱을 제공합니다.',
    annotations: [
      { lines: [31, 39], color: 'sky', note: 'Poseidon2 구조체 — ExternalPerm + InternalPerm' },
      { lines: [48, 63], color: 'emerald', note: 'new() — 외부/내부 상수에서 레이어 생성' },
      { lines: [107, 112], color: 'amber', note: 'permute_mut — external → internal → external 3단계 순열' },
    ],
  },

  'p3-keccak-air': {
    path: 'plonky3/keccak-air/src/air.rs',
    code: keccakAirRs,
    lang: 'rust',
    highlight: [37, 80],
    desc: 'KeccakAir는 Keccak-256을 AIR 제약으로 표현한 것입니다. 트레이스 행렬의 current/next 행 접근으로 24라운드 전이 제약을 구현합니다.',
    annotations: [
      { lines: [17, 29], color: 'sky', note: 'KeccakAir 구조체 + 트레이스 생성' },
      { lines: [37, 48], color: 'emerald', note: 'Air::eval — AirBuilder로 제약 평가' },
      { lines: [50, 59], color: 'amber', note: '첫 단계: preimage == a (초기 상태 제약)' },
      { lines: [62, 71], color: 'violet', note: '비최종 단계: local.preimage == next.preimage (전이 제약)' },
    ],
  },

  'p3-stark-config': {
    path: 'plonky3/uni-stark/src/config.rs',
    code: configRs,
    lang: 'rust',
    highlight: [24, 46],
    desc: 'StarkGenericConfig는 STARK 증명 시스템의 핵심 설정 트레이트입니다. PCS·Challenge·Challenger를 조합하여 다양한 STARK 구성을 표현합니다.',
    annotations: [
      { lines: [24, 37], color: 'sky', note: 'StarkGenericConfig 트레이트 — Pcs + Challenge + Challenger' },
      { lines: [48, 55], color: 'emerald', note: 'StarkConfig 구체 구조체' },
      { lines: [67, 87], color: 'amber', note: 'impl StarkGenericConfig for StarkConfig — 트레이트 구현' },
    ],
  },
};
