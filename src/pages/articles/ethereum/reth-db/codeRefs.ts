import type { CodeRef } from '@/components/code/types';

import tablesRs from './codebase/reth/tables.rs?raw';
import cursorRs from './codebase/reth/cursor.rs?raw';
import staticFileRs from './codebase/reth/static_file.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'db-tables': {
    path: 'reth/crates/storage/db/src/tables/mod.rs',
    code: tablesRs,
    lang: 'rust',
    highlight: [9, 36],
    desc: 'tables! 매크로 — 모든 DB 테이블의 Key/Value 타입을 선언. MDBX named database로 각각 생성됩니다.',
    annotations: [
      { lines: [11, 16], color: 'sky', note: '블록 데이터 테이블 — Headers, Bodies, Transactions, Receipts' },
      { lines: [18, 23], color: 'emerald', note: '상태 테이블 — PlainAccountState, PlainStorageState (DupSort)' },
      { lines: [28, 33], color: 'amber', note: 'Trie 테이블 — AccountsTrie, StoragesTrie (상태 루트 계산용)' },
    ],
  },
  'db-cursor': {
    path: 'reth/crates/storage/db-api/src/cursor.rs',
    code: cursorRs,
    lang: 'rust',
    highlight: [8, 21],
    desc: 'DbCursorRO / DbCursorRW — MDBX B+tree 커서. seek, walk_range로 범위 조회, upsert으로 삽입/갱신.',
    annotations: [
      { lines: [10, 11], color: 'sky', note: 'seek_exact — B+tree O(log n) 탐색' },
      { lines: [13, 14], color: 'emerald', note: 'walk_range — 키 범위 순차 순회' },
      { lines: [25, 27], color: 'amber', note: 'upsert — 있으면 갱신, 없으면 삽입' },
    ],
  },
  'db-static-file': {
    path: 'reth/crates/storage/provider/src/providers/static_file/mod.rs',
    code: staticFileRs,
    lang: 'rust',
    highlight: [14, 24],
    desc: 'StaticFileProvider — finalized 블록을 flat file로 아카이브. MDBX 크기 감소 + 순차 읽기 최적화.',
    annotations: [
      { lines: [11, 14], color: 'sky', note: 'MDBX에서 고대 데이터 분리 → DB 크기 감소, 조회 성능 향상' },
      { lines: [16, 19], color: 'emerald', note: 'path + highest_block — 세그먼트별 관리' },
      { lines: [22, 26], color: 'amber', note: 'Headers / Transactions / Receipts 별도 파일' },
    ],
  },
};
