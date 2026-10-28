if this.deadline.as_mut().poll(cx).is_ready() {
    trace!(target: "payload_builder", "payload building deadline reached");
    return Poll::Ready(Ok(()))
}

loop {
    if let Some(mut fut) = this.pending_block.take() {
        match fut.poll_unpin(cx) {
            Poll::Ready(Ok(outcome)) => match outcome {
                BuildOutcome::Better { payload, cached_reads } => {
                    this.cached_reads = Some(cached_reads);
                    debug!(target: "payload_builder", value = %payload.fees(), "built better payload");
                    this.best_payload = PayloadState::Best(payload);
                }
                BuildOutcome::Freeze(payload) => {
                    debug!(target: "payload_builder", "payload frozen, no further building will occur");
                    this.best_payload = PayloadState::Frozen(payload);
                }
                BuildOutcome::Aborted { fees, cached_reads } => {
                    this.cached_reads = Some(cached_reads);
                    trace!(target: "payload_builder", worse_fees = %fees, "skipped payload build of worse block");
                }
                BuildOutcome::Cancelled => {
                    unreachable!("the cancel signal never fired")
                }
            },
            Poll::Ready(Err(error)) => {
                debug!(target: "payload_builder", %error, "payload build attempt failed");
                this.metrics.inc_failed_payload_builds();
            }
            Poll::Pending => {
                this.pending_block = Some(fut);
                return Poll::Pending
            }
        }
    }

    if this.best_payload.is_frozen() {
        return Poll::Pending
    }

    ready!(this.interval.poll_tick(cx));
    this.spawn_build_job()
}
