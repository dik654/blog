export const PINNING_STEPS = [
  { label: 'Pinning & GC 개요' }, { label: 'Mark 단계' },
  { label: 'Sweep 단계' }, { label: '저장소 계층' },
];

export const BLOCKSTORE_LAYERS = [
  { label: 'Application Layer', color: '#6366f1', desc: '앱에서 블록 접근' },
  { label: 'Caching Layer', color: '#0ea5e9', desc: 'Two-Queue (LRU+LFU) 캐시' },
  { label: 'Validation Layer', color: '#10b981', desc: '블록 해시 무결성 검증' },
  { label: 'GC Layer', color: '#f59e0b', desc: '가비지 컬렉션 락 관리' },
  { label: 'Base Blockstore', color: '#ef4444', desc: '기본 블록 저장소 구현' },
  { label: 'Datastore Backend', color: '#6b7280', desc: 'Badger / LevelDB / Flatfs' },
];

export const GC_CODE = `// GC 핵심 로직 - Mark and Sweep
func GC(ctx context.Context, bs bstore.GCBlockstore,
  dstor dstore.Datastore, pn pin.Pinner, ...) {
  unlocker := bs.GCLock(ctx) // GC 락 획득
  defer unlocker.Unlock(ctx)
  // Mark: 보존할 블록 집합 생성
  gcs, err := ColoredSet(ctx, pn, ds,
    bestEffortRoots, output)
  // Sweep: 마킹 안 된 블록 삭제
  keychain, _ := bs.AllKeysChan(ctx)
  for k := range keychain {
    if !gcs.Has(k) {
      bs.DeleteBlock(ctx, k) // 삭제
    }
  }
}`;

export const GC_ANNOTATIONS = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: 'GC 락 -- 읽기/쓰기 보호' },
  { lines: [6, 7] as [number, number], color: 'emerald' as const, note: 'Mark: pin된 블록 집합' },
  { lines: [9, 13] as [number, number], color: 'amber' as const, note: 'Sweep: 미마킹 블록 삭제' },
];
