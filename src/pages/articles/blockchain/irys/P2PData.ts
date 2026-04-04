export const PEER_SERVICE_CODE = `pub struct PeerNetworkService<A, R>
where
    A: ApiClient,
    R: Handler<RethPeerInfo, Result = eyre::Result<()>> + Actor<Context = Context<R>>,
{
    db: DatabaseProvider,
    peer_list: PeerList,
    currently_running_announcements: HashSet<SocketAddr>, // 진행 중인 공지 추적
    gossip_client: GossipClient,
    irys_api_client: A,   // API 클라이언트 (제네릭)
    chain_id: u64,
    peer_address: PeerAddress,
}

// 피어 점수 시스템: ScoreIncreaseReason::Online/SuccessfulData/ValidResponse
// ScoreDecreaseReason::Offline — 낮은 점수 피어는 비활성 목록으로`;

export const PEER_DISCOVERY_CODE = `// 1단계: 부트스트랩 피어로 초기 연결
async fn trusted_peers_handshake_task(
    peer_service: Addr<PeerNetworkService>,
    bootstrap_peers: HashSet<SocketAddr>,
) {
    for peer in bootstrap_peers {
        peer_service.send(NewPotentialPeer::force_announce(peer)).await.ok();
    }
}

// 2단계: 핸드셰이크 후 동적 피어 확장
// 연결된 피어에서 추가 피어 목록 수신
PeerResponse::Accepted(accepted_peers) => {
    let mut peers = accepted_peers.peers;
    peers.shuffle(&mut rand::thread_rng()); // 랜덤 순서로 시도
    peers.truncate(peers_limit());          // 리소스 고갈 방지
    // 각 피어에게 핸드셰이크 시도
    for peer_addr in peers {
        announce_peer(peer_addr).await;
    }
}`;

export const HEALTH_CHECK_CODE = `// 핸드셰이크: VersionRequest (서명 포함)
struct VersionRequest {
    address: PeerAddress,
    chain_id: u64,
    user_agent: Option<String>, // build_user_agent("Irys-Node", CARGO_PKG_VERSION)
    // + 서명 필드 (sign_p2p_handshake)
}

// 비활성 피어 헬스 체크 (INACTIVE_PEERS_HEALTH_CHECK_INTERVAL 주기)
ctx.run_interval(INACTIVE_PEERS_HEALTH_CHECK_INTERVAL, |act, ctx| {
    let inactive_peers = act.peer_list.inactive_peers();
    for (mining_addr, peer) in inactive_peers {
        // gossip_client.check_health(peer_address)
        // Ok(true)  → increase_peer_score(ScoreIncreaseReason::Online)
        // Ok(false) → decrease_peer_score(ScoreDecreaseReason::Offline)
    }
});`;

export const GOSSIP_CODE = `const MAX_PEERS_PER_BROADCAST: usize = 5;

// 새 블록 전파
async fn broadcast_block(block: &Block, peers: &PeerList) {
    let mut broadcast_peers = peers.healthy();
    broadcast_peers.shuffle(&mut rand::thread_rng());
    let n = std::cmp::min(MAX_PEERS_PER_BROADCAST, broadcast_peers.len());

    join_all(broadcast_peers[..n].iter().map(|peer| {
        gossip_client.send_block(peer, block)
    })).await;
}

// ChainSyncService: 뒤처진 노드의 블록 동기화
async fn sync_chain(from_height: u64, target: &Peer) {
    loop {
        let blocks = api_client.get_blocks(target, from_height, BATCH_SIZE).await?;
        for block in &blocks {
            validate_and_apply(block).await?;
        }
        from_height += blocks.len() as u64;
        if blocks.len() < BATCH_SIZE { break; }
    }
}`;
