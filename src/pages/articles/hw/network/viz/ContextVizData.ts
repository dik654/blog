export const C = { eth: '#6366f1', rdma: '#f59e0b', ib: '#10b981', err: '#ef4444', hw: '#71717a' };

export const STEPS = [
  { label: '데스크톱(1Gbps) vs 서버(10G/25G/100G) 대역폭', body: '데스크톱: 1Gbps 충분 / 서버: 10G(SFP+) 기본, 25G(SFP28) DC 표준, 100G(QSFP28) 백본' },
  { label: '10G → 25G → 100G 이더넷 단계별 스펙', body: '10G: SFP+ DAC/광, ~3us / 25G: SFP28, ~2us / 100G: QSFP28 4x25G, ~1.5us' },
  { label: 'RDMA: CPU 바이패스로 레이턴시 50→1 us', body: 'RoCE v2: UDP/IP 위 RDMA, ~1us / InfiniBand: 전용 스위치, ~0.5us, 400Gbps NDR' },
  { label: '블록체인 노드 = 10G 충분, GPU 클러스터 = InfiniBand', body: '블록 전파: ~100KB per block / 텐서 병렬: ~GB per iteration → 요구 대역폭 10000배 차이' },
];
