// Reth v2.8.1 · crates/net/network/tests/it/session.rs
// This test proves that the highest exact version shared by both peers wins.
#[tokio::test(flavor = "multi_thread")]
async fn test_overlapping_version_sets_negotiation() {
    let version = negotiated_version(
        PeerConfig::default().with_protocols([
            EthVersion::Eth69,
            EthVersion::Eth67,
            EthVersion::Eth66,
        ]),
        PeerConfig::default().with_protocols([
            EthVersion::Eth68,
            EthVersion::Eth67,
            EthVersion::Eth66,
        ]),
    )
    .await;
    // Highest common version: eth/67. Neither side needs a contiguous version range.
    assert_eq!(version, Some(EthVersion::Eth67));
}
