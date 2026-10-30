// p2p/src/authenticated/router/ingress.rs · Commonware v2026.9.0
// 한국어 설명: Router가 아직 시작되지 않았으면 local send는 Ok를 돌려주지만 실제 recipient는 없습니다.
let Some(mailbox) = self.shared.mailbox.get() else {
    return Unreliable::new(Feedback::Ok);
};
let Some(mailbox) = mailbox else {
    return Unreliable::new(Feedback::Closed);
};

// 한국어 설명: Channel과 payload를 한 번 encode하고 bounded router mailbox에 Content를 넣습니다.
let encoded = EncodedData::new(&self.pool, channel, message);
mailbox.0.enqueue(Message::Content {
    recipients,
    encoded,
    priority,
})

// p2p/src/authenticated/router/actor.rs
// 한국어 설명: Router는 현재 연결된 recipient relay에 넣어 보지만 그 결과를 caller에게 되돌리지 않습니다.
fn send(&mut self, recipient: P, encoded: EncodedData, priority: bool) {
    if let Some(relay) = self.connections.get_mut(&recipient) {
        let _ = relay.send(encoded, priority);
    }
}

// p2p/src/authenticated/lookup/actors/peer/actor.rs
// 한국어 설명: Bob peer actor는 decrypted frame을 decode하고 등록 channel인지 먼저 확인합니다.
let msg = conn_receiver.recv().await.map_err(Error::ReceiveFailed)?;
let max_data_length = msg.len();
let msg = types::Message::decode_cfg(msg, &max_data_length)
    .map_err(Error::DecodeFailed)?;
let (metric, rate_limiter) = match &msg {
    types::Message::Data(data) => match rate_limits.get(&data.channel) {
        Some(rate_limit) => (metrics::Message::new_data(&peer, data.channel), rate_limit),
        None => return Err(Error::InvalidChannel),
    },
    types::Message::Ping => (metrics::Message::new_ping(&peer), &ping_rate_limiter),
};

// 한국어 설명: Per-peer quota가 찼으면 기다린 뒤, application mailbox에는 blocking 없이 넣습니다.
if let Err(wait_until) = rate_limiter.check() {
    let wait_duration = wait_until.wait_time_from(context.now());
    context.sleep(wait_duration).await;
}
if let types::Message::Data(data) = msg {
    let sender = senders.get_mut(&data.channel).unwrap();
    let _ = sender.enqueue(channels::Inbound((peer.clone(), data.message)));
}
