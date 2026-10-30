pub async fn try_construct_certificate(
    &mut self,
    strategy: &impl Strategy,
) -> Option<Certificate<S, D>> {
    if let Some(notarizes) = self.notarize.try_complete() {
        let span = info_span!(
            "simplex.batcher.try_construct_notarization",
            epoch = self.round.epoch().traced(),
            view = self.round.view().traced()
        );
        let scheme = Arc::clone(&self.scheme);
        let notarization = offload(notarizes.len(), span, strategy, move |strategy| {
            Notarization::from_owned_notarizes(
                scheme.as_ref(),
                non_empty![@notarizes],
                &strategy,
            )
            .expect("verified notarize quorum must assemble")
        })
        .await;
        return Some(Certificate::Notarization(notarization));
    }

    if let Some(nullifies) = self.nullify.try_complete() {
        let span = info_span!(
            "simplex.batcher.try_construct_nullification",
            epoch = self.round.epoch().traced(),
            view = self.round.view().traced()
        );
        let scheme = Arc::clone(&self.scheme);
        let nullification = offload(nullifies.len(), span, strategy, move |strategy| {
            Nullification::from_owned_nullifies(
                scheme.as_ref(),
                non_empty![@nullifies],
                &strategy,
            )
            .expect("verified nullify quorum must assemble")
        })
        .await;
        return Some(Certificate::Nullification(nullification));
    }

    if let Some(finalizes) = self.finalize.try_complete() {
        let span = info_span!(
            "simplex.batcher.try_construct_finalization",
            epoch = self.round.epoch().traced(),
            view = self.round.view().traced()
        );
        let scheme = Arc::clone(&self.scheme);
        let finalization = offload(finalizes.len(), span, strategy, move |strategy| {
            Finalization::from_owned_finalizes(
                scheme.as_ref(),
                non_empty![@finalizes],
                &strategy,
            )
            .expect("verified finalize quorum must assemble")
        })
        .await;
        return Some(Certificate::Finalization(finalization));
    }
}
