export const PREPARE_SEND_CODE = `// prepare_send: 패킷마다 최적 경로 결정
fn prepare_send(transmit: &Transmit) -> SmallVec<[Addr; 3]> {
    let mut paths = SmallVec::new();
    if let Some(udp_addr) = node_map.best_direct_addr() {
        paths.push(Addr::Udp(udp_addr));   // 직접 UDP
    }
    if let Some(relay_url) = node_map.relay_url() {
        paths.push(Addr::Relay(relay_url, node_id)); // relay 백업
    }
    paths  // 두 경로 모두 전송 → 먼저 도착한 것 사용
}`;

export const PREPARE_SEND_ANNOTATIONS = [
  { lines: [4, 5] as [number, number], color: 'sky' as const, note: '직접 UDP 경로' },
  { lines: [7, 8] as [number, number], color: 'emerald' as const, note: 'relay 백업 경로' },
  { lines: [10, 10] as [number, number], color: 'amber' as const, note: '두 경로 동시 전송' },
];
