func (s *Service) subscribe(topic string, validator wrappedVal, handle subHandler, nse params.NetworkScheduleEntry) {
	// Subscriptions need to come up before initial sync completes so the node can
	// follow new gossip immediately after the synced flag flips. Validators already
	// ignore messages while initial sync is still active.
	if s.subscriptionRequestExpired(nse) {
		log.WithFields(s.subscribeLogFields(topic, nse)).Debug("Not subscribing to topic as we are already past the next fork epoch")
		return
	}
	base := p2p.GossipTopicMappings(topic, nse.Epoch)
	if base == nil {
		// Impossible condition as it would mean topic does not exist.
		panic(fmt.Sprintf("%s is not mapped to any message in GossipTopicMappings", topic)) // lint:nopanic -- Impossible condition.
	}
	s.subscribeWithBase(s.addDigestToTopic(topic, nse.ForkDigest)+s.cfg.p2p.Encoding().ProtocolSuffix(), validator, handle)
}

func (s *Service) subscribeWithBase(topic string, validator wrappedVal, handle subHandler) *pubsub.Subscription {
	log := log.WithField("topic", topic)

	// Do not resubscribe already seen subscriptions.
	ok := s.subHandler.topicExists(topic)
	if ok {
		log.WithField("topic", topic).Error("Provided topic already has an active subscription running")
		return nil
	}

	if err := s.cfg.p2p.PubSub().RegisterTopicValidator(s.wrapAndReportValidation(topic, validator)); err != nil {
		log.WithError(err).Error("Could not register validator for topic")
		return nil
	}

	sub, err := s.cfg.p2p.SubscribeToTopic(topic)
	if err != nil {
		// Any error subscribing to a PubSub topic would be the result of a misconfiguration of
		// libp2p PubSub library or a subscription request to a topic that fails to match the topic
		// subscription filter.
		log.WithError(err).Error("Could not subscribe topic")
		return nil
	}

	s.subHandler.addTopic(sub.Topic(), sub)

	// Pipeline decodes the incoming subscription data, runs the validation, and handles the
	// message.
	pipeline := func(msg *pubsub.Message) {
		ctx, cancel := context.WithTimeout(s.ctx, pubsubMessageTimeout)
		defer cancel()

		ctx, span := trace.StartSpan(ctx, "sync.pubsub")
		defer span.End()

		defer func() {
			if r := recover(); r != nil {
				tracing.AnnotateError(span, fmt.Errorf("panic occurred: %v", r))
				log.WithField("error", r).
					WithField("recoveredAt", "subscribeWithBase").
					WithField("stack", string(debug.Stack())).
					Error("Panic occurred")
			}
		}()

		span.SetAttributes(trace.StringAttribute("topic", topic))

		if msg.ValidatorData == nil {
			log.Error("Received nil message on pubsub")
			messageFailedProcessingCounter.WithLabelValues(topic).Inc()
			return
		}

		if err := handle(ctx, msg.ValidatorData.(proto.Message)); err != nil {
			tracing.AnnotateError(span, err)
			log.WithError(err).Error("Could not handle p2p pubsub")
			messageFailedProcessingCounter.WithLabelValues(topic).Inc()
			return
		}
	}
