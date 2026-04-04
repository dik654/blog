import type { CodeRef } from './codeRefsTypes';

export const bridgeCodeRef: Record<string, CodeRef> = {
  'bridge-main': {
    path: 'commonware/examples/bridge/src/bin/validator.rs — main()',
    lang: 'rust',
    highlight: [1, 36],
    desc: 'Bridge 예제의 validator 메인 함수.\n모든 프리미티브를 조립하는 실전 패턴:\nRuntime → P2P → Application → Consensus → Start.',
    code: `// 1. Runtime 초기화
let runtime_cfg = tokio::Config::new()
    .with_storage_directory(storage_directory);
let executor = tokio::Runner::new(runtime_cfg);

// 2. P2P 네트워크 설정
let p2p_cfg = authenticated::discovery::Config::local(
    signer,
    &union(APPLICATION_NAMESPACE, P2P_SUFFIX),
    SocketAddr::new(IpAddr::V4(Ipv4Addr::LOCALHOST), port),
    SocketAddr::new(IpAddr::V4(Ipv4Addr::LOCALHOST), port),
    bootstrapper_identities.clone(),
    1024 * 1024, // 1MB max message
);

// 3. executor.start() — 루트 태스크 시작
executor.start(|context| async move {
    // 4. P2P 네트워크 생성
    let (mut network, mut oracle) =
        authenticated::discovery::Network::new(
            context.with_label("network"), p2p_cfg
        );
    oracle.track(0, validators.clone()).await;

    // 5. 채널 등록 (vote, certificate, resolver)
    let (vote_s, vote_r) = network.register(
        0, Quota::per_second(NZU32!(10)), 256);
    let (cert_s, cert_r) = network.register(
        1, Quota::per_second(NZU32!(10)), 256);
    let (res_s, res_r) = network.register(
        2, Quota::per_second(NZU32!(10)), 256);

    // 6. 합의 엔진 시작
    network.start();
    engine.start(
        (vote_s, vote_r), (cert_s, cert_r),
        (res_s, res_r));
    application.run().await;
});`,
    annotations: [
      { lines: [2, 4], color: 'sky', note: 'tokio::Runner — 프로덕션 런타임. Config로 스토리지 경로 지정' },
      { lines: [7, 14], color: 'emerald', note: 'authenticated P2P — ECIES 암호화 + 서명 인증. 부트스트랩 노드 목록 전달' },
      { lines: [17, 23], color: 'amber', note: 'executor.start(|context|) — context가 Clock+Network+Storage+Spawner 모두 제공' },
      { lines: [27, 31], color: 'violet', note: 'network.register() — 채널 ID별 rate limit + backpressure 설정' },
    ],
  },
};
