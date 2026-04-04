package types

import (
	"bytes"
	"crypto/sha256"
	"fmt"
	"time"

	cmtbytes "github.com/cometbft/cometbft/libs/bytes"
	cmtproto "github.com/cometbft/cometbft/proto/tendermint/types"
)

// Block defines the atomic unit of a CometBFT blockchain.
type Block struct {
	mtx        sync.Mutex
	Header     `json:"header"`
	Data       `json:"data"`
	Evidence   EvidenceData `json:"evidence"`
	LastCommit *Commit      `json:"last_commit"`
}

// Header defines the structure of a CometBFT block header.
type Header struct {
	// basic block info
	Version  cmtproto.Version `json:"version"`
	ChainID  string           `json:"chain_id"`
	Height   int64            `json:"height"`
	Time     time.Time        `json:"time"`

	// prev block info
	LastBlockID BlockID `json:"last_block_id"`

	// hashes of block data
	LastCommitHash cmtbytes.HexBytes `json:"last_commit_hash"`
	DataHash       cmtbytes.HexBytes `json:"data_hash"`

	// hashes from the app output from the prev block
	ValidatorsHash     cmtbytes.HexBytes `json:"validators_hash"`
	NextValidatorsHash cmtbytes.HexBytes `json:"next_validators_hash"`
	ConsensusHash      cmtbytes.HexBytes `json:"consensus_hash"`
	AppHash            cmtbytes.HexBytes `json:"app_hash"`

	// root hash of all results from the txs from the previous block
	LastResultsHash cmtbytes.HexBytes `json:"last_results_hash"`

	// consensus info
	EvidenceHash    cmtbytes.HexBytes `json:"evidence_hash"`
	ProposerAddress Address           `json:"proposer_address"`
}

// Hash returns the hash of the header.
// It uses a Merkle tree of the header fields.
func (h *Header) Hash() cmtbytes.HexBytes {
	if h == nil || h.ValidatorsHash == nil {
		return nil
	}
	hbz, err := h.Version.Marshal()
	if err != nil {
		panic(err)
	}
	return merkle.HashFromByteSlices([][]byte{
		hbz,
		cdcEncode(h.ChainID),
		cdcEncode(h.Height),
		cdcEncode(h.Time),
		cdcEncode(h.LastBlockID),
		cdcEncode(h.LastCommitHash),
		cdcEncode(h.DataHash),
		cdcEncode(h.ValidatorsHash),
		cdcEncode(h.NextValidatorsHash),
		cdcEncode(h.ConsensusHash),
		cdcEncode(h.AppHash),
		cdcEncode(h.LastResultsHash),
		cdcEncode(h.EvidenceHash),
		cdcEncode(h.ProposerAddress),
	})
}

// Data contains the set of transactions included in the block.
type Data struct {
	Txs Txs `json:"txs"`
}

// Hash returns the hash of the data (Merkle root of txs).
func (data *Data) Hash() cmtbytes.HexBytes {
	if data == nil {
		return (Txs{}).Hash()
	}
	return data.Txs.Hash()
}

// MakePartSet returns the Block as a PartSet — split into 64KB parts
// for efficient gossip over the P2P network.
func (b *Block) MakePartSet(partSize uint32) (*PartSet, error) {
	bz, err := cdc.MarshalBinaryLengthPrefixed(b)
	if err != nil {
		return nil, err
	}
	return NewPartSetFromData(bz, partSize), nil
}
