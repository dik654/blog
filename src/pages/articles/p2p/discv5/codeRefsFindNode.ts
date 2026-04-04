import type { CodeRef } from '@/components/code/types';

export const findNodeCodeRefs: Record<string, CodeRef> = {
  'lookup-distances': {
    path: 'go-ethereum/p2p/discover/v5_udp.go', lang: 'go', highlight: [1, 12],
    desc: 'lookupDistances: XOR 거리(log2) 기준 양방향 인접 거리를 수집한다.',
    code: `func lookupDistances(target, dest enode.ID) (dists []uint) {
    td := enode.LogDist(target, dest)
    dists = append(dists, uint(td))
    for i := 1; len(dists) < lookupRequestLimit; i++ {
        if td+i <= 256 {
            dists = append(dists, uint(td+i))
        }
        if td-i > 0 {
            dists = append(dists, uint(td-i))
        }
    }
    return dists
}`,
    annotations: [
      { lines: [2, 3], color: 'sky', note: 'XOR 거리의 log2 = 기준 거리' },
      { lines: [4, 11], color: 'emerald', note: '양방향 확장하여 최대 3개 거리' },
      { lines: [5, 6], color: 'amber', note: '상한 256 (최대 log-distance)' },
    ],
  },
  'wait-for-nodes': {
    path: 'go-ethereum/p2p/discover/v5_udp.go', lang: 'go', highlight: [1, 20],
    desc: 'waitForNodes: NODES 응답을 분할 수신. seen 맵으로 중복 제거.',
    code: `func (t *UDPv5) waitForNodes(c *callV5,
    distances []uint) ([]*enode.Node, error) {
    var (
        nodes           []*enode.Node
        seen            = make(map[enode.ID]struct{})
        received, total = 0, -1
    )
    for {
        select {
        case responseP := <-c.ch:
            response := responseP.(*v5wire.Nodes)
            for _, record := range response.Nodes {
                node, err := t.verifyResponseNode(
                    c, record, distances, seen)
                if err != nil { continue }
                nodes = append(nodes, node)
            }
            if total == -1 {
                total = min(int(response.RespCount),
                    totalNodesResponseLimit)
            }
            if received++; received == total {
                return nodes, nil
            }
        case err := <-c.err:
            return nodes, err
        }
    }
}`,
    annotations: [
      { lines: [5, 5], color: 'sky', note: 'seen 맵으로 중복 노드 필터링' },
      { lines: [13, 14], color: 'emerald', note: '거리 + 릴레이 주소 검증' },
      { lines: [18, 20], color: 'amber', note: '첫 응답에서 total 설정 (최대 5개)' },
    ],
  },
};
