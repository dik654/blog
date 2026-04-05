export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요: discv4의 한계 → discv5</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          discv4의 한계: 평문 통신(도청 가능), reflection 공격, 서비스 광고 기능 없음.
          <br />
          discv5는 이 모든 문제를 해결한다.
        </p>
        <p>
          핵심 변경점:
          <br />
          <strong>WHOAREYOU 핸드셰이크</strong> — 세션 키 교환 후 AES-GCM 암호화.
          <br />
          <strong>FINDNODE(distances)</strong> — 특정 거리의 노드만 요청 (기존: 공개키 기반).
          <br />
          <strong>TALKREQ/TALKRESP</strong> — 확장 프로토콜 (portal network 등).
        </p>
        <p>
          go-ethereum <code>v5_udp.go</code> + <code>v5wire/</code> 패키지에서 구현.
          <br />
          현재 Ethereum 메인넷은 discv4/discv5를 병용 중.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">discv4 vs discv5 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">특성</th>
                <th className="border border-border px-3 py-2 text-left">discv4</th>
                <th className="border border-border px-3 py-2 text-left">discv5</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Encryption</td>
                <td className="border border-border px-3 py-2">None (signed only)</td>
                <td className="border border-border px-3 py-2">AES-128-GCM</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Session</td>
                <td className="border border-border px-3 py-2">Stateless</td>
                <td className="border border-border px-3 py-2">Session-based</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Handshake</td>
                <td className="border border-border px-3 py-2">None (per-packet sig)</td>
                <td className="border border-border px-3 py-2">WHOAREYOU challenge</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">FINDNODE</td>
                <td className="border border-border px-3 py-2">Target node ID</td>
                <td className="border border-border px-3 py-2">List of distances</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Topic Advertisement</td>
                <td className="border border-border px-3 py-2">No</td>
                <td className="border border-border px-3 py-2">Yes (REGTOPIC)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Custom Protocols</td>
                <td className="border border-border px-3 py-2">No</td>
                <td className="border border-border px-3 py-2">TALKREQ/TALKRESP</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Amplification</td>
                <td className="border border-border px-3 py-2">Vulnerable</td>
                <td className="border border-border px-3 py-2">Mitigated</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">discv5 Packet 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// discv5 Packet (encrypted)
//
// ┌───────────────────────────────────────┐
// │ IV (16 bytes)                         │
// │ Random nonce for AES-GCM              │
// ├───────────────────────────────────────┤
// │ Static Header (23 bytes, obfuscated)  │
// │ - protocol ID: "discv5" (6B)          │
// │ - version: 0x0001 (2B)                │
// │ - flag: 0/1/2 (1B)                    │
// │ - nonce (12B)                         │
// │ - authdata-size (2B)                  │
// ├───────────────────────────────────────┤
// │ Authdata (variable)                   │
// │ Type-specific auth info               │
// ├───────────────────────────────────────┤
// │ Message (AES-GCM encrypted)           │
// │ Message type + fields                 │
// └───────────────────────────────────────┘

// Packet types (by flag)
// 0: Ordinary message (session established)
// 1: WHOAREYOU (challenge)
// 2: Handshake message (session setup)

// Key derivation
// session_key = HKDF(ecdh_shared, salt, "discovery v5 key")
// initiator_key, recipient_key (separate)
// id_nonce = random 32B (per session)

// Encryption
// ciphertext = AES-128-GCM(session_key, iv, plaintext, static_header)
// - static_header as AAD
// - 16 byte auth tag appended`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">WHOAREYOU Handshake</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// discv5 handshake flow

// Initial: Alice sends to Bob (no session yet)
Alice → Bob: random packet (blind)
  - flag = 0 (ordinary)
  - Use random key (Bob can't decrypt)

// Bob doesn't have session for Alice
Bob → Alice: WHOAREYOU
  - flag = 1
  - id_nonce (challenge)
  - enr_seq (Bob's current ENR sequence)

// Alice received WHOAREYOU, starts handshake
Alice → Bob: Handshake message
  - flag = 2
  - static signature (id_nonce signed by Alice's key)
  - ephemeral pubkey (for ECDH)
  - Alice's ENR (if stale)

// Bob validates and creates session
// - verify Alice's signature
// - compute ECDH shared secret
// - derive session keys
// - Now can decrypt Alice's message

// Subsequent messages
Alice ↔ Bob: ordinary (flag=0, encrypted with session key)

// Security
// ✓ Perfect forward secrecy (ephemeral keys)
// ✓ Identity binding (static sig)
// ✓ Mutual authentication
// ✓ Replay protection (nonces)`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: discv5의 Topic Discovery</p>
          <p>
            <strong>Topic Advertisement</strong>: Service registration on DHT<br />
            <strong>Use cases</strong>:<br />
            - "eth/67" topic → 이더리움 sync 노드만<br />
            - "portal" topic → Portal Network 참여자<br />
            - Custom services (RPC nodes, archive nodes, etc.)
          </p>
          <p className="mt-2">
            <strong>구현 방식</strong>:<br />
            - TOPIC = keccak256(topic_string)<br />
            - Nodes "close to" topic hash store advertisements<br />
            - REGTOPIC / TOPICQUERY messages<br />
            - Ticket-based DoS mitigation
          </p>
        </div>

      </div>
    </section>
  );
}
