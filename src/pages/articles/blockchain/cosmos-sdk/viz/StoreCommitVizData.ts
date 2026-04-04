import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: 'MultiStore 구조 & Commit 흐름', body: '모듈별 IAVL 트리를 관리하고 Commit 시 app_hash를 생성합니다.' },
  { label: '① 모듈별 서브스토어', body: '각 모듈이 StoreKey로 독립된 KVStore에 접근합니다.' },
  { label: '② commitStores — 서브스토어 커밋', body: 'IAVL 트리별 Commit()으로 해시를 재계산합니다.' },
  { label: '③ CommitInfo.Hash() → app_hash', body: '서브스토어 해시를 Merkle 합산하여 app_hash(=stateRoot)를 생성합니다.' },
];

export const STEP_REFS = ['rootmulti-struct', 'rootmulti-struct', 'rootmulti-commit', 'rootmulti-commit'];
export const STEP_LABELS = ['store.go — rootmulti.Store', 'store.go — StoreKey → KVStore', 'store.go — commitStores()', 'store.go — CommitInfo.Hash()'];

export const STORES = [
  { label: 'bank', color: '#6366f1' },
  { label: 'staking', color: '#8b5cf6' },
  { label: 'gov', color: '#10b981' },
  { label: 'ibc', color: '#f59e0b' },
];
