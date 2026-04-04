import type { CodeRef } from '@/components/code/types';

import gcGo from './codebase/kubo/gc/gc.go?raw';
import storageGo from './codebase/kubo/core/node/storage.go?raw';
import pinGo from './codebase/kubo/core/coreapi/pin.go?raw';

export const gcRefs: Record<string, CodeRef> = {
  'kubo-gc-main': {
    path: 'gc/gc.go',
    code: gcGo,
    lang: 'go',
    highlight: [41, 152],
    desc: 'GC는 mark-and-sweep 방식의 가비지 컬렉션입니다. 핀된 블록의 자손을 모두 마킹한 후, 마킹되지 않은 블록을 삭제합니다.',
    annotations: [
      { lines: [50, 56], color: 'sky', note: 'GCLock 획득 → DAGService 생성 (오프라인)' },
      { lines: [65, 66], color: 'emerald', note: 'ColoredSet — 핀된 블록 + 자손을 마킹' },
      { lines: [84, 85], color: 'amber', note: 'AllKeysChan — 블록스토어 전체 키 순회' },
      { lines: [105, 106], color: 'violet', note: 'gcs.Has(k) 체크 → 미마킹이면 DeleteBlock' },
    ],
  },
  'kubo-colored-set': {
    path: 'gc/gc.go',
    code: gcGo,
    lang: 'go',
    highlight: [210, 297],
    desc: 'ColoredSet은 핀된 블록의 집합을 계산합니다. RecursiveKeys → 자손 순회, DirectKeys → 직접 추가, InternalPins → 내부 핀 순서로 마킹합니다.',
    annotations: [
      { lines: [216, 216], color: 'sky', note: 'gcs — CID 집합 (메모리, 향후 블룸 필터 가능)' },
      { lines: [229, 230], color: 'emerald', note: 'RecursiveKeys → Descendants로 자손 순회' },
      { lines: [273, 279], color: 'amber', note: 'DirectKeys → 직접 핀 CID 추가' },
      { lines: [281, 282], color: 'violet', note: 'InternalPins → 피너 내부 메타데이터 보존' },
    ],
  },
  'kubo-storage-ctor': {
    path: 'core/node/storage.go',
    code: storageGo,
    lang: 'go',
    highlight: [29, 77],
    desc: 'BaseBlockstoreCtor는 캐시 + 검증 레이어를 쌓은 블록스토어를 생성합니다. ProvideStrategy가 "all"이면 Put 시 즉시 DHT 제공합니다.',
    annotations: [
      { lines: [44, 47], color: 'sky', note: 'ProvideStrategyAll → blockstore.Provider 연결' },
      { lines: [50, 55], color: 'emerald', note: '생성 순서: Datastore→VerifBS→Cache→IdStore' },
      { lines: [62, 64], color: 'amber', note: 'HashOnRead — 읽기 시 해시 검증 (보안)' },
    ],
  },
  'kubo-pin-add': {
    path: 'core/coreapi/pin.go',
    code: pinGo,
    lang: 'go',
    highlight: [24, 48],
    desc: 'PinAPI.Add는 경로를 해석하고 DAG 노드를 핀합니다. PinLock으로 GC와 경합을 방지한 뒤 pinning.Flush()로 디스크에 기록합니다.',
    annotations: [
      { lines: [28, 31], color: 'sky', note: 'ResolveNode — 경로 → DAG 노드 해석' },
      { lines: [40, 40], color: 'emerald', note: 'PinLock — GC와 동시 실행 방지' },
      { lines: [42, 47], color: 'amber', note: 'Pin → Flush — 핀 등록 후 디스크 반영' },
    ],
  },
};
