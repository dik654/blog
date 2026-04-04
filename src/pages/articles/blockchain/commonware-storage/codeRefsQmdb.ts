import type { CodeRef } from '@/components/code/types';

import anyDb from './codebase/commonware/qmdb_any_db.rs?raw';
import currentDb from './codebase/commonware/qmdb_current_db.rs?raw';
import grafting from './codebase/commonware/grafting.rs?raw';
import currentProof from './codebase/commonware/current_proof.rs?raw';

export const qmdbRefs: Record<string, CodeRef> = {
  'any-db': {
    path: 'storage/src/qmdb/any/db.rs',
    code: anyDb,
    lang: 'rust',
    highlight: [4, 23],
    desc: 'Any DB 구조체 — AuthenticatedLog + snapshot + inactivity_floor. 모든 쓰기를 append-only 로그에 기록.',
    annotations: [
      { lines: [6, 8], color: 'sky', note: 'log — 인증된 Journal (MMR 머클화)' },
      { lines: [10, 12], color: 'emerald', note: 'inactivity_floor — 비활성 경계' },
      { lines: [17, 19], color: 'amber', note: 'snapshot — 활성 키→위치 인덱스' },
    ],
  },
  'any-get': {
    path: 'storage/src/qmdb/any/db.rs',
    code: anyDb,
    lang: 'rust',
    highlight: [26, 39],
    desc: 'get() — snapshot에서 위치 찾기 → log에서 값 읽기. O(1) 해시 조회 + O(1) 순차 읽기.',
    annotations: [
      { lines: [28, 29], color: 'sky', note: 'snapshot.get(key) — 해시 인덱스 조회' },
      { lines: [31, 35], color: 'emerald', note: 'log.reader().read(loc) — 실제 값 읽기' },
    ],
  },
  'any-proof': {
    path: 'storage/src/qmdb/any/db.rs',
    code: anyDb,
    lang: 'rust',
    highlight: [41, 46],
    desc: 'proof() — historical_proof 위임. MMR range proof + 연산 목록 반환.',
  },
  'current-db': {
    path: 'storage/src/qmdb/current/db.rs',
    code: currentDb,
    lang: 'rust',
    highlight: [4, 22],
    desc: 'Current DB — Any + BitmapBatch(활성 비트맵) + grafted_mmr. 정규 루트 = hash(ops_root || grafted_root).',
    annotations: [
      { lines: [6, 7], color: 'sky', note: 'any — 이력 증명 위임' },
      { lines: [9, 11], color: 'emerald', note: 'status — 활성/비활성 비트맵' },
      { lines: [13, 15], color: 'amber', note: 'grafted_mmr — 비트맵+ops 결합 MMR' },
      { lines: [20, 22], color: 'violet', note: 'root — hash(ops || grafted [|| partial])' },
    ],
  },
  'grafting': {
    path: 'storage/src/qmdb/current/grafting.rs',
    code: grafting,
    lang: 'rust',
    highlight: [1, 28],
    desc: 'Grafting — ops MMR 서브트리 + 비트맵 청크를 하나의 grafted leaf로 결합. 증명 크기 ~50% 절감.',
    annotations: [
      { lines: [14, 15], color: 'sky', note: 'grafting height = log2(chunk_size_bits)' },
      { lines: [19, 22], color: 'emerald', note: 'chunk_idx → ops Position 변환' },
      { lines: [25, 28], color: 'amber', note: 'grafted leaf = hash(chunk || subtree_root)' },
    ],
  },
  'current-proof': {
    path: 'storage/src/qmdb/current/proof.rs',
    code: currentProof,
    lang: 'rust',
    highlight: [12, 27],
    desc: 'OperationProof — 비트맵 활성 확인 + RangeProof 검증으로 "현재 값" 증명.',
    annotations: [
      { lines: [12, 15], color: 'sky', note: 'OperationProof 구조: loc + chunk + range_proof' },
      { lines: [19, 21], color: 'emerald', note: 'get_bit_from_chunk — 활성 비트 확인' },
      { lines: [24, 25], color: 'amber', note: 'range_proof.verify — grafted 루트 검증' },
    ],
  },
};
