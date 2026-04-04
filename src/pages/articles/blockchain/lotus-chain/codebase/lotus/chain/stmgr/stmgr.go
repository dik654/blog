package stmgr

// StateManager — Tipset을 실행하여 상태 트리를 계산하는 엔진
// ApplyBlocks가 핵심: 각 메시지를 FVM Actor에 전달 → state root 갱신

import (
	"context"
	"github.com/filecoin-project/lotus/chain/types"
	"github.com/filecoin-project/lotus/chain/vm"
	cbor "github.com/ipfs/go-ipld-cbor"
)

type StateManager struct {
	cs         *store.ChainStore  // 체인 저장소
	exec       Executor           // FVM 실행 엔진
	stCache    map[string]cid.Cid // tipset key → state root 캐시
}

// ApplyBlocks는 tipset의 모든 메시지를 순차 실행
func (sm *StateManager) ApplyBlocks(
	ctx context.Context, ts *types.TipSet,
) (cid.Cid, error) {
	// 부모 상태에서 VM 생성
	parentState := sm.getParentState(ts)
	vmi, _ := vm.NewFVM(ctx, &vm.VMOpts{
		StateBase: parentState,
		Epoch:     ts.Height(),
	})
	// 시스템 메시지: CronTick (에폭별 자동 작업)
	_ = vmi.ApplyImplicitMessage(cronMsg)
	// 사용자 메시지: 순서대로 실행
	for _, blk := range ts.Blocks() {
		for _, msg := range blk.Messages {
			receipt, _ := vmi.ApplyMessage(ctx, msg)
			// 가스 소비, 상태 변경, 이벤트 로그 기록
			_ = receipt
		}
	}
	// 최종 state root = HAMT root CID
	return vmi.Flush(ctx)
}
