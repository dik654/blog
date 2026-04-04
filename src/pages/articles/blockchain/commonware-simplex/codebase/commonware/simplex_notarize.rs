// consensus/src/simplex/actors/voter — construct_notarize + broadcast_notarization

// --- state.rs ---
/// Construct a notarize vote for this view when we're ready to sign.
pub fn construct_notarize(&mut self, view: View) -> Option<Notarize<S, D>> {
    let candidate = self.views
        .get_mut(&view)
        .and_then(|round| round.construct_notarize().cloned())?;

    // Signing can only fail if we are a verifier
    Notarize::sign(&self.scheme, candidate)
}

/// Construct a notarization certificate once the round has quorum.
pub fn broadcast_notarization(&mut self, view: View) -> Option<Notarization<S, D>> {
    self.views
        .get_mut(&view)
        .and_then(|round| round.broadcast_notarization())
}

// --- actor.rs ---
/// Build, persist, and broadcast a notarize vote when this view is ready.
async fn try_broadcast_notarize(&mut self, batcher, vote_sender, view: View) {
    let Some(notarize) = self.state.construct_notarize(view) else { return };

    batcher.constructed(Vote::Notarize(notarize.clone())).await; // batcher에 전달
    self.handle_notarize(notarize.clone()).await;                // 저널에 기록
    self.sync_journal(view).await;                               // fsync

    // 전체 참여자에게 브로드캐스트
    self.broadcast_vote(vote_sender, Vote::Notarize(notarize)).await;
}

/// Share a notarization certificate once we can assemble it locally.
async fn try_broadcast_notarization(&mut self, resolver, certificate_sender, view, resolved) {
    let Some(notarization) = self.state.broadcast_notarization(view) else { return };

    if resolved != Resolved::Notarization {
        resolver.updated(Certificate::Notarization(notarization.clone())).await;
    }
    self.handle_notarization(notarization.clone()).await;
    self.sync_journal(view).await;
    self.broadcast_certificate(certificate_sender,
        Certificate::Notarization(notarization.clone())).await;
    self.reporter.report(Activity::Notarization(notarization)).await;
}
