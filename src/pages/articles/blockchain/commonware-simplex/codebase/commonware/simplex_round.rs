// consensus/src/simplex/actors/voter/round.rs — Round<S, D>

/// Per-Round state machine.
pub struct Round<S: Scheme, D: Digest> {
    start: SystemTime,       // when this round was created
    scheme: S,               // signing scheme
    round: Rnd,              // (epoch, view) pair

    leader: Option<Leader<S::PublicKey>>, // elected leader

    proposal: ProposalSlot<D>,           // the proposal for this round
    leader_deadline: Option<SystemTime>,  // when to timeout waiting for leader
    certification_deadline: Option<SystemTime>, // when to timeout certification
    timeout_retry: Option<SystemTime>,   // next nullify retry time
    timeout_reason: Option<TimeoutReason>,

    // Certificates received from batcher (constructed or from network)
    notarization: Option<Notarization<S, D>>,
    broadcast_notarize: bool,       // have we broadcast our notarize vote?
    broadcast_notarization: bool,   // have we broadcast the notarization cert?
    nullification: Option<Nullification<S>>,
    broadcast_nullify: bool,        // have we broadcast our nullify vote?
    broadcast_nullification: bool,  // have we broadcast the nullification cert?
    finalization: Option<Finalization<S, D>>,
    broadcast_finalize: bool,       // have we broadcast our finalize vote?
    broadcast_finalization: bool,   // have we broadcast the finalization cert?
    certify: CertifyState,          // certification progress tracking
}

/// Returns a nullify vote if we should timeout/retry.
pub const fn construct_nullify(&mut self) -> Option<bool> {
    if self.broadcast_finalize {
        return None;  // already finalized — no timeout needed
    }
    let retry = replace(&mut self.broadcast_nullify, true);
    self.clear_deadlines();
    self.set_timeout_retry(None);
    Some(retry) // true = retry, false = first timeout
}
