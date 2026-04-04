// beacon-chain/sync/subscriber.go — Prysm v5.x

// subscribeStaticTopics subscribes to all required gossip topics.
func (s *Service) subscribeStaticTopics() {
	s.subscribe(
		p2p.BlockSubnetTopicFormat,
		s.validateBeaconBlockPubSub,
		s.beaconBlockSubscriber,
	)
	s.subscribe(
		p2p.AttestationSubnetTopicFormat,
		s.validateCommitteeIndexBeaconAttestation,
		s.committeeIndexBeaconAttestationSubscriber,
	)
	s.subscribe(
		p2p.SyncCommitteeSubnetTopicFormat,
		s.validateSyncCommitteeMessage,
		s.syncCommitteeMessageSubscriber,
	)
}

// subscribe wraps topic subscription with fork digest prefix.
func (s *Service) subscribe(
	topicFormat string,
	validate pubsub.ValidatorEx,
	handle messageHandler,
) {
	digest, err := s.currentForkDigest()
	if err != nil {
		log.WithError(err).Error("Could not get fork digest")
		return
	}
	topic := fmt.Sprintf(topicFormat, digest)
	sub, err := s.p2p.SubscribeToTopic(topic, validate)
	if err != nil {
		log.WithError(err).Error("Could not subscribe to topic")
		return
	}
	go s.handleMessages(sub, handle)
}
