pub fn construct_finalize(&mut self) -> Option<&Proposal<D>> {
    // Ensure we haven't already broadcast a finalize vote or nullify vote.
    // The nullify check is the never-healing base case of same-term vote
    // safety (see the module documentation).
    if self.broadcast_finalize || self.broadcast_nullify {
        return None;
    }
    // We do not check for an observed finalization here: the caller only
    // requests finalize votes for views above the last finalized view,
    // a premise of the same-term vote safety argument (see the module
    // documentation).

    // If we have a proposal and we have not yet detected equivocation, we are willing
    // to consider constructing a finalize vote.
    if !self.proposal.has_unequivocated_proposal() {
        return None;
    }

    // If there doesn't exist a notarization certificate, return None.
    self.notarization.as_ref()?;

    // If we haven't certified the proposal, return None.
    //
    // Note, this does not require verification.
    if !self.is_certified() {
        return None;
    }

    self.broadcast_finalize = true;
    self.proposal.proposal()
}
