export const LOOKUP_STRUCT_CODE = `type lookup struct {
    tab         *Table
    queryfunc   queryFunc
    replyCh     chan []*enode.Node
    cancelCh    <-chan struct{}
    asked, seen map[enode.ID]bool  // 중복 질의/노드 방지
    result      nodesByDistance    // target 기준 정렬된 결과
    replyBuffer []*enode.Node
    queries     int               // 진행 중인 고루틴 수
}`;

export const ADVANCE_CODE = `func (it *lookup) advance() bool {
    for it.startQueries() {
        select {
        case nodes := <-it.replyCh:
            it.queries--
            it.addNodes(nodes)
            if !it.empty() {
                return true   // 새 노드 발견 -> 호출자에게 반환
            }
        case <-it.cancelCh:
            it.shutdown()     // 컨텍스트 취소 -> 정리
        }
    }
    return false  // 더 이상 질의할 노드 없음 -> 종료
}`;

export const START_QUERIES_CODE = `func (it *lookup) startQueries() bool {
    if it.queryfunc == nil {
        return false
    }
    // 가장 가까운 노드부터 순회, 동시 질의 alpha(3)개 제한
    for i := 0; i < len(it.result.entries) && it.queries < alpha; i++ {
        n := it.result.entries[i]
        if !it.asked[n.ID()] {
            it.asked[n.ID()] = true
            it.queries++
            go it.query(n, it.replyCh)
        }
    }
    return it.queries > 0  // 진행 중인 질의가 있으면 계속
}`;
