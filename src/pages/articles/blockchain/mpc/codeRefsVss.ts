import type { CodeRef } from '@/components/code/types';
import feldmanVssGo from './codebase/tss-lib/crypto/vss/feldman_vss.go?raw';

export const vssCodeRefs: Record<string, CodeRef> = {
  'vss-create': {
    path: 'tss-lib/crypto/vss/feldman_vss.go',
    code: feldmanVssGo,
    lang: 'go',
    highlight: [62, 93],
    annotations: [
      { lines: [62, 68], color: 'sky', note: 'Create — threshold, secret, indexes로 VSS 공유 생성' },
      { lines: [80, 85], color: 'emerald', note: 'Feldman 커밋먼트 — v[i] = g^a_i (검증 가능)' },
      { lines: [87, 93], color: 'amber', note: '각 참가자에게 다항식 평가값 f(id) 배포' },
    ],
    desc: 'Feldman VSS의 Create 함수입니다. 비밀을 상수항으로 갖는 차수 t 다항식을 랜덤 생성하고, 각 참가자 ID에서 평가하여 share를 만듭니다. 커밋먼트 v[i] = g^a_i로 검증 가능합니다.',
  },

  'vss-verify': {
    path: 'tss-lib/crypto/vss/feldman_vss.go',
    code: feldmanVssGo,
    lang: 'go',
    highlight: [95, 114],
    annotations: [
      { lines: [95, 98], color: 'sky', note: 'Verify — threshold, vs 벡터 유효성 확인' },
      { lines: [101, 113], color: 'emerald', note: '∏ v_j^(id^j) == g^(share) 검증 (Feldman 조건)' },
    ],
    desc: '각 참가자가 받은 share가 올바른지 커밋먼트로 검증합니다. g^σ_i == v_0 · v_1^i · v_2^(i²) · ... 를 확인합니다.',
  },

  'vss-reconstruct': {
    path: 'tss-lib/crypto/vss/feldman_vss.go',
    code: feldmanVssGo,
    lang: 'go',
    highlight: [116, 146],
    annotations: [
      { lines: [116, 120], color: 'sky', note: 'ReConstruct — threshold 이상의 share로 비밀 복원' },
      { lines: [129, 143], color: 'emerald', note: '라그랑주 보간 — ∏ x_j/(x_j - x_i) 계수 계산' },
    ],
    desc: 'Lagrange 보간으로 비밀을 복원합니다. t+1개 이상의 share가 필요하며, 라그랑주 계수를 곱해 합산합니다.',
  },
};
