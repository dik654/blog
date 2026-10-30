// Commonware v2026.9.0 · examples/bridge/src/bin/validator.rs에서 발췌
// 원문 위치: lines 183–270 · 설명과 무관한 설정은 생략했습니다.

executor.start(|context| async move {
    let (sink, stream) = context
        .dial(indexer_address)
        .await
        .expect("Failed to dial indexer");
    let indexer = dial(context.child("dialer"), indexer_cfg, indexer, stream, sink)
        .await
        .expect("Failed to upgrade connection with indexer");

    let (mut network, mut oracle) =
        authenticated::discovery::Network::new(context.child("network"), p2p_cfg);
    oracle.track(0, validators.clone());

    let message_rate = Quota::per_second(NZU32!(10));
    let (vote_sender, vote_receiver) = network.register(0, message_rate);
    let (certificate_sender, certificate_receiver) = network.register(1, message_rate);
    let (resolver_sender, resolver_receiver) = network.register(2, message_rate);

    let (application, scheme, mailbox) = application::Application::<_, Sha256, _, _>::new(
        context.child("application"),
        application::Config {
            indexer,
            this_network,
            other_network,
            mailbox_size: NZUsize!(1024),
        },
    );

    let engine = Engine::new(
        context.child("engine"),
        simplex::Config {
            scheme,
            blocker: oracle,
            automaton: mailbox.clone(),
            relay: mailbox.clone(),
            reporter: mailbox.clone(),
            // 나머지 timeout·buffer·floor 설정은 생략했습니다.
        },
    );

    network.start();
    engine.start(
        (vote_sender, vote_receiver),
        (certificate_sender, certificate_receiver),
        (resolver_sender, resolver_receiver),
    );
    application.run().await;
});
