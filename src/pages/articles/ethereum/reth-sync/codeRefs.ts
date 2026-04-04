import type { CodeRef } from '@/components/code/types';

import pipelineRs from './codebase/reth/pipeline_sync.rs?raw';
import snapRs from './codebase/reth/snap_sync.rs?raw';
import exexRs from './codebase/reth/exex.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'sync-pipeline': {
    path: 'reth/crates/stages/stages/src/stages/mod.rs',
    code: pipelineRs,
    lang: 'rust',
    highlight: [6, 12],
    desc: 'Pipeline — Stage 순서 실행 관리자. Headers → Bodies → Execution → Merkle 순으로 tip까지 진행.',
    annotations: [
      { lines: [8, 12], color: 'sky', note: 'stages + progress + tip — 파이프라인 상태' },
      { lines: [15, 21], color: 'emerald', note: 'Stage trait — execute + unwind 인터페이스' },
      { lines: [24, 35], color: 'amber', note: 'run() — 전체 Stage 반복 실행 루프' },
    ],
  },
  'sync-snap': {
    path: 'reth/crates/net/downloaders/src/snap/mod.rs',
    code: snapRs,
    lang: 'rust',
    highlight: [7, 14],
    desc: 'SnapSync — 전체 블록 재실행 없이 최신 상태를 피어에서 직접 다운로드. Merkle proof로 무결성 검증.',
    annotations: [
      { lines: [9, 14], color: 'sky', note: 'account + storage fetcher + proof verifier' },
      { lines: [17, 26], color: 'emerald', note: 'fetch_account_range — 해시 범위로 계정 다운로드' },
      { lines: [22, 24], color: 'amber', note: 'Merkle proof 검증 → DB 기록' },
    ],
  },
  'sync-exex': {
    path: 'reth/crates/exex/exex/src/notification.rs',
    code: exexRs,
    lang: 'rust',
    highlight: [7, 20],
    desc: 'ExExNotification — 블록 커밋/reorg/revert 이벤트를 ExEx 확장 모듈에 브로드캐스트.',
    annotations: [
      { lines: [9, 11], color: 'sky', note: 'ChainCommitted — 새 블록 커밋 이벤트' },
      { lines: [13, 16], color: 'emerald', note: 'ChainReorged — reorg 시 old + new 체인' },
      { lines: [24, 28], color: 'amber', note: 'ExExManager — broadcast 채널로 전파' },
    ],
  },
};
