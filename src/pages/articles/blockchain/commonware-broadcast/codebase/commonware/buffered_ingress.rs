// broadcast/src/buffered/ingress.rs · v2026.9.0
impl<P: PublicKey, M: Digestible + Codec> Mailbox<P, M> {
    // 한국어 설명: Cache에 있으면 즉시, 없으면 같은 digest가 도착할 때 응답합니다.
    pub fn subscribe(&self, digest: M::Digest) -> oneshot::Receiver<Arc<M>> {
        let (responder, receiver) = oneshot::channel();
        let _ = self
            .sender
            .enqueue(Message::Subscribe { digest, responder });
        receiver
    }

    // 한국어 설명: 현재 node-local cache만 한 번 조회합니다.
    pub async fn get(&self, digest: M::Digest) -> Option<Arc<M>> {
        let (responder, receiver) = oneshot::channel();
        let _ = self.sender.enqueue(Message::Get { digest, responder });
        receiver.await.unwrap_or_default()
    }

    // 한국어 설명: Broadcast command를 bounded local mailbox에 넣습니다.
    pub fn broadcast_shared(&self, recipients: Recipients<P>, message: Arc<M>) -> Feedback {
        self.sender.enqueue(Message::Broadcast {
            recipients,
            message,
        })
    }
}
