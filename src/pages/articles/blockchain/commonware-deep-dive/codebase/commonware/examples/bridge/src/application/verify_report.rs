// Commonware v2026.9.0 · examples/bridge/src/application/actor.rs에서 발췌
// 원문 위치: lines 138–209 · Notarization과 Nullification log 분기만 생략했습니다.

Message::Verify { payload, response } => {
    let msg = Inbound::GetBlock(inbound::GetBlock {
        network: self.this_network,
        digest: payload,
    })
    .encode();
    indexer_sender.send(msg).await.expect("failed to send block to indexer");

    let result = indexer_receiver.recv().await.expect("failed to receive from indexer");
    let msg = Outbound::<H::Digest>::decode(result).expect("failed to decode result");
    let block = match msg {
        Outbound::Block(block) => block,
        Outbound::Success(false) => {
            let _ = response.send(false);
            continue;
        }
        _ => panic!("unexpected response"),
    };

    match block {
        BlockFormat::Random(_) => {
            let _ = response.send(true);
        }
        BlockFormat::Bridge(finalization) => {
            let result = finalization.verify(
                &mut self.context,
                &self.other_network,
                &Sequential,
            );
            let _ = response.send(result);
        }
    }
}

Message::Report { activity } => {
    let view = activity.view();
    match activity {
        Activity::Finalization(finalization) => {
            let msg = Inbound::PutFinalization::<H::Digest>(inbound::PutFinalization {
                network: self.this_network,
                finalization,
            })
            .encode();
            indexer_sender
                .send(msg)
                .await
                .expect("failed to send finalization to indexer");

            let result = indexer_receiver
                .recv()
                .await
                .expect("failed to receive from indexer");
            let message = Outbound::<H::Digest>::decode(result)
                .expect("failed to decode result");
            let Outbound::Success(success) = message else {
                panic!("unexpected response");
            };
            debug!(%view, success, "finalization posted");
        }
        // Notarization·Nullification과 나머지 log 분기는 생략했습니다.
        _ => {}
    }
}
