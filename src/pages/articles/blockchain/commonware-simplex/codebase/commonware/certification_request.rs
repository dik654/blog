let (candidates, fetches) = self.state.certify_candidates();
for CertificateFetch { proposal, view } in fetches {
    resolver.resolve(proposal, view, Kind::Notarization, None);
}
for proposal in candidates {
    let round = proposal.round;
    let view = round.view();
    debug!(%view, "attempting certification");
    let span = info_span!(
        parent: self.state.view_span(view),
        "simplex.voter.certify",
        epoch = round.epoch().traced(),
        view = view.traced()
    );
    #[allow(clippy::async_yields_async)]
    let receiver = async { self.automaton.certify(round, proposal.payload).await }
        .instrument(span.clone())
        .await;
    let handle = certify_pool.push(async move { (round, span, receiver.await) });
    self.state.set_certify_handle(view, handle);
}
