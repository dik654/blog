import type { CodeRef } from '@/components/code/types';
import kvRaw from './codebase/prysm/beacon-chain/db/kv/kv.go?raw';
import blocksRaw from './codebase/prysm/beacon-chain/db/kv/blocks.go?raw';
import stateRaw from './codebase/prysm/beacon-chain/db/kv/state.go?raw';

export const beaconDBCodeRefs: Record<string, CodeRef> = {
  'kv-store': {
    path: 'beacon-chain/db/kv/kv.go — NewKVStore()',
    lang: 'go', code: kvRaw, highlight: [3, 37],
    desc: 'NewKVStore — BoltDB 열기 + 버킷 생성 + Ristretto 캐시 초기화',
    annotations: [
      { lines: [14, 18], color: 'sky', note: 'BoltDB 파일 열기 (1초 타임아웃)' },
      { lines: [23, 29], color: 'emerald', note: '필요한 버킷이 없으면 자동 생성' },
      { lines: [34, 35], color: 'amber', note: 'Ristretto 캐시 (블록·상태)' },
    ],
  },
  'save-block': {
    path: 'beacon-chain/db/kv/blocks.go — SaveBlock()',
    lang: 'go', code: blocksRaw, highlight: [3, 21],
    desc: 'SaveBlock — 블록 SSZ 직렬화 → blocksBucket 저장 + 슬롯 인덱스',
    annotations: [
      { lines: [5, 7], color: 'sky', note: 'HashTreeRoot 계산 (키)' },
      { lines: [8, 11], color: 'emerald', note: 'SSZ 직렬화 (값)' },
      { lines: [14, 15], color: 'amber', note: 'blocksBucket에 root→enc 저장' },
      { lines: [18, 18], color: 'violet', note: '슬롯→루트 인덱스 저장' },
    ],
  },
  'get-block': {
    path: 'beacon-chain/db/kv/blocks.go — Block()',
    lang: 'go', code: blocksRaw, highlight: [24, 42],
    desc: 'Block — 캐시 우선 조회 → 캐시 미스 시 BoltDB에서 역직렬화',
    annotations: [
      { lines: [26, 28], color: 'sky', note: 'Ristretto 캐시 히트 시 즉시 반환' },
      { lines: [31, 37], color: 'emerald', note: 'BoltDB 읽기 트랜잭션 + 역직렬화' },
    ],
  },
  'save-state': {
    path: 'beacon-chain/db/kv/state.go — SaveState()',
    lang: 'go', code: stateRaw, highlight: [3, 12],
    desc: 'SaveState — 비콘 상태를 SSZ 직렬화 후 stateBucket에 저장',
    annotations: [
      { lines: [5, 7], color: 'sky', note: 'SSZ 직렬화' },
      { lines: [9, 11], color: 'emerald', note: 'stateBucket에 root→enc 저장' },
    ],
  },
};
