package tmhash

import (
	"crypto/sha256"
)

const (
	Size          = sha256.Size      // 32 bytes — full SHA256
	TruncatedSize = 20               // TMHASH = SHA256[:20]
)

// Sum computes SHA256 of the given data.
func Sum(data []byte) []byte {
	h := sha256.Sum256(data)
	return h[:]
}

// SumTruncated returns the first 20 bytes of SHA256(data).
// Used for Address derivation and internal hash identifiers.
func SumTruncated(data []byte) []byte {
	h := sha256.Sum256(data)
	return h[:TruncatedSize]
}

// New returns a new hash.Hash computing SHA256 checksum.
func New() hash.Hash {
	return sha256.New()
}
