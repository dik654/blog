import type { CodeRef } from '@/components/code/types';
import ed25519Go from './codebase/cometbft/crypto/ed25519/ed25519.go?raw';
import proofGo from './codebase/cometbft/crypto/merkle/proof.go?raw';
import tmhashGo from './codebase/cometbft/crypto/tmhash/tmhash.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'ed25519-sign': {
    path: 'crypto/ed25519/ed25519.go', code: ed25519Go,
    lang: 'go', highlight: [26, 31],
    desc: 'Sign() — privKey(64B)로 메시지 서명',
    annotations: [
      { lines: [27, 29], color: 'sky', note: 'privKey 길이 64B 아니면 panic' },
      { lines: [30, 30], color: 'emerald', note: 'ed25519.Sign(): 내부에서 2회 해시 (RFC 8032)' },
    ],
  },
  'ed25519-verify': {
    path: 'crypto/ed25519/ed25519.go', code: ed25519Go,
    lang: 'go', highlight: [54, 59],
    desc: 'VerifySignature() — pubKey로 서명 검증',
    annotations: [
      { lines: [55, 56], color: 'sky', note: 'sig 길이 != 64이면 즉시 false' },
      { lines: [58, 58], color: 'emerald', note: 'ed25519.Verify(pubKey, msg, sig)' },
    ],
  },
  'ed25519-addr': {
    path: 'crypto/ed25519/ed25519.go', code: ed25519Go,
    lang: 'go', highlight: [45, 50],
    desc: 'Address() — SHA256(pubKey)[:20]',
    annotations: [
      { lines: [46, 48], color: 'sky', note: 'pubKey 32B 검증' },
      { lines: [49, 49], color: 'amber', note: 'tmhash.SumTruncated: SHA256의 첫 20바이트' },
    ],
  },
  'merkle-hash': {
    path: 'crypto/merkle/proof.go', code: proofGo,
    lang: 'go', highlight: [76, 88],
    desc: 'HashFromByteSlices() — 재귀 이진 분할로 머클 루트 생성',
    annotations: [
      { lines: [78, 79], color: 'sky', note: '0개: emptyHash()' },
      { lines: [80, 81], color: 'emerald', note: '1개: leafHash(0x00 ∥ item)' },
      { lines: [83, 86], color: 'amber', note: 'getSplitPoint로 분할 → 재귀 → innerHash' },
    ],
  },
  'merkle-verify': {
    path: 'crypto/merkle/proof.go', code: proofGo,
    lang: 'go', highlight: [29, 44],
    desc: 'Proof.Verify() — 형제 경로로 루트 복원 후 비교',
    annotations: [
      { lines: [30, 33], color: 'sky', note: 'leafHash 계산 → 입력값과 비교' },
      { lines: [35, 38], color: 'emerald', note: 'computeRootHash → rootHash와 비교' },
    ],
  },
  'merkle-leaf-inner': {
    path: 'crypto/merkle/proof.go', code: proofGo,
    lang: 'go', highlight: [90, 103],
    desc: 'leafHash / innerHash — 프리픽스로 구분',
    annotations: [
      { lines: [91, 94], color: 'sky', note: 'leafHash: 0x00 ∥ leaf → SHA256' },
      { lines: [97, 102], color: 'amber', note: 'innerHash: 0x01 ∥ left ∥ right → SHA256' },
    ],
  },
  'tmhash-sum': {
    path: 'crypto/tmhash/tmhash.go', code: tmhashGo,
    lang: 'go', highlight: [14, 23],
    desc: 'Sum / SumTruncated — SHA256 전체 또는 20바이트 절삭',
    annotations: [
      { lines: [14, 17], color: 'sky', note: 'Sum(): SHA256 전체 32바이트 반환' },
      { lines: [21, 23], color: 'amber', note: 'SumTruncated(): SHA256[:20] — 주소용' },
    ],
  },
};
