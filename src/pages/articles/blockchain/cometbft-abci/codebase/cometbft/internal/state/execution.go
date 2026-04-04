package state

import (
	abci "github.com/cometbft/cometbft/abci/types"
	"github.com/cometbft/cometbft/proxy"
	"github.com/cometbft/cometbft/types"
)

// BlockExecutor handles block execution against the ABCI application.
// It is the bridge between consensus and the application state machine.
type BlockExecutor struct {
	appConn proxy.AppConnConsensus // consensus-only ABCI connection
	store   Store                  // stores committed blocks
	mempool Mempool                // tx pool — Lock/Unlock around block execution
	evpool  EvidencePool           // byzantine evidence tracker
}

// CreateProposalBlock builds a new block proposal.
// Called ONLY by the proposer for the current round.
func (blockExec *BlockExecutor) CreateProposalBlock(
	ctx context.Context, height int64, state State, commit *types.Commit,
) (*types.Block, error) {
	maxBytes := state.ConsensusParams.Block.MaxBytes
	maxGas := state.ConsensusParams.Block.MaxGas
	evidence, maxEvidenceBytes := blockExec.evpool.PendingEvidence(state.ConsensusParams.Evidence.MaxBytes)

	// Fetch txs from mempool, respecting block size limits
	maxDataBytes := types.MaxDataBytes(maxBytes, maxEvidenceBytes)
	txs := blockExec.mempool.ReapMaxBytesMaxGas(maxDataBytes, maxGas)

	block := state.MakeBlock(height, txs, commit, evidence)

	// Ask the app to re-order / filter / inject txs
	rpp, err := blockExec.appConn.PrepareProposal(ctx, &abci.RequestPrepareProposal{
		MaxTxBytes:         maxDataBytes,
		Txs:                block.Txs.ToSliceOfBytes(),
		LocalLastCommit:    buildExtendedCommitInfo(commit, state.Validators),
		Misbehavior:        block.Evidence.Evidence.ToABCI(),
		Height:             height,
		Time:               block.Time,
		NextValidatorsHash: block.NextValidatorsHash,
		ProposerAddress:    block.ProposerAddress,
	})
	if err != nil {
		return nil, err
	}

	// Replace block txs with app-selected txs
	txRecords := rpp.TxRecords
	block.Txs = txRecordsToTxs(txRecords)
	return block, nil
}

// ProcessProposal sends the proposed block to the app for validation.
// Called by all validators (including proposer) upon receiving a proposal.
func (blockExec *BlockExecutor) ProcessProposal(
	block *types.Block, state State,
) (bool, error) {
	resp, err := blockExec.appConn.ProcessProposal(ctx, &abci.RequestProcessProposal{
		Txs:                block.Txs.ToSliceOfBytes(),
		ProposedLastCommit: buildLastCommitInfo(block, state.Validators),
		Misbehavior:        block.Evidence.Evidence.ToABCI(),
		Hash:               block.Hash(),
		Height:             block.Height,
		Time:               block.Time,
		NextValidatorsHash: block.NextValidatorsHash,
		ProposerAddress:    block.ProposerAddress,
	})
	if err != nil {
		return false, err
	}

	// ACCEPT → valid proposal, REJECT → nil prevote
	return resp.Status == abci.ResponseProcessProposal_ACCEPT, nil
}

// ApplyBlock executes the block against the app via FinalizeBlock.
// Called after +2/3 precommits — the block is now considered committed.
func (blockExec *BlockExecutor) ApplyBlock(
	ctx context.Context, state State, blockID types.BlockID, block *types.Block,
) (State, error) {
	// Lock mempool to prevent new txs during block execution
	blockExec.mempool.Lock()
	defer blockExec.mempool.Unlock()

	// Send the committed block to the app for execution
	fBlockResp, err := blockExec.appConn.FinalizeBlock(ctx, &abci.RequestFinalizeBlock{
		Txs:               block.Txs.ToSliceOfBytes(),
		DecidedLastCommit:  buildLastCommitInfo(block, state.Validators),
		Misbehavior:        block.Evidence.Evidence.ToABCI(),
		Hash:               block.Hash(),
		Height:             block.Height,
		Time:               block.Time,
		NextValidatorsHash: block.NextValidatorsHash,
		ProposerAddress:    block.ProposerAddress,
	})
	if err != nil {
		return state, err
	}

	// Update state from FinalizeBlock response
	state, err = updateState(state, blockID, block.Header, fBlockResp)
	if err != nil {
		return state, err
	}

	// Commit: app persists state, returns retain_height
	commitResp, err := blockExec.appConn.Commit(ctx, &abci.RequestCommit{})
	if err != nil {
		return state, err
	}

	// IMPORTANT: app state is persisted BEFORE CometBFT state
	// This ordering prevents inconsistency on crash recovery

	// Prune old blocks if app requested
	if commitResp.RetainHeight > 0 {
		blockExec.pruneBlocks(commitResp.RetainHeight)
	}

	// Remove executed txs from mempool
	blockExec.mempool.Update(block.Height, block.Txs, fBlockResp.TxResults)

	// Save CometBFT state (validators, consensus params, app_hash)
	blockExec.store.Save(state)
	return state, nil
}
