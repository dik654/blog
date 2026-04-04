import type { CodeRef } from '@/components/code/types';

export const gossipsubCodeRefs2: Record<string, CodeRef> = {
  'gossipsub-struct': {
    path: 'protocols/gossipsub/src/behaviour.rs — Behaviour<D, F> 구조체',
    lang: 'rust',
    highlight: [1, 30],
    desc: 'Gossipsub Behaviour는 mesh 오버레이, fanout, 메시지 캐시, 피어 스코어링을 관리하는 핵심 구조체입니다.',
    code: `pub struct Behaviour<D = IdentityTransform, F = AllowAllSubscriptionFilter> {
    config: Config,
    events: VecDeque<ToSwarm<Event, HandlerIn>>,
    publish_config: PublishConfig,
    /// An LRU Time cache for storing seen messages (based on their ID).
    duplicate_cache: DuplicateCache<MessageId>,
    connected_peers: HashMap<PeerId, PeerDetails>,
    /// Explicit peers — unconditionally forward, outside scoring.
    explicit_peers: HashSet<PeerId>,
    blacklisted_peers: HashSet<PeerId>,
    /// Overlay network — Maps topics to connected gossipsub peers.
    mesh: HashMap<TopicHash, BTreeSet<PeerId>>,
    /// Topics we publish to but don't subscribe to.
    fanout: HashMap<TopicHash, BTreeSet<PeerId>>,
    fanout_last_pub: HashMap<TopicHash, Instant>,
    backoffs: BackoffStorage,
    /// Message cache for the last few heartbeats.
    mcache: MessageCache,
    /// Stores peer score data together with thresholds.
    peer_score: PeerScoreState,
    /// Tracks recently sent IWANT messages and checks if peers respond.
    gossip_promises: GossipPromises,
    failed_messages: HashMap<PeerId, FailedMessages>,
}`,
    annotations: [
      { lines: [12, 12], color: 'sky', note: '토픽별 메시 피어 관리' },
      { lines: [14, 14], color: 'emerald', note: 'fanout — 구독 없이 발행만 하는 토픽의 피어' },
      { lines: [18, 18], color: 'amber', note: '최근 메시지 캐시 — IHAVE/IWANT 교환에 사용' },
      { lines: [20, 20], color: 'violet', note: '피어 스코어링 시스템' },
    ],
  },

  'gossipsub-handle-msg': {
    path: 'protocols/gossipsub/src/behaviour.rs — handle_received_message()',
    lang: 'rust',
    highlight: [1, 40],
    desc: '수신 메시지를 검증하고, 중복 체크 후 mcache에 저장하고 mesh 피어에게 전파합니다.',
    code: `fn handle_received_message(
    &mut self, mut raw_message: RawMessage, propagation_source: &PeerId,
) {
    let message = match self.data_transform.inbound_transform(raw_message.clone()) {
        Ok(message) => message,
        Err(e) => {
            self.handle_invalid_message(propagation_source, &raw_message.topic,
                None, RejectReason::ValidationError(ValidationError::TransformFailed));
            return;
        }
    };

    let msg_id = self.config.message_id(&message);

    if !self.message_is_valid(&msg_id, &mut raw_message, propagation_source) {
        return;
    }

    if !self.duplicate_cache.insert(msg_id.clone()) {
        if let PeerScoreState::Active(peer_score) = &mut self.peer_score {
            peer_score.duplicated_message(propagation_source, &msg_id, &message.topic);
        }
        self.mcache.observe_duplicate(&msg_id, propagation_source);
        return;
    }

    self.gossip_promises.message_delivered(&msg_id);
    if let PeerScoreState::Active(peer_score) = &mut self.peer_score {
        peer_score.validate_message(propagation_source, &msg_id, &message.topic);
    }

    // Add the message to our memcache
    self.mcache.put(&msg_id, raw_message.clone());

    // Dispatch the message to the user if we are subscribed
    if self.mesh.contains_key(&message.topic) {
        self.events.push_back(ToSwarm::GenerateEvent(Event::Message {
            propagation_source: *propagation_source,
            message_id: msg_id.clone(), message,
        }));
    }

    // forward the message to mesh peers, if no validation is required
    if !self.config.validate_messages() {
        self.forward_msg(&msg_id, raw_message, Some(propagation_source), HashSet::new());
    }
}`,
    annotations: [
      { lines: [4, 11], color: 'sky', note: '메시지 검증 — transform 실패 시 즉시 거부' },
      { lines: [19, 25], color: 'emerald', note: '중복 체크 — duplicate_cache로 이미 본 메시지 필터링' },
      { lines: [32, 33], color: 'amber', note: 'mcache에 삽입 — 이후 IHAVE 교환에 활용' },
      { lines: [43, 46], color: 'violet', note: 'mesh 피어에게 전파 (validate_messages 비활성 시)' },
    ],
  },
};
