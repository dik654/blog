// consensus/src/ordered_broadcast/types.rs — Node + Chunk + Parent

/// Chunk — the smallest unit of data in ordered broadcast.
/// Each sequencer maintains its own chain of chunks.
#[derive(Clone, Debug)]
pub struct Chunk<P: PublicKey, D: Digest> {
    pub sequencer: P,    // sequencer's public key
    pub height: Height,  // sequencer-specific height (zero-indexed)
    pub payload: D,      // digest of the actual payload
}

/// Parent — links a chunk to its predecessor.
/// Contains a certificate proving quorum acknowledged the parent.
pub struct Parent<S: Scheme, D: Digest> {
    pub digest: D,                  // digest of parent chunk
    pub epoch: Epoch,               // epoch of signing validator set
    pub certificate: S::Certificate, // quorum certificate over parent
}

/// Node — sequencer's broadcast message.
/// Contains a Chunk + signature + optional Parent (chain link).
pub struct Node<P: PublicKey, S: Scheme, D: Digest> {
    pub chunk: Chunk<P, D>,
    pub signature: P::Signature,     // sequencer signs the chunk
    pub parent: Option<Parent<S, D>>, // None for genesis (height 0)
}
