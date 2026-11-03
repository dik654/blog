func (s *Service) wrapAndReportValidation(topic string, v wrappedVal) (string, pubsub.ValidatorEx) {
	return topic, func(ctx context.Context, pid peer.ID, msg *pubsub.Message) (res pubsub.ValidationResult) {
		defer messagehandler.HandlePanic(ctx, msg)
		// Default: ignore any message that panics.
		res = pubsub.ValidationIgnore // nolint:wastedassign
		ctx, cancel := context.WithTimeout(ctx, pubsubMessageTimeout)
		defer cancel()
		messageReceivedCounter.WithLabelValues(topic).Inc()
		if msg.Topic == nil {
			messageFailedValidationCounter.WithLabelValues(topic).Inc()
			return pubsub.ValidationReject
		}
		// Ignore any messages received before chainstart.
		if !s.chainStarted.Load() {
			messageIgnoredValidationCounter.WithLabelValues(topic).Inc()
			return pubsub.ValidationIgnore
		}
		retDigest, err := p2p.ExtractGossipDigest(topic)
		if err != nil {
			log.WithField("topic", topic).Errorf("Invalid topic format of pubsub topic: %v", err)
			return pubsub.ValidationIgnore
		}
		currDigest := s.currentForkDigest()
		if currDigest != retDigest {
			// Only proposer preferences are accepted from the next epoch's fork
			// digest, allowing them to arrive before a fork activates.
			if !strings.Contains(topic, p2p.GossipSignedProposerPreferencesMessage) ||
				params.ForkDigest(s.cfg.clock.CurrentEpoch()+1) != retDigest {
				log.WithField("topic", topic).Debugf("Received message from outdated fork digest %#x", retDigest)
				return pubsub.ValidationIgnore
			}
		}
		b, err := v(ctx, pid, msg)
		// We do not penalize peers if we are hitting pubsub timeouts
		// trying to process those messages.
		if b == pubsub.ValidationReject && ctx.Err() != nil {
			b = pubsub.ValidationIgnore
		}
		if b == pubsub.ValidationReject {
			fields := logrus.Fields{
				"topic":        topic,
				"multiaddress": multiAddr(pid, s.cfg.p2p.Peers()),
				"peerID":       pid.String(),
				"agent":        agentString(pid, s.cfg.p2p.Host()),
				"gossipScore":  s.cfg.p2p.Peers().Scorers().GossipScorer().Score(pid),
			}
			if features.Get().EnableFullSSZDataLogging {
				fields["message"] = hexutil.Encode(msg.Data)
			}
			log.WithError(err).WithFields(fields).Debug("Gossip message was rejected")
			messageFailedValidationCounter.WithLabelValues(topic).Inc()
		}
		if b == pubsub.ValidationIgnore {
			if err != nil && !errorIsIgnored(err) {
				log.WithError(err).WithFields(logrus.Fields{
					"topic":        topic,
					"multiaddress": multiAddr(pid, s.cfg.p2p.Peers()),
					"peerID":       pid.String(),
					"agent":        agentString(pid, s.cfg.p2p.Host()),
					"gossipScore":  fmt.Sprintf("%.2f", s.cfg.p2p.Peers().Scorers().GossipScorer().Score(pid)),
				}).Debug("Gossip message was ignored")
			}
			messageIgnoredValidationCounter.WithLabelValues(topic).Inc()
		}
		return b
	}
}
