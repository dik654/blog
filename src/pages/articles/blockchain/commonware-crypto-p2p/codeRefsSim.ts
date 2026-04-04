import type { CodeRef } from './codeRefsTypes';
import simRs from './codebase/commonware/p2p_simulated.rs?raw';

export const simCodeRefs: Record<string, CodeRef> = {
  'sim-config': {
    path: 'p2p/src/simulated/mod.rs — Config + Link',
    lang: 'rust',
    code: simRs,
    highlight: [1, 16],
    desc: '시뮬레이션 링크/설정.\nLink: latency + jitter + success_rate로 네트워크 특성 모델링.\nConfig: 메시지 크기 제한, block 시 연결 해제 여부.',
    annotations: [
      { lines: [4, 7], color: 'sky', note: 'Link — 지연/지터/성공률로 현실적 네트워크 모델링' },
      { lines: [10, 14], color: 'emerald', note: 'Config — max_size, disconnect_on_block 등 설정' },
    ],
  },
  'sim-deterministic': {
    path: 'p2p/src/simulated/mod.rs — 결정론적 실행',
    lang: 'rust',
    code: simRs,
    highlight: [18, 38],
    desc: '결정론적 시뮬레이션 실행 모델.\n동일 seed → 동일 메시지 순서 → 동일 결과.\n4가지 장애: 파티션/비잔틴/손실/크래시.',
    annotations: [
      { lines: [20, 22], color: 'sky', note: 'deterministic::Runner — seed 기반 재현 가능 실행' },
      { lines: [25, 29], color: 'emerald', note: '4가지 장애 시뮬레이션 유형' },
      { lines: [32, 37], color: 'amber', note: 'progressive filling — max-min 공정 대역폭 할당' },
    ],
  },
};
