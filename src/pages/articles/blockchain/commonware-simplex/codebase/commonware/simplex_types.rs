// consensus/src/simplex/types.rs — Core protocol types

/// Proposal represents a proposed block in the protocol.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Proposal<D: Digest> {
    pub round: Round,    // (epoch, view) of this proposal
    pub parent: View,    // view of the parent proposal we build upon
    pub payload: D,      // digest of the block data
}

/// Validator vote that endorses a proposal for notarization.
pub struct Notarize<S: Scheme, D: Digest> {
    pub proposal: Proposal<D>,       // the proposal being endorsed
    pub attestation: Attestation<S>, // scheme-specific signature material
}

/// Aggregated notarization certificate (2f+1 notarize votes).
pub struct Notarization<S: Scheme, D: Digest> {
    pub proposal: Proposal<D>,       // the notarized proposal
    pub certificate: S::Certificate, // recovered aggregate certificate
}

impl<S: Scheme, D: Digest> Notarization<S, D> {
    /// Builds from notarize votes for the same proposal.
    pub fn from_notarizes(scheme: &S, notarizes: I, strategy: &impl Strategy) -> Option<Self> {
        let proposal = iter.peek()?.proposal.clone();
        // assemble::<_, N3f1> — requires exactly (n-f) valid attestations
        let certificate = scheme.assemble::<_, N3f1>(
            iter.map(|n| n.attestation.clone()), strategy
        )?;
        Some(Self { proposal, certificate })
    }
}

/// Validator vote for nullifying (skipping) the current round.
pub struct Nullify<S: Scheme> {
    pub round: Round,                // round to be skipped
    pub attestation: Attestation<S>, // scheme-specific signature material
}

/// Vote to finalize a notarized proposal.
pub struct Finalize<S: Scheme, D: Digest> {
    pub proposal: Proposal<D>,       // the proposal to finalize
    pub attestation: Attestation<S>, // scheme-specific signature material
}

/// Tracks notarize/nullify/finalize votes for a view.
pub struct VoteTracker<S: Scheme, D: Digest> {
    notarizes: AttributableMap<Notarize<S, D>>,  // per-signer notarize votes
    nullifies: AttributableMap<Nullify<S>>,       // per-signer nullify votes
    finalizes: AttributableMap<Finalize<S, D>>,   // per-signer finalize votes
}
