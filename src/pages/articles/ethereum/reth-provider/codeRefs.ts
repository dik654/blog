import type { CodeRef } from '@/components/code/types';

import providerRs from './codebase/reth/provider.rs?raw';
import bundleStateRs from './codebase/reth/bundle_state.rs?raw';
import changesetsRs from './codebase/reth/changesets.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'provider-trait': {
    path: 'reth/crates/storage/provider/src/providers/state/latest.rs',
    code: providerRs,
    lang: 'rust',
    highlight: [10, 18],
    desc: 'StateProvider trait — 모든 상태 소스의 공통 인터페이스. account(), storage(), bytecode_by_hash() 3개 메서드로 상태 접근을 추상화합니다.',
    annotations: [
      { lines: [10, 18], color: 'sky', note: 'StateProvider trait — 핵심 3개 메서드' },
      { lines: [22, 25], color: 'emerald', note: 'LatestStateProviderRef — MDBX tx + StaticFile 조합' },
      { lines: [28, 33], color: 'amber', note: 'account() — PlainAccountState 테이블 직접 조회' },
    ],
  },
  'bundle-state': {
    path: 'reth/crates/revm/src/state/bundle_state.rs',
    code: bundleStateRs,
    lang: 'rust',
    highlight: [10, 19],
    desc: 'BundleState — revm 블록 실행 결과의 상태 변경 캐시. DB 커밋 전까지 메모리에서 빠르게 읽기 가능.',
    annotations: [
      { lines: [12, 13], color: 'sky', note: 'state — 변경된 계정 HashMap' },
      { lines: [14, 15], color: 'emerald', note: 'reverts — reorg용 되돌리기 정보' },
      { lines: [33, 38], color: 'amber', note: 'from_revm() — revm 결과를 Reth 타입으로 변환' },
    ],
  },
  'changeset-tables': {
    path: 'reth/crates/storage/db/src/tables/mod.rs',
    code: changesetsRs,
    lang: 'rust',
    highlight: [8, 20],
    desc: 'ChangeSet 테이블 — AccountChangeSets와 StorageChangeSets로 블록별 변경 이전 값을 저장. HistoricalStateProviderRef가 이를 역추적하여 과거 상태를 복원한다.',
    annotations: [
      { lines: [8, 13], color: 'sky', note: 'AccountChangeSets — 계정 변경 전 값 테이블' },
      { lines: [16, 20], color: 'emerald', note: 'StorageChangeSets — 스토리지 변경 전 값 테이블' },
      { lines: [25, 32], color: 'amber', note: 'HistoricalStateProviderRef — 역추적 Provider' },
      { lines: [36, 48], color: 'violet', note: 'account() — ChangeSet 역순 순회로 과거 값 복원' },
    ],
  },
};
