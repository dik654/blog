import type { CodeRef } from '@/components/code/types';

import chunkTrackerRs from './codebase/rqbit/crates/librqbit/src/chunk_tracker.rs?raw';
import pieceTrackerRs from './codebase/rqbit/crates/librqbit/src/piece_tracker.rs?raw';

export const trackerRefs: Record<string, CodeRef> = {
  'chunk-tracker': {
    path: 'librqbit/src/chunk_tracker.rs',
    code: chunkTrackerRs,
    lang: 'rust',
    highlight: [15, 45],
    desc: 'ChunkTracker는 다운로드 진행 상태의 핵심입니다. 비트필드 3개로 피스 상태를 추적합니다.',
    annotations: [
      { lines: [24, 24], color: 'sky', note: 'queue_pieces — 다운로드 필요한 피스. 요청 시작 시 0으로 전환' },
      { lines: [27, 28], color: 'emerald', note: 'chunk_status — 청크 단위 수신 추적 (피스 내 부분 완료 감지)' },
      { lines: [31, 31], color: 'amber', note: 'have — SHA-1 검증 완료된 피스 비트맵' },
      { lines: [34, 35], color: 'violet', note: 'selected — 사용자가 선택한 파일에 해당하는 피스' },
    ],
  },

  'have-needed-selected': {
    path: 'librqbit/src/chunk_tracker.rs',
    code: chunkTrackerRs,
    lang: 'rust',
    highlight: [47, 70],
    desc: 'HaveNeededSelected는 다운로드 진행률 요약입니다. have/needed/selected 바이트를 추적합니다.',
    annotations: [
      { lines: [49, 50], color: 'sky', note: 'have_bytes — 검증 완료된 바이트 수' },
      { lines: [52, 53], color: 'emerald', note: 'needed_bytes — 아직 필요한 바이트 수' },
      { lines: [55, 56], color: 'amber', note: 'selected_bytes — 사용자가 선택한 전체 바이트 수' },
    ],
  },

  'piece-tracker': {
    path: 'librqbit/src/piece_tracker.rs',
    code: pieceTrackerRs,
    lang: 'rust',
    highlight: [29, 82],
    desc: 'PieceTracker는 ChunkTracker를 감싸서 in-flight 피스를 관리합니다. 느린 피어에서 빠른 피어로 재할당(steal)합니다.',
    annotations: [
      { lines: [29, 32], color: 'sky', note: 'InflightPiece — 어떤 피어가 언제부터 다운로드 중인지 기록' },
      { lines: [36, 46], color: 'emerald', note: 'AcquireResult — Reserved / Stolen / NoneAvailable' },
      { lines: [79, 82], color: 'amber', note: 'PieceTracker — chunks + inflight HashMap' },
    ],
  },
};
