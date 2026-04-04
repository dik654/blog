import type { CodeRef } from '@/components/code/types';

export const storeCodeRefs: Record<string, CodeRef> = {
  'rootmulti-struct': {
    path: 'store/rootmulti/store.go',
    lang: 'go',
    highlight: [1, 22],
    desc: `rootmulti.Store — MultiStore 구현체.
모듈마다 독립된 CommitStore(IAVL)를 관리하고,
Commit 시 모든 서브스토어 해시를 합산해 app_hash 생성.
💡 stores 맵이 핵심 — StoreKey → CommitStore 매핑.`,
    annotations: [
      { lines: [1, 4], color: 'sky', note: 'DB + 로거 + lastCommitInfo (atomic 포인터)' },
      { lines: [6, 9], color: 'emerald', note: 'IAVL 설정 — 캐시 크기, fast node 비활성화 옵션' },
      { lines: [11, 15], color: 'amber', note: 'stores 맵 — StoreKey → CommitStore(IAVL)' },
      { lines: [17, 22], color: 'violet', note: 'listeners + commitHeader — 상태 변경 감지 + 헤더 정보' },
    ],
    code: `// rootmulti.Store — CommitMultiStore 구현
type Store struct {
	db             dbm.DB
	logger         log.Logger
	lastCommitInfo atomic.Pointer[types.CommitInfo]
	// IAVL 설정
	pruningManager      *pruning.Manager
	iavlCacheSize       int
	iavlDisableFastNode bool
	iavlSyncPruning     bool
	// 핵심: 모듈별 서브스토어
	storesParams map[types.StoreKey]storeParams
	stores       map[types.StoreKey]types.CommitStore // 실제 IAVL 트리
	keysByName   map[string]types.StoreKey
	initialVersion int64
	removalMap     map[types.StoreKey]bool
	// 상태 변경 감지 + 블록 헤더
	interBlockCache types.MultiStorePersistentCache
	listeners       map[types.StoreKey]*types.MemoryListener
	commitHeader cmtproto.Header
}`,
  },

  'rootmulti-commit': {
    path: 'store/rootmulti/store.go',
    lang: 'go',
    highlight: [1, 22],
    desc: `Store.Commit() — 모든 서브스토어를 한 번에 커밋.
commitStores()가 각 IAVL 트리를 커밋하고 CommitInfo 생성.
CommitInfo.Hash()가 app_hash — 이더리움의 stateRoot에 해당.
💡 version = previousHeight + 1 — 블록 높이와 스토어 버전이 1:1 대응.`,
    annotations: [
      { lines: [1, 5], color: 'sky', note: '버전 결정 — 이전 커밋 높이 + 1' },
      { lines: [7, 10], color: 'emerald', note: 'commitStores — 모든 서브스토어 IAVL Commit()' },
      { lines: [12, 16], color: 'amber', note: '삭제 예약 스토어 정리 + removalMap 리셋' },
      { lines: [18, 22], color: 'violet', note: '프루닝 + CommitID{Version, Hash} 반환' },
    ],
    code: `func (rs *Store) Commit() types.CommitID {
	var previousHeight, version int64
	if cInfo := rs.lastCommitInfo.Load(); cInfo != nil {
		previousHeight = cInfo.Version
	}
	version = previousHeight + 1
	// 모든 서브스토어 커밋 → CommitInfo 생성
	cInfo := commitStores(version, rs.stores, rs.removalMap)
	cInfo.Timestamp = rs.commitHeader.Time
	rs.lastCommitInfo.Store(cInfo)
	defer rs.flushMetadata(rs.db, version, cInfo)
	// 삭제 예약 스토어 정리
	for sk := range rs.removalMap {
		if _, ok := rs.stores[sk]; ok {
			delete(rs.stores, sk)
			delete(rs.keysByName, sk.Name())
		}
	}
	rs.removalMap = make(map[types.StoreKey]bool)
	rs.handlePruning(version)
	// CommitID.Hash = app_hash
	return types.CommitID{Version: version, Hash: cInfo.Hash()}
}`,
  },
};
