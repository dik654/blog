package state

// StateTree — Actor 주소를 Actor 상태에 매핑하는 전역 상태 트리
// 내부적으로 HAMT(Hash Array Mapped Trie)를 사용

import (
	"context"
	"github.com/ipfs/go-cid"
	cbor "github.com/ipfs/go-ipld-cbor"
	"github.com/filecoin-project/go-address"
	"github.com/filecoin-project/lotus/chain/types"
)

type StateTree struct {
	root    *hamt.Node   // HAMT 루트 노드
	Store   cbor.IpldStore
	version types.StateTreeVersion
}

// GetActor는 주소로 Actor 상태를 조회
func (st *StateTree) GetActor(addr address.Address) (*types.Actor, error) {
	// ID 주소로 변환 (f0 prefix)
	iaddr, err := st.LookupID(addr)
	if err != nil {
		return nil, err
	}
	// HAMT에서 Actor 조회 — O(log n) 시간
	var act types.Actor
	if found, err := st.root.Find(context.TODO(),
		string(iaddr.Bytes()), &act); err != nil {
		return nil, err
	} else if !found {
		return nil, types.ErrActorNotFound
	}
	return &act, nil
}

// Flush는 변경된 상태를 IPLD 블록스토어에 기록하고 root CID 반환
func (st *StateTree) Flush(ctx context.Context) (cid.Cid, error) {
	// HAMT의 모든 dirty 노드를 CBOR 직렬화 → 블록스토어에 PUT
	return st.root.Flush(ctx)
}
