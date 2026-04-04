export const GOSSIP_DATA_CODE = `pub enum GossipData {
    Chunk(Arc<UnpackedChunk>),           // 데이터 청크
    Transaction(Arc<DataTransactionHeader>), // 트랜잭션
    CommitmentTransaction(Arc<CommitmentTransaction>),
    Block(Arc<IrysBlockHeader>),         // 블록 헤더
    ExecutionPayload(Block),             // EVM 실행 페이로드
    IngressProof(Arc<IngressProof>),     // 인그레스 증명
}

pub struct GossipRequest<T> {
    pub miner_address: Address,  // 송신자 마이닝 주소
    pub data: T,                 // 실제 페이로드
}`;

export const GOSSIP_DATA_ANNOTATIONS = [
  { lines: [1, 8] as [number, number], color: 'sky' as const, note: '6가지 가십 데이터 유형' },
  { lines: [10, 13] as [number, number], color: 'emerald' as const, note: '가십 요청 래퍼 (송신자 + 페이로드)' },
];

export const BROADCAST_CODE = `const MAX_PEERS_PER_BROADCAST: usize = 5;
const BROADCAST_INTERVAL: Duration = Duration::from_secs(1);

async fn broadcast_data(&self, message: GossipBroadcastMessage,
    peer_list: &PeerList) -> GossipResult<()> {
    let mut peers = peer_list.top_active_peers(None, None);
    peers.shuffle(&mut rand::thread_rng());

    while !peers.is_empty() {
        // 이미 데이터를 본 피어 제외
        let seen = self.cache.peers_that_have_seen(&key)?;
        peers.retain(|(addr, _)| !seen.contains(addr));
        if peers.is_empty() { break; }

        // 최대 5개 피어에게 전송
        let n = std::cmp::min(MAX_PEERS_PER_BROADCAST, peers.len());
        for (addr, peer) in peers.get(0..n) {
            self.client.send_data_and_update_the_score(addr, peer);
        }
        tokio::time::sleep(BROADCAST_INTERVAL).await;
    }
}`;

export const BROADCAST_ANNOTATIONS = [
  { lines: [10, 12] as [number, number], color: 'sky' as const, note: '중복 전송 방지 (캐시 검사)' },
  { lines: [15, 18] as [number, number], color: 'emerald' as const, note: '라운드별 최대 5개 피어 전송' },
];

export const CACHE_CODE = `pub struct GossipCache {
    chunks: Cache<ChunkPathHash, Arc<RwLock<HashSet<Address>>>>,
    transactions: Cache<IrysTransactionId, Arc<RwLock<HashSet<Address>>>>,
    blocks: Cache<BlockHash, Arc<RwLock<HashSet<Address>>>>,
    payloads: Cache<B256, Arc<RwLock<HashSet<Address>>>>,
    ingress_proofs: Cache<H256, Arc<RwLock<HashSet<Address>>>>,
}

// 중복 검사: 캐시 확인 → 멤풀 확인 → 새 데이터 처리
async fn handle_transaction(&self, req: GossipRequest<DataTransactionHeader>) {
    let already_seen = self.cache.seen_transaction_from_any_peer(&tx_id)?;
    self.cache.record_seen(source_miner_address, GossipCacheKey::Transaction(tx_id));
    if already_seen { return Ok(()); }
    if self.mempool.is_known_transaction(tx_id).await? { return Ok(()); }
    self.mempool.handle_data_transaction_ingress(req.data).await?;
}`;

export const CACHE_ANNOTATIONS = [
  { lines: [1, 7] as [number, number], color: 'sky' as const, note: '데이터 유형별 TTL 캐시' },
  { lines: [11, 15] as [number, number], color: 'emerald' as const, note: '2단계 중복 검사 (캐시 + 멤풀)' },
];
