package types

import (
	"fmt"
	"sort"

	"github.com/cometbft/cometbft/crypto"
)

// Validator represents a validator node with its public key and voting power.
type Validator struct {
	Address          Address       `json:"address"`
	PubKey           crypto.PubKey `json:"pub_key"`
	VotingPower      int64         `json:"voting_power"`
	ProposerPriority int64         `json:"proposer_priority"`
}

// ValidatorSet represent a set of Validators at a given height.
type ValidatorSet struct {
	Validators []*Validator `json:"validators"`
	Proposer   *Validator   `json:"proposer"`

	totalVotingPower int64
}

// GetProposer returns the current proposer (highest priority).
func (vals *ValidatorSet) GetProposer() (proposer *Validator) {
	if len(vals.Validators) == 0 {
		return nil
	}
	if vals.Proposer == nil {
		vals.Proposer = vals.findProposer()
	}
	return vals.Proposer.Copy()
}

func (vals *ValidatorSet) findProposer() *Validator {
	var proposer *Validator
	for _, val := range vals.Validators {
		if proposer == nil || val.ProposerPriority > proposer.ProposerPriority {
			proposer = val
		}
	}
	return proposer
}

// IncrementProposerPriority increments proposer selection for N rounds.
// The proposer is the validator with the highest priority.
// After selection:
//   1. selected proposer's priority -= TotalVotingPower
//   2. all validators' priority += their VotingPower
// This ensures weighted round-robin fairness.
func (vals *ValidatorSet) IncrementProposerPriority(times int32) {
	if vals.IsNilOrEmpty() {
		panic("empty validator set")
	}
	if times <= 0 {
		panic("cannot increment priority by non-positive value")
	}

	// Cap the number of rounds
	const maxTimesBeforeRescale = 100
	if times > maxTimesBeforeRescale {
		vals.RescalePriorities(PriorityWindowSizeFactor * vals.TotalVotingPower())
		times = 1
	}

	var proposer *Validator
	for i := int32(0); i < times; i++ {
		proposer = vals.incrementProposerPriority()
	}
	vals.Proposer = proposer
}

func (vals *ValidatorSet) incrementProposerPriority() *Validator {
	for _, val := range vals.Validators {
		// Every validator gains priority proportional to voting power
		val.ProposerPriority += val.VotingPower
	}

	// Select the proposer: highest priority
	proposer := vals.findProposer()

	// Selected proposer loses TotalVotingPower from priority
	proposer.ProposerPriority -= vals.TotalVotingPower()

	return proposer
}

// TotalVotingPower returns the sum of all validators' voting power.
func (vals *ValidatorSet) TotalVotingPower() int64 {
	if vals.totalVotingPower == 0 {
		sum := int64(0)
		for _, val := range vals.Validators {
			sum += val.VotingPower
		}
		vals.totalVotingPower = sum
	}
	return vals.totalVotingPower
}
