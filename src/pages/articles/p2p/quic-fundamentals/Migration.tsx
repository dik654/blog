import MigrationViz from './viz/MigrationViz';

export default function Migration() {
  return (
    <section id="migration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">연결 마이그레이션</h2>
      <div className="not-prose mb-8"><MigrationViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          TCP 연결은 (소스 IP, 소스 포트, 대상 IP, 대상 포트) 4-tuple로 식별됩니다.<br />
          Wi-Fi에서 셀룰러로 전환하면 IP가 바뀌므로 TCP 연결이 끊어집니다.
        </p>
        <h3>Connection ID</h3>
        <p className="leading-7">
          QUIC는 <strong>Connection ID</strong>로 연결을 식별합니다.<br />
          IP 주소가 변경되어도 Connection ID가 같으면 기존 연결을 유지합니다.<br />
          이를 <strong>연결 마이그레이션(Connection Migration)</strong>이라 합니다.
        </p>
        <h3>Path Validation</h3>
        <p className="leading-7">
          새 경로로 전환 시 QUIC는 <strong>PATH_CHALLENGE</strong> 프레임을 전송합니다.<br />
          상대가 <strong>PATH_RESPONSE</strong>로 응답하면 새 경로가 유효함을 확인합니다.<br />
          이 과정은 경로 위조 공격을 방지합니다.
        </p>
        <p className="leading-7">
          iroh의 MagicSock은 QUIC 연결 마이그레이션을 활용해
          직접 연결과 릴레이 경로를 실시간으로 전환합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Connection ID 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// QUIC packet header
// ┌────────────────────────────────────────────┐
// │ Header flags (1 byte)                      │
// │ Version (4 bytes, if long header)          │
// │ DCID length + DCID (destination conn id)   │
// │ SCID length + SCID (source conn id)        │
// │ ... packet-specific fields                 │
// └────────────────────────────────────────────┘

// Connection ID 생성
// - Server가 assign
// - 0~20 bytes (보통 8 bytes)
// - Random, hard to guess
// - 여러 CID 동시 활성 가능

// Multiple CIDs per connection
// - NEW_CONNECTION_ID frame으로 추가 발급
// - Client uses different CIDs for different paths
// - Privacy (linkability 방지)

// Example
// Client가 3개 CID 사용
// CID_A: WiFi path
// CID_B: 4G path
// CID_C: VPN path
// Each path 독립적으로 validate`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Path Validation Protocol</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// PATH_CHALLENGE / PATH_RESPONSE frames

// Migration scenario
// Client at IP_1, connected to server
// Client's IP changes to IP_2 (network switch)

// Step 1: Probe packet from new path
Client(IP_2) → Server:
  Frame type: PATH_CHALLENGE
  Data: random 8 bytes (nonce)

// Server detects new IP
Server → Client(IP_2):
  Frame type: PATH_RESPONSE
  Data: same nonce (echoed)

// Step 2: Server validates client
// - Ensures client can receive on new path
// - Prevents reflection attacks
// - Max 3 probes before give up

// Step 3: Migrate active path
// - Traffic moves to new path
// - Old path kept alive briefly (probing)
// - Eventually old path discarded

// Anti-amplification
// - Server sends max 3x received bytes
// - Until client validated
// - Prevents DDoS via spoofed migration

// iroh 사용 예시
// - Direct connection attempt (STUN)
// - Fallback to relay if NAT blocks
// - Later, direct path works
// - Seamless migration without connection reset`}</pre>

      </div>
    </section>
  );
}
