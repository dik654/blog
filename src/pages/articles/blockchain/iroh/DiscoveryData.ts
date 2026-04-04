export const DISCOVERY_TRAIT_CODE = `pub trait Discovery: Debug + Send + Sync + 'static {
    // NodeData(직접 주소 + relay URL)를 외부에 게시
    fn publish(&self, data: &NodeData) {}
    // NodeId로 연결 정보 조회 (스트림으로 비동기 반환)
    fn resolve(&self, node_id: NodeId)
        -> Option<BoxStream<Result<DiscoveryItem>>>;
    // 새로운 피어 발견 알림 구독
    fn subscribe(&self) -> Option<BoxStream<DiscoveryItem>>;
}`;

export const DISCOVERY_TRAIT_ANNOTATIONS = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: '노드 정보 게시' },
  { lines: [4, 6] as [number, number], color: 'emerald' as const, note: 'NodeId → 주소 해석' },
  { lines: [7, 8] as [number, number], color: 'amber' as const, note: '새 피어 발견 구독' },
];

export const PKARR_CODE = `pub struct PkarrPublisher {
    // NodeId가 DHT key, NodeData(주소 정보)가 value
    // 주기적으로 republish (TTL 관리)
    secret_key: SecretKey,
    pkarr_client: pkarr::Client,
}
// 조회: NodeId → Mainline DHT.get(node_id) → NodeData
// 게시: NodeData → sign(secret_key) → Mainline DHT.put(node_id, signed)`;

export const PKARR_ANNOTATIONS = [
  { lines: [1, 5] as [number, number], color: 'sky' as const, note: 'Pkarr 게시자 구조체' },
  { lines: [7, 8] as [number, number], color: 'emerald' as const, note: 'DHT 조회/게시 흐름' },
];
