// reth/crates/net/discv4/src/lib.rs
// Discv4 — UDP 기반 노드 디스커버리 (Kademlia DHT 변형)

use reth_primitives::PeerId;
use std::net::SocketAddr;
use tokio::net::UdpSocket;

/// Discv4 — 이더리움 노드 디스커버리 v4 프로토콜.
/// Kademlia 버킷으로 피어를 관리하며, FIND_NODE로 새 피어를 탐색.
pub struct Discv4 {
    /// UDP 소켓 (디스커버리 메시지 송수신)
    socket: UdpSocket,
    /// 자신의 노드 ID (secp256k1 공개키)
    local_id: PeerId,
    /// Kademlia 라우팅 테이블 (256개 버킷)
    kbuckets: KBucketsTable,
    /// 부트노드 목록 (초기 연결 시드)
    bootnodes: Vec<NodeRecord>,
}

impl Discv4 {
    /// lookup — 특정 target ID에 가까운 노드 탐색.
    /// 반복적으로 FIND_NODE 전송 → 응답에서 더 가까운 노드 발견.
    pub async fn lookup(&self, target: PeerId) -> Vec<NodeRecord> {
        // 1. 로컬 버킷에서 target에 가장 가까운 k개 선택
        // 2. 각 노드에 FIND_NODE(target) UDP 전송
        // 3. 응답 노드를 버킷에 추가 + 더 가까운 노드에 재전송
        // 4. 수렴할 때까지 반복 (alpha=3 병렬)
        todo!()
    }

    /// 주기적 버킷 갱신 — 랜덤 target으로 lookup 실행
    pub async fn refresh_buckets(&self) {
        let random_target = PeerId::random();
        self.lookup(random_target).await;
    }
}
