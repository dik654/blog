export const discoveryCode = `// 피어 발견 3가지 메커니즘

// 1. Bootstrap Discovery: 초기 시드 노드 연결
type BootstrapDiscoveryConfig struct {
  Enable          bool
  Seeds           []peer.AddrInfo
  RetentionPeriod time.Duration
}

// 2. Registry-based Discovery: 합의 레지스트리 활용
func (m *PeerManager) connectRegisteredPeers(ctx) {
  for p, d := range m.protocols {
    peerCh := m.registry.findProtocolPeers(ctx, p)
    m.connector.connectMany(ctx, peerCh, limit)
  }
}

// 3. DHT Discovery: 분산 해시 테이블
func (d *peerDiscovery) findPeers(ctx, topic) {
  peers, _ := discovery.FindPeers(ctx, topic)
  // DHT를 통해 토픽별 피어 검색
}`;

export const discoveryAnnotations = [
  { lines: [3, 8] as [number, number], color: 'sky' as const, note: 'Bootstrap: 시드 노드 기반' },
  { lines: [10, 15] as [number, number], color: 'emerald' as const, note: 'Registry: 합의 레지스트리 기반' },
  { lines: [18, 22] as [number, number], color: 'amber' as const, note: 'DHT: 분산 해시 테이블 기반' },
];
