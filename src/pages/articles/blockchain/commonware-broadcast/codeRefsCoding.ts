import type { CodeRef } from '@/components/code/types';
import schemeRs from './codebase/commonware/coding_scheme.rs?raw';
import zodaRs from './codebase/commonware/zoda_impl.rs?raw';

export const codeRefsCoding: Record<string, CodeRef> = {
  'coding-scheme': {
    path: 'coding/src/lib.rs', code: schemeRs, lang: 'rust',
    highlight: [3, 26],
    desc: 'Scheme trait — encode/check/decode 3단계 이레이저 코딩 추상화.\nPhasedScheme — strong/weak 샤드 분리로 검증 최적화.',
    annotations: [
      { lines: [3, 8], color: 'sky', note: 'Scheme trait — Commitment + Shard + CheckedShard 연관 타입' },
      { lines: [10, 25], color: 'emerald', note: 'encode → check → decode 3단계. 결정론적 인코딩 보장' },
      { lines: [29, 54], color: 'amber', note: 'PhasedScheme — weaken()으로 Strong→Weak 변환. 로컬 vs 전달 검증 분리' },
    ],
  },
  'zoda-impl': {
    path: 'coding/src/zoda/mod.rs', code: zodaRs, lang: 'rust',
    highlight: [17, 47],
    desc: 'ZODA 구현 — Reed-Solomon + Hadamard + Fiat-Shamir.\n신뢰 설정 없이 샤드 유효성 즉시 검증 가능 (ValidatingScheme).',
    annotations: [
      { lines: [2, 8], color: 'sky', note: 'StrongShard — 데이터 행 + Merkle proof + checksum. 직접 수신자만 보유' },
      { lines: [11, 14], color: 'emerald', note: 'WeakShard — proof + data만. 전달 시 checksum/root 제거' },
      { lines: [17, 47], color: 'amber', note: 'encode() — 행렬 배치 → RS 인코딩 → Merkle 커밋 → Fiat-Shamir → 체크섬 → 샤드 분배' },
    ],
  },
  'zoda-check': {
    path: 'coding/src/zoda/mod.rs', code: zodaRs, lang: 'rust',
    highlight: [49, 58],
    desc: 'ZODA check — Merkle proof 검증 + 체크섬 비교.\n샤드 하나만 검증해도 전체 데이터 유효성 확신 가능 (ValidatingScheme).',
    annotations: [
      { lines: [49, 53], color: 'sky', note: 'weaken() — StrongShard에서 checksum/root 제거 → WeakShard 생성' },
      { lines: [55, 58], color: 'emerald', note: 'check() — Merkle inclusion 검증 + shard·H == encoded_checksum 비교' },
    ],
  },
};
