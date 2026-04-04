import type { CodeRef } from './codeRefsTypes';
import blsSchemeRs from './codebase/commonware/bls12381_scheme.rs?raw';
import blsDkgRs from './codebase/commonware/bls_dkg.rs?raw';

export const blsCodeRefs: Record<string, CodeRef> = {
  'bls-signer': {
    path: 'cryptography/src/bls12381/scheme.rs — Signer impl',
    lang: 'rust',
    code: blsSchemeRs,
    highlight: [1, 28],
    desc: 'BLS12-381 서명 구현.\nMinPk variant: 공개키 48B(G1), 서명 96B(G2).\nblst 크레이트로 hash-to-curve + 서명.',
    annotations: [
      { lines: [8, 9], color: 'sky', note: 'Secret<[u8; 32]> + Private — zeroize로 메모리 보호' },
      { lines: [18, 20], color: 'emerald', note: 'MinPk — 공개키가 G1(작음), 서명이 G2(큼)' },
      { lines: [22, 24], color: 'amber', note: 'sign_message — hash-to-curve + 스칼라 곱셈' },
    ],
  },
  'bls-verifier': {
    path: 'cryptography/src/bls12381/scheme.rs — Verifier impl',
    lang: 'rust',
    code: blsSchemeRs,
    highlight: [30, 46],
    desc: 'BLS12-381 검증 + 집계.\n48바이트 공개키로 96바이트 서명 검증.\n여러 서명의 G2 점 덧셈 → O(1) 집계 서명.',
    annotations: [
      { lines: [32, 33], color: 'sky', note: '48B 압축 G1 점 + blst G1 Affine' },
      { lines: [37, 41], color: 'emerald', note: 'verify_message — 페어링 검증 e(pk, H(m)) = e(G1, sig)' },
    ],
  },
  'dkg-dealer': {
    path: 'cryptography/src/bls12381/dkg.rs — Dealer',
    lang: 'rust',
    code: blsDkgRs,
    highlight: [1, 30],
    desc: 'DKG 딜러 상태 머신.\nStep 1: degree 2f 다항식 → 커밋먼트 + 개인 share 분배.\nStep 4: ACK 수집 → 미응답 share 공개.',
    annotations: [
      { lines: [4, 8], color: 'sky', note: 'Info — 라운드 번호, 이전 출력, 딜러/플레이어 목록' },
      { lines: [14, 19], color: 'emerald', note: 'start() — 다항식 생성 → PubMsg + PrivMsg 쌍' },
      { lines: [22, 25], color: 'amber', note: 'finalize() — ACK 미수신 → share 공개 (reveal)' },
    ],
  },
  'dkg-player': {
    path: 'cryptography/src/bls12381/dkg.rs — Player',
    lang: 'rust',
    code: blsDkgRs,
    highlight: [32, 55],
    desc: 'DKG 플레이어 상태 머신.\nStep 3: 커밋먼트 vs share 일치 검증 → ACK.\nStep 5: 유효 share 합산 → 개인 share + 그룹 공개키.',
    annotations: [
      { lines: [36, 39], color: 'sky', note: 'dealer_message — 다항식 커밋먼트 검증 → ACK' },
      { lines: [42, 46], color: 'emerald', note: 'finalize — share 합산 → (Share, Output)' },
      { lines: [50, 55], color: 'amber', note: 'Output — 그룹 공개 다항식 + 참여자 목록' },
    ],
  },
};
