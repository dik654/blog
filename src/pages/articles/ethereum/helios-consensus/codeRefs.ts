import type { CodeRef } from '@/components/code/types';

import verifyRs from './codebase/helios/consensus/src/verify.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  // 본문 대응: VerifyTrace 단계 1~2 — 비트맵 필터링 + 정족수 검사
  'hl-verify-filter': {
    path: 'helios/consensus/src/verify.rs',
    code: verifyRs,
    lang: 'rust',
    highlight: [27, 44],
    desc: '참여 비트맵 필터링 + 2/3 정족수 검사. pks와 bits를 zip하여 bit=1인 공개키만 추출, 정수 비교로 2/3 임계값 확인.',
    annotations: [
      { lines: [27, 31], color: 'sky', note: '단계 1: bits.iter()로 참여 여부 필터링 → 보통 480~510개' },
      { lines: [41, 44], color: 'amber', note: '단계 2: participants*3 < total*2 → 최소 342명(66.8%)' },
    ],
  },

  // 본문 대응: VerifyTrace 단계 3 — 집계 공개키 합산 (G1 점 덧셈)
  'hl-verify-bls': {
    path: 'helios/consensus/src/verify.rs',
    code: verifyRs,
    lang: 'rust',
    highlight: [55, 100],
    desc: 'BLS 검증 — G1 점 합산 → signing_root → 페어링 비교. BLS 선형성으로 개별 검증 486회를 집계 1회로 대체.',
    annotations: [
      { lines: [55, 57], color: 'sky', note: '단계 3: G1 점 fold 합산 → agg_pk (48B)' },
      { lines: [68, 78], color: 'emerald', note: '단계 4: 도메인 분리 (0x07) + fork_version → signing_root' },
      { lines: [86, 97], color: 'amber', note: '단계 5: e(agg_pk, H(m)) == e(G, sig) → 쌍선형성 검증' },
    ],
  },

  // 본문 대응: VerifyTrace 단계 4 — signing_root 도메인 분리 (상세)
  'hl-verify-root': {
    path: 'helios/consensus/src/verify.rs',
    code: verifyRs,
    lang: 'rust',
    highlight: [59, 78],
    desc: 'signing_root 계산 — DOMAIN_SYNC_COMMITTEE(0x07) + fork_version + genesis_root 결합. 3중 보호로 서명 재사용 방지.',
    annotations: [
      { lines: [63, 67], color: 'sky', note: 'compute_domain: 도메인 타입 + 포크 + 제네시스 루트 결합' },
      { lines: [68, 71], color: 'emerald', note: 'DOMAIN_SYNC_COMMITTEE = 0x07, fork = 0x04 (Deneb)' },
      { lines: [72, 78], color: 'amber', note: 'compute_signing_root: SSZ(header) + domain → 32B 해시' },
    ],
  },
};
