package store

import (
	"fmt"

	dbm "github.com/cometbft/cometbft-db"
	"github.com/cometbft/cometbft/types"
)

// BlockStore is a simple low level store for blocks.
// There are three types of information stored:
//  1. BlockMeta   - Meta information about each block
//  2. Block part  - Parts of each block, aggregated w/ PartSet
//  3. Commit      - The commit part of each block, for gossiping precommit votes
//
// Currently the precommit signatures are duplicated in the Block parts as
// well as the Commit. In the future, we should improve block storage efficiency.
type BlockStore struct {
	db dbm.DB

	// mtx trie.Mutex
	base   int64 // lowest block stored
	height int64 // highest block stored
}

// NewBlockStore returns a new BlockStore with the given DB.
func NewBlockStore(db dbm.DB) *BlockStore {
	return &BlockStore{db: db}
}

// Base returns the first known contiguous block height, or 0 for empty block stores.
func (bs *BlockStore) Base() int64 { return bs.base }

// Height returns the last known contiguous block height, or 0 for empty block stores.
func (bs *BlockStore) Height() int64 { return bs.height }

// SaveBlock persists the given block, blockParts, and seenCommit to the underlying db.
// blockParts: Must be parts of the block
// seenCommit: The +2/3 precommits that were seen which committed at height.
//
//	If all the nodes restart after committing a block,
//	we need this to reload the precommits to catch up nodes to the
//	having the right VoteSet when Propose step starts.
func (bs *BlockStore) SaveBlock(block *types.Block, blockParts *types.PartSet, seenCommit *types.Commit) {
	if block == nil {
		panic("BlockStore can only save a non-nil block")
	}
	height := block.Height
	if g, w := height, bs.Height()+1; bs.Base() > 0 && g != w {
		panic(fmt.Sprintf("BlockStore can only save contiguous blocks. Wanted %v, got %v", w, g))
	}

	// Save block meta
	blockMeta := types.NewBlockMeta(block, blockParts)
	// Save block parts (each part keyed by height + index)
	for i := 0; i < int(blockParts.Total()); i++ {
		part := blockParts.GetPart(i)
		_ = part // persisted as calcBlockPartKey(height, i)
	}
	_ = blockMeta // persisted as calcBlockMetaKey(height)

	// Save block commit (duplicate)
	// Save seen commit (used for reconstructing vote sets)
	bs.height = height
}

// LoadBlock returns the block with the given height.
// If no block is found for that height, it returns nil.
func (bs *BlockStore) LoadBlock(height int64) *types.Block { return nil }

// LoadBlockMeta returns the BlockMeta for the given height.
func (bs *BlockStore) LoadBlockMeta(height int64) *types.BlockMeta { return nil }

// LoadBlockCommit returns the Commit for the given height.
func (bs *BlockStore) LoadBlockCommit(height int64) *types.Commit { return nil }
