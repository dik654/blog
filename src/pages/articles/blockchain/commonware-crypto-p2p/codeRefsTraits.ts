import type { CodeRef } from './codeRefsTypes';
import traitsRs from './codebase/commonware/crypto_traits.rs?raw';

export const traitsCodeRefs: Record<string, CodeRef> = {
  'signer-trait': {
    path: 'cryptography/src/lib.rs — Signer trait',
    lang: 'rust',
    code: traitsRs,
    highlight: [4, 20],
    desc: 'Signer — namespace 기반 서명 생성.\nnamespace가 반드시 prepend되어 크로스 도메인 리플레이 원천 차단.',
    annotations: [
      { lines: [6, 7], color: 'sky', note: '연관 타입 — 스킴별 Signature/PublicKey 바인딩' },
      { lines: [11, 14], color: 'emerald', note: 'sign() — union_unique(ns, msg)로 도메인 분리' },
      { lines: [16, 18], color: 'amber', note: 'from_seed — ChaCha20 PRNG. 테스트 전용' },
    ],
  },
  'verifier-trait': {
    path: 'cryptography/src/lib.rs — Verifier trait',
    lang: 'rust',
    code: traitsRs,
    highlight: [24, 36],
    desc: 'Verifier/PublicKey/Signature — 검증 + 직렬화 인터페이스.\nPublicKey가 Ord + Array를 확장하여 정렬/집합 연산 가능.',
    annotations: [
      { lines: [24, 29], color: 'sky', note: 'Verifier — namespace 일치 필수로 서명 검증' },
      { lines: [32, 33], color: 'emerald', note: 'PublicKey — Ord + Array. BTreeSet/HashMap 키로 사용' },
      { lines: [36, 37], color: 'amber', note: 'Signature — FixedSize 직렬화. ReadExt + Encode' },
    ],
  },
  'batch-verifier': {
    path: 'cryptography/src/lib.rs — BatchVerifier',
    lang: 'rust',
    code: traitsRs,
    highlight: [45, 54],
    desc: 'BatchVerifier — 서명을 누적 후 한 번에 검증.\n랜덤 가중치로 위조 배치 공격(c₁+d, c₂-d) 방지.',
    annotations: [
      { lines: [48, 50], color: 'sky', note: 'add — 서명을 배치에 추가. namespace 포함' },
      { lines: [52, 53], color: 'emerald', note: 'verify(rng) — 랜덤 가중합으로 배치 위조 방지' },
    ],
  },
};
