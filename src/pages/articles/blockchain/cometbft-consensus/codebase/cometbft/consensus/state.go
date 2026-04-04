package consensus

import (
	"bytes"
	"fmt"
	"runtime/debug"
	"time"

	cstypes "github.com/cometbft/cometbft/consensus/types"
	"github.com/cometbft/cometbft/crypto"
	"github.com/cometbft/cometbft/libs/log"
	"github.com/cometbft/cometbft/libs/service"
	cmtsync "github.com/cometbft/cometbft/libs/sync"
	"github.com/cometbft/cometbft/p2p"
	cmtproto "github.com/cometbft/cometbft/proto/tendermint/types"
	sm "github.com/cometbft/cometbft/state"
	"github.com/cometbft/cometbft/types"
	cmttime "github.com/cometbft/cometbft/types/time"
)

// State handles execution of the consensus algorithm.
// It processes votes and proposals, and upon reaching agreement,
// commits blocks to the chain and executes them against the application.
type State struct {
	service.BaseService

	config        *cfg.ConsensusConfig
	privValidator types.PrivValidator

	blockStore sm.BlockStore
	blockExec  *sm.BlockExecutor

	txNotifier txNotifier
	evpool     evidencePool

	// internal state
	mtx cmtsync.RWMutex
	cstypes.RoundState
	state sm.State

	privValidatorPubKey crypto.PubKey

	// 3 input channels for the receiveRoutine
	peerMsgQueue     chan msgInfo
	internalMsgQueue chan msgInfo
	timeoutTicker    TimeoutTicker

	// WAL for crash recovery
	wal WAL

	decideProposal func(height int64, round int32)
	doPrevote      func(height int64, round int32)
}

// receiveRoutine — single goroutine that processes all consensus events sequentially.
// No locks needed inside: channel serialization eliminates concurrency bugs.
func (cs *State) receiveRoutine(maxSteps int) {
	defer func() {
		if r := recover(); r != nil {
			cs.Logger.Error("CONSENSUS FAILURE!!!", "err", r, "stack", string(debug.Stack()))
		}
	}()

	for {
		rs := cs.RoundState
		var mi msgInfo

		select {
		case <-cs.txNotifier.TxsAvailable():
			cs.handleTxsAvailable()

		case mi = <-cs.peerMsgQueue:
			// WAL write (async) then dispatch
			cs.wal.Write(mi)
			cs.handleMsg(mi)

		case mi = <-cs.internalMsgQueue:
			// WAL write (sync — must persist before processing own vote)
			cs.wal.WriteSync(mi)
			cs.handleMsg(mi)

		case ti := <-cs.timeoutTicker.Chan():
			cs.wal.Write(ti)
			cs.handleTimeout(ti, rs)

		case <-cs.Quit():
			return
		}
	}
}

// handleMsg dispatches incoming messages to the appropriate handler.
func (cs *State) handleMsg(mi msgInfo) {
	cs.mtx.Lock()
	defer cs.mtx.Unlock()

	switch msg := mi.Msg.(type) {
	case *ProposalMessage:
		cs.setProposal(msg.Proposal)
	case *BlockPartMessage:
		cs.addProposalBlockPart(msg, mi.PeerID)
		if cs.Step <= cstypes.RoundStepPropose && cs.isProposalComplete() {
			cs.enterPrevote(cs.Height, cs.Round)
		}
	case *VoteMessage:
		cs.tryAddVote(msg.Vote, mi.PeerID)
	}
}

// enterNewRound sets up a new consensus round.
func (cs *State) enterNewRound(height int64, round int32) {
	if cs.Height != height || round < cs.Round {
		return
	}
	validators := cs.Validators
	if cs.Round < round {
		validators = validators.Copy()
		validators.IncrementProposerPriority(round - cs.Round)
	}
	cs.updateRoundStep(round, cstypes.RoundStepNewRound)
	cs.Validators = validators
	cs.Votes.SetRound(round + 1)
	cs.TriggeredTimeoutPrecommit = false
	cs.enterPropose(height, round)
}

// enterPropose — proposer creates block, others wait for proposal.
func (cs *State) enterPropose(height int64, round int32) {
	cs.scheduleTimeout(cs.config.Propose(round), height, round, cstypes.RoundStepPropose)

	defer func() {
		cs.updateRoundStep(round, cstypes.RoundStepPropose)
		if cs.isProposalComplete() {
			cs.enterPrevote(height, cs.Round)
		}
	}()

	if cs.isProposer(cs.privValidatorPubKey.Address()) {
		cs.decideProposal(height, round)
	}
}

// enterPrevote — vote for LockedBlock if locked, ProposalBlock if valid, else nil.
func (cs *State) enterPrevote(height int64, round int32) {
	defer func() {
		cs.updateRoundStep(round, cstypes.RoundStepPrevote)
	}()
	cs.doPrevote(height, round)
}

// enterPrecommit — requires 2/3+ prevote (polka).
// If polka for a block: validate → lock → precommit.
// If polka for nil: unlock → precommit nil.
func (cs *State) enterPrecommit(height int64, round int32) {
	blockID, ok := cs.Votes.Prevotes(round).TwoThirdsMajority()

	// No polka → precommit nil
	if !ok {
		cs.signAddVote(cmtproto.PrecommitType, nil, types.PartSetHeader{}, nil)
		return
	}

	// +2/3 prevoted nil → unlock → precommit nil
	if len(blockID.Hash) == 0 {
		cs.LockedRound = -1
		cs.LockedBlock = nil
		cs.signAddVote(cmtproto.PrecommitType, nil, types.PartSetHeader{}, nil)
		return
	}

	// +2/3 prevoted a block → lock and precommit
	if cs.ProposalBlock.HashesTo(blockID.Hash) {
		cs.blockExec.ValidateBlock(cs.state, cs.ProposalBlock)
		cs.LockedRound = round
		cs.LockedBlock = cs.ProposalBlock
		cs.LockedBlockParts = cs.ProposalBlockParts
		cs.signAddVote(cmtproto.PrecommitType, blockID.Hash, blockID.PartSetHeader, cs.ProposalBlock)
	}
}

// enterCommit — 2/3+ precommits achieved.
// Save block → apply via ABCI → advance to next height.
func (cs *State) enterCommit(height int64, commitRound int32) {
	if cs.Height != height || cstypes.RoundStepCommit <= cs.Step {
		return
	}
	cs.updateRoundStep(cs.Round, cstypes.RoundStepCommit)
	cs.CommitRound = commitRound

	blockID, ok := cs.Votes.Precommits(commitRound).TwoThirdsMajority()
	if !ok {
		panic("enterCommit expects +2/3 precommits")
	}

	// Move LockedBlock to ProposalBlock if it matches
	if cs.LockedBlock.HashesTo(blockID.Hash) {
		cs.ProposalBlock = cs.LockedBlock
	}

	cs.tryFinalizeCommit(height)
}

// tryFinalizeCommit saves the block and calls ABCI to apply it.
func (cs *State) tryFinalizeCommit(height int64) {
	if cs.ProposalBlock == nil {
		return // waiting for block
	}
	// blockStore.SaveBlock → blockExec.ApplyBlock → updateToState
	cs.finalizeCommit(height)
}
