package evidence

import (
	"fmt"

	dbm "github.com/cometbft/cometbft-db"
	"github.com/cometbft/cometbft/libs/log"
	sm "github.com/cometbft/cometbft/state"
	"github.com/cometbft/cometbft/types"
)

// Pool maintains a pool of valid evidence to be proposed in upcoming blocks.
type Pool struct {
	logger log.Logger

	evidenceStore dbm.DB
	evidenceList  *clist.CList // concurrent linked-list of evidence

	// needed to load validators to verify evidence
	stateDB sm.Store
	state   sm.State

	// latest block state
	mtx sync.Mutex
}

// NewPool creates a new evidence pool.
func NewPool(logger log.Logger, evidenceDB dbm.DB, stateDB sm.Store, blockStore sm.BlockStore) (*Pool, error) {
	return &Pool{
		logger:        logger,
		evidenceStore: evidenceDB,
		evidenceList:  clist.New(),
		stateDB:       stateDB,
	}, nil
}

// AddEvidence checks the evidence is valid and adds it to the pool.
// Evidence must satisfy:
//  1. Not already committed or pending
//  2. The validator existed at the infraction height
//  3. Not expired (infraction height within MaxAgeNumBlocks)
func (evpool *Pool) AddEvidence(ev types.Evidence) error {
	// 1) Check if already exists
	if evpool.isPending(ev) {
		return nil // already known
	}
	if evpool.isCommitted(ev) {
		return nil // already committed in a block
	}

	// 2) Verify the evidence — loads validator set from the infraction height
	if err := evpool.verify(ev); err != nil {
		return fmt.Errorf("failed to verify evidence: %w", err)
	}

	// 3) Add to pool
	evpool.evidenceList.PushBack(ev)
	return nil
}

// PendingEvidence returns up to maxBytes of uncommitted evidence.
// These are included in the proposer's block.
func (evpool *Pool) PendingEvidence(maxBytes int64) ([]types.Evidence, int64) {
	return nil, 0
}

// Update removes evidence that was committed in the block.
func (evpool *Pool) Update(state sm.State, ev types.EvidenceList) {
	evpool.mtx.Lock()
	defer evpool.mtx.Unlock()
	evpool.state = state
	evpool.removeCommittedEvidence(ev)
}

// MarkEvidenceAsCommitted marks all the evidence as committed and removes it from the pool.
func (evpool *Pool) MarkEvidenceAsCommitted(height int64, evidence []types.Evidence) {
	for _, ev := range evidence {
		evpool.markCommitted(ev, height)
	}
}

// CheckEvidence takes a list of evidence from a block and verifies all are valid.
func (evpool *Pool) CheckEvidence(evidence types.EvidenceList) error {
	for _, ev := range evidence {
		if err := evpool.verify(ev); err != nil {
			return err
		}
	}
	return nil
}
