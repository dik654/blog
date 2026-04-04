import type { CodeRef } from '@/components/code/types';
import generatorsRs from './codebase/bulletproofs/src/generators.rs?raw';
import ipaRs from './codebase/bulletproofs/src/inner_product_proof.rs?raw';

export const coreCodeRefs: Record<string, CodeRef> = {
  'pedersen-gens': {
    path: 'bulletproofs/src/generators.rs',
    code: generatorsRs,
    lang: 'rust',
    highlight: [30, 53],
    annotations: [
      { lines: [30, 35], color: 'sky', note: 'PedersenGens — B(값 기저점), B_blinding(블라인딩 기저점)' },
      { lines: [39, 41], color: 'emerald', note: 'commit() — multiscalar_mul(&[value, blinding], &[B, B_blinding])' },
      { lines: [44, 52], color: 'amber', note: 'Default — Ristretto 베이스포인트 + SHA3-512 hash-to-group' },
    ],
    desc: 'Pedersen 커밋의 기저점 쌍입니다. B는 Ristretto255 베이스포인트, B_blinding은 SHA3-512 hash-to-group으로 생성됩니다. commit()은 v*B + r*B_blinding 멀티스칼라 곱셈입니다.',
  },

  'generators-chain': {
    path: 'bulletproofs/src/generators.rs',
    code: generatorsRs,
    lang: 'rust',
    highlight: [55, 82],
    annotations: [
      { lines: [58, 60], color: 'sky', note: 'GeneratorsChain — SHAKE256 XOF 리더' },
      { lines: [62, 72], color: 'emerald', note: 'new() — "GeneratorsChain" || label → SHAKE256 XOF' },
      { lines: [76, 80], color: 'amber', note: 'fast_forward — n번 건너뛰기 (파티별 오프셋)' },
    ],
    desc: 'SHAKE256 XOF로 결정론적 기저점 시퀀스를 생성합니다. Nothing-up-my-sleeve: 이산 로그 관계를 알 수 없는 독립 기저점들이 만들어집니다.',
  },

  'ipa-struct': {
    path: 'bulletproofs/src/inner_product_proof.rs',
    code: ipaRs,
    lang: 'rust',
    highlight: [18, 24],
    annotations: [
      { lines: [19, 21], color: 'sky', note: 'L_vec, R_vec — log2(n)개 압축 포인트' },
      { lines: [22, 23], color: 'emerald', note: 'a, b — 최종 스칼라 (재귀 종료)' },
    ],
    desc: 'InnerProductProof 구조체입니다. L/R 벡터(각 log2(n)개)와 최종 스칼라 a, b로 구성되어 O(log n) 크기입니다.',
  },

  'ipa-create': {
    path: 'bulletproofs/src/inner_product_proof.rs',
    code: ipaRs,
    lang: 'rust',
    highlight: [38, 193],
    annotations: [
      { lines: [38, 47], color: 'sky', note: 'create 시그니처 — transcript, Q, G/H factors, G/H/a/b 벡터' },
      { lines: [77, 85], color: 'emerald', note: '첫 라운드 벡터 분할 + 교차 내적 c_L, c_R' },
      { lines: [87, 99], color: 'amber', note: 'L 점 계산 — a_L*G_R + b_R*H_L + c_L*Q' },
      { lines: [121, 135], color: 'violet', note: '접기(folding) — a = a_L*u + a_R*u_inv' },
      { lines: [187, 192], color: 'rose', note: '최종 반환 — L_vec, R_vec, a[0], b[0]' },
    ],
    desc: 'IPA 증명 생성의 핵심 루프입니다. 매 라운드 벡터를 절반으로 나누고, 교차 내적으로 L/R 점을 계산한 뒤, Fiat-Shamir 도전값 u로 접어 크기를 줄입니다.',
  },
};
