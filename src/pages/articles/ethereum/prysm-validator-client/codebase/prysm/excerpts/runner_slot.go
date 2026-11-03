	for {
		select {
		case <-ctx.Done():
			log.Info("Context canceled, stopping validator")
			//nolint:govet
			return // Exit if context is canceled.
		case slot := <-v.NextSlot():
			if !v.healthMonitor.IsHealthy() {
				log.WithField("url", api.RedactEndpointList(r.validator.Host())).Warning("Beacon node unhealthy, stopping runner")
				return
			}

			// Restart the event stream if it died, or rebind it after a fallback
			v.EnsureEventStream(ctx, eventClient.DefaultEventTopics)

			deadline := v.SlotDeadline(slot)
			slotCtx, cancel := context.WithDeadline(ctx, deadline) //nolint:govet

			var span trace.Span
			slotCtx, span = prysmTrace.StartSpan(slotCtx, "validator.processSlot")
			span.SetAttributes(prysmTrace.Int64Attribute("slot", int64(slot))) // lint:ignore uintcast -- This conversion is OK for tracing.

			log := log.WithField("slot", slot)
			log.WithField("deadline", deadline).Debug("Set deadline for proposals and attestations")

			// Refresh assignments at the epoch boundary.
			if slots.IsEpochStart(slot) {
				dutiesDeadline := v.SlotDeadline(slot + params.BeaconConfig().SlotsPerEpoch - 1)
				dutiesCtx, dutiesCancel := context.WithDeadline(ctx, dutiesDeadline)
				if err := v.UpdateDuties(dutiesCtx); err != nil {
					handleAssignmentError(err, slot)
					v.dutyAwareShutdown.markDone(slot)
					dutiesCancel()
					span.End()
					cancel()
					continue
				}
				dutiesCancel()
			}

			// Fetch the deferred next-epoch duties in the background. Pre-Gloas this
			// no-ops: only the split path records the indices needsNextFetch requires.
			if shouldFetchNextDuties(slot) {
				v.MaybeFetchNextDuties(ctx, slot)
			}

			// Background doppelganger check for keys quarantined by a key reload.
			v.CheckDoppelGangerMidEpoch(ctx, slot)

			// call push proposer settings often to account for the following edge cases:
			// proposer is activated at the start of epoch and tries to propose immediately
			// account has changed in the middle of an epoch
			if err := v.PushProposerSettings(slotCtx, slot, false); err != nil {
				log.WithError(err).Warn("Failed to update proposer settings")
			}

			// Start fetching domain data for the next epoch.
			if slots.IsEpochEnd(slot) {
				domainCtx, _ := context.WithDeadline(ctx, deadline) //nolint:govet
				go v.UpdateDomainDataCaches(domainCtx, slot+1)
			}

			var wg sync.WaitGroup

			allRoles, err := v.RolesAt(slotCtx, slot)
			if err != nil {
				log.WithError(err).Error("Could not get validator roles")
				v.dutyAwareShutdown.markDone(slot)
				span.End()
				cancel()
				continue
			}
			// performRoles calls span.End()
			rolesCtx, _ := context.WithDeadline(ctx, deadline) //nolint:govet
			performRoles(rolesCtx, allRoles, v, slot, &wg, span)
		case e := <-v.EventsChan():
