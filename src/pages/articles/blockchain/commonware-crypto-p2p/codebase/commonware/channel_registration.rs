// p2p/src/authenticated/channels.rs · Commonware v2026.9.0
// 한국어 설명: 등록 channel 하나의 inbound mailbox는 모든 허용 peer의 quota burst를 담을 만큼 잡습니다.
pub fn register<C: Clock + Metrics>(
    &mut self,
    channel: Channel,
    rate: Quota,
    context: C,
) -> (Sender<P, C>, Receiver<P>) {
    if self.receivers.contains_key(&channel) {
        panic!("duplicate channel registration: {channel}");
    }
    let capacity = self
        .max_peers
        .get()
        .checked_mul(rate.burst_size().get() as usize)
        .and_then(NonZeroUsize::new)
        .expect("channel mailbox capacity overflow");
    self.outbound_capacity = self
        .outbound_capacity
        .checked_add(capacity.get())
        .expect("router mailbox capacity overflow");
    let (sender, receiver) = mailbox::new_unreliable(context.child("mailbox"), capacity);
    assert!(self.receivers.insert(channel, (rate, sender)).is_none());
    (
        Sender::new(channel, self.max_size, self.messenger.handle(), context, rate),
        Receiver::new(receiver),
    )
}

// 한국어 설명: Application은 inbound mailbox에서 sender public key와 decrypted bytes를 함께 받습니다.
async fn recv(&mut self) -> Result<NetworkMessage<Self::PublicKey>, Error> {
    let Inbound((sender, message)) = self.receiver.recv().await.ok_or(Error::NetworkClosed)?;
    Ok((sender, message))
}

// p2p/src/authenticated/channels.rs · 공식 test의 용량 예
// 한국어 설명: max_peers=2, burst_size=2이면 네 건이 접수되고 다섯 번째 새 도착은 버려집니다.
for _ in 0..4 {
    assert!(
        inbound
            .enqueue(Inbound((peer.clone(), IoBuf::from(b"message"))))
            .accepted()
    );
}
assert_eq!(
    inbound.enqueue(Inbound((peer, IoBuf::from(b"overflow")))),
    Unreliable::Rejected
);
