// broadcast/src/lib.rs — Broadcaster Trait

/// Broadcaster is the interface responsible for
/// attempting replication of messages across a network.
pub trait Broadcaster: Clone + Send + 'static {
    /// The type of recipients that can receive messages.
    type Recipients;

    /// Message is the type of data that can be broadcasted.
    /// Must implement Codec for serialize/deserialize.
    type Message: Codec + Clone + Send + 'static;

    /// The type of data returned once the message is broadcasted.
    /// May also indicate success or failure.
    type Response: Clone + Send + 'static;

    /// Attempt to broadcast a message to the associated recipients.
    fn broadcast(
        &self,
        recipients: Self::Recipients,
        message: Self::Message,
    ) -> impl Future<Output = oneshot::Receiver<Self::Response>> + Send;
}
