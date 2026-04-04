package state

import (
	"context"
	"fmt"
	"time"

	abci "github.com/cometbft/cometbft/abci/types"
	"github.com/cometbft/cometbft/libs/fail"
	"github.com/cometbft/cometbft/libs/log"
	"github.com/cometbft/cometbft/mempool"
	"github.com/cometbft/cometbft/proxy"
	"github.com/cometbft/cometbft/types"
)

// BlockExecutor handles block execution and state updates.
// ApplyBlock is the sole entry point for applying a committed block.
type BlockExecutor struct {
	store    Store                  // state persistence
	blockStore BlockStore           // block persistence
	proxyApp proxy.AppConnConsensus // ABCI consensus connection
	eventBus types.BlockEventPublisher
	mempool  mempool.Mempool
	evpool   EvidencePool
	logger   log.Logger
	metrics  *Metrics
}

// ApplyBlock validates the block, executes it against the app via ABCI,
// commits, updates state, saves to DB, and fires events.
// This is the ONLY function that needs to be called to process an entire block.
func (blockExec *BlockExecutor) ApplyBlock(
	state State, blockID types.BlockID, block *types.Block,
) (State, error) {
	// 1. ValidateBlock — header, last commit signatures, evidence expiry
	if err := validateBlock(state, block); err != nil {
		return state, ErrInvalidBlock(err)
	}

	// 2. FinalizeBlock — send block to app via ABCI
	startTime := time.Now().UnixNano()
	abciResponse, err := blockExec.proxyApp.FinalizeBlock(
		context.TODO(), &abci.RequestFinalizeBlock{
			Hash:    block.Hash(),
			Height:  block.Height,
			Time:    block.Time,
			Txs:     block.Txs.ToSliceOfBytes(),
		},
	)
	if err != nil {
		return state, err
	}
	blockExec.metrics.BlockProcessingTime.Observe(
		float64(time.Now().UnixNano()-startTime) / 1000000,
	)

	fail.Fail() // crash injection point

	// 3. Save ABCI responses
	blockExec.store.SaveFinalizeBlockResponse(block.Height, abciResponse)

	// 4. Validate and apply validator updates
	validatorUpdates, err := types.PB2TM.ValidatorUpdates(abciResponse.ValidatorUpdates)
	if err != nil {
		return state, err
	}

	// 5. updateState — build new State from header + ABCI responses
	state, err = updateState(state, blockID, &block.Header, abciResponse, validatorUpdates)
	if err != nil {
		return state, fmt.Errorf("commit failed for application: %v", err)
	}

	// 6. Commit — lock mempool, call ABCI Commit, update mempool async
	_, err = blockExec.Commit(state, block, abciResponse)
	if err != nil {
		return state, fmt.Errorf("commit failed for application: %v", err)
	}

	// 7. Update evidence pool
	blockExec.evpool.Update(state, block.Evidence.Evidence)

	// 8. Save state to DB (AFTER app Commit — order matters!)
	state.AppHash = abciResponse.AppHash
	if err := blockExec.store.Save(state); err != nil {
		return state, err
	}

	// 9. Fire events (NewBlock, NewBlockHeader, Tx events)
	fireEvents(blockExec.logger, blockExec.eventBus, block, blockID, abciResponse, validatorUpdates)

	return state, nil
}
