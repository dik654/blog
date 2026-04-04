import type { CodeRef } from '@/components/code/types';

export const gossipsubCodeRefs: Record<string, CodeRef> = {
  'gossipsub-publish': {
    path: 'protocols/gossipsub/src/behaviour.rs — publish()',
    lang: 'rust',
    highlight: [1, 44],
    desc: 'publish()는 메시지를 빌드하고, mesh/fanout에서 수신자를 선택한 뒤 IDONTWANT를 먼저 보내고 메시지를 전송합니다.',
    code: `pub fn publish(&mut self, topic: impl Into<TopicHash>, data: impl Into<Vec<u8>>)
    -> Result<MessageId, PublishError>
{
    let transformed_data = self.data_transform
        .outbound_transform(&topic.clone(), data.clone())?;
    if transformed_data.len() > max_transmit_size_for_topic {
        return Err(PublishError::MessageTooLarge);
    }
    let raw_message = self.build_raw_message(topic, transformed_data)?;
    let msg_id = self.config.message_id(&Message {
        source: raw_message.source, data,
        sequence_number: raw_message.sequence_number,
        topic: raw_message.topic.clone(),
    });
    if self.duplicate_cache.contains(&msg_id) { return Err(PublishError::Duplicate); }

    let candidates = self.publish_peers(&topic_hash);
    let recipients = self.filter_publish_candidates(&topic_hash, candidates);
    if recipients.is_empty() { return Err(PublishError::NoPeersSubscribedToTopic); }
    self.duplicate_cache.insert(msg_id.clone());
    self.mcache.put(&msg_id, raw_message.clone());

    for peer_id in recipients.iter() {
        // Send IDONTWANT first so slower publishers don't receive it back
        if raw_message.raw_protobuf_len() > self.config.idontwant_message_size_threshold() {
            self.send_message(*peer_id, RpcOut::IDontWant(IDontWant {
                message_ids: vec![msg_id.clone()],
            }));
        }
        self.send_message(*peer_id, RpcOut::Publish {
            message_id: msg_id.clone(), message: raw_message.clone(),
            timeout: Delay::new(self.config.publish_queue_duration()),
        });
    }
    Ok(msg_id)
}`,
    annotations: [
      { lines: [4, 15], color: 'sky', note: '메시지 구성: transform → build → msg_id 계산' },
      { lines: [20, 22], color: 'emerald', note: 'mesh/fanout에서 수신 피어 선택' },
      { lines: [29, 35], color: 'amber', note: 'IDONTWANT 선 브로드캐스트 — 중복 수신 방지' },
      { lines: [36, 41], color: 'violet', note: 'RpcOut::Publish로 실제 메시지 전송' },
    ],
  },

  'gossipsub-heartbeat': {
    path: 'protocols/gossipsub/src/behaviour.rs — heartbeat()',
    lang: 'rust',
    highlight: [1, 28],
    desc: 'heartbeat()는 주기적으로 mesh를 유지보수합니다. 백오프 정리, IWANT 페널티, 메시 리밸런싱을 순서대로 수행합니다.',
    code: `fn heartbeat(&mut self) {
    self.heartbeat_ticks += 1;
    let mut to_graft = HashMap::new();
    let mut to_prune = HashMap::new();

    self.backoffs.heartbeat();   // clean up expired backoffs
    self.count_sent_iwant.clear();
    self.count_received_ihave.clear();
    self.apply_iwant_penalties(); // penalize peers who broke IWANT promises

    // maintain the mesh for each topic
    for (topic_hash, peers) in self.mesh.iter_mut() {
        let mesh_n = self.config.mesh_n_for_topic(topic_hash);
        let mesh_n_low = self.config.mesh_n_low_for_topic(topic_hash);

        // Drop all peers with negative score
        peers.retain(|peer_id| {
            let score = scores.get(peer_id).map(|r| r.score).unwrap_or_default();
            if score < 0.0 {
                to_prune.entry(*peer_id).or_default().push(topic_hash.clone());
                return false;
            }
            true
        });

        // too little peers - add some
        if peers.len() < mesh_n_low {
            let peer_list = get_random_peers(&self.connected_peers, topic_hash,
                mesh_n - peers.len(), |p| !peers.contains(p));
            peers.extend(peer_list);
        }
    }
}`,
    annotations: [
      { lines: [6, 8], color: 'sky', note: '백오프·IHAVE 카운터 정리' },
      { lines: [9], color: 'emerald', note: 'IWANT 약속 미이행 피어에 페널티' },
      { lines: [12, 32], color: 'amber', note: '메시 유지보수: 음수 스코어 제거 → 부족하면 랜덤 추가' },
    ],
  },
};
