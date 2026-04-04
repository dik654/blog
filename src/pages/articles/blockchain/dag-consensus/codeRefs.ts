import type { CodeRef } from '@/components/code/types';

import blockRs from './codebase/sui/consensus/core/src/block.rs?raw';
import coreRs from './codebase/sui/consensus/core/src/core.rs?raw';
import committerRs from './codebase/sui/consensus/core/src/base_committer.rs?raw';
import linearizerRs from './codebase/sui/consensus/core/src/linearizer.rs?raw';
import dagStateRs from './codebase/sui/consensus/core/src/dag_state.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'sui-block': {
    path: 'sui/consensus/core/src/block.rs',
    code: blockRs,
    lang: 'rust',
    highlight: [55, 80],
    desc: 'Block은 Sui 합의의 기본 단위입니다. 이전 라운드 블록에 대한 참조(ancestors)와 트랜잭션을 담으며, Narwhal의 Vertex/Certificate 역할을 합니다.',
    annotations: [
      { lines: [29, 31], color: 'sky', note: 'Transaction — 직렬화된 Sui 트랜잭션 바이트' },
      { lines: [59, 65], color: 'emerald', note: 'Block 열거형 — V1/V2 버전 관리' },
      { lines: [69, 80], color: 'amber', note: 'BlockAPI 트레이트 — epoch, round, author, ancestors, transactions' },
    ],
  },

  'sui-core': {
    path: 'sui/consensus/core/src/core.rs',
    code: coreRs,
    lang: 'rust',
    highlight: [61, 116],
    desc: 'Core는 Sui 합의 엔진의 중심입니다. DAG 상태 관리, 블록 제안, UniversalCommitter를 통한 리더 커밋 결정을 총괄합니다.',
    annotations: [
      { lines: [61, 67], color: 'sky', note: 'Core 구조체 — context + transaction_consumer' },
      { lines: [68, 78], color: 'emerald', note: 'block_manager + committer — DAG 관리 + 커밋 결정' },
      { lines: [89, 101], color: 'amber', note: 'leader_schedule + commit_observer + dag_state' },
      { lines: [110, 116], color: 'violet', note: 'ancestor_state_manager + round_tracker — 블록 품질 추적' },
    ],
  },

  'sui-committer': {
    path: 'sui/consensus/core/src/base_committer.rs',
    code: committerRs,
    lang: 'rust',
    highlight: [52, 66],
    desc: 'BaseCommitter는 Bullshark 스타일의 커밋 로직입니다. 리더 블록에 대해 direct-commit/skip 또는 indirect-commit/skip을 결정합니다.',
    annotations: [
      { lines: [28, 40], color: 'sky', note: 'BaseCommitterOptions — wave_length, leader_offset, round_offset' },
      { lines: [56, 66], color: 'emerald', note: 'BaseCommitter 구조체 — context + leader_schedule + dag_state' },
      { lines: [86, 117], color: 'amber', note: 'try_direct_decide — 2f+1 지지/비난 검사' },
      { lines: [122, 145], color: 'violet', note: 'try_indirect_decide — 앵커 기반 간접 커밋' },
    ],
  },

  'sui-linearizer': {
    path: 'sui/consensus/core/src/linearizer.rs',
    code: linearizerRs,
    lang: 'rust',
    highlight: [52, 61],
    desc: 'Linearizer는 커밋된 리더 블록의 인과적 히스토리를 수집하여 전체 순서(sub-dag)를 결정합니다. BFS 탐색 후 (round, author) 순서로 정렬합니다.',
    annotations: [
      { lines: [52, 56], color: 'sky', note: 'Linearizer 구조체 — context + dag_state' },
      { lines: [65, 84], color: 'emerald', note: 'collect_sub_dag_and_commit — 리더에서 서브DAG 수집' },
      { lines: [159, 221], color: 'amber', note: 'linearize_sub_dag — BFS + 정렬로 전체 순서 결정' },
      { lines: [226, 237], color: 'violet', note: 'handle_commit — 커밋 리더 목록에서 서브DAG 일괄 생성' },
    ],
  },

  'sui-dag-state': {
    path: 'sui/consensus/core/src/dag_state.rs',
    code: dagStateRs,
    lang: 'rust',
    highlight: [33, 97],
    desc: 'DagState는 DAG의 인메모리 상태를 관리합니다. 최근 블록 캐시, 커밋 상태, 쓰레시홀드 클럭, GC 라운드 등을 포함합니다.',
    annotations: [
      { lines: [40, 53], color: 'sky', note: 'DagState 구조체 — genesis + recent_blocks + recent_refs_by_authority' },
      { lines: [59, 68], color: 'emerald', note: 'evicted_rounds + highest_accepted_round — GC 관리' },
      { lines: [70, 82], color: 'amber', note: 'last_commit + scoring_subdag — 커밋 및 평판 점수' },
      { lines: [83, 97], color: 'violet', note: 'pending_commit_votes + blocks_to_write — 쓰기 버퍼' },
    ],
  },
};
