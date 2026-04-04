package types

import (
	"crypto/sha256"

	"github.com/cometbft/cometbft/crypto/merkle"
	cmtbytes "github.com/cometbft/cometbft/libs/bytes"
)

// Tx is an arbitrary byte array — the application decides
// how to interpret and validate it.
type Tx []byte

// Hash computes the SHA256 hash of the transaction.
func (tx Tx) Hash() []byte {
	return sha256.New().Sum(tx)
}

// Txs is a slice of Tx.
type Txs []Tx

// Hash returns the Merkle root hash of the transaction list.
// Each TX is SHA256-hashed, then the Merkle tree computes the root.
func (txs Txs) Hash() []byte {
	hl := txs.hashList()
	return merkle.HashFromByteSlices(hl)
}

func (txs Txs) hashList() [][]byte {
	hl := make([][]byte, len(txs))
	for i, tx := range txs {
		hl[i] = tx.Hash()
	}
	return hl
}

// IndexByHash returns the index of the given tx hash, or -1.
func (txs Txs) IndexByHash(hash []byte) int {
	for i, tx := range txs {
		if bytes.Equal(tx.Hash(), hash) {
			return i
		}
	}
	return -1
}
