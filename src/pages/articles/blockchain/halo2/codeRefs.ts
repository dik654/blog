import type { CodeRef } from '@/components/code/types';
export type { LineNote, CodeRef } from '@/components/code/types';

import plonkRs from './codebase/halo2_proofs/src/plonk.rs?raw';
import keygenRs from './codebase/halo2_proofs/src/plonk/keygen.rs?raw';
import proverRs from './codebase/halo2_proofs/src/plonk/prover.rs?raw';
import verifierRs from './codebase/halo2_proofs/src/plonk/verifier.rs?raw';
import circuitRs from './codebase/halo2_proofs/src/circuit.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'plonk-mod': {
    path: 'halo2_proofs/src/plonk.rs',
    code: plonkRs,
    lang: 'rust',
    highlight: [40, 50],
    annotations: [
      { lines: [18, 27], color: 'sky', note: '하위 모듈 선언 — circuit, keygen, prover, verifier, lookup, permutation, vanishing' },
      { lines: [40, 50], color: 'emerald', note: 'VerifyingKey 구조체 — 도메인, 고정 열 커밋, 퍼뮤테이션 VK, ConstraintSystem' },
      { lines: [131, 141], color: 'amber', note: 'ProvingKey 구조체 — VK + l0/l_blind/l_last 도메인 다항식 + 고정 다항식' },
      { lines: [157, 175], color: 'violet', note: 'Fiat-Shamir 도전값 타입 정의 (Theta, Beta, Gamma, Y, X)' },
    ],
    desc: '크레이트 최상위 PLONK 모듈입니다. VerifyingKey와 ProvingKey 구조체를 정의하고, keygen/prover/verifier 하위 모듈을 re-export합니다. Fiat-Shamir 도전값 타입(Theta, Beta, Gamma, Y, X)도 여기서 정의됩니다.',
  },

  'circuit-trait': {
    path: 'halo2_proofs/src/circuit.rs',
    code: circuitRs,
    lang: 'rust',
    highlight: [28, 50],
    annotations: [
      { lines: [20, 27], color: 'sky', note: 'Chip 트레이트 — Config + Loaded 연관 타입으로 가젯 상태 관리' },
      { lines: [30, 36], color: 'emerald', note: 'Cell 구조체 — region_index + row_offset + column으로 셀 위치 식별' },
      { lines: [55, 60], color: 'amber', note: 'Region — assign_advice/assign_fixed/constrain_equal로 셀 할당' },
      { lines: [103, 120], color: 'violet', note: 'Layouter 트레이트 — assign_region/assign_table로 회로 배치 전략 추상화' },
    ],
    desc: '회로 구현을 위한 핵심 트레이트와 구조체입니다. Chip은 가젯의 설정/상태를 관리하고, Region은 실제 셀 할당이 이루어지는 영역입니다. Layouter가 Region 배치를 최적화합니다.',
  },

  'keygen-vk': {
    path: 'halo2_proofs/src/plonk/keygen.rs',
    code: keygenRs,
    lang: 'rust',
    highlight: [189, 244],
    annotations: [
      { lines: [189, 197], color: 'sky', note: 'keygen_vk 함수 시그니처 — Params + Circuit → VerifyingKey' },
      { lines: [198, 211], color: 'emerald', note: 'create_domain + Assembly 초기화 — 고정 열, 퍼뮤테이션, 선택자 빈 배열 생성' },
      { lines: [214, 227], color: 'amber', note: '회로 합성 + 선택자 압축 — FloorPlanner::synthesize → compress_selectors' },
      { lines: [229, 244], color: 'violet', note: '퍼뮤테이션 VK 빌드 + 고정 열 KZG 커밋 → VerifyingKey 조립' },
    ],
    desc: 'keygen_vk는 Circuit 인스턴스에서 VerifyingKey를 생성합니다. 회로를 합성하여 고정 열과 퍼뮤테이션 데이터를 채우고, 선택자를 압축한 뒤 KZG 커밋으로 마무리합니다.',
  },

  'keygen-pk': {
    path: 'halo2_proofs/src/plonk/keygen.rs',
    code: keygenRs,
    lang: 'rust',
    highlight: [247, 337],
    annotations: [
      { lines: [247, 255], color: 'sky', note: 'keygen_pk 함수 시그니처 — Params + VK + Circuit → ProvingKey' },
      { lines: [290, 302], color: 'emerald', note: '고정 다항식 변환 — Lagrange → 계수형 → extended coset' },
      { lines: [304, 309], color: 'amber', note: 'l0(X) 계산 — row 0 경계 다항식 (그랜드 프로덕트 초기 조건)' },
      { lines: [311, 325], color: 'violet', note: 'l_blind(X) + l_last(X) — 블라인딩 행 + 마지막 활성 행 경계 다항식' },
    ],
    desc: 'keygen_pk는 VK에 증명 전용 데이터를 추가합니다. l0, l_blind, l_last는 그랜드 프로덕트 인수의 경계 조건을 인코딩하는 Lagrange 다항식으로, extended coset 형태로 미리 계산됩니다.',
  },

  'create-proof': {
    path: 'halo2_proofs/src/plonk/prover.rs',
    code: proverRs,
    lang: 'rust',
    highlight: [35, 48],
    annotations: [
      { lines: [35, 48], color: 'sky', note: 'create_proof 시그니처 — Params, ProvingKey, circuits, instances, rng, transcript' },
      { lines: [59, 68], color: 'emerald', note: 'VK 해시 → 트랜스크립트 + ConstraintSystem 로드 (도메인 분리)' },
      { lines: [269, 317], color: 'amber', note: '어드바이스 열 합성 + 블라인딩 + KZG 커밋 → 트랜스크립트 기록' },
      { lines: [339, 346], color: 'violet', note: 'theta/beta/gamma/y 도전값 샘플링 → 그랜드 프로덕트 & 소멸 다항식 구성' },
    ],
    desc: 'create_proof는 PLONKish 증명의 전체 파이프라인을 구현합니다. Fiat-Shamir 트랜스크립트로 도전값을 순차 생성하며, 어드바이스 커밋 → 그랜드 프로덕트 → 소멸 다항식 → SHPLONK 개구 순서로 진행됩니다.',
  },

  'verify-proof': {
    path: 'halo2_proofs/src/plonk/verifier.rs',
    code: verifierRs,
    lang: 'rust',
    highlight: [67, 79],
    annotations: [
      { lines: [22, 32], color: 'sky', note: 'VerificationStrategy 트레이트 — MSM 기반 검증 전략 추상화' },
      { lines: [34, 47], color: 'emerald', note: 'SingleVerifier — 단일 증명 검증, msm.eval()로 최종 판정' },
      { lines: [67, 79], color: 'amber', note: 'verify_proof 시그니처 — Params, VK, strategy, instances, transcript' },
      { lines: [109, 130], color: 'violet', note: 'Fiat-Shamir 재생: 같은 순서로 도전값 재생성하여 증명 검증' },
    ],
    desc: 'verify_proof는 증명을 검증합니다. 증명자와 동일한 순서로 Fiat-Shamir 도전값을 재생성하고, 게이트/퍼뮤테이션/룩업 제약의 합이 소멸 다항식과 일치하는지 확인한 뒤 MSM으로 최종 판정합니다.',
  },
};
