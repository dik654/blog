package types

import (
	"fmt"
	"time"
)

// DuplicateVoteEvidence contains evidence of a validator signing two
// conflicting votes at the same height/round/type.
type DuplicateVoteEvidence struct {
	VoteA *Vote `json:"vote_a"`
	VoteB *Vote `json:"vote_b"`

	// abci specific information
	TotalVotingPower int64     `json:"total_voting_power"`
	ValidatorPower   int64     `json:"validator_power"`
	Timestamp        time.Time `json:"timestamp"`
}

// EvidenceData contains any evidence of malicious wrong-doing
// by validators.
type EvidenceData struct {
	Evidence EvidenceList `json:"evidence"`
}

// Hash returns the hash of the evidence data (Merkle root of evidence list).
func (data *EvidenceData) Hash() []byte {
	if data.Evidence == nil {
		return nil
	}
	return data.Evidence.Hash()
}

// Verify verifies the evidence fully against the val set and block header.
func (dve *DuplicateVoteEvidence) Verify(chainID string) error {
	if dve.VoteA.Height != dve.VoteB.Height ||
		dve.VoteA.Round != dve.VoteB.Round ||
		dve.VoteA.Type != dve.VoteB.Type {
		return fmt.Errorf("votes must be conflicting")
	}
	if !dve.VoteA.BlockID.Equals(dve.VoteB.BlockID) {
		return nil // different blocks = valid evidence
	}
	return fmt.Errorf("votes are for the same block")
}
