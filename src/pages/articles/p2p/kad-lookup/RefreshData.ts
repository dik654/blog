export const DO_REFRESH_CODE = `func (tab *Table) doRefresh(done chan struct{}) {
    defer close(done)

    // 1. DB에서 이전에 본 노드 로드
    tab.loadSeedNodes()

    // 2. 자기 자신 ID로 탐색 -> 이웃 노드 발견
    tab.net.lookupSelf()

    // 3. 랜덤 타겟 3회 탐색 -> 버킷 골고루 채움
    for i := 0; i < 3; i++ {
        tab.net.lookupRandom()
    }
}`;

export const LOAD_SEEDS_CODE = `func (tab *Table) loadSeedNodes() {
    // DB에서 최대 30개, 최근 5일 이내 본 노드
    seeds := tab.db.QuerySeeds(seedCount, seedMaxAge)
    // 부트노드(nursery) 추가
    seeds = append(seeds, tab.nursery...)
    for i := range seeds {
        seed := seeds[i]
        tab.mutex.Lock()
        tab.handleAddNode(addNodeOp{node: seed, isInbound: false})
        tab.mutex.Unlock()
    }
}`;

export const LOOKUP_ITERATOR_CODE = `type lookupIterator struct {
    buffer     []*enode.Node
    nextLookup lookupFunc        // 새 lookup 생성 함수
    ctx        context.Context
    cancel     func()
    lookup     *lookup           // 현재 진행 중인 탐색
    lastLookup time.Time         // 과열 방지 타이머
}

// Next: 버퍼 소진 -> advance() -> lookup 완료 시 새 lookup 생성
// slowdown(): 최소 1초 간격 보장 (테스트 환경 과열 방지)
// lookupFailed(): 테이블 초기화 대기 + refresh 트리거`;

export const REFRESH_TIMER_CODE = `// table.go loop() 내부
refresh = time.NewTimer(tab.nextRefreshTime())

func (tab *Table) nextRefreshTime() time.Duration {
    half := tab.cfg.RefreshInterval / 2  // 기본 15분
    return half + time.Duration(tab.rand.Int63n(int64(half)))
    // 15~30분 랜덤 -> 네트워크 동시 refresh 방지
}`;
