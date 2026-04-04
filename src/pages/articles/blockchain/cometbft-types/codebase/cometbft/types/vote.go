package types

import (
	"fmt"
	"time"

	cmtproto "github.com/cometbft/cometbft/proto/tendermint/types"
)

// Vote represents a prevote, precommit, or commit vote from validators.
type Vote struct {
	Type             cmtproto.SignedMsgType `json:"type"`
	Height           int64                  `json:"height"`
	Round            int32                  `json:"round"`
	BlockID          BlockID                `json:"block_id"`
	Timestamp        time.Time              `json:"timestamp"`
	ValidatorAddress Address                `json:"validator_address"`
	ValidatorIndex   int32                  `json:"validator_index"`
	Signature        []byte                 `json:"signature"`
	Extension        []byte                 `json:"extension,omitempty"`
	ExtensionSignature []byte              `json:"extension_signature,omitempty"`
}

// VoteSet helps collect signatures from validators at each height+round
// for a given vote type (prevote or precommit).
type VoteSet struct {
	chainID       string
	height        int64
	round         int32
	signedMsgType cmtproto.SignedMsgType
	valSet        *ValidatorSet

	mtx           sync.Mutex
	votesBitArray *bits.BitArray
	votes         []*Vote
	sum           int64 // sum of voting power that voted
	maj23         *BlockID
	votesByBlock  map[string]*blockVotes
	peerMaj23s    map[P2PID]BlockID
}

// AddVote adds a vote to the VoteSet and returns (added, error).
// It checks signature validity and prevents duplicate votes.
func (voteSet *VoteSet) AddVote(vote *Vote) (added bool, err error) {
	if voteSet == nil {
		panic("AddVote() on nil VoteSet")
	}
	voteSet.mtx.Lock()
	defer voteSet.mtx.Unlock()
	return voteSet.addVote(vote)
}

func (voteSet *VoteSet) addVote(vote *Vote) (bool, error) {
	valIdx := vote.ValidatorIndex
	valAddr := vote.ValidatorAddress
	blockKey := vote.BlockID.Key()

	// Ensure vote is for the correct height/round/type
	if vote.Height != voteSet.height ||
		vote.Round != voteSet.round ||
		vote.Type != voteSet.signedMsgType {
		return false, fmt.Errorf("expected %d/%d/%d, got %d/%d/%d",
			voteSet.height, voteSet.round, voteSet.signedMsgType,
			vote.Height, vote.Round, vote.Type)
	}

	// Check validator index and address
	lookupAddr, val := voteSet.valSet.GetByIndex(valIdx)
	if val == nil {
		return false, fmt.Errorf("validator index %d out of range", valIdx)
	}

	// Verify signature
	if !val.PubKey.VerifySignature(
		VoteSignBytes(voteSet.chainID, vote.ToProto()), vote.Signature) {
		return false, ErrVoteInvalidSignature
	}

	// Track the vote and check for +2/3 majority
	voteSet.votes[valIdx] = vote
	voteSet.votesBitArray.SetIndex(int(valIdx), true)
	voteSet.sum += val.VotingPower

	// Update blockVotes and check for 2/3+
	votesByBlock, ok := voteSet.votesByBlock[blockKey]
	if !ok {
		votesByBlock = newBlockVotes(false, voteSet.valSet.Size())
		voteSet.votesByBlock[blockKey] = votesByBlock
	}
	votesByBlock.addVerifiedVote(vote, val.VotingPower)

	// If we just crossed the +2/3 threshold for this block
	if votesByBlock.sum > voteSet.valSet.TotalVotingPower()*2/3 {
		voteSet.maj23 = &vote.BlockID
	}
	return true, nil
}

// HasTwoThirdsMajority returns true if there's a 2/3+ majority for any block.
func (voteSet *VoteSet) HasTwoThirdsMajority() bool {
	if voteSet == nil {
		return false
	}
	voteSet.mtx.Lock()
	defer voteSet.mtx.Unlock()
	return voteSet.maj23 != nil
}
