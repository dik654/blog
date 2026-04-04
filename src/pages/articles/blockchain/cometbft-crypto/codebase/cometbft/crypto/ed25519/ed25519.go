package ed25519

import (
	"crypto/ed25519"
	"crypto/sha256"
	"fmt"
	"io"

	"github.com/cometbft/cometbft/crypto"
	"github.com/cometbft/cometbft/crypto/tmhash"
)

const (
	PrivKeySize = 64
	PubKeySize  = 32
	SignatureSize = 64
	KeyType     = "ed25519"
	SeedSize    = 32
)

// PrivKey implements crypto.PrivKey.
type PrivKey []byte

// Sign produces an ed25519 signature on the provided message.
// The message is not hashed prior to signing (ed25519 does internal hashing).
func (privKey PrivKey) Sign(msg []byte) ([]byte, error) {
	if len(privKey) != PrivKeySize {
		panic("invalid private key size")
	}
	return ed25519.Sign(ed25519.PrivateKey(privKey), msg), nil
}

// PubKey returns the corresponding public key.
func (privKey PrivKey) PubKey() crypto.PubKey {
	privKeyEd := ed25519.PrivateKey(privKey)
	pubBytes := privKeyEd.Public().(ed25519.PublicKey)
	return PubKey(pubBytes)
}

// PubKey implements crypto.PubKey for the Ed25519 signature scheme.
type PubKey []byte

// Address is the SHA256-20 (TMHASH) of the raw pubkey bytes.
// TMHASH = first 20 bytes of SHA256.
func (pubKey PubKey) Address() crypto.Address {
	if len(pubKey) != PubKeySize {
		panic("invalid pubkey size")
	}
	return crypto.Address(tmhash.SumTruncated(pubKey))
}

// VerifySignature verifies an ed25519 signature against a message.
// Returns true if the signature is valid.
func (pubKey PubKey) VerifySignature(msg []byte, sig []byte) bool {
	if len(sig) != SignatureSize {
		return false
	}
	return ed25519.Verify(ed25519.PublicKey(pubKey), msg, sig)
}

// Type returns the key type string.
func (pubKey PubKey) Type() string {
	return KeyType
}
