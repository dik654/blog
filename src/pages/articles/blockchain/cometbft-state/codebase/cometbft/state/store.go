package state

import (
	"fmt"

	dbm "github.com/cometbft/cometbft-db"
	cmtproto "github.com/cometbft/cometbft/proto/tendermint/types"
	"github.com/cometbft/cometbft/types"
)

// Store defines the state store interface. It is used to retrieve
// current state and save and load ABCI responses, validators, and
// consensus parameters.
type Store interface {
	// Save overwrites the previous state with the updated one.
	Save(State) error
	// Load loads the current state from the underlying persistence layer.
	Load() (State, error)
	// LoadValidators loads the validator set at a given height.
	LoadValidators(height int64) (*types.ValidatorSet, error)
	// LoadConsensusParams loads the consensus params for a given height.
	LoadConsensusParams(height int64) (cmtproto.ConsensusParams, error)
	// SaveFinalizeBlockResponse saves FinalizeBlock responses for a given height.
	SaveFinalizeBlockResponse(height int64, resp interface{}) error
	// Close closes the connection with the database.
	Close() error
	// PruneStates prunes state up to (but not including) the given height.
	PruneStates(from, to, evidenceThresholdHeight int64) error
}

// dbStore wraps a db.DB for state persistence using LevelDB.
type dbStore struct {
	db dbm.DB
}

// NewStore creates a new state Store backed by the given LevelDB database.
func NewStore(db dbm.DB, options ...StoreOption) Store {
	return &dbStore{db: db}
}

type StoreOption func(*dbStore)

// LoadFromDBOrGenesisDoc loads the most recent state from the database,
// or creates a new one from the given genesisDoc.
func (store dbStore) LoadFromDBOrGenesisDoc(genesisDoc *types.GenesisDoc) (State, error) {
	state, err := store.Load()
	if err != nil {
		return State{}, err
	}
	if state.IsEmpty() {
		state, err = MakeGenesisState(genesisDoc)
		if err != nil {
			return State{}, fmt.Errorf("error making genesis state: %w", err)
		}
	}
	return state, nil
}
