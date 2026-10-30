// Commonware v2026.9.0 · examples/bridge/src/application/actor.rs에서 발췌
// 원문 위치: lines 59–137 · Bridge certificate 분기는 별도 글로 미뤘습니다.

Message::Propose { round, response } => {
    let block = BlockFormat::<H::Digest>::Random(self.context.random());

    let digest = H::hash(&[&block.encode()]);
    info!(?block, payload = ?digest, "proposed");

    let msg = Inbound::PutBlock::<H::Digest>(inbound::PutBlock {
        network: self.this_network,
        block,
    })
    .encode();
    indexer_sender
        .send(msg)
        .await
        .expect("failed to send block to indexer");

    let result = indexer_receiver
        .recv()
        .await
        .expect("failed to receive from indexer");
    let msg = Outbound::<H::Digest>::decode(result)
        .expect("failed to decode result");
    let Outbound::Success(success) = msg else {
        panic!("unexpected response");
    };
    debug!(?round, success, "block published");
    if !success {
        continue;
    }

    let _ = response.send(digest);
}
