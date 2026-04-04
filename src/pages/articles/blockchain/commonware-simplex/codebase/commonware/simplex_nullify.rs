// consensus/src/simplex/actors/voter — construct_nullify + broadcast_nullification

// --- state.rs ---
/// Constructs a nullify vote for the current view, if eligible.
/// Returns Some((is_retry, nullify)) — is_retry=true means not first timeout.
pub fn construct_nullify(&mut self, view: View) -> Option<(bool, Nullify<S>)> {
    if view != self.view {
        return None;            // 현재 뷰만 nullify 가능
    }
    let is_retry = self.create_round(view).construct_nullify()?;
    let nullify = Nullify::sign::<D>(&self.scheme, Rnd::new(self.epoch, view))?;
    if !is_retry {
        let round = self.create_round(view);
        let reason = if round.proposal().is_some() {
            TimeoutReason::CertificationTimeout  // 제안은 받았지만 인증 실패
        } else {
            TimeoutReason::LeaderTimeout          // 제안 자체가 없음
        };
        let (reason, _) = round.set_timeout_reason(reason);
        if let Some(leader) = round.leader() {
            self.timeouts.get_or_create(&Timeout::new(&leader.key, reason)).inc();
        }
    }
    Some((is_retry, nullify))
}

/// Construct a nullification certificate once the round has quorum.
pub fn broadcast_nullification(&mut self, view: View) -> Option<Nullification<S>> {
    self.views
        .get_mut(&view)
        .and_then(|round| round.broadcast_nullification())
}

// --- round.rs ---
/// Returns a nullify vote if we should timeout/retry.
pub const fn construct_nullify(&mut self) -> Option<bool> {
    if self.broadcast_finalize {
        return None;  // 이미 finalize 투표 → nullify 불필요
    }
    let retry = replace(&mut self.broadcast_nullify, true);
    self.clear_deadlines();
    self.set_timeout_retry(None);
    Some(retry) // true=retry, false=first timeout
}
