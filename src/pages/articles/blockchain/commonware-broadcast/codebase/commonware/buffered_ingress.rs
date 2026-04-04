// broadcast/src/buffered/ingress.rs — Mailbox API

/// Message types that can be sent to the Engine.
pub enum Message<P: PublicKey, M: Digestible> {
    /// Broadcast a message to the network.
    /// Responder receives list of peers that got the message.
    Broadcast {
        recipients: Recipients<P>,
        message: M,
        responder: oneshot::Sender<Vec<P>>,
    },
    /// Subscribe to a message by digest.
    /// Resolves instantly if cached, otherwise waits for network.
    Subscribe {
        digest: M::Digest,
        responder: oneshot::Sender<M>,
    },
    /// Get a cached message by digest.
    Get {
        digest: M::Digest,
        responder: oneshot::Sender<Option<M>>,
    },
}

/// Ingress mailbox for Engine. Implements Broadcaster trait.
#[derive(Clone)]
pub struct Mailbox<P: PublicKey, M: Digestible + Codec> {
    sender: mpsc::Sender<Message<P, M>>,
}

impl<P, M> Broadcaster for Mailbox<P, M> {
    type Recipients = Recipients<P>;
    type Message = M;
    type Response = Vec<P>;

    async fn broadcast(
        &self, recipients: Self::Recipients, message: Self::Message,
    ) -> oneshot::Receiver<Self::Response> {
        let (sender, receiver) = oneshot::channel();
        self.sender.send_lossy(Message::Broadcast {
            recipients, message, responder: sender,
        }).await;
        receiver
    }
}
