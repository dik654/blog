export const upgradeChainCode = `// TCP 연결 기준 업그레이드 과정
TCP 연결 수립
    ↓
multistream-select: "/noise" 또는 "/tls/1.0.0" 협상
    ↓
Noise XX 핸드셰이크 (3 round-trip):
  1. Initiator → e (임시 Diffie-Hellman 공개키)
  2. Responder ← e, ee, s, es (DH 키교환 + 정적키)
  3. Initiator → s, se (정적키 + 마지막 DH)
    ↓
multistream-select: "/yamux/1.0.0" 협상
    ↓
Yamux: 단일 TCP 위에서 다수의 논리 스트림
    ↓
각 스트림에서 프로토콜별 협상 ("/ipfs/kad/1.0.0" 등)`;

export const upgradeAnnotations = [
  { lines: [4, 4] as [number, number], color: 'sky' as const, note: 'multistream-select로 보안 프로토콜 협상' },
  { lines: [6, 9] as [number, number], color: 'emerald' as const, note: 'Noise XX — 3-way 핸드셰이크' },
  { lines: [13, 13] as [number, number], color: 'amber' as const, note: 'Yamux 멀티플렉싱' },
];

export const noiseXXCode = `// libp2p-noise 구현체
pub struct Config {
    dh_keys: AuthenticKeypair, // X25519 DH 키 + libp2p 서명
    params: NoiseParams,       // XX 패턴
}

pub struct AuthenticKeypair {
    keypair: Keypair,          // X25519 DH 키 쌍
    identity: KeypairIdentity, // libp2p 신원 바인딩
}

pub struct KeypairIdentity {
    public: identity::PublicKey, // libp2p Ed25519 공개키
    signature: Vec<u8>,          // DH 공개키에 대한 Ed25519 서명
}

// 신원 인증 흐름:
// 1. X25519 임시키 생성
// 2. Ed25519 개인키로 X25519 공개키에 서명
// 3. 핸드셰이크 payload에 (libp2p_pubkey, signature) 포함
// 4. 상대방: 서명 검증 → PeerId 도출 → 신원 확인`;

export const noiseAnnotations = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: 'Config — DH 키 + Noise XX 패턴' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: 'AuthenticKeypair — 신원 바인딩' },
  { lines: [17, 21] as [number, number], color: 'amber' as const, note: '신원 인증 흐름 4단계' },
];

export const yamuxCode = `pub struct YamuxConfig {
    max_buffer_size: usize,      // 스트림당 최대 버퍼 (기본 16MB)
    max_num_streams: usize,      // 최대 동시 스트림 수 (기본 8192)
    window_update_mode: WindowUpdateMode, // OnRead | OnReceive
}

// Yamux 프레임 헤더 (12바이트)
struct Frame {
    version: u8,  // 0
    type_: u8,    // 0=Data, 1=Window, 2=Ping, 3=GoAway
    flags: u16,   // SYN|ACK|FIN|RST
    stream_id: u32,
    length: u32,
}

// 한 TCP 연결 위에서 독립적인 스트림 예시:
// Stream 1: /ipfs/kad/1.0.0  (DHT 쿼리)
// Stream 2: /ipfs/identify/1.0.0  (피어 정보 교환)
// Stream 3: /meshsub/1.1.0  (GossipSub 메시지)`;

export const yamuxAnnotations = [
  { lines: [1, 5] as [number, number], color: 'sky' as const, note: 'Yamux 설정 파라미터' },
  { lines: [7, 14] as [number, number], color: 'emerald' as const, note: '12바이트 프레임 헤더 구조' },
  { lines: [16, 19] as [number, number], color: 'amber' as const, note: '단일 TCP 위 멀티 스트림' },
];

export const quicCode = `// QUIC 연결: Security + Mux 업그레이드 없이 바로 스트림 열기
// /ip4/1.2.3.4/udp/4001/quic-v1/p2p/12D3KooW...

// QUIC 스트림 = Yamux 스트림 (동일한 NetworkBehaviour 인터페이스)
// 연결 마이그레이션: IP 변경 시에도 연결 유지
// 0-RTT: 기존 알려진 서버에 첫 패킷부터 데이터 전송 가능`;

export const quicAnnotations = [
  { lines: [1, 2] as [number, number], color: 'sky' as const, note: 'Security + Mux 불필요' },
  { lines: [4, 6] as [number, number], color: 'emerald' as const, note: '연결 마이그레이션 + 0-RTT' },
];
