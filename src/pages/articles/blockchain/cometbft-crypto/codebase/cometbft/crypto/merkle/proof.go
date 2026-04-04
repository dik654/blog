package merkle

import (
	"bytes"
	"crypto/sha256"
	"fmt"

	cmtcrypto "github.com/cometbft/cometbft/proto/tendermint/crypto"
)

const (
	HashSize      = sha256.Size  // 32
	TruncatedSize = 20           // TMHASH = SHA256[:20]
)

// Proof represents a Merkle proof for a single item.
// The proof shows that the item at Index is included in
// a Merkle tree with the given LeafHash.
type Proof struct {
	Total    int64    `json:"total"`     // total number of items
	Index    int64    `json:"index"`     // index of item
	LeafHash []byte   `json:"leaf_hash"` // hash of the item
	Aunts    [][]byte `json:"aunts"`     // sibling hashes on the path to root
}

// Verify verifies the Merkle proof against the given root hash.
// It recomputes the root from the leaf and sibling path,
// then checks if it matches the expected root.
func (proof *Proof) Verify(rootHash []byte, leaf []byte) error {
	leafHash := leafHash(leaf)
	if !bytes.Equal(proof.LeafHash, leafHash) {
		return fmt.Errorf("leaf hash mismatch: %X vs %X", proof.LeafHash, leafHash)
	}

	computedHash := proof.computeRootHash()
	if !bytes.Equal(computedHash, rootHash) {
		return fmt.Errorf("root hash mismatch: %X vs %X", computedHash, rootHash)
	}
	return nil
}

func (proof *Proof) computeRootHash() []byte {
	return computeHashFromAunts(proof.Index, proof.Total, proof.LeafHash, proof.Aunts)
}

// computeHashFromAunts recursively computes the root hash
// using the sibling path (aunts) from leaf to root.
func computeHashFromAunts(index, total int64, leafHash []byte, aunts [][]byte) []byte {
	if total == 1 {
		if len(aunts) != 0 {
			return nil
		}
		return leafHash
	}
	if len(aunts) == 0 {
		return nil
	}

	numLeft := getSplitPoint(total)
	if index < numLeft {
		leftHash := computeHashFromAunts(index, numLeft, leafHash, aunts[:len(aunts)-1])
		if leftHash == nil {
			return nil
		}
		return innerHash(leftHash, aunts[len(aunts)-1])
	}
	rightHash := computeHashFromAunts(index-numLeft, total-numLeft, leafHash, aunts[:len(aunts)-1])
	if rightHash == nil {
		return nil
	}
	return innerHash(aunts[len(aunts)-1], rightHash)
}

// HashFromByteSlices computes a Merkle root from a list of byte slices.
// Uses a balanced binary tree: recursively split and hash pairs.
func HashFromByteSlices(items [][]byte) []byte {
	switch len(items) {
	case 0:
		return emptyHash()
	case 1:
		return leafHash(items[0])
	default:
		k := getSplitPoint(int64(len(items)))
		left := HashFromByteSlices(items[:k])
		right := HashFromByteSlices(items[k:])
		return innerHash(left, right)
	}
}

func leafHash(leaf []byte) []byte {
	h := sha256.New()
	h.Write([]byte{0x00}) // leaf prefix
	h.Write(leaf)
	return h.Sum(nil)
}

func innerHash(left, right []byte) []byte {
	h := sha256.New()
	h.Write([]byte{0x01}) // inner prefix
	h.Write(left)
	h.Write(right)
	return h.Sum(nil)
}
