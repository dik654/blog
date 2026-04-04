export const NODES_BY_DISTANCE_CODE = `type nodesByDistance struct {
    entries []*enode.Node
    target  enode.ID
}

func (h *nodesByDistance) push(n *enode.Node, maxElems int) {
    // 이진 탐색으로 삽입 위치 결정
    ix := sort.Search(len(h.entries), func(i int) bool {
        return enode.DistCmp(h.target, h.entries[i].ID(), n.ID()) > 0
    })
    end := len(h.entries)
    if len(h.entries) < maxElems {
        h.entries = append(h.entries, n)  // 슬롯 확보
    }
    if ix < end {
        copy(h.entries[ix+1:], h.entries[ix:])  // 밀어내기
        h.entries[ix] = n                        // 삽입
    }
    // maxElems 초과 시 마지막(가장 먼) 노드가 자연스럽게 탈락
}`;

export const QUERY_CODE = `func (it *lookup) query(n *enode.Node, reply chan<- []*enode.Node) {
    r, err := it.queryfunc(n)    // FINDNODE RPC 실행
    if !errors.Is(err, errClosed) {
        success := len(r) > 0
        it.tab.trackRequest(n, success, r)  // 테이블에 결과 기록
        if err != nil {
            it.tab.log.Trace("FINDNODE failed", "id", n.ID(), "err", err)
        }
    }
    reply <- r  // 결과를 채널로 전송
}`;

export const TRACK_REQUEST_CODE = `func (tab *Table) handleTrackRequest(op trackRequestOp) {
    if op.success {
        tab.db.UpdateFindFails(op.node.ID(), op.node.IPAddr(), 0)
    } else {
        fails := tab.db.FindFails(op.node.ID(), op.node.IPAddr())
        fails++
        tab.db.UpdateFindFails(op.node.ID(), op.node.IPAddr(), fails)
    }
    b := tab.bucket(op.node.ID())
    // 연속 실패 횟수 초과 + 버킷 노드 충분 -> 퇴출
    if fails >= maxFindnodeFailures && len(b.entries) >= bucketSize/4 {
        tab.deleteInBucket(b, op.node.ID())
    }
    // 응답에 포함된 새 노드들을 테이블에 추가
    for _, n := range op.foundNodes {
        tab.handleAddNode(addNodeOp{n, false, false})
    }
}`;
