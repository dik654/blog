fn resolve(
    &mut self,
    id: PayloadId,
    kind: PayloadKind,
) -> ResolvePayloadResult<T::BuiltPayload, Gen::Job> {
    let start = Instant::now();

    debug!(target: "payload_builder", %id, "resolving payload job");

    if let Some((cached, _, payload)) = &*self.cached_payload_rx.borrow() &&
        *cached == id
    {
        self.metrics.resolve_duration_seconds.record(start.elapsed());
        return (Some(Box::pin(core::future::ready(Ok(payload.clone())))), None)
    }

    let Some(job) = self.payload_jobs.iter().position(|entry| entry.id == id) else {
        return (None, None)
    };
    let (fut, keep_alive) = self.payload_jobs[job].job.resolve_kind(kind);
    let payload_timestamp = self.payload_jobs[job].job.payload_timestamp();

    let mut resolved_job =
        (keep_alive == KeepPayloadJobAlive::No).then(|| self.payload_jobs.swap_remove(job));
    let leases = resolved_job
        .as_mut()
        .map(|entry| std::mem::take(&mut entry.leases))
        .unwrap_or_default();

    let resolved_metrics = self.metrics.clone();
    let payload_events = self.payload_events.clone();
    let cached_payload_tx = self.cached_payload_tx.clone();

    let fut = async move {
        let _leases = leases;
        let res = fut.await;
        resolved_metrics.resolve_duration_seconds.record(start.elapsed());
        if let Ok(payload) = &res {
            if payload_events.receiver_count() > 0 {
                payload_events.send(Events::BuiltPayload(payload.clone().into())).ok();
            }

            if let Ok(timestamp) = payload_timestamp {
                let _ = cached_payload_tx.send(Some((id, timestamp, payload.clone().into())));
            }

            resolved_metrics
                .set_resolved_revenue(payload.block().number(), f64::from(payload.fees()));
        }
        res.map(|p| p.into())
    };

    (Some(Box::pin(fut)), resolved_job)
}
