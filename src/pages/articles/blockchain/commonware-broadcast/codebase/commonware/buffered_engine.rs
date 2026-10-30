// broadcast/src/buffered/engine.rs · v2026.9.0
// 한국어 설명: Local Mailbox command와 network receive는 같은 actor loop에서 처리됩니다.
Some(msg) = self.mailbox_receiver.recv() else {
    error!("mailbox receiver failed");
    break;
} => match msg {
    Message::Broadcast {
        recipients,
        message,
    } => {
        trace!("mailbox: broadcast");
        self.handle_broadcast(&mut sender, recipients, message);
    }
    Message::Subscribe { digest, responder } => {
        trace!("mailbox: subscribe");
        self.handle_subscribe(digest, responder);
    }
    Message::Get { digest, responder } => {
        trace!("mailbox: get");
        self.handle_get(digest, responder);
    }
},
// 한국어 설명: Network frame은 decode에 성공한 뒤에만 handle_network로 갑니다.
msg = receiver.recv() => {
    let (peer, msg) = match msg {
        Ok(r) => r,
        Err(err) => {
            error!(?err, "receiver failed");
            break;
        }
    };
    let msg = match msg {
        Ok(msg) => msg,
        Err(err) => {
            warn!(?err, ?peer, "failed to decode message");
            self.metrics.receive.inc(Status::Invalid);
            continue;
        }
    };
    trace!(?peer, "network");
    self.metrics.peer.get_or_create_by(&peer).inc();
    self.handle_network(peer, msg);
},

// 한국어 설명: Local cache insert 뒤 send_ref를 호출하고 remote ack를 기다리지 않습니다.
fn handle_broadcast<Sr: Sender<PublicKey = P>>(
    &mut self,
    sender: &mut WrappedSender<Sr, M>,
    recipients: Recipients<P>,
    msg: Arc<M>,
) {
    let digest = msg.digest();
    let _ = self.insert_shared_message(self.public_key.clone(), digest, &msg);
    sender.send_ref(recipients, msg.as_ref(), self.priority);
}
