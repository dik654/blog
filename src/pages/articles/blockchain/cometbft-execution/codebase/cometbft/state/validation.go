package state

import (
	"fmt"

	"github.com/cometbft/cometbft/types"
)

// validateBlock validates the block against the given state.
// It checks the header, last commit, and evidence.
// Validation does not mutate state.
func validateBlock(state State, block *types.Block) error {
	// 1. Header validation
	if block.ChainID != state.ChainID {
		return fmt.Errorf("wrong Block.Header.ChainID. Expected %v, got %v",
			state.ChainID, block.ChainID)
	}
	if block.Height != state.LastBlockHeight+1 {
		return fmt.Errorf("wrong Block.Header.Height. Expected %v, got %v",
			state.LastBlockHeight+1, block.Height)
	}
	if !block.LastBlockID.Equals(state.LastBlockID) {
		return fmt.Errorf("wrong Block.Header.LastBlockID. Expected %v, got %v",
			state.LastBlockID, block.LastBlockID)
	}

	// 2. LastCommit signature verification (2/3+ of previous validator set)
	if block.Height > state.InitialHeight {
		if err := state.LastValidators.VerifyCommitLightTrusting(
			state.ChainID, block.LastCommit, types.DefaultTrustLevel,
		); err != nil {
			return fmt.Errorf("error validating block last commit: %w", err)
		}
	}

	// 3. Evidence validation (within MaxAgeNumBlocks)
	for _, ev := range block.Evidence.Evidence {
		if ev.Height()+state.ConsensusParams.Evidence.MaxAgeNumBlocks < block.Height {
			return fmt.Errorf("evidence from height %d is too old", ev.Height())
		}
	}

	// 4. Proposer is in the validator set
	if !state.Validators.HasAddress(block.ProposerAddress) {
		return fmt.Errorf("block proposer %X is not in validator set", block.ProposerAddress)
	}

	return nil
}
