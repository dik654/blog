export const transportTraitCode = `pub trait Transport {
    type Output: Send + 'static;
    type Error: Send + 'static;
    type ListenerUpgrade: Future<Output = Result<Self::Output, Self::Error>>;
    type Dial: Future<Output = Result<Self::Output, Self::Error>>;

    // 리스닝 시작 (서버 모드)
    fn listen_on(
        &mut self,
        id: ListenerId,
        addr: Multiaddr,
    ) -> Result<(), TransportError>;

    // 원격 피어에 다이얼 (클라이언트 모드)
    fn dial(
        &mut self,
        addr: Multiaddr,
    ) -> Result<Self::Dial, TransportError>;

    // 이벤트 폴링 (새 연결, 주소 변경 등)
    fn poll(
        &mut self,
        cx: &mut Context<'_>,
    ) -> Poll<TransportEvent<Self::ListenerUpgrade, Self::Error>>;
}`;

export const transportTraitAnnotations = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: '연관 타입 — Output, Error, Future' },
  { lines: [7, 12] as [number, number], color: 'emerald' as const, note: 'listen_on — 주소 바인딩' },
  { lines: [14, 19] as [number, number], color: 'amber' as const, note: 'dial — 아웃바운드 연결' },
];

export const transportComparison = [
  { transport: 'TCP', proto: '/ip4/.../tcp/...', security: 'Noise XX 별도', mux: 'Yamux 별도', latency: '1-RTT + 3-RTT (Noise)', color: '#ef4444' },
  { transport: 'QUIC', proto: '/ip4/.../udp/.../quic-v1', security: 'TLS 1.3 내장', mux: 'QUIC 스트림 내장', latency: '1-RTT (0-RTT 가능)', color: '#06b6d4' },
  { transport: 'WebSocket', proto: '/ip4/.../tcp/.../ws', security: 'Noise XX', mux: 'Yamux', latency: '1+1 RTT + Noise', color: '#f59e0b' },
  { transport: 'WebRTC', proto: '/ip4/.../udp/.../webrtc', security: 'DTLS 내장', mux: 'SCTP 내장', latency: '브라우저 호환', color: '#8b5cf6' },
];

export const upgradeCode = `// TCP 연결 업그레이드 과정 (SwarmBuilder 내부)
//
// 1. TCP 3-way handshake
//    → Raw AsyncRead + AsyncWrite 스트림
//
// 2. multistream-select: "/noise" 협상
//    → 양쪽이 지원하는 보안 프로토콜 합의
//
// 3. Noise XX 핸드셰이크 (3 round-trip)
//    → 암호화 + PeerId 인증 완료
//
// 4. multistream-select: "/yamux/1.0.0" 협상
//    → 멀티플렉서 합의
//
// 5. Yamux 세션 수립
//    → 단일 TCP 위에서 다수 논리 스트림
//
// 6. 각 스트림에서 프로토콜별 협상
//    → "/ipfs/kad/1.0.0", "/meshsub/1.1.0" 등`;

export const upgradeAnnotations = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: 'TCP raw 연결' },
  { lines: [6, 10] as [number, number], color: 'emerald' as const, note: 'Security 협상 + 핸드셰이크' },
  { lines: [12, 19] as [number, number], color: 'amber' as const, note: 'Mux + Protocol 협상' },
];
