package hamt

// HAMT — Hash Array Mapped Trie
// Filecoin 상태 트리의 기본 자료구조: 키-값 쌍을 IPLD DAG로 저장

import (
	"context"
	"github.com/ipfs/go-cid"
	cbor "github.com/ipfs/go-ipld-cbor"
)

const (
	// 비트폭 5: 각 노드가 최대 2^5=32개 자식 슬롯
	// Filecoin은 5를 선택 — I/O 깊이와 노드 크기의 최적 균형
	defaultBitWidth = 5
	// 버킷 크기 3: 한 슬롯에 최대 3개 키-값 쌍 저장
	defaultBucketSize = 3
)

// Node는 HAMT의 내부/리프 노드
type Node struct {
	Bitfield Bitfield       // 어떤 슬롯이 차 있는지 비트맵
	Pointers []*Pointer     // 실제 데이터 또는 자식 노드 링크
	store    cbor.IpldStore
	bitWidth int
}

// Find는 키에 해당하는 값을 탐색
func (n *Node) Find(ctx context.Context, key string, out interface{}) (bool, error) {
	// 키를 SHA-256 해시 → 비트폭 단위로 슬라이스
	hv := hash(key)
	// 깊이별로 비트폭만큼의 비트를 인덱스로 사용
	idx := hv.Next(n.bitWidth)
	if !n.Bitfield.IsSet(idx) {
		return false, nil // 해당 슬롯 비어있음
	}
	child := n.getChild(idx)
	if child.isShard() {
		// 서브트리로 재귀 탐색
		return child.Node.Find(ctx, key, out)
	}
	// 리프: 버킷에서 키 매칭
	return child.bucket.find(key, out)
}
