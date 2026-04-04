import type { CodeRef } from './codeRefsTypes';
import ed25519Rs from './codebase/commonware/ed25519_scheme.rs?raw';
import secp256r1Rs from './codebase/commonware/secp256r1_scheme.rs?raw';

export const schemesCodeRefs: Record<string, CodeRef> = {
  'ed25519-signer': {
    path: 'cryptography/src/ed25519/scheme.rs — Signer impl',
    lang: 'rust',
    code: ed25519Rs,
    highlight: [1, 27],
    desc: 'ed25519 서명 구현.\ned25519-consensus 크레이트 — 합의 컨텍스트의 엄격한 검증 규칙.\nSecret<SigningKey>로 비밀키 메모리 보호.',
    annotations: [
      { lines: [7, 8], color: 'sky', note: 'Secret<SigningKey> — zeroize 적용 메모리 보호' },
      { lines: [15, 19], color: 'emerald', note: 'sign — union_unique(ns, msg) 후 서명' },
      { lines: [22, 25], color: 'amber', note: 'public_key — expose로 VerificationKey 추출' },
    ],
  },
  'ed25519-verifier': {
    path: 'cryptography/src/ed25519/scheme.rs — Verifier impl',
    lang: 'rust',
    code: ed25519Rs,
    highlight: [29, 44],
    desc: 'ed25519 검증.\nOrd + PartialOrd + Hash 구현 → BTreeSet 키로 사용 가능.\nPublicKey 32B, Signature 64B.',
    annotations: [
      { lines: [30, 32], color: 'sky', note: 'Ord + PartialOrd + Hash — 정렬/집합 연산 지원' },
      { lines: [35, 40], color: 'emerald', note: 'verify — union_unique 후 검증' },
    ],
  },
  'secp256r1-signer': {
    path: 'cryptography/src/secp256r1/standard.rs — Signer impl',
    lang: 'rust',
    code: secp256r1Rs,
    highlight: [1, 33],
    desc: 'secp256r1(NIST P-256) 서명.\nRFC 6979 결정론적 서명 + BIP 62 low-s 정규화.\nSHA-256 프리해시 후 ECDSA 서명.',
    annotations: [
      { lines: [16, 22], color: 'sky', note: 'sha256 + sign_prehash — 프리해시 서명' },
      { lines: [23, 23], color: 'emerald', note: 'normalize_s — BIP 62 low-s 정규화 (malleability 방지)' },
    ],
  },
  'secp256r1-recover': {
    path: 'cryptography/src/secp256r1/recoverable.rs',
    lang: 'rust',
    code: secp256r1Rs,
    highlight: [37, 47],
    desc: 'secp256r1 Recoverable variant.\n서명 65B (r + s + v) — v 바이트로 공개키 복원.\nEIP-712 스타일 서명 검증에 활용.',
    annotations: [
      { lines: [42, 44], color: 'sky', note: 'recover_signer — v 바이트로 공개키 복원' },
    ],
  },
};
